# 🎨 Recomendações de Tipografia para Capa de Orçamento

## 📋 Contexto: Cheff Daniela Bosing

**Setor**: Gastronomia / Catering / Eventos  
**Público**: Clientes corporativos e eventos particulares  
**Tom**: Profissional, acessível, premium  
**Objetivo**: Confiança + Criatividade + Requinte

---

## 🏆 Recomendações Finais

### **Camada 1: Título Principal (ORÇAMENTO DE NEGOCIAÇÃO)**

#### ✅ Opção 1: **Montserrat Bold** (RECOMENDADO)
```
Peso: 700 (Bold)
Tamanho: 36-48pt
Cor: #1f2937 (Cinza escuro) ou #111827 (Preto)
Espaçamento: 1.1
Características: Moderno, limpo, corporativo
```
- ✅ Profissional e contemporâneo
- ✅ Excelente legibilidade em PDF
- ✅ Universalmente disponível
- ✅ Funciona bem em tamanhos grandes
- ⭐ Melhor para: Títulos imponentes

#### ✅ Opção 2: **Playfair Display Bold**
```
Peso: 700
Tamanho: 36-44pt
Cor: #1f2937 ou #111827
Características: Elegante, serif sofisticada, premium
```
- ✅ Traz requinte e sofisticação
- ✅ Perfeito para gastronomia
- ✅ Transmite experiência premium
- ⚠️ Menos moderno, mais clássico
- ⭐ Melhor para: Elegância sofisticada

#### ✅ Opção 3: **Poppins ExtraBold**
```
Peso: 800
Tamanho: 38-50pt
Cor: #1f2937
Características: Moderno, geométrico, impactante
```
- ✅ Muito moderno e dinâmico
- ✅ Ótimo para impacto visual
- ⚠️ Menos formal que Montserrat
- ⭐ Melhor para: Marca jovem, inovadora

---

### **Camada 2: Subtítulo (Descrição/Slogan)**

#### ✅ Opção 1: **Montserrat Regular** (RECOMENDADO)
```
Peso: 400 (Regular)
Tamanho: 14-18pt
Cor: #6b7280 (Cinza médio)
Espaçamento: 1.2
```
- ✅ Complementa bem Montserrat Bold
- ✅ Legibilidade perfeita
- ✅ Hierarquia clara

#### ✅ Opção 2: **Open Sans Light**
```
Peso: 300
Tamanho: 16-20pt
Cor: #6b7280 ou #9ca3af (Cinza claro)
```
- ✅ Leve e elegante
- ✅ Menos pesado visualmente

#### ✅ Opção 3: **Lato Regular**
```
Peso: 400
Tamanho: 14-18pt
Cor: #6b7280
```
- ✅ Friendly, acessível
- ✅ Ótima legibilidade

---

### **Camada 3: Informações da Empresa (Logo text)**

#### ✅ Opção: **Montserrat SemiBold**
```
Peso: 600
Tamanho: 12-14pt
Cor: #1f2937
```
- ✅ Destaque sem excesso
- ✅ Integra bem na hierarquia

---

### **Camada 4: Dados do Cliente e Corpo do PDF**

#### ✅ Opção: **Lato Regular ou Open Sans Regular**
```
Peso: 400
Tamanho: 10-11pt
Cor: #374151
Line-height: 1.6
```
- ✅ Máxima legibilidade
- ✅ Confortável para leitura prolongada

---

## 🎯 Combinação Recomendada (Stack Completo)

```
┌─────────────────────────────────────────┐
│          CAPA DO ORÇAMENTO              │
├─────────────────────────────────────────┤
│                                         │
│  [Logo]                                 │
│                                         │
│  ORÇAMENTO DE NEGOCIAÇÃO               │ ← Montserrat Bold 42pt
│  Este documento contém nosso            │ ← Montserrat Regular 16pt
│  orçamento profissional                 │
│                                         │
│  ─────────────────────────────────     │
│                                         │
│  Cheff Daniela Bosing                   │ ← Montserrat SemiBold 13pt
│  contato@cheffdanielabosing.com.br     │ ← Open Sans Regular 11pt
│  (11) 99999-9999                        │
│  www.cheffdanielabosing.com.br         │
│                                         │
│                                         │
│  ───────────────────────────────────   │
│                                         │
│  Data: 20 de Novembro de 2025          │ ← Lato Regular 10pt
│  Documento #ABC123                      │
│                                         │
│  Cozinha com Paixão                    │ ← Montserrat SemiBold 11pt
│  Receitas que Transformam Eventos      │ ← Open Sans Regular 10pt
│                                         │
└─────────────────────────────────────────┘

CONTEÚDO INTERNO:

Montserrat SemiBold 11pt → Títulos de seção (DADOS DO CLIENTE, ITENS DO PEDIDO)
Lato Regular 10pt → Corpo de texto
Open Sans Regular 9pt → Rodapé

Tabelas:
- Header: Montserrat SemiBold 10pt, fundo #1f2937, texto branco
- Dados: Lato Regular 9pt, cores alternadas
- Total: Montserrat SemiBold 11pt, fundo preto
```

---

## 💾 Implementação no PDF Settings

Adicione estes campos ao `PDF Settings` no Strapi:

