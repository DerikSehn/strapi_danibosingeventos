import PDFDocument from 'pdfkit';
import { Core } from '@strapi/strapi';
import { fetchBusinessContact } from './fetch-items';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';



/**
 * Type for Order with populated relations matching orderPdfSelect
 */
export interface OrderWithPdfPopulate {
  id: string | number;
  documentId: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  totalPrice?: number;
  eventDate?: string | Date;
  eventDetails?: string;
  internalNotes?: string;
  order_items?: Array<{
    id: string | number;
    documentId?: string;
    quantity?: number;
    unit_price?: number;
    total_item_price?: number;
    item_name?: string;
    product_variant?: {
      id: string | number;
      documentId?: string;
      title?: string;
      price?: number;
      image?: {
        id: string | number;
        documentId?: string;
        url: string;
        name?: string;
      };
      product?: {
        id: string | number;
        documentId?: string;
        title?: string;
        category?: {
          id: string | number;
          documentId?: string;
          title?: string;
        };
      };
    };
  }>;
}

/**
 * Helper: Get full Strapi URL
 */
function getStrapiURL(): string {
  return process.env.STRAPI_URL || process.env.STRAPI_API_URL || 'http://localhost:1337';
}

/**
 * Helper: Convert Strapi media URL to full URL
 */
function getStrapiMedia(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('data:')) return url;
  if (url.startsWith('http') || url.startsWith('//')) return url;
  return `${getStrapiURL()}${url}`;
}

/**
 * Helper: Download image and save to temp directory
 */
