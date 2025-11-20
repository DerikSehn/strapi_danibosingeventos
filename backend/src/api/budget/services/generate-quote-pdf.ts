import PDFDocument from 'pdfkit';
import { Core } from '@strapi/strapi';
import { fetchBusinessContact } from './fetch-items';
import axios from 'axios';

/**
 * Helper: Download image from URL to Buffer
 */
async function downloadImage(url: string): Promise<Buffer> {
  if (!url) return null;
  try {
    // Handle both full URLs and local paths
    const fullUrl = url.startsWith('http') ? url : `http://localhost:1337${url}`;
    const response = await axios.get(fullUrl, { responseType: 'arraybuffer' });
    return Buffer.from(response.data);
  } catch (error) {
    console.warn(`⚠️ Falha ao baixar imagem: ${url}`, error.message);
    return null;
  }
}

/**
 * Helper: Get image dimensions
 */
function getImageDimensions(buffer: Buffer): { width: number; height: number } {
  // PDFKit will handle dimensions automatically, return defaults
  return { width: 600, height: 400 };
}

/**
 * Generates a professional PDF quote document with settings from Strapi
 * Returns a Buffer with PDF data
 */
export async function generateQuotePDF({
  orderId,
  order,
  strapi,
}: {
  orderId?: string | number;
  order: any;
  strapi: Core.Strapi;
}): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      // Fetch PDF Settings and images using documents API (Strapi v5)
      const pdfSettingsDoc = await strapi.documents('api::pdf-setting.pdf-setting').findFirst({
        populate: {
          coverImage: true,
          backgroundImage: true,
          logo: true,
        },
      });

      if (!pdfSettingsDoc) {
        throw new Error('PDF Settings não encontradas. Crie a configuração no Strapi.');
      }

      // Fetch business contact for fallback
      const businessContact = await fetchBusinessContact(strapi);

      // Extract image URLs from populated media objects
      // Strapi returns media as { name, url, ... }
      const coverImageUrl = pdfSettingsDoc.coverImage?.url;
      const backgroundImageUrl = pdfSettingsDoc.backgroundImage?.url;
      const logoUrl = pdfSettingsDoc.logo?.url;
      
      
      const pdfSettings = pdfSettingsDoc;

      const coverImageBuffer = await downloadImage(coverImageUrl);
      const backgroundImageBuffer = await downloadImage(backgroundImageUrl);
      const logoBuffer = await downloadImage(logoUrl);

      // Extract colors and settings
      const colors = {
        primary: pdfSettings.colorPrimary || '#1f2937',
        secondary: pdfSettings.colorSecondary || '#f3f4f6',
        text: pdfSettings.colorText || '#374151',
        border: pdfSettings.colorBorder || '#d1d5db',
        total: pdfSettings.colorTotal || '#111827',
        accent: pdfSettings.colorAccent || '#3b82f6',
      };

      const fonts = {
        titleSize: pdfSettings.fontTitleSize || 24,
        subtitleSize: pdfSettings.fontSubtitleSize || 12,
        bodySize: pdfSettings.fontBodySize || 10,
        smallSize: pdfSettings.fontSmall || 8,
      };

      const content = {
        headerTitle: pdfSettings.headerTitle || 'ORÇAMENTO DE NEGOCIAÇÃO',
        headerSubtitle: pdfSettings.headerSubtitle || 'Este documento contém nosso orçamento profissional',
        sectionClient: pdfSettings.sectionTitleClient || 'DADOS DO CLIENTE',
        sectionItems: pdfSettings.sectionTitleItems || 'ITENS DO PEDIDO',
        sectionNotes: pdfSettings.sectionTitleNotes || 'OBSERVAÇÕES',
        notesContent: pdfSettings.notesContent || 'Este é um orçamento de negociação. Os valores e itens listados acima são nossos valores finais para este pedido.',
        footerText: pdfSettings.footerText || 'Documento gerado automaticamente pelo sistema de orçamentos',
        currencySymbol: pdfSettings.currencySymbol || 'R$',
      };

      // Create PDF document
      const doc = new PDFDocument({
        size: 'A4',
        margin: 0, // Remove default margin para ter controle total
      });

      // Collect PDF chunks into buffer
      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('error', reject);
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });

      // Page 1: Cover (if image exists, always show it regardless of setting)
      if (coverImageBuffer) {
        try {
          doc.image(coverImageBuffer, 0, 0, { width: doc.page.width, height: doc.page.height });
          doc.addPage();
        } catch (error) {
          console.warn('⚠️ Erro ao adicionar capa:', error.message);
        }
      }

      // Helper: Apply background image on current page (full bleed, no margins)
      const applyBackground = (pageDoc: any) => {
        if (pdfSettings.includeBackground && backgroundImageBuffer) {
          try {
            pageDoc.image(backgroundImageBuffer, 0, 0, {
              width: pageDoc.page.width,
              height: pageDoc.page.height,
              opacity: pdfSettings.backgroundOpacity || 0.15,
            });
          } catch (error) {
            console.warn('⚠️ Erro ao aplicar background:', error.message);
          }
        }
      };

      // Apply background to first content page
      applyBackground(doc);

      // Content starts here with 220px top margin
      const contentMarginTop = 150;
      const contentMarginLeft = 40;
      const contentMarginRight = 40;
      const contentWidth = doc.page.width - contentMarginLeft - contentMarginRight;
      
      // Position at top margin
      doc.y = contentMarginTop;
      doc.x = contentMarginLeft;
      
      doc.moveDown(0.5);

      // Client info section with background box
      const clientBoxTop = doc.y;
      const clientBoxHeight = 90;
      
      // Draw background box
      doc
        .fillColor('#f0f0f0')
        .rect(contentMarginLeft, clientBoxTop, contentWidth - 20, clientBoxHeight)
        .fill();
      
      // Draw border
      doc
        .strokeColor(colors.border)
        .lineWidth(1)
        .rect(contentMarginLeft, clientBoxTop, contentWidth - 20, clientBoxHeight)
        .stroke();
      
      // Title inside box
      doc
        .fontSize(11)
        .font('Helvetica-Bold')
        .fillColor(colors.primary)
        .text(content.sectionClient, contentMarginLeft + 12, clientBoxTop + 10);
      
      // Divider line
      doc
        .strokeColor(colors.border)
        .lineWidth(0.5)
        .moveTo(contentMarginLeft + 12, clientBoxTop + 28)
        .lineTo(contentMarginLeft + contentWidth - 32, clientBoxTop + 28)
        .stroke();
      
      // Client details
      doc
        .fontSize(10)
        .font('Helvetica')
        .fillColor(colors.text);
      
      const detailsY = clientBoxTop + 35;
      doc.text(`Nome: ${order.customerName || '-'}`, contentMarginLeft + 12, detailsY);
      doc.text(`Telefone: ${order.customerPhone || '-'}`, contentMarginLeft + 12, detailsY + 15);
      doc.text(`Email: ${order.customerEmail || '-'}`, contentMarginLeft + 12, detailsY + 30);
      
      if (order.eventDetails) {
        doc.fontSize(9).text(`Detalhes: ${order.eventDetails}`, contentMarginLeft + 12, detailsY + 45, { width: contentWidth - 50 });
      }
      
      doc.y = clientBoxTop + clientBoxHeight + 10;

      // Items table
      doc
        .fontSize(fonts.subtitleSize)
        .font('Helvetica-Bold')
        .fillColor(colors.primary)
        .text(content.sectionItems, { underline: true })
        .moveDown(0.5);

      // Table header
      const tableTop = doc.y;
      const col1X = contentMarginLeft + 10;
      const col2X = contentMarginLeft + 250;
      const col3X = contentMarginLeft + 330;
      const col4X = contentMarginLeft + 410;
      const cellHeight = 20;
      const headerHeight = 25;
      const tableWidth = contentWidth - 20;

      // Header background
      doc
        .fillColor(colors.secondary)
        .rect(contentMarginLeft, tableTop, tableWidth, headerHeight)
        .fill();

      doc
        .fillColor(colors.total)
        .fontSize(10)
        .font('Helvetica-Bold');

      doc.text(pdfSettings.tableHeaderItem || 'Item', col1X, tableTop + 5, { width: 240 });
      doc.text(pdfSettings.tableHeaderQuantity || 'Qtd', col2X, tableTop + 5, { width: 70, align: 'center' });
      doc.text(pdfSettings.tableHeaderUnitPrice || 'Preço Unit.', col3X, tableTop + 5, { width: 60, align: 'right' });
      doc.text(pdfSettings.tableHeaderTotal || 'Total', col4X, tableTop + 5, { width: 55, align: 'right' });

      let tableY = tableTop + headerHeight;

      // Table rows
      const items = Array.isArray(order.order_items) ? order.order_items : [];
      let totalSum = 0;

      items.forEach((item: any, index: number) => {
        const itemName = item.item_name || item.product_variant?.title || 'Item';
        const quantity = Number(item.quantity || 0);
        const unitPrice = Number(item.unit_price || 0);
        const itemTotal = Number(item.total_item_price || 0);
        totalSum += itemTotal;

        // Alternate row background (if striped enabled)
        if (pdfSettings.tableStriped && index % 2 === 0) {
          doc
            .fillColor(colors.secondary)
            .rect(contentMarginLeft, tableY, tableWidth, cellHeight)
            .fill();
        }

        doc
          .fillColor(colors.text)
          .fontSize(9)
          .font('Helvetica')
          .text(itemName, col1X, tableY + 4, { width: 240 });

        doc.text(quantity.toString(), col2X, tableY + 4, { width: 70, align: 'center' });
        doc.text(`${content.currencySymbol} ${unitPrice.toFixed(2)}`, col3X, tableY + 4, { width: 60, align: 'right' });
        doc.text(`${content.currencySymbol} ${itemTotal.toFixed(2)}`, col4X, tableY + 4, { width: 55, align: 'right' });

        tableY += cellHeight;
      });

      // Total row
      const totalRowY = tableY;
      doc
        .fillColor(colors.total)
        .rect(contentMarginLeft, totalRowY, tableWidth, headerHeight)
        .fill();

      doc
        .fillColor('#ffffff')
        .fontSize(11)
        .font('Helvetica-Bold')
        .text(pdfSettings.labelTotal || 'TOTAL:', col1X, totalRowY + 5, { width: 240 })
        .text(`${content.currencySymbol} ${totalSum.toFixed(2)}`, col4X, totalRowY + 5, { width: 55, align: 'right' });

      doc.moveDown(1.5);

      // Notes section with background box
      const notesBoxTop = doc.y;
      const notesBoxHeight = 80;
      
      // Draw background box
      doc
        .fillColor('#f9f9f9')
        .rect(contentMarginLeft, notesBoxTop, contentWidth - 20, notesBoxHeight)
        .fill();
      
      // Draw border
      doc
        .strokeColor(colors.border)
        .lineWidth(1)
        .rect(contentMarginLeft, notesBoxTop, contentWidth - 20, notesBoxHeight)
        .stroke();
      
      // Title inside box
      doc
        .fontSize(11)
        .font('Helvetica-Bold')
        .fillColor(colors.primary)
        .text(content.sectionNotes, contentMarginLeft + 12, notesBoxTop + 10);
      
      // Divider line
      doc
        .strokeColor(colors.border)
        .lineWidth(0.5)
        .moveTo(contentMarginLeft + 12, notesBoxTop + 28)
        .lineTo(contentMarginLeft + contentWidth - 32, notesBoxTop + 28)
        .stroke();
      
      // Notes content
      doc
        .fontSize(9)
        .font('Helvetica')
        .fillColor(colors.text)
        .text(content.notesContent, contentMarginLeft + 12, notesBoxTop + 35, {
          width: contentWidth - 50,
        });
      
      doc.y = notesBoxTop + notesBoxHeight + 10;

      // Check if we need new page for signature/footer
      if (doc.y > doc.page.height - 150) {
        doc.addPage();
        applyBackground(doc);
      }

      doc.moveDown(2);

      // Signature section (if enabled)
      if (pdfSettings.includeSignature) {
        doc
          .fontSize(fonts.smallSize)
          .font('Helvetica')
          .fillColor(colors.text)
          .text('_' + '_'.repeat(50), { align: 'center' })
          .moveDown(0.3)
          .text('Assinatura Autorizada', { align: 'center' });

        // Add logo on signature page if available
        if (logoBuffer) {
          try {
            const logoTop = doc.y + 20;
            doc.image(logoBuffer, 250, logoTop, {
              width: 100,
              height: 100,
            });
          } catch (error) {
            console.warn('⚠️ Erro ao adicionar logo na assinatura:', error.message);
          }
        }

        doc.moveDown(5);
      }

      // Footer
      doc.moveDown(1);
      doc
        .fontSize(fonts.smallSize)
        .fillColor('#9ca3af')
        .text(content.footerText, { align: 'center' })
        .text(`${new Date().toLocaleString('pt-BR')}`, { align: 'center' });

      // Finalize PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
