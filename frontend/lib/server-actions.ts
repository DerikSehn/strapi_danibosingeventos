"use server";

import { headers } from "next/headers";
import { createServerApi } from "@/lib/server-api";

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pageCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface GetPaginatedParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: string;
  q?: string;
  status?: string;
  [key: string]: any;
}

/**
 * Fetches paginated data from a specified API endpoint
 * Reusable server action that can be used across the application
 * 
 * @param endpoint - The API endpoint to fetch from (e.g., '/api/orders')
 * @param params - Pagination and filtering parameters
 * @returns PaginatedResponse with data and metadata
 */
export async function getPaginatedData<T extends Record<string, any>>(
  endpoint: string,
  params: GetPaginatedParams = {}
): Promise<PaginatedResponse<T>> {
  try {
    const h = await headers();
    const api = createServerApi(h);

    const {
      page = 1,
      limit = 20,
      sort,
      order,
      q,
      status,
      ...additionalParams
    } = params;

    // Build query string with provided parameters
    const queryParams = new URLSearchParams();
    
    if (page) queryParams.set("page", String(page));
    if (limit) queryParams.set("pageSize", String(limit));
    if (sort) queryParams.set("sort", sort);
    if (order) queryParams.set("order", order);
    if (q) queryParams.set("q", q);
    if (status && status !== "all") queryParams.set("status", status);

    // Add any additional custom parameters
    Object.entries(additionalParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.set(key, String(value));
      }
    });

    const url = `${endpoint}?${queryParams.toString()}`;
    const response = await api.get<{ ok: boolean; data: T[] }>(url);

    return {
      data: response?.data || [],
      meta: {
        total: response?.data?.length || 0,
        page,
        limit,
        pageCount: Math.ceil((response?.data?.length || 0) / limit),
        hasNext: (page - 1) * limit + limit < (response?.data?.length || 0),
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    console.error(`Erro ao buscar dados de ${endpoint}:`, error);
    return {
      data: [],
      meta: {
        total: 0,
        page: params.page || 1,
        limit: params.limit || 20,
        pageCount: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  }
}
