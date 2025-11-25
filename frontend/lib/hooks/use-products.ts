import { useQuery } from '@tanstack/react-query';
import { getStrapiURL } from '../utils';
import qs from 'qs';

interface ProductVariant {
  id: number;
  documentId: string;
  title: string;
  description?: string;
  price: number;
  cost_price?: number;
  image?: {
    data?: {
      attributes?: {
        url?: string;
      };
    };
    url?: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pageCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedProductsResponse {
  data: ProductVariant[];
  meta: PaginationMeta;
}

export function useProducts(enabled: boolean = true) {
  return useQuery({
    queryKey: ['product-variants'],
    queryFn: async (): Promise<ProductVariant[]> => {
      try {
        const baseUrl = getStrapiURL();
        const query = qs.stringify({
          populate: ['image']
        });
        const url = `${baseUrl}/api/product-variants?${query}&pagination[limit]=1000`;
        
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          console.error('Erro ao buscar product variants:', response.status, response.statusText);
          return [];
        }
        
        const result = await response.json();
        
        // Strapi v4 retorna { data: [...], meta: {...} }
        return result?.data || [];
      } catch (error) {
        console.error('Erro ao buscar product variants:', error);
        return [];
      }
    },
    enabled, // Só executa quando enabled é true
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
    retry: 2,
  });
}

// Hook para buscar produtos com paginação (compatível com DynamicGrid)
export function useProductsPaginated(
  page: number = 1,
  limit: number = 12,
  search?: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['product-variants-paginated', page, limit, search],
    queryFn: async (): Promise<PaginatedProductsResponse> => {
      try {
        const baseUrl = getStrapiURL();
        const query = qs.stringify({
          populate: ['image'],
          pagination: {
            page,
            pageSize: limit,
          },
          ...(search && {
            filters: {
              title: {
                $containsi: search,
              },
            },
          }),
        });
        
        const url = `${baseUrl}/api/product-variants?${query}`;
        
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          console.error('Erro ao buscar product variants:', response.status, response.statusText);
          return {
            data: [],
            meta: {
              total: 0,
              page: 1,
              limit: 0,
              pageCount: 0,
              hasNext: false,
              hasPrev: false,
            },
          };
        }
        
        const result = await response.json();
        const meta = result.meta?.pagination || {};
        
        
        return {
          data: result?.data || [],
          meta: {
            total: meta.total || 0,
            page: meta.page || 1,
            limit: meta.pageSize || limit,
            pageCount: meta.pageCount || 1,
            hasNext: (meta.page || 1) < (meta.pageCount || 1),
            hasPrev: (meta.page || 1) > 1,
          },
        };
      } catch (error) {
        console.error('Erro ao buscar product variants:', error);
        return {
          data: [],
          meta: {
            total: 0,
            page: 1,
            limit: 0,
            pageCount: 0,
            hasNext: false,
            hasPrev: false,
          },
        };
      }
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
    retry: 2,
  });
}
