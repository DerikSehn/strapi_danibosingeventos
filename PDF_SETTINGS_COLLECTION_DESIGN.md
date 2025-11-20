# 📋 Design de Collection: PDF Settings (Configurações de PDF)

## Visão Geral

Collection **singleType** (única instância) para gerenciar todos os conteúdos e assets dinâmicos usados na geração de PDFs de orçamentos.

---

## 📐 Estrutura da Collection

### 1. **Informações da Empresa**

```
├─ companyName (string, required)
│  └─ "Cheff Daniela Bosing"
│
├─ companyPhone (string)
│  └─ "(11) 99999-9999"
│
├─ companyEmail (string)
│  └─ "contato@cheffdanielabosing.com.br"
│
├─ companyWebsite (string)
│  └─ "www.cheffdanielabosing.com.br"
│
├─ companyAddress (text)
│  └─ "Rua da Cozinha, 123 - São Paulo, SP"
│
├─ companyRegistration (string)
│  └─ CNPJ ou outro identificador: "12.345.678/0001-99"
│
└─ companyDescription (text)
   └─ "Descrição curta da empresa para rodapé"
```

### 2. **Imagens e Assets**

```
├─ logo (media - single)
│  └─ Upload: Logo da empresa
│  └─ Recomendação: PNG 300x300px
│  └─ Uso: Cabeçalho do PDF
│
├─ headerImage (media - single)
│  └─ Upload: Imagem de cabeçalho/banner
│  └─ Recomendação: JPG/PNG 1200x200px
│  └─ Uso: Topo da primeira página (capa)
│  └─ Nota: Altura redimensionada automaticamente
│
├─ footerImage (media - single)
│  └─ Upload: Imagem de rodapé
│  └─ Recomendação: PNG 1200x100px (transparente)
│  └─ Uso: Rodapé de todas as páginas
│
├─ backgroundImage (media - single)
│  └─ Upload: Imagem de fundo (watermark)
│  └─ Recomendação: PNG 2000x2800px semitransparente (30% opacidade)
│  └─ Uso: Fundo de todas as páginas de conteúdo
│  └─ Nota: Será posicionada atrás do conteúdo
│
├─ coverImage (media - single)
│  └─ Upload: Imagem de capa (primeira página)
│  └─ Recomendação: JPG 1200x1600px
│  └─ Uso: Capa completa (primeira página do PDF)
│  └─ Nota: Se presente, cria página separada
│
└─ signatureImage (media - single)
   └─ Upload: Assinatura digital ou stamp
   └─ Recomendação: PNG 400x150px
   └─ Uso: Rodapé da última página (aprovação)
```

### 3. **Configurações de Cores**

```
├─ colorPrimary (string - color)
│  └─ "#1f2937" (Cinza escuro)
│  └─ Uso: Títulos, headers, destaque
│
├─ colorSecondary (string - color)
│  └─ "#f3f4f6" (Cinza muito claro)
│  └─ Uso: Fundos alternados de tabelas
│
├─ colorAccent (string - color)
│  └─ "#3b82f6" (Azul)
│  └─ Uso: Links, CTA, destaque especial
│
├─ colorText (string - color)
│  └─ "#374151" (Cinza médio)
│  └─ Uso: Corpo de texto
│
├─ colorBorder (string - color)
│  └─ "#d1d5db" (Cinza claro)
│  └─ Uso: Bordas de boxes
│
└─ colorTotal (string - color)
   └─ "#111827" (Preto)
   └─ Uso: Row de totais
```

### 4. **Configurações de Fontes e Estilo**

```
├─ fontTitle (enum: Helvetica, Times, Arial)
│  └─ "Helvetica"
│  └─ Uso: Títulos principais
│
├─ fontTitleSize (number)
│  └─ 24
│  └─ Padrão recomendado
│
├─ fontSubtitle (enum: Helvetica, Times, Arial)
│  └─ "Helvetica"
│  └─ Uso: Subtítulos e seções
│
├─ fontSubtitleSize (number)
│  └─ 12
│
├─ fontBody (enum: Helvetica, Times, Arial)
│  └─ "Helvetica"
│  └─ Uso: Corpo de texto principal
│
├─ fontBodySize (number)
│  └─ 10
│
├─ fontSmall (number)
│  └─ 8
│  └─ Uso: Rodapé, notas pequenas
│
└─ lineHeight (number)
   └─ 1.5
   └─ Espaçamento entre linhas
```

