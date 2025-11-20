# 🚀 Instalação da Collection PDF Settings

## Comparação: Automático vs Manual

| Aspecto | Via Código (Automático) | Via CMS (Manual) |
|---------|-------------------------|-----------------|
| **Velocidade** | ⚡ Instantâneo | ⏱️ Manual (5 min) |
| **Segurança** | ✅ Versionado no Git | ✅ Interface validada |
| **Controle** | ✅ Código = Fonte da verdade | ✅ Admin mais intuitivo |
| **Colaboração** | ✅ PR review obrigatório | ⚠️ Sem histórico de mudanças |
| **Backup** | ✅ Já está no Git | ❌ Precisa de dump DB |
| **Dev/Prod** | ✅ Sempre sincronizado | ⚠️ Pode desincronizar |
| **Ideal para** | 🎯 **Produção + Desenvolvimento** | 🎯 **Testes rápidos** |

---

## ✅ RECOMENDAÇÃO: **AMBAS!**

1. **Código**: Para garantir collection sempre existe e versão correta
2. **CMS**: Para gerenciar conteúdo (imagens, cores, mensagens)

---

## 🎯 Opção 1: Via Código (RECOMENDADO PARA PRODUÇÃO)

### ✅ Já Feito!

A collection foi criada automaticamente via arquivos de código:

```
backend/src/api/pdf-setting/
├── content-types/
│   └── pdf-setting/
│       ├── schema.json          ✅ Criado
│       └── index.ts             ✅ Criado
├── controllers/
│   └── pdf-setting.ts           ✅ Criado
└── routes/
    └── pdf-setting.ts           ✅ Criado
```

### 🔄 Como Usar

1. **Reinicie o Strapi**:
```bash
cd backend
npm run dev
```

2. **Acesse o Admin**:
- URL: `http://localhost:1337/admin`
- Vá para: **Content Manager > PDF Settings**
- A collection já estará lá! 🎉

3. **Pronto para usar!**
- Preencha as informações
- Faça upload das imagens
- Clique em "Publish"

---

## 🎯 Opção 2: Via CLI (Se Preferir Interativo)

Se quiser recriar ou customizar via CLI:

```bash
# 1. Entre na pasta backend
cd backend

# 2. Execute o gerador Strapi
npm run strapi generate

# 3. Escolha as opções (prompt):
# ❯ What type of files do you want to generate?
#   ❯ components  → No, skip (Esc)
#   ❯ content-types → Yes
#   ❯ controllers → No, skip
#   ❯ routes → No, skip
#   ❯ plugins → No, skip

# 4. Siga os prompts:
# ? What do you want to name this content-type?
#   → pdf-setting
# ? Is it a singleType?
#   → Y (Yes)
# ? Do you want to create a new REST API?
#   → Y (Yes)
```

---

## 🎯 Opção 3: Seed Automático (Para Dados Iniciais)

Se quiser popular com dados padrão automaticamente:

### Criar arquivo de seed:

```bash
touch backend/src/database/seeds/pdf-settings.seed.ts
```

### Conteúdo do seed (`pdf-settings.seed.ts`):