```json
{
  "fontTitle": "Montserrat",
  "fontTitleSize": 42,
  "fontTitleWeight": "bold",
  
  "fontSubtitle": "Montserrat",
  "fontSubtitleSize": 16,
  "fontSubtitleWeight": "regular",
  
  "fontCompanyName": "Montserrat",
  "fontCompanyNameSize": 13,
  "fontCompanyNameWeight": "semibold",
  
  "fontBody": "Lato",
  "fontBodySize": 10,
  "fontBodyWeight": "regular",
  
  "fontSmall": "Open Sans",
  "fontSmallSize": 9,
  "fontSmallWeight": "regular",
  
  "fontTableHeader": "Montserrat",
  "fontTableHeaderSize": 10,
  "fontTableHeaderWeight": "semibold"
}
```

---

## 📚 Disponibilidade em PDFKit

### ✅ Fontes Nativas (Always Available)

```
PDFKit reconhece nativamente:
- Helvetica (sistema)
- Times-Roman (sistema)
- Courier (sistema)
- Symbol (sistema)
- ZapfDingbats (sistema)

Código:
doc.font('Helvetica-Bold')
doc.fontSize(24)
doc.text('Título')
```

### ❌ Fontes Customizadas (Requer Registro)

Para usar Montserrat, Playfair, Lato no PDF:

```typescript
import PDFDocument from 'pdfkit';

// 1. Registrar fontes
doc.registerFont('Montserrat', '/fonts/Montserrat-Regular.ttf');
doc.registerFont('Montserrat-Bold', '/fonts/Montserrat-Bold.ttf');
doc.registerFont('Montserrat-SemiBold', '/fonts/Montserrat-SemiBold.ttf');

doc.registerFont('Lato', '/fonts/Lato-Regular.ttf');
doc.registerFont('OpenSans', '/fonts/OpenSans-Regular.ttf');
doc.registerFont('Playfair', '/fonts/PlayfairDisplay-Bold.ttf');

// 2. Usar
doc.font('Montserrat-Bold').fontSize(42).text('ORÇAMENTO');
```

---

## 🔧 Solução Pragmática (SEM Fontes Customizadas)

Se não quiser complicar com downloads de fontes, use a **combinação de sistema**:

```typescript
// Título: Helvetica Bold 24pt → Muito profissional
doc.font('Helvetica-Bold').fontSize(24).text('ORÇAMENTO DE NEGOCIAÇÃO');

// Subtítulo: Helvetica 12pt
doc.font('Helvetica').fontSize(12).text('Este documento contém nosso orçamento profissional');

// Corpo: Helvetica 10pt
doc.font('Helvetica').fontSize(10).text('Dados do cliente...');

// Ênfase: Helvetica-Bold 11pt
doc.font('Helvetica-Bold').fontSize(11).text('TOTAL:');
```

**Vantagem**: Funciona em qualquer sistema sem dependências ✅

---

## 🎨 Paleta de Cores Recomendada

```
Título Principal:    #1f2937 (Cinza escuro)
Subtítulo:           #6b7280 (Cinza médio)
Corpo Padrão:        #374151 (Cinza corporativo)
Ênfase/Destaque:     #3b82f6 (Azul)
Fundo Claro:         #f9fafb (Quase branco)
Fundo Escuro:        #1f2937 (Cinza muito escuro)
Bordas:              #d1d5db (Cinza claro)
```

---

## ✨ Sugestão Final (Stack Otimizado)

### **Para Simplicidade + Profissionalismo:**

```typescript
// CAPA
doc.font('Helvetica-Bold').fontSize(36).text('ORÇAMENTO');
doc.font('Helvetica').fontSize(14).text('Documento de Negociação');

// EMPRESA
doc.font('Helvetica-Bold').fontSize(12).text('Cheff Daniela Bosing');
doc.font('Helvetica').fontSize(10).text('São Paulo, SP');

// TABELAS
// Header: Helvetica-Bold 10pt, fundo escuro
// Dados: Helvetica 9pt
// Total: Helvetica-Bold 11pt, fundo escuro

// RODAPÉ
doc.font('Helvetica').fontSize(8).text('Documento gerado automaticamente');
```

**Resultado**: Profissional, clean, sem dependências externas ✅

---

## 🎯 Recomendação Final

### Para PDFKit Nativo (Recomendado):
**Use Helvetica Bold para títulos + Helvetica Regular para corpo**
- ✅ Sempre disponível
- ✅ Muito profissional
- ✅ Excelente legibilidade
- ✅ Zero dependências

### Se Quiser Customizar (Advanced):
**Adicione Montserrat + Lato via `.ttf`**
- ✅ Muito mais elegante
- ✅ Diferencia marca
- ⚠️ Mais complexidade

### Minha Escolha para Você:
🎯 **Helvetica (sistema) + Montserrat Bold (se quiser premium)**

---

## 📦 Próximas Etapas

1. **Escolha a tipografia**: Helvetica (simples) ou com customização
2. **Teste no PDF**: Veja como fica
3. **Ajuste cores** se necessário
4. **Adicione logo** da empresa
5. **Capa pronta!** 🚀

---

**Qual abordagem você prefere? Sistema ou com customização? 🎨**
