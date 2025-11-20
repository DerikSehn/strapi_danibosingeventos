# Guia Completo: Funcionalidade de PDF para Orçamentos

## 📊 Recomendação de Bibliotecas para Gerar PDFs

### Opções Avaliadas

| Biblioteca | Pros | Contras | Caso de Uso |
|-----------|------|---------|-----------|
| **PDFKit** ✅ (Escolhida) | Leve, Nativo Node.js, Customização completa, Sem dependências pesadas | Curva de aprendizado, Sem HTML->PDF direto | Relatórios profissionais, Invoices, Orçamentos |
| `puppeteer` | HTML->PDF perfeito, Renderiza exatamente como no navegador | Pesado (precisa Chromium), Lento para volume alto | PDFs complexos com estilos CSS avançados |
| `html2pdf` | Fácil de usar | Qualidade inferior, Client-side | Conversões rápidas, Protótipos |
| `node-html2pdf` | Usa Puppeteer, Fácil | Mesmo peso que Puppeteer | Alternativa simplificada do Puppeteer |
| `jsPDF` | Suporta JavaScript client-side | Qualidade ruim, Limitado | Casos simples client-side |
| `@react-pdf/renderer` | Integração React, Declarativo | Comunidade menor, Menos flexível | Projetos React com renderização de PDFs |

### ✅ Por que PDFKit foi escolhido?

1. **Leve e Eficiente**: ~4 MB de tamanho, sem dependências externas pesadas
2. **Controle Total**: Customização completa de fontes, cores, layout
3. **Performance**: Rápido para gerar múltiplos PDFs em paralelo
4. **Profissional**: Suporta:
   - Múltiplas páginas
   - Imagens e gráficos
   - Fontes customizadas
   - Tabelas (criadas manualmente)
   - Posicionamento absoluto

5. **Manutenção**: Biblioteca estável e bem documentada

---

## 🎨 Design do PDF Gerado

O PDF inclui:

### 1. **Cabeçalho Profissional**
- Título: "ORÇAMENTO DE NEGOCIAÇÃO"
- Box com dados da empresa (nome, telefone, email)
- Data do documento e número do orçamento

### 2. **Seção de Dados do Cliente**
- Nome, telefone, email
- Detalhes do evento (se informado)

### 3. **Tabela de Itens**
- Design com linhas alternadas (zebra striping)
- Colunas: Item | Quantidade | Preço Unitário | Total
- Header em cinza escuro com texto branco

### 4. **Total Geral**
- Highlighted em background escuro
- Valor total em destaque

### 5. **Rodapé**
- Observações sobre a validade do orçamento
- Data/hora de geração
- Nota: "Documento gerado automaticamente"

---

## 🔧 Implementação Técnica

### Backend (Strapi)

#### Arquivo: `generate-quote-pdf.ts`
```typescript
export async function generateQuotePDF({
  orderId,
  order,
  strapi,
}): Promise<Buffer>
```

**Retorna**: Buffer contendo dados binários do PDF

**Customizações possíveis**:
- `doc.fontSize()` - Alterar tamanhos de fonte
- `doc.fillColor()` - Alterar cores
- `doc.font()` - Usar diferentes fontes
- `doc.rect()` - Desenhar formas
- `doc.image()` - Inserir imagens/logos

#### Arquivo: `send-quote-pdf-email.ts`
```typescript
export async function sendQuotePDFEmail({
  orderId,
  order,
  strapi,
}): Promise<{ success: boolean; message: string }>
```

**Anexa PDF** ao email via `attachments[]`

### Frontend (Next.js)

#### Componente: `quote-action-buttons.tsx`
- Dois botões: "Baixar PDF" e "Enviar PDF"
- Estados de loading com spinners
- Validação de email antes de enviar

#### Rotas de API:
- `GET /api/orders/[id]/download-pdf` - Proxeia para backend
- `POST /api/orders/[id]/send-pdf` - Proxeia para backend

### Backend Endpoints

```
GET /api/budget/:id/download-pdf
→ Gera PDF e retorna como arquivo para download

POST /api/budget/:id/send-pdf
→ Gera PDF e envia por email
→ Requer: order.customerEmail
→ Registra evento: "pdf_sent"
```

---

## 🚀 Como Usar

### 1. Baixar PDF
```typescript
// Button click → fetch('/api/orders/{id}/download-pdf')
// Browser baixa o arquivo automaticamente
```

### 2. Enviar PDF por Email
```typescript
// Button click → fetch('/api/orders/{id}/send-pdf', { method: 'POST' })
// Backend:
//   1. Gera PDF
//   2. Envia para customer email
//   3. Registra evento
//   4. Retorna sucesso
```

---

## 📁 Arquivos Criados/Modificados

