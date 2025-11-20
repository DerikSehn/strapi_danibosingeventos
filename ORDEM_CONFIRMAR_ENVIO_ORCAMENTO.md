# Funcionalidade: Envio de Orçamento ao Confirmar Pedido

## Resumo
Quando um pedido é confirmado (clicando em "Confirmar" no detalhe do pedido), o sistema agora envia automaticamente um email com um orçamento de negociação contendo apenas os valores finais e os itens que serão inclusos no pedido.

## Fluxo Completo

```
1. Usuário clica em "Confirmar" na página de detalhe do pedido
                ↓
2. ApproveSwitch muda status para 'confirmado' 
   e mostra "Enviando orçamento..." com spinner
                ↓
3. confirmOrderStatus() → atualiza status + chama POST /budget/{id}/send-quote
                ↓
4. Backend recebe o pedido, extrai itens com valores finais
                ↓
5. Gera email em formato MJML com tabela de itens + total
                ↓
6. Envia email para o cliente (ou contato de negócio se email não informado)
                ↓
7. Registra evento "quote_sent" no histórico do pedido
                ↓
8. Retorna sucesso e toast é mostrado ao usuário
```

## Mudanças Implementadas

### Backend (`Strapi`)

#### 1. Nova Rota
**Arquivo:** `backend/src/api/budget/routes/calculate.ts`
```
POST /api/budget/:id/send-quote
```

#### 2. Novo Serviço
**Arquivo:** `backend/src/api/budget/services/send-order-quote.ts`

Função principal:
```typescript
export async function sendOrderQuote({
  orderId,
  strapi,
}: {
  orderId: string | number;
  strapi: Core.Strapi;
})
```

**O que faz:**
- Busca o pedido com todos os itens (order_items)
- Extrai dados do cliente: nome, email, telefone
- Extrai itens com valores finais: quantidade, preço unitário, subtotal
- Gera email HTML usando template MJML
- Envia via serviço de email do Strapi
- Registra evento de envio

**Email gerado:**
- Cabeçalho: "Orçamento de Negociação"
- Seção dados do cliente
- Tabela com itens: Item | Quantidade | Preço Unitário | Total
- Total geral destacado
- Rodapé com dados do negócio

#### 3. Handler no Controller
**Arquivo:** `backend/src/api/budget/controllers/calculate.ts`

Novo método:
```typescript
async sendOrderQuote(ctx) {
  // valida ID do pedido
  // chama sendOrderQuote()
  // registra evento
  // retorna resposta
}
```

### Frontend (`Next.js`)

#### 1. Nova Action Server
**Arquivo:** `frontend/app/dashboard/orders/[id]/actions.ts`

Modificação em `confirmOrderStatus()`:
```typescript
// Se status for "confirmado", chama novo endpoint de envio de orçamento
if (status === "confirmado") {
  try {
    await fetchBackend(`/budget/${id}/send-quote`, {}, {
      method: 'POST',
      requireAuth: false
    });
  } catch (quoteError) {
    console.warn('Failed to send quote email:', quoteError);
    // Não falha a operação completa se email falhar
  }
}
```

#### 2. Melhorias no Componente
**Arquivo:** `frontend/components/orders/approve-switch.tsx`

Alterações:
- Adiciona prop `isLoading` para mostrar estado de envio
- Mostra spinner e texto "Enviando orçamento..." durante processamento
- Desabilita cliques enquanto o endpoint está sendo processado
- Importa `Loader2` do lucide-react

```typescript
{isLoading ? (
  <>
    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
    Enviando orçamento...
  </>
) : (
  checked ? 'Desmarcar' : 'Confirmar'
)}
```

#### 3. Passar Estado de Loading
**Arquivo:** `frontend/app/dashboard/orders/[id]/client.tsx`

Na chamada do ApproveSwitch:
```typescript
<ApproveSwitch
  defaultChecked={order.status === 'confirmado'}
  isLoading={confirmMutation.isPending}
  onStatusChange={(status) => {
    confirmMutation.mutateAsync({ id: order?.documentId || order?.id, status });
  }}
/>
```

## Como Testar

### 1. Teste Manual no Dashboard
1. Acesse: `http://localhost:3000/dashboard/orders`
2. Selecione um pedido
3. Clique no botão "Confirmar"
4. Aguarde 2-3 segundos enquanto vê "Enviando orçamento..."
5. Veja toast de sucesso/erro
6. Verifique os logs do backend para confirmar envio

### 2. Teste de Email
1. Verifique no Mailhog (ou seu serviço de email):
   - Endereço: `http://localhost:1025`
   - Email deve conter tabela formatada com itens do pedido
   - Assunto: "Orçamento de Negociação - [Nome do Cliente]"

### 3. Verificar no Backend
```bash
# Logs indicam sucesso:
[Send Order Quote] Starting quote sending process { orderId: 'abc123' }
[Send Order Quote] Order loaded: { ... }
[Send Order Quote] Quote email sent successfully
```

## Dados Inclusos no Email

| Campo | Origem |
|-------|--------|
| Nome Cliente | `order.customerName` |
| Email | `order.customerEmail` ou contato de negócio |
| Telefone | `order.customerPhone` |
| Detalhes | `order.eventDetails` |
| **Itens** | `order.order_items[]` |
| - Nome | `order_item.item_name` ou `product_variant.title` |
| - Quantidade | `order_item.quantity` |
| - Preço Unitário | `order_item.unit_price` |
| - Subtotal | `order_item.total_item_price` |
| **Total Geral** | `order.totalPrice` |

## Tratamento de Erros

- ✅ Se email falha → não impede confirmação do pedido
- ✅ Se pedido não encontrado → retorna 404
- ✅ Se sem itens → ainda envia email vazio (com dados do cliente)
- ✅ Se sem email cliente → tenta enviar para contato de negócio
- ✅ Todos os erros são logados no backend

## Observações Importantes

1. **Email não é bloqueante**: Se o envio falhar, a confirmação do pedido ainda é concluída
2. **Apenas valores finais**: Email mostra somente itens e valores já calculados (sem mudanças posteriores)
3. **Evento registrado**: Todo envio de orçamento fica registrado em `order_events`
4. **Reutiliza estrutura existente**: Usa os mesmos serviços de email do projeto

## Próximos Passos (Futuro)

- [ ] Adicionar webhook para PDF do orçamento
- [ ] Permitir reenvio manual de orçamento via botão
- [ ] Rastrear status de entrega do email
- [ ] Template customizável por empresa
- [ ] Suporte a múltiplos idiomas no email
