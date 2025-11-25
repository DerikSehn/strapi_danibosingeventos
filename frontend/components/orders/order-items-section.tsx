"use client"
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ProductVariant } from '@/types';
import ProductSelectionModal from '@/components/meaplan/product-selection-modal';
import { useProductSelection } from '@/lib/hooks/use-product-selection';
import { OrderItemCard } from '@/components/order/order-item-card';

interface OrderItem {
  id?: string;
  documentId?: string;
  item_name?: string;
  quantity?: number;
  unit_price?: number;
  total_item_price?: number;
  product_variant?: {
    id?: string;
    documentId?: string;
    title?: string;
    price?: number;
    image?: {
      url?: string;
      data?: {
        attributes?: {
          url?: string;
        };
      };
    };
  };
}

interface NormalizedOrderItem extends Record<string, unknown> {
  id: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
  total: number;
}

interface OrderItemsSectionProps {
  items: OrderItem[];
  orderId?: string;
  onQuantityChange?: (itemId: string, newQuantity: number) => void;
  onItemRemove?: (itemId: string) => void;
  onItemsAdd?: (items: ProductVariant[]) => void;
  isEditable?: boolean;
  title?: string;
  itemsPerPage?: number;
  // Loading states
  isQuantityLoading?: boolean;
  isRemoveLoading?: boolean;
  isAddLoading?: boolean;
}

/**
 * Extrai a URL da imagem de um objeto com estrutura Strapi
 */
function getImageUrl(image: any): string {
  if (!image) return '';
  if (typeof image === 'string') return image;
  if (image.url) return image.url;
  return '';
}

/**
 * Normaliza um item para exibição
 */
function normalizeItem(item: OrderItem | ProductVariant, isNewItem: boolean): NormalizedOrderItem {
  if (isNewItem) {
    const pv = item as ProductVariant;
    return {
      id: pv.documentId || String(pv.id) || '',
      title: pv.title || 'Item',
      price: Number(pv.price ?? 0),
      quantity: (item as any).quantity || 1,
      imageUrl: getImageUrl(pv.image),
      total: Number(pv.price ?? 0) * ((item as any).quantity || 1),
    };
  }

  const orderItem = item as OrderItem;
  const pv = orderItem.product_variant || {};
  return {
    id: orderItem.id || pv.documentId || pv.id || '',
    title: pv.title || orderItem.item_name || 'Item',
    price: Number(orderItem.unit_price ?? pv.price ?? 0),
    quantity: Number(orderItem.quantity ?? 0),
    imageUrl: getImageUrl(pv.image),
    total: Number(orderItem.total_item_price ?? 0),
  };
}

export default function OrderItemsSection({
  items,
  orderId,
  onQuantityChange,
  onItemRemove,
  onItemsAdd,
  isEditable = true,
  title = "Itens do Pedido",
  itemsPerPage = 10,
  isQuantityLoading = false,
  isRemoveLoading = false,
  isAddLoading = false,
}: OrderItemsSectionProps) {

  const [modalOpen, setModalOpen] = useState(false);
  
  const {
    selectedItems,
    addItems,
    removeItem,
    getSelectedItemIds
  } = useProductSelection({
    initialSelectedItems: [],
    onSelectionChange: (newItems) => {
      // Apenas chamar o callback - a mutation/invalidação é no parent
      onItemsAdd?.(newItems);
      setModalOpen(false);
    }
  });

  const selectedIds = getSelectedItemIds();
  
  // Normaliza todos os itens
  const normalizedItems = items.map(item => ({
    ...normalizeItem(item, false),
    isNewItem: false,
  }));

  const normalizedSelectedItems = selectedItems.map(item => ({
    ...normalizeItem(item, true),
    isNewItem: true,
  }));

  const allItems = [...normalizedItems, ...normalizedSelectedItems];

  const handleRemoveItem = (itemId: string) => {
    if (selectedIds.includes(itemId)) {
      removeItem(itemId);
    } else {
      // Apenas chamar o callback - a mutation/invalidação é no parent
      onItemRemove?.(itemId);
    }
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    // Apenas chamar o callback - a mutation/invalidação é no parent
    onQuantityChange?.(itemId, newQuantity);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {allItems.length} item{allItems.length > 1 ? 's' : ''}
          </p>
        </div>
       
        {isEditable && (
          <Button
            type="button"
            onClick={() => setModalOpen(true)}
            className="gap-2"
            size="sm"
            disabled={isAddLoading}
          >
            <Plus className="w-4 h-4" />
            Adicionar Itens
          </Button>
        )}
      </div>

      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item) => {
            const normalizedItem = normalizeItem(item, false);
            return (
              <OrderItemCard
                key={normalizedItem.id}
                id={normalizedItem.id}
                title={normalizedItem.title}
                price={normalizedItem.price}
                quantity={normalizedItem.quantity}
                imageUrl={normalizedItem.imageUrl}
                isEditable={isEditable && !isQuantityLoading && !isRemoveLoading}
                showRemoveButton={isEditable}
                onQuantityChange={(newQty) => handleQuantityChange(normalizedItem.id, newQty)}
                onRemove={() => handleRemoveItem(normalizedItem.id)}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Nenhum item no pedido
        </div>
      )}

      {isEditable && (
        <ProductSelectionModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          onConfirm={addItems}
          onCancel={() => setModalOpen(false)}
          title="Selecionar Itens"
          description="Clique nos itens para adicioná-los ao pedido"
        />
      )}
    </div>
  );
}