### 5. **Conteúdo e Mensagens**

```
├─ headerTitle (string)
│  └─ "ORÇAMENTO DE NEGOCIAÇÃO"
│  └─ Título principal do PDF
│
├─ headerSubtitle (string)
│  └─ "Este documento contém nosso orçamento profissional"
│
├─ sectionTitleClient (string)
│  └─ "DADOS DO CLIENTE"
│
├─ sectionTitleItems (string)
│  └─ "ITENS DO PEDIDO"
│
├─ sectionTitleNotes (string)
│  └─ "OBSERVAÇÕES"
│
├─ tableHeaderItem (string)
│  └─ "Item"
│
├─ tableHeaderQuantity (string)
│  └─ "Qtd"
│
├─ tableHeaderUnitPrice (string)
│  └─ "Preço Unit."
│
├─ tableHeaderTotal (string)
│  └─ "Total"
│
├─ labelTotal (string)
│  └─ "TOTAL:"
│
├─ notesContent (text)
│  └─ "Este é um orçamento de negociação. Os valores e itens listados acima são nossos valores finais para este pedido."
│
├─ footerText (text)
│  └─ "Documento gerado automaticamente pelo sistema de orçamentos"
│
├─ warrantyText (string)
│  └─ Texto de garantia/aviso legal
│
├─ thanksText (string)
│  └─ "Obrigado por sua confiança!"
│
└─ disclaimerText (text)
   └─ "Validade da proposta: 30 dias"
```

### 6. **Configurações de Layout**

```
├─ pageMargin (number)
│  └─ 40 (mm)
│  └─ Margem de todas as páginas
│
├─ pageSize (enum: A4, Letter)
│  └─ "A4"
│
├─ includeCover (boolean)
│  └─ true
│  └─ Se true: primeira página é capa
│
├─ includeSignature (boolean)
│  └─ true
│  └─ Se true: adiciona bloco de assinatura no final
│
├─ includeBackground (boolean)
│  └─ true
│  └─ Se true: aplica imagem de fundo
│
├─ includeFooter (boolean)
│  └─ true
│  └─ Se true: adiciona rodapé em todas as páginas
│
├─ tableStriped (boolean)
│  └─ true
│  └─ Se true: alterna cores de linhas
│
├─ companyBoxEnabled (boolean)
│  └─ true
│  └─ Se true: mostra box com info da empresa
│
├─ showDocumentNumber (boolean)
│  └─ true
│  └─ Se true: mostra "Orçamento #123"
│
├─ showGenerationDate (boolean)
│  └─ true
│  └─ Se true: mostra data de geração
│
└─ showGenerationTime (boolean)
   └─ true
   └─ Se true: mostra hora de geração
```

### 7. **Configurações Avançadas**

```
├─ logoWidth (number)
│  └─ 80 (px)
│
├─ logoHeight (number)
│  └─ 80 (px)
│
├─ headerImageHeight (number)
│  └─ 150 (px)
│
├─ backgroundOpacity (number)
│  └─ 0.15 (0.0 = transparente, 1.0 = opaco)
│
├─ cellPadding (number)
│  └─ 8 (px)
│  └─ Padding interno das células da tabela
│
├─ enableDebugMode (boolean)
│  └─ false
│  └─ Se true: mostra informações de debug (posições, margens)
│
└─ currencySymbol (string)
   └─ "R$"
```

---

## 📁 Schema JSON Completo