```typescript
export const seed = async (strapi) => {
  try {
    // Verificar se já existe
    const existing = await strapi.db
      .query('api::pdf-setting.pdf-setting')
      .findOne();

    if (existing) {
      console.log('PDF Settings já existe. Pulando seed...');
      return;
    }

    // Criar padrão
    await strapi.entityService.create('api::pdf-setting.pdf-setting', {
      data: {
        companyName: 'Cheff Daniela Bosing',
        companyPhone: '(11) 99999-9999',
        companyEmail: 'contato@cheffdanielabosing.com.br',
        companyWebsite: 'www.cheffdanielabosing.com.br',
        companyAddress: 'São Paulo, SP',
        companyRegistration: '',
        companyDescription: 'Receitas incríveis para seu evento',
        colorPrimary: '#1f2937',
        colorSecondary: '#f3f4f6',
        colorAccent: '#3b82f6',
        colorText: '#374151',
        colorBorder: '#d1d5db',
        colorTotal: '#111827',
        fontTitle: 'Helvetica',
        fontTitleSize: 24,
        fontSubtitle: 'Helvetica',
        fontSubtitleSize: 12,
        fontBody: 'Helvetica',
        fontBodySize: 10,
        fontSmall: 8,
        headerTitle: 'ORÇAMENTO DE NEGOCIAÇÃO',
        headerSubtitle: 'Este documento contém nosso orçamento profissional',
        sectionTitleClient: 'DADOS DO CLIENTE',
        sectionTitleItems: 'ITENS DO PEDIDO',
        sectionTitleNotes: 'OBSERVAÇÕES',
        tableHeaderItem: 'Item',
        tableHeaderQuantity: 'Qtd',
        tableHeaderUnitPrice: 'Preço Unit.',
        tableHeaderTotal: 'Total',
        labelTotal: 'TOTAL:',
        notesContent: 'Este é um orçamento de negociação. Os valores e itens listados acima são nossos valores finais para este pedido.',
        footerText: 'Documento gerado automaticamente pelo sistema de orçamentos',
        warrantyText: '',
        thanksText: 'Obrigado por sua confiança!',
        disclaimerText: 'Validade da proposta: 30 dias',
        pageMargin: 40,
        pageSize: 'A4',
        includeCover: false,
        includeSignature: false,
        includeBackground: true,
        includeFooter: true,
        tableStriped: true,
        companyBoxEnabled: true,
        showDocumentNumber: true,
        showGenerationDate: true,
        showGenerationTime: false,
        logoWidth: 80,
        logoHeight: 80,
        headerImageHeight: 150,
        backgroundOpacity: 0.15,
        cellPadding: 8,
        enableDebugMode: false,
        currencySymbol: 'R$',
        publishedAt: new Date(),
      },
    });

    console.log('✅ PDF Settings criado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao criar PDF Settings:', error);
  }
};
```

### Executar seed:

```bash
npm run strapi db:seed run pdf-settings
```

---

## 📋 Checklist de Instalação

### ✅ Fase 1: Código (PRONTO!)
- [x] Schema JSON criado
- [x] Controller criado
- [x] Routes criadas
- [x] Index TypeScript criado

### ⏳ Fase 2: Iniciar Strapi
- [ ] Execute: `npm run dev` no backend
- [ ] Aguarde build (2-3 min)
- [ ] Acesse: `http://localhost:1337/admin`

### ⏳ Fase 3: Verificar Collection
- [ ] Vá para: Content Manager
- [ ] Procure: "PDF Settings"
- [ ] Clique e abra
- [ ] Você deve ver todos os campos! 🎉

### ⏳ Fase 4: Preencher Dados
- [ ] Preencha informações da empresa
- [ ] Faça upload de imagens
- [ ] Defina cores
- [ ] Configure mensagens
- [ ] Clique "Publish"

### ⏳ Fase 5: Atualizar Serviço PDF
- [ ] Modifique: `backend/src/api/budget/services/generate-quote-pdf.ts`
- [ ] Busque dados de `pdf-setting` em vez de hardcoded
- [ ] Teste geração de PDF

---

## 🔍 Verificação de Criação

```bash
# Se quiser confirmar que foi criado, acesse:
curl http://localhost:1337/api/pdf-settings

# Resposta esperada:
{
  "data": {
    "id": 1,
    "documentId": "...",
    "companyName": "Cheff Daniela Bosing",
    "colorPrimary": "#1f2937",
    ...
  }
}
```

---

## 🚀 Próximas Etapas

1. **Atualizar `generate-quote-pdf.ts`** para buscar configs de PDF Settings
2. **Testar PDF** com novas imagens e cores
3. **Adicionar upload de imagens** no CMS
4. **Sincronizar com Git** para compartilhar com team

---

## ❌ Troubleshooting

### Problema: "PDF Settings não aparece no Admin"
**Solução**: Reinicie Strapi com `Ctrl+C` e `npm run dev`

### Problema: "Erro ao criar PDF: PDF Settings não encontrada"
**Solução**: 
1. Acesse `/admin`
2. Vá para Content Manager → PDF Settings
3. Clique em "Create"
4. Preencha com dados padrão
5. Clique "Publish"

### Problema: "Erro de media/upload"
**Solução**: 
- Verifique se o plugin de media está ativo
- Confirme permissões de upload na pasta `public/uploads`

---

## 📚 Referências

- [Strapi Content Types Docs](https://docs.strapi.io/user-docs/content-manager/creating-new-content-type)
- [Strapi API Usage](https://docs.strapi.io/dev-docs/api/rest)
- [Strapi Database Seeds](https://docs.strapi.io/dev-docs/database)

**Pronto para começar? 🚀**
