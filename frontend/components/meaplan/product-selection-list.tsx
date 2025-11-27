"use client"
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { DynamicGrid, PaginatedResponse } from "@/components/datagrid/dynamic-grid";
import ProductSelectionCard from "./product-selection-card";
import { getStrapiURL } from "@/lib/utils";
import qs from "qs";
import SelectableItemCard from "../common/selectable-item-card";

interface ProductVariant extends Record<string, unknown> {
  id: number;
  documentId: string;
  title: string;
  description?: string;
  price: number;
  image?: {
    url?: string;
  };
}

interface ProductSelectionListProps {
  onItemsChange: (items: ProductVariant[]) => void;
  orderId?: string;
  columnsMobile?: number;
}

export default function ProductSelectionList({ onItemsChange, orderId, columnsMobile = 2 }: ProductSelectionListProps) {
  const apiEndpoint = React.useCallback(async (params: {
    page?: number;
    limit?: number;
    q?: string;
  }): Promise<PaginatedResponse<ProductVariant>> => {
    try {
      const baseUrl = getStrapiURL();

      // Se orderId foi fornecido, usar o endpoint que filtra variants já usadas
      if (orderId) {
        const queryString = qs.stringify({
          page: params.page || 1,
          limit: params.limit || 12,
          ...(params.q && { q: params.q }),
        });
        const url = `${baseUrl}/api/orders/${orderId}/available-variants?${queryString}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error('Erro ao buscar available variants:', response.status, response.statusText);
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();
        return {
          data: result?.data || [],
          meta: result?.meta || {
            total: 0,
            page: 1,
            limit: params.limit || 12,
            pageCount: 1,
            hasNext: false,
            hasPrev: false,
          },
        };
      }

      // Fallback: usar endpoint padrão se orderId não foi fornecido
      const queryString = qs.stringify({
        populate: ['image'],
        pagination: {
          page: params.page || 1,
          pageSize: params.limit || 12,
        },
        ...(params.q && {
          filters: {
            title: {
              $containsi: params.q,
            },
          },
        }),
      });

      const url = `${baseUrl}/api/product-variants?${queryString}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Erro ao buscar product variants:', response.status, response.statusText);
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      const meta = result.meta?.pagination || {};


      return {
        data: result?.data || [],
        meta: {
          total: meta.total || 0,
          page: meta.page || 1,
          limit: meta.pageSize || (params.limit || 12),
          pageCount: meta.pageCount || 1,
          hasNext: (meta.page || 1) < (meta.pageCount || 1),
          hasPrev: (meta.page || 1) > 1,
        },
      };
    } catch (error) {
      console.error('Erro ao buscar product variants:', error);
      throw error;
    }
  }, [orderId]);

  const [selectedItems, setSelectedItems] = useState<ProductVariant[]>([]);

  // Sincronizar estado com o pai via useEffect (não no setState)
  useEffect(() => {
    onItemsChange(selectedItems);
  }, [selectedItems, onItemsChange]);

  const handleSelect = (itemId: string, product: ProductVariant) => ({
    select: setSelectedItems(prev => prev.filter(item => String(item.documentId || item.id) !== itemId)),
    deselect: setSelectedItems(prev => [...prev, product])
  }
  )


  return (
    <DynamicGrid
      gridId="product-selection"
      apiEndpoint={apiEndpoint}
      renderItem={(product: ProductVariant) => {
        const itemId = String(product.documentId);
        const isSelected = selectedItems.some(item => String(item.documentId || item.id) === itemId)
        return (

          <SelectableItemCard
            item={product}
            isSelected={isSelected}
            onToggle={() => handleSelect(itemId, product)[isSelected ? 'deselect' : 'select']}
            layout="large"
            showPrice={true}
          />
        );
      }}
      columns={4}
      columnsMobile={columnsMobile}
      defaultLimit={12}
      searchPlaceholder="Buscar produtos..."
      emptyMessage="Nenhum produto encontrado"
      enableSearch={true}
    />
  );
}