```json
{
  "kind": "singleType",
  "collectionName": "pdf_settings",
  "info": {
    "singularName": "pdf-setting",
    "pluralName": "pdf-settings",
    "displayName": "PDF Settings",
    "description": "Configurações centralizadas para geração de PDFs de orçamentos"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "companyName": {
      "type": "string",
      "required": true,
      "default": "Cheff Daniela Bosing"
    },
    "companyPhone": {
      "type": "string",
      "default": "(11) 99999-9999"
    },
    "companyEmail": {
      "type": "email",
      "default": "contato@cheffdanielabosing.com.br"
    },
    "companyWebsite": {
      "type": "string"
    },
    "companyAddress": {
      "type": "text"
    },
    "companyRegistration": {
      "type": "string"
    },
    "companyDescription": {
      "type": "text"
    },
    "logo": {
      "type": "media",
      "multiple": false,
      "required": false
    },
    "headerImage": {
      "type": "media",
      "multiple": false,
      "required": false
    },
    "footerImage": {
      "type": "media",
      "multiple": false,
      "required": false
    },
    "backgroundImage": {
      "type": "media",
      "multiple": false,
      "required": false
    },
    "coverImage": {
      "type": "media",
      "multiple": false,
      "required": false
    },
    "signatureImage": {
      "type": "media",
      "multiple": false,
      "required": false
    },
    "colorPrimary": {
      "type": "string",
      "default": "#1f2937"
    },
    "colorSecondary": {
      "type": "string",
      "default": "#f3f4f6"
    },
    "colorAccent": {
      "type": "string",
      "default": "#3b82f6"
    },
    "colorText": {
      "type": "string",
      "default": "#374151"
    },
    "colorBorder": {
      "type": "string",
      "default": "#d1d5db"
    },
    "colorTotal": {
      "type": "string",
      "default": "#111827"
    },
    "fontTitle": {
      "type": "enumeration",
      "enum": ["Helvetica", "Times-Roman", "Courier"],
      "default": "Helvetica"
    },
    "fontTitleSize": {
      "type": "integer",
      "default": 24
    },
    "fontSubtitle": {
      "type": "enumeration",
      "enum": ["Helvetica", "Times-Roman", "Courier"],
      "default": "Helvetica"
    },
    "fontSubtitleSize": {
      "type": "integer",
      "default": 12
    },
    "fontBody": {
      "type": "enumeration",
      "enum": ["Helvetica", "Times-Roman", "Courier"],
      "default": "Helvetica"
    },
    "fontBodySize": {
      "type": "integer",
      "default": 10
    },
    "fontSmall": {
      "type": "integer",
      "default": 8
    },
    "headerTitle": {
      "type": "string",
      "default": "ORÇAMENTO DE NEGOCIAÇÃO"
    },
    "headerSubtitle": {
      "type": "string",
      "default": "Este documento contém nosso orçamento profissional"
    },
    "sectionTitleClient": {
      "type": "string",
      "default": "DADOS DO CLIENTE"
    },
    "sectionTitleItems": {
      "type": "string",
      "default": "ITENS DO PEDIDO"
    },
    "sectionTitleNotes": {
      "type": "string",
      "default": "OBSERVAÇÕES"
    },
    "tableHeaderItem": {
      "type": "string",
      "default": "Item"
    },
    "tableHeaderQuantity": {
      "type": "string",
      "default": "Qtd"
    },
    "tableHeaderUnitPrice": {
      "type": "string",
      "default": "Preço Unit."
    },
    "tableHeaderTotal": {
      "type": "string",
      "default": "Total"
    },
    "labelTotal": {
      "type": "string",
      "default": "TOTAL:"
    },
    "notesContent": {
      "type": "text",
      "default": "Este é um orçamento de negociação. Os valores e itens listados acima são nossos valores finais para este pedido."
    },
    "footerText": {
      "type": "text",
      "default": "Documento gerado automaticamente pelo sistema de orçamentos"
    },
    "warrantyText": {
      "type": "string"
    },
    "thanksText": {
      "type": "string",
      "default": "Obrigado por sua confiança!"
    },
    "disclaimerText": {
      "type": "text"
    },
    "pageMargin": {
      "type": "integer",
      "default": 40
    },
    "pageSize": {
      "type": "enumeration",
      "enum": ["A4", "Letter"],
      "default": "A4"
    },
    "includeCover": {
      "type": "boolean",
      "default": false
    },
    "includeSignature": {
      "type": "boolean",
      "default": false
    },
    "includeBackground": {
      "type": "boolean",
      "default": true
    },
    "includeFooter": {
      "type": "boolean",
      "default": true
    },
    "tableStriped": {
      "type": "boolean",
      "default": true
    },
    "companyBoxEnabled": {
      "type": "boolean",
      "default": true
    },
    "showDocumentNumber": {
      "type": "boolean",
      "default": true
    },
    "showGenerationDate": {
      "type": "boolean",
      "default": true
    },
    "showGenerationTime": {
      "type": "boolean",
      "default": false
    },
    "logoWidth": {
      "type": "integer",
      "default": 80
    },
    "logoHeight": {
      "type": "integer",
      "default": 80
    },
    "headerImageHeight": {
      "type": "integer",
      "default": 150
    },
    "backgroundOpacity": {
      "type": "decimal",
      "default": 0.15
    },
    "cellPadding": {
      "type": "integer",
      "default": 8
    },
    "enableDebugMode": {
      "type": "boolean",
      "default": false
    },
    "currencySymbol": {
      "type": "string",
      "default": "R$"
    }
  }
}
```