async function downloadImageToTemp(url: string, tempDir: string): Promise<string | null> {
  if (!url) {
    return null;
  }
  try {
    const fullUrl = getStrapiMedia(url);
    
    if (!fullUrl) {
      return null;
    }

    const response = await axios.get(fullUrl, { 
      responseType: 'arraybuffer', 
      timeout: 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });


    // Create temp directory if not exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Generate unique filename
    const filename = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`;
    const filepath = path.join(tempDir, filename);

    // Write to disk
    fs.writeFileSync(filepath, Buffer.from(response.data));
    
    return filepath;
  } catch (error) {
    console.warn(`⚠️ Falha ao baixar imagem ${url}:`, error.message);
    console.error(`🔍 DEBUG: Stack trace:`, error.stack);
    return null;
  }
}

/**
 * Helper: Cleanup temporary directory
 */
function cleanupTempDirectory(tempDir: string): void {
  try {
    if (fs.existsSync(tempDir)) {
      const files = fs.readdirSync(tempDir);
      for (const file of files) {
        const filepath = path.join(tempDir, file);
        fs.unlinkSync(filepath);
      }
      fs.rmdirSync(tempDir);
    }
  } catch (error) {
    console.warn(`⚠️ Erro ao limpar diretório temporário:`, error.message);
  }
}

/**
 * Helper: Group items by category
 */
function groupItemsByCategory(items: OrderWithPdfPopulate['order_items']): Map<string, any[]> {
  const grouped = new Map<string, any[]>();
  items.forEach((item) => {
    const categoryName = item.product_variant?.product?.category.title || 'Sem Categoria';
    if (!grouped.has(categoryName)) {
      grouped.set(categoryName, []);
    }
    grouped.get(categoryName)!.push(item);
  });
  
  return grouped;
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
  order: OrderWithPdfPopulate;
  strapi: Core.Strapi;
}): Promise<Buffer> {
  // Create temp directory for all PDF images
  const tempDir = path.join(os.tmpdir(), `strapi-pdf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  
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

      // Download images to temp directory instead of buffer
      
      const coverImagePath = await downloadImageToTemp(coverImageUrl, tempDir);
      
      const backgroundImagePath = await downloadImageToTemp(backgroundImageUrl, tempDir);
      
      const logoPath = await downloadImageToTemp(logoUrl, tempDir);

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
        // Cleanup temp directory after PDF is generated
        cleanupTempDirectory(tempDir);
        resolve(pdfBuffer);
      });

      // Page 1: Cover (if image exists, always show it regardless of setting)
      if (coverImagePath && fs.existsSync(coverImagePath)) {
        try {
          doc.image(coverImagePath, 0, 0, { width: doc.page.width, height: doc.page.height });
          doc.addPage();
        } catch (error) {
          console.warn('⚠️ Erro ao adicionar capa:', error.message);
        }
      }

      // Helper: Apply background image on current page (full bleed, no margins)
      const applyBackground = (pageDoc: any) => {
        if (pdfSettings.includeBackground && backgroundImagePath && fs.existsSync(backgroundImagePath)) {
          try {
            pageDoc.image(backgroundImagePath, 0, 0, {
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
      const clientBoxHeight = 130;
      
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
      
      // Add event date if available
      if (order.eventDate) {
        const eventDate = new Date(order.eventDate);
        const formattedDate = eventDate.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        doc.text(`Evento: ${formattedDate}`, contentMarginLeft + 12, detailsY + 45);
      }
      
      if (order.eventDetails) {
        const detailsLineY = order.eventDate ? detailsY + 60 : detailsY + 45;
        doc.fontSize(9).text(`Detalhes: ${order.eventDetails}`, contentMarginLeft + 12, detailsLineY, { width: contentWidth - 50 });
      }
      
      doc.y = clientBoxTop + clientBoxHeight + 20;

      // Items Grid Section - Modern Design
      doc
        .fontSize(fonts.subtitleSize)
        .font('Helvetica-Bold')
        .fillColor(colors.primary)
        .text(content.sectionItems, contentMarginLeft, doc.y)
        .moveDown(0.5);

      // Group items by category
      const items = Array.isArray(order.order_items) ? order.order_items : [];
      
      const groupedItems = groupItemsByCategory(items);
      
      // Pre-download all images to temp directory
      const allItemsWithImages = await Promise.all(
        items.map(async (item, idx) => {
          const imageUrl = item.product_variant?.image?.url;
          
          const imagePath = imageUrl ? await downloadImageToTemp(imageUrl, tempDir) : null;
          
          return {
            ...item,
            imagePath,
          };
        })
      );

      // Render each category with modern grid layout
      for (const [categoryName, categoryItems] of groupedItems) {
        // Check if we need a new page for this category
        if (doc.y > doc.page.height - 180) {
          doc.addPage();
          applyBackground(doc);
          doc.y = contentMarginTop;
        }

        // Category header with underline
        doc
          .fontSize(12)
          .font('Helvetica-Bold')
          .fillColor(colors.accent)
          .text(categoryName, contentMarginLeft)
          .moveDown(0.2);

        // Add subtle line under category
        const lineY = doc.y - 2;
        doc
          .strokeColor(colors.accent)
          .lineWidth(1.5)
          .moveTo(contentMarginLeft, lineY)
          .lineTo(contentMarginLeft + contentWidth - 20, lineY)
          .stroke();

        doc.moveDown(0.5);

        // Grid parameters - 3 items per row
        const gridItemsPerRow = 3;
        const gridItemWidth = (contentWidth - 20) / gridItemsPerRow;
        const gridItemHeight = 100; // Item card height
        const gridGutter = 8;
        const imageHeight = 60;
        const imagePadding = 5;

        let gridX = contentMarginLeft;
        let gridY = doc.y;
        let itemCount = 0;

        // Get items for this category with images
        const categoryItemsWithImages = allItemsWithImages.filter(
          (item) => (item.product_variant?.product.category?.title || 'Sem Categoria') === categoryName
        );

      


        for (const itemWithImage of categoryItemsWithImages) {
          // Check if we need a new row
          if (itemCount > 0 && itemCount % gridItemsPerRow === 0) {
            gridY += gridItemHeight + gridGutter;
            gridX = contentMarginLeft;

            // Check if we need a new page
            if (gridY > doc.page.height - 120) {
              doc.addPage();
              applyBackground(doc);
              gridY = contentMarginTop;
              gridX = contentMarginLeft;
            }
          }

          const itemName = itemWithImage.item_name || itemWithImage.product_variant?.title || 'Item';
          const quantity = Number(itemWithImage.quantity || 0);

          // Draw item card background (light gray)
          doc
            .fillColor('#f9fafb')
            .rect(gridX, gridY, gridItemWidth - gridGutter, gridItemHeight)
            .fill();

          // Draw item card border
          doc
            .strokeColor(colors.border)
            .lineWidth(0.5)
            .rect(gridX, gridY, gridItemWidth - gridGutter, gridItemHeight)
            .stroke();

          // Image area with border
          const imageX = gridX + imagePadding;
          const imageY = gridY + imagePadding;
          const imageWidth = gridItemWidth - gridGutter - imagePadding * 2;

          // Draw image background placeholder
          doc
            .fillColor('#e5e7eb')
            .rect(imageX, imageY, imageWidth, imageHeight)
            .fill();

          // Render image if available
          const imagePath = itemWithImage.imagePath;
          const imageExists = imagePath ? fs.existsSync(imagePath) : false;
          
          if (imagePath && imageExists) {
            try {
              // PDFKit image method - draw image from file path
              doc.image(imagePath, imageX, imageY, {
                width: imageWidth,
                height: imageHeight,
                fit: [imageWidth, imageHeight],
                align: 'center',
                valign: 'center',
              });
            } catch (imgError) {
              console.warn(`⚠️ Erro ao renderizar imagem de ${itemName}:`, imgError.message);
              console.error(`🔍 DEBUG: Stack trace:`, imgError.stack);
              // Draw "No Image" text
              doc
                .fontSize(8)
                .font('Helvetica')
                .fillColor('#9ca3af')
                .text('Sem Imagem', imageX, imageY + imageHeight / 2 - 4, {
                  width: imageWidth,
                  align: 'center',
                });
            }
          } else {
            // No image placeholder
            doc
              .fontSize(8)
              .font('Helvetica')
              .fillColor('#9ca3af')
              .text('Sem Imagem', imageX, imageY + imageHeight / 2 - 4, {
                width: imageWidth,
                align: 'center',
              });
          }

          // Item name text
          const textY = imageY + imageHeight + 6;
          doc
            .fontSize(9)
            .font('Helvetica-Bold')
            .fillColor(colors.text)
            .text(itemName, gridX + imagePadding, textY, {
              width: gridItemWidth - gridGutter - imagePadding * 2,
              align: 'center',
              ellipsis: true,
              height: 16,
            });

          // Quantity display (only if it's an order type)
          if (order.order_items && order.order_items.length > 0) {
            const qtyY = textY + 16;
            doc
              .fontSize(10)
              .font('Helvetica-Bold')
              .fillColor(colors.accent)
              .text(`Qtd: ${quantity}`, gridX + imagePadding, qtyY, {
                width: gridItemWidth - gridGutter - imagePadding * 2,
                align: 'center',
              });
          }

          // Move to next grid position
          gridX += gridItemWidth;
          itemCount++;
        }

        // Move doc position after grid
        doc.y = gridY + gridItemHeight + 15;
      }

      // Check if we need a new page for total section
      if (doc.y > doc.page.height - 120) {
        doc.addPage();
        applyBackground(doc);
        doc.y = contentMarginTop;
      }

      // Total summary box - Modern style
      const totalBoxTop = doc.y;
      const totalBoxHeight = 60;
      const totalBoxWidth = contentWidth - 20;

      // Main total box with gradient effect (using rect fill)
      doc
        .fillColor(colors.total)
        .rect(contentMarginLeft, totalBoxTop, totalBoxWidth, totalBoxHeight)
        .fill();

      // Total label and value
      doc
        .fontSize(11)
        .font('Helvetica')
        .fillColor('#d1d5db')
        .text('TOTAL DA ENCOMENDA:', contentMarginLeft + 15, totalBoxTop + 10);

      doc
        .fontSize(18)
        .font('Helvetica-Bold')
        .fillColor('#ffffff')
        .text(`${content.currencySymbol} ${order.totalPrice.toFixed(2)}`, contentMarginLeft + 15, totalBoxTop + 28);

      doc.y = totalBoxTop + totalBoxHeight + 15;

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
        // Add logo on signature page if available
        if (logoPath && fs.existsSync(logoPath)) {
          try {
            const logoWidth = 80;
            const logoHeight = 80;
            const logoX = (doc.page.width - logoWidth) / 2;
            doc.image(logoPath, logoX, doc.y, {
              width: logoWidth,
              height: logoHeight,
              fit: [logoWidth, logoHeight],
              align: 'center',
              valign: 'top',
            });
            doc.moveDown(4.5);
          } catch (error) {
            console.warn('⚠️ Erro ao adicionar logo:', error.message);
          }
        }

        // Signature line
        doc
          .fontSize(fonts.smallSize)
          .font('Helvetica')
          .fillColor(colors.text)
          .text('_' + '_'.repeat(50), { align: 'center' })
          .moveDown(0.3)
          .text('Assinatura Autorizada', { align: 'center' });
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
      console.error(`🔍 DEBUG: ===== ERRO NA GERAÇÃO DE PDF =====`);
      console.error(`🔍 DEBUG: ${error.message}`);
      console.error(`🔍 DEBUG: Stack trace:`, error.stack);
      // Cleanup temp directory on error
      cleanupTempDirectory(tempDir);
      reject(error);
    }
  });
}
