"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ProductSelectionModal from "@/components/meaplan/product-selection-modal";
import { OrderItem } from "@/lib/api/orders/types";
import { ProductVariant } from "@/types";


interface OrderItemsTableProps {
  items: OrderItem[];
  orderId: string;
  onQuantityChange?: (itemId: string, newQuantity: number) => void;
  onItemRemove?: (itemId: string) => void;
  onItemsAdd?: (items: ProductVariant[]) => void;
  isQuantityLoading?: boolean;
  isRemoveLoading?: boolean;
  isAddLoading?: boolean;
}

export function OrderItemsTable({
  items,
  orderId,
  onQuantityChange,
  onItemRemove,
  onItemsAdd,
  isQuantityLoading = false,
  isRemoveLoading = false,
  isAddLoading = false,
}: OrderItemsTableProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuantityId, setEditingQuantityId] = useState<string | null>(null);
  const [editingQuantityValue, setEditingQuantityValue] = useState<string>("");

  const handleConfirmAdd = (items: ProductVariant[]) => {
    if (items.length > 0) {
      onItemsAdd?.(items);
      setModalOpen(false);
    }
  };

  const handleCancelModal = () => {
    setModalOpen(false);
  };



  const handleStartEdit = (itemId: string, currentQuantity: number) => {
    setEditingQuantityId(itemId);
    setEditingQuantityValue(String(currentQuantity));
  };


  const handleConfirmQuantity = (itemId: string) => {
    if (!editingQuantityValue) {
        handleCancelEdit();
        return;
    }
    const newQuantity = Math.max(1, parseInt(editingQuantityValue) || 1);
    onQuantityChange?.(itemId, newQuantity);
    setEditingQuantityId(null);
    setEditingQuantityValue("");
  };


  const handleCancelEdit = () => {
    setEditingQuantityId(null);
    setEditingQuantityValue("");
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, itemId: string) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const handleRemoveItem = (itemId: string) => {
      onItemRemove?.(itemId);

  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    onQuantityChange?.(itemId, newQuantity);
  };

  const allItems = items.map((item) => ({
    id: String(item.id || item.documentId || ""),
    title: item.product_variant?.title || item.item_name || "Item",
    price: Number(item.unit_price ?? item.product_variant?.price ?? 0),
    quantity: Number(item.quantity ?? 0),
    total: Number(item.total_item_price ?? 0),
    isNew: false,
  }));

  const totals = allItems.reduce(
    (acc, item) => ({
      quantity: acc.quantity + item.quantity,
      total: acc.total + item.total,
    }),
    { quantity: 0, total: 0 }
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          {allItems.length} item(s) | Total: R$ {totals.total.toFixed(2)}
        </h3>
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
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead className="text-right">Valor Unit.</TableHead>
              <TableHead className="text-center">Qtd</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right w-24">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  Nenhum item adicionado
                </TableCell>
              </TableRow>
            ) : (
              allItems.map((item) => (
                <TableRow
                  key={item.id}
                  className={item.isNew ? "bg-blue-50" : "hover:bg-gray-50"}
                >
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell className="text-right">
                    R$ {item.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 10)}
                        disabled={item.quantity <= 10 || isQuantityLoading}
                        title="-10"
                      >
                        <span className="text-xs font-bold">-10</span>
                      </Button>

                      {editingQuantityId === item.id ? (
                        <input
                          type="number"
                          min="1"
                          value={editingQuantityValue}
                          onChange={(e) => setEditingQuantityValue(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, item.id)}
                          onBlur={() => handleConfirmQuantity(item.id)}
                          autoFocus
                          className="w-16 px-2 py-1 text-center border rounded font-semibold"
                        />
                      ) : (
                        <button
                          onClick={() => handleStartEdit(item.id, item.quantity)}
                          className="w-16 px-2 py-1 text-center font-semibold hover:bg-gray-200 rounded transition-colors cursor-pointer"
                          title="Clique para editar quantidade"
                        >
                          {item.quantity}
                        </button>
                      )}

                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 10)}
                        disabled={isQuantityLoading}
                        title="+10"
                      >
                        <span className="text-xs font-bold">+10</span>
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    R$ {item.total.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={isRemoveLoading}
                      className="p-1 hover:bg-red-100 text-red-600 rounded disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ProductSelectionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Selecionar Itens"
        description="Clique nos itens para adicioná-los ao pedido"
        onConfirm={handleConfirmAdd}
        onCancel={handleCancelModal}
        confirmButtonText="Adicionar"
        cancelButtonText="Cancelar"
        orderId={orderId}
      />
    </div>
  );
}