---

## 🚀 Como Criar via Terminal (Strapi CLI)

```bash
# 1. Gere a collection usando Strapi generators
cd backend
npm run strapi generate

# 2. Escolha as opções:
# > collection type? (y/n) > n (singleType)
# > API name? pdf-setting
# > REST API? (y/n) > y
# > GraphQL? (y/n) > n
```

## 📝 Criação Manual

1. **Crie a pasta**: `backend/src/api/pdf-setting/`
2. **Crie a subpasta**: `content-types/pdf-setting/`
3. **Copie o `schema.json`** acima para `backend/src/api/pdf-setting/content-types/pdf-setting/schema.json`
4. **Reinicie o Strapi**: `npm run dev`

---

## 🔗 Integração no Serviço de PDF

```typescript
// backend/src/api/budget/services/generate-quote-pdf.ts

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
      // ✨ NOVO: Buscar configurações de PDF
      const pdfSettings = await strapi.entityService.findOne('api::pdf-setting.pdf-setting', 1, {
        populate: ['logo', 'headerImage', 'footerImage', 'backgroundImage', 'coverImage', 'signatureImage'],
      });

      if (!pdfSettings) {
        throw new Error('PDF Settings não encontradas. Crie a configuração no Strapi.');
      }

      // ✨ Usar cores, fonts, conteúdo do pdfSettings em vez de hardcoded
      const colors = {
        primary: pdfSettings.colorPrimary,
        secondary: pdfSettings.colorSecondary,
        text: pdfSettings.colorText,
      };

      // ... resto da lógica usando pdfSettings ...
    } catch (error) {
      reject(error);
    }
  });
}
```

---

## 💡 Dicas de Uso

### Upload de Imagens Recomendadas

| Imagem | Tamanho Recomendado | Formato | Nota |
|--------|-------------------|---------|------|
| Logo | 300x300px | PNG | Sem fundo ou com fundo transparente |
| Header | 1200x200px | JPG/PNG | Banner do topo |
| Footer | 1200x100px | PNG | Com fundo transparente |
| Background | 2000x2800px | PNG | Semi-transparente (30% opacidade) |
| Cover | 1200x1600px | JPG | Capa completa |
| Signature | 400x150px | PNG | Assinatura/stamp |

### Workflow de Gerenciamento

1. **Admin acessa**: `/admin/content-manager/collectionType/api::pdf-setting.pdf-setting`
2. **Edita todos os campos**: Empresa, cores, imagens, mensagens
3. **Publica as mudanças**: Draft & Publish
4. **PDFs gerados** automaticamente usam as novas configurações

### Versionamento de Templates

Para diferentes "tipos" de PDF (Orçamento, Nota Fiscal, Relatório):
- Criar **múltiplas single types**: `pdf-setting-quote`, `pdf-setting-invoice`
- Ou usar um campo `templateType` (enum) na mesma collection

---

## ✅ Checklist de Implementação

```
[ ] Criar schema.json conforme acima
[ ] Reiniciar Strapi
[ ] Acessar Admin e visualizar a collection
[ ] Fazer upload de imagens teste
[ ] Atualizar serviço generate-quote-pdf.ts
[ ] Testar geração de PDF com novas imagens
[ ] Validar cores, fontes, layout
```

---

**Pronto para criar a collection? 🎨**