```
✅ backend/src/api/budget/services/generate-quote-pdf.ts        (NOVO)
✅ backend/src/api/budget/services/send-quote-pdf-email.ts      (NOVO)
✅ backend/src/api/budget/controllers/calculate.ts              (MODIFICADO)
✅ backend/src/api/budget/routes/calculate.ts                   (MODIFICADO)
✅ backend/package.json                                          (pdfkit adicionado)
✅ frontend/components/orders/quote-action-buttons.tsx           (NOVO)
✅ frontend/app/api/orders/[id]/download-pdf/route.ts           (NOVO)
✅ frontend/app/api/orders/[id]/send-pdf/route.ts               (NOVO)
✅ frontend/app/dashboard/orders/[id]/client.tsx                (MODIFICADO)
```

---

## 🎯 Fluxo Completo

### Baixar PDF
```
Clique no botão "Baixar PDF"
    ↓
QuoteActionButtons chama /api/orders/{id}/download-pdf
    ↓
Frontend route proxeia para /api/budget/{id}/download-pdf
    ↓
Backend:
  1. Busca ordem com itens
  2. Chama generateQuotePDF()
  3. Retorna Buffer do PDF
    ↓
Frontend recebe Blob
    ↓
Browser faz download automático
```

### Enviar PDF por Email
```
Clique no botão "Enviar PDF"
    ↓
QuoteActionButtons valida customerEmail
    ↓
Chama /api/orders/{id}/send-pdf (POST)
    ↓
Frontend route proxeia para /api/budget/{id}/send-pdf
    ↓
Backend:
  1. Busca ordem com itens
  2. Chama generateQuotePDF()
  3. Chama sendQuotePDFEmail()
  4. Registra evento "pdf_sent"
  5. Retorna sucesso
    ↓
Frontend mostra toast de sucesso
```

---

## 🎨 Customizações Futuras

### Adicionar Logo
```typescript
doc.image('path/to/logo.png', 50, boxTop + 5, { width: 100 });
```

### Adicionar Assinatura Digital
```typescript
doc.text('Assinado digitalmente', 50, doc.y);
doc.text(`${new Date().toISOString()}`, 50, doc.y);
```

### Múltiplas Páginas
```typescript
doc.addPage();
doc.fontSize(12).text('Página 2', 100, 100);
```

### Gráficos/Charts
```typescript
// Usar svg2pdf para converter SVG em PDF
// Ou desenhar manualmente com PDFKit shapes
```

### Tema Customizável
```typescript
const colors = {
  primary: '#1f2937',
  secondary: '#f3f4f6',
  accent: '#3b82f6'
};
```

---

## 📊 Comparação com Alternativas

### Se usar Puppeteer em vez de PDFKit:

**Vantagens**:
- HTML/CSS renderizado exatamente como navegador
- Mais fácil para designs complexos

**Desvantagens**:
- +50 MB de tamanho (Chromium)
- Lenta para volume alto
- Consome mais memória

**Instalação**:
```bash
npm install puppeteer
```

**Código Equivalente**:
```typescript
import puppeteer from 'puppeteer';

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setContent(htmlContent);
const pdf = await page.pdf({ format: 'A4' });
await browser.close();
```

---

## ✅ Checklist de Teste

- [ ] Botão "Baixar PDF" aparece no detalhe do pedido
- [ ] Botão "Enviar PDF" aparece no detalhe do pedido
- [ ] Clique em "Baixar PDF" faz download do arquivo
- [ ] PDF gerado tem nome correto: `orcamento-{id}.pdf`
- [ ] PDF contém todos os itens do pedido
- [ ] PDF contém dados do cliente corretos
- [ ] PDF contém total correto
- [ ] Clique em "Enviar PDF" envia email ao cliente
- [ ] Email contém o PDF em anexo
- [ ] Toast de sucesso aparece após envio
- [ ] Evento "pdf_sent" é registrado
- [ ] Botão desabilitado quando sem email do cliente

---

## 🔗 Endpoints Completos

```
GET /api/budget/:id/download-pdf
Content-Type: application/pdf
→ PDF file (binary)

POST /api/budget/:id/send-pdf
Content-Type: application/json
→ {
    "success": true,
    "message": "PDF enviado com sucesso para email@example.com"
  }
```

---

## 📝 Exemplo de uso via cURL

```bash
# Baixar PDF
curl -X GET http://localhost:1337/api/budget/abc123/download-pdf \
  -H "Accept: application/pdf" \
  -o orcamento.pdf

# Enviar PDF por email
curl -X POST http://localhost:1337/api/budget/abc123/send-pdf \
  -H "Content-Type: application/json"
```

---

## 🎉 Conclusão

A implementação usa **PDFKit** por ser a melhor opção para:
- ✅ Relatórios profissionais
- ✅ Performance
- ✅ Peso reduzido
- ✅ Customização completa

Você agora pode **baixar** e **enviar por email** orçamentos em PDF com design profissional! 🚀
