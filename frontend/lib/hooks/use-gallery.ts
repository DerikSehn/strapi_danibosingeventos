/**
 * Hooks customizados para operações de Gallery
 * Inclui useQuery para listagem e useMutation para CRUD
 */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getStrapiURL } from "../utils";
import qs from "qs";

export interface GalleryItem {
  id: number;
  documentId?: string;
  title: string;
  description?: string;
  category?: string;
  image: {
    id: number;
    documentId?: string;
    url: string;
    name: string;
    width?: number;
    height?: number;
  };
}

export interface GallerySection {
  id: number;
  __component: string;
  title: string;
  description?: string;
  items: GalleryItem[];
}

export interface GalleryPageData {
  id: number;
  documentId: string;
  title: string;
  description?: string;
  blocks: GallerySection[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

/**
 * Hook para buscar dados da página de galeria
 */
export function useGalleryPage(enabled: boolean = true) {
  return useQuery({
    queryKey: ["gallery-page"],
    queryFn: async (): Promise<GalleryPageData | null> => {
      try {
        const baseUrl = getStrapiURL();
        const query = qs.stringify({
          populate: {
            blocks: {
              on: {
                "section.hero-section": {
                  populate: {
                    heroImage: true,
                    backgroundImage: true,
                    button: true,
                  },
                },
                "section.gallery-section": {
                  populate: {
                    items: {
                      populate: ["image"],
                    },
                  },
                },
              },
            },
          },
        });

        const response = await fetch(`${baseUrl}/api/gallery-page?${query}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error("Erro ao buscar página de galeria:", response.status);
          return null;
        }

        const result = await response.json();
        return result?.data || null;
      } catch (error) {
        console.error("Erro ao buscar página de galeria:", error);
        return null;
      }
    },
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
  });
}

/**
 * Hook para atualizar a página de galeria
 */
export function useUpdateGalleryPage(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<GalleryPageData>) => {
      const response = await fetch("/api/gallery-page", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: payload }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Erro ao atualizar galeria");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery-page"] });
      queryClient.invalidateQueries({ queryKey: ["gallery-preview"] });
      toast.success("Galeria atualizada com sucesso");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar galeria");
    },
  });
}

/**
 * Hook para upload de imagem para galeria
 */
export function useUploadGalleryImage(onSuccess?: (file: any) => void) {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("files", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro ao fazer upload da imagem");
      }

      const result = await response.json();
      return result[0];
    },
    onSuccess: (data) => {
      toast.success("Imagem enviada com sucesso");
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao enviar imagem");
    },
  });
}

/**
 * Hook para deletar imagem da galeria
 */
export function useDeleteGalleryImage(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageId: number | string) => {
      const response = await fetch(`/api/upload/files/${imageId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao deletar imagem");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery-page"] });
      queryClient.invalidateQueries({ queryKey: ["gallery-preview"] });
      toast.success("Imagem removida com sucesso");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao remover imagem");
    },
  });
}
