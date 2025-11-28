"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { StrapiImage } from "@/components/strapi-image";
import {
  useGalleryPage,
  useUpdateGalleryPage,
  useUploadGalleryImage,
  GalleryItem,
  GallerySection,
} from "@/lib/hooks/use-gallery";
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Upload,
  Images,
  Loader2,
  GripVertical,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function GalleryManagementPage() {
  const { data: galleryPage, isLoading, refetch } = useGalleryPage();
  const updateGalleryPage = useUpdateGalleryPage(() => refetch());
  const uploadImage = useUploadGalleryImage();
  
  const [editingSection, setEditingSection] = useState<number | null>(null);
  const [isAddingItem, setIsAddingItem] = useState<number | null>(null);
  const [newItem, setNewItem] = useState<Partial<GalleryItem>>({
    title: "",
    description: "",
    category: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddSection = async () => {
    if (!galleryPage) return;

    const newSection: GallerySection = {
      id: Date.now(),
      __component: "section.gallery-section",
      title: "Nova Seção",
      description: "",
      items: [],
    };

    const updatedBlocks = [...(galleryPage.blocks || []), newSection];
    
    await updateGalleryPage.mutateAsync({ blocks: updatedBlocks } as any);
  };

  const handleUpdateSection = async (sectionIndex: number, updates: Partial<GallerySection>) => {
    if (!galleryPage) return;

    const updatedBlocks = galleryPage.blocks.map((block, index) => {
      if (index === sectionIndex && block.__component === "section.gallery-section") {
        return { ...block, ...updates };
      }
      return block;
    });

    await updateGalleryPage.mutateAsync({ blocks: updatedBlocks } as any);
    setEditingSection(null);
  };

  const handleDeleteSection = async (sectionIndex: number) => {
    if (!galleryPage) return;
    
    if (!confirm("Tem certeza que deseja remover esta seção?")) return;

    const updatedBlocks = galleryPage.blocks.filter((_, index) => index !== sectionIndex);
    await updateGalleryPage.mutateAsync({ blocks: updatedBlocks } as any);
  };

  const handleAddItem = async (sectionIndex: number) => {
    if (!galleryPage || !newItem.title) {
      toast.error("Título é obrigatório");
      return;
    }

    let imageData = null;
    if (selectedImage) {
      try {
        imageData = await uploadImage.mutateAsync(selectedImage);
      } catch {
        return;
      }
    }

    const updatedBlocks = galleryPage.blocks.map((block, index) => {
      if (index === sectionIndex && block.__component === "section.gallery-section") {
        const newGalleryItem: GalleryItem = {
          id: Date.now(),
          title: newItem.title || "",
          description: newItem.description || "",
          category: newItem.category || "",
          image: imageData ? {
            id: imageData.id,
            documentId: imageData.documentId,
            url: imageData.url,
            name: imageData.name,
          } : {
            id: 0,
            url: "",
            name: "",
          },
        };

        return {
          ...block,
          items: [...(block.items || []), newGalleryItem],
        };
      }
      return block;
    });

    await updateGalleryPage.mutateAsync({ blocks: updatedBlocks } as any);
    setNewItem({ title: "", description: "", category: "" });
    setSelectedImage(null);
    setIsAddingItem(null);
  };

  const handleDeleteItem = async (sectionIndex: number, itemIndex: number) => {
    if (!galleryPage) return;
    
    if (!confirm("Tem certeza que deseja remover esta imagem?")) return;

    const updatedBlocks = galleryPage.blocks.map((block, index) => {
      if (index === sectionIndex && block.__component === "section.gallery-section") {
        return {
          ...block,
          items: block.items.filter((_, idx) => idx !== itemIndex),
        };
      }
      return block;
    });

    await updateGalleryPage.mutateAsync({ blocks: updatedBlocks } as any);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Por favor, selecione um arquivo de imagem");
        return;
      }
      setSelectedImage(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  const gallerySections = galleryPage?.blocks?.filter(
    (block) => block.__component === "section.gallery-section"
  ) as GallerySection[] || [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Images className="w-8 h-8 text-orange-500" />
            Gerenciamento da Galeria
          </h1>
          <p className="text-gray-600 mt-1">
            Adicione, edite e remova fotos da galeria de eventos
          </p>
        </div>
        <Button
          onClick={handleAddSection}
          className="bg-orange-500 hover:bg-orange-600"
          disabled={updateGalleryPage.isPending}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Seção
        </Button>
      </div>

      {/* Gallery Sections */}
      <div className="space-y-8">
        {gallerySections.length === 0 ? (
          <Card className="p-12 text-center">
            <Images className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma seção de galeria
            </h3>
            <p className="text-gray-600 mb-4">
              Comece criando uma nova seção para organizar suas fotos
            </p>
            <Button
              onClick={handleAddSection}
              variant="outline"
              disabled={updateGalleryPage.isPending}
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira Seção
            </Button>
          </Card>
        ) : (
          gallerySections.map((section, sectionIndex) => {
            const actualIndex = galleryPage?.blocks?.findIndex(
              (b) => b === section
            ) ?? sectionIndex;

            return (
              <Card key={section.id || sectionIndex} className="p-6">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-6">
                  {editingSection === actualIndex ? (
                    <div className="flex-1 mr-4">
                      <Input
                        defaultValue={section.title}
                        placeholder="Título da seção"
                        className="mb-2"
                        onBlur={(e) => {
                          if (e.target.value !== section.title) {
                            handleUpdateSection(actualIndex, { title: e.target.value });
                          }
                        }}
                      />
                      <Textarea
                        defaultValue={section.description || ""}
                        placeholder="Descrição da seção (suporta markdown)"
                        rows={2}
                        onBlur={(e) => {
                          handleUpdateSection(actualIndex, { description: e.target.value });
                        }}
                      />
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {section.title}
                      </h2>
                      {section.description && (
                        <p className="text-gray-600 text-sm mt-1">
                          {section.description}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingSection(
                        editingSection === actualIndex ? null : actualIndex
                      )}
                    >
                      {editingSection === actualIndex ? (
                        <X className="w-4 h-4" />
                      ) : (
                        <Edit2 className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteSection(actualIndex)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Gallery Items Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {section.items?.map((item, itemIndex) => (
                    <div
                      key={item.id || itemIndex}
                      className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                    >
                      {item.image?.url ? (
                        <StrapiImage
                          src={item.image.url}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Images className="w-8 h-8 text-gray-400" />
                        </div>
                      )}

                      {/* Overlay with actions */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                        <div className="flex justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-red-500/20"
                            onClick={() => handleDeleteItem(actualIndex, itemIndex)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium truncate">
                            {item.title}
                          </p>
                          {item.category && (
                            <span className="text-white/70 text-xs">
                              {item.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add Item Button */}
                  <Dialog
                    open={isAddingItem === actualIndex}
                    onOpenChange={(open) => setIsAddingItem(open ? actualIndex : null)}
                  >
                    <DialogTrigger asChild>
                      <button className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-500 hover:bg-orange-50 transition-colors flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-orange-500">
                        <Plus className="w-8 h-8" />
                        <span className="text-sm">Adicionar</span>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Adicionar Item à Galeria</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <Label htmlFor="title">Título *</Label>
                          <Input
                            id="title"
                            value={newItem.title || ""}
                            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                            placeholder="Nome do evento ou imagem"
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Categoria</Label>
                          <Input
                            id="category"
                            value={newItem.category || ""}
                            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                            placeholder="Ex: Casamento, Aniversário, Corporativo"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Descrição</Label>
                          <Textarea
                            id="description"
                            value={newItem.description || ""}
                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                            placeholder="Descrição do evento (suporta markdown)"
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label>Imagem *</Label>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors"
                          >
                            {selectedImage ? (
                              <div className="flex items-center justify-center gap-2">
                                <span className="text-sm text-gray-700">
                                  {selectedImage.name}
                                </span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedImage(null);
                                  }}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : (
                              <>
                                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                <p className="text-sm text-gray-600">
                                  Clique para selecionar uma imagem
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsAddingItem(null);
                              setNewItem({ title: "", description: "", category: "" });
                              setSelectedImage(null);
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button
                            onClick={() => handleAddItem(actualIndex)}
                            disabled={!newItem.title || !selectedImage || uploadImage.isPending || updateGalleryPage.isPending}
                            className="bg-orange-500 hover:bg-orange-600"
                          >
                            {uploadImage.isPending || updateGalleryPage.isPending ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Save className="w-4 h-4 mr-2" />
                            )}
                            Salvar
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
