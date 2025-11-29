"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StrapiImage } from "../strapi-image";
import Markdown from "react-markdown";
import ScrollElement from "@/components/uilayouts/scroll-animation";
import { ArrowRight, X, Images } from "lucide-react";
import { SliderModal } from "@/components/ui/slider-modal";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface GalleryItem {
  id: number;
  title: string;
  description?: string;
  image: {
    url: string;
    name: string;
  };
}

interface GalleryBlock {
  id: number;
  __component: string;
  title: string;
  description?: string;
  items: GalleryItem[];
}

interface GallerySelectorProps {
  galleries: GalleryBlock[];
}

export default function GallerySelector({ galleries }: Readonly<GallerySelectorProps>) {
  const [selectedGallery, setSelectedGallery] = useState<GalleryBlock | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (selectedGallery && !isMobile && contentRef.current) {
      // Scroll to the content with a slight offset for the sticky header
      const yOffset = -100; 
      const element = contentRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [selectedGallery, isMobile]);

  if (!galleries || galleries.length === 0) return null;

  return (
    <section className="py-16 bg-neutral-900 min-h-screen" ref={contentRef}>
      <div className="container mx-auto px-4">
        <div className={cn(
          "transition-all duration-500 ease-in-out",
          selectedGallery && !isMobile ? "sticky top-0 z-40 bg-neutral-900/95 backdrop-blur-sm py-4 border-b border-white/10 shadow-xl" : "mb-12"
        )}>
          <div className={cn("text-center", selectedGallery && !isMobile ? "mb-4" : "mb-12")}>
            <h2 className={cn("font-food text-amber-200 transition-all", selectedGallery && !isMobile ? "text-2xl mb-2" : "text-3xl md:text-4xl mb-4")}>
              Mais Galerias
            </h2>
            <p className={cn("text-amber-100/60 transition-all", selectedGallery && !isMobile ? "text-sm" : "")}>
              Explore outros eventos e momentos especiais
            </p>
          </div>

          {/* Gallery Cards Grid */}
          <div className={cn(
            "grid gap-4 transition-all duration-500",
            isMobile ? "grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
            selectedGallery && !isMobile ? "grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2" : "gap-8"
          )}>
            {galleries.map((gallery) => {
              const coverImage = gallery.items?.[0]?.image?.url;
              const isSelected = selectedGallery?.id === gallery.id;

              if (isMobile) {
                return (
                  <Link key={gallery.id} href={`/gallery/${gallery.id}`} className="block h-full">
                    <div className="relative flex flex-col items-center justify-center p-4 border rounded-lg bg-neutral-800 cursor-pointer transition-all gap-2 text-center h-32 active:scale-95 duration-200 overflow-hidden group border-neutral-700">
                        {coverImage && (
                            <StrapiImage
                                src={coverImage}
                                alt={gallery.title}
                                fill
                                className="object-cover transition-transform group-hover:scale-110"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black/80 z-10" />

                        <div className="z-20 flex flex-col items-center text-white w-full px-2">
                            <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2">
                                 <Images className="h-4 w-4 text-amber-200" />
                            </div>
                            <span className="font-bold text-sm shadow-sm line-clamp-2 leading-tight text-amber-100">{gallery.title}</span>
                        </div>
                    </div>
                  </Link>
                );
              }

              const CardContent = (
                <motion.div
                  layout={!isMobile}
                  whileHover={{ y: -5 }}
                  className={cn(
                    "group cursor-pointer rounded-xl overflow-hidden bg-neutral-800 border-2 transition-all duration-300 h-full",
                    isSelected ? "border-amber-500 shadow-lg shadow-amber-500/20" : "border-transparent hover:border-amber-500/50",
                    selectedGallery && !isMobile ? "flex flex-col" : ""
                  )}
                >
                  {/* Cover Image */}
                  <div className={cn("relative w-full overflow-hidden", selectedGallery && !isMobile ? "h-20" : "h-32 md:h-64")}>
                    {coverImage ? (
                      <StrapiImage
                        src={coverImage}
                        alt={gallery.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-700 flex items-center justify-center text-neutral-500">
                        Sem imagem
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />
                  </div>

                  {/* Content */}
                  <div className={cn("p-4", selectedGallery && !isMobile ? "p-2" : "p-6")}>
                    <h3 className={cn("font-food text-amber-200 group-hover:text-amber-400 transition-colors", selectedGallery && !isMobile ? "text-sm truncate" : "text-xl mb-2")}>
                      {gallery.title}
                    </h3>
                    {!selectedGallery && (
                      <>
                        {gallery.description && (
                          <div className="text-sm text-neutral-400 line-clamp-2 mb-4">
                            <Markdown>{gallery.description}</Markdown>
                          </div>
                        )}
                        <div className="flex items-center text-amber-500 text-sm font-medium">
                          {isSelected ? "Fechar" : "Ver Fotos"}
                          {isSelected ? (
                              <X className="w-4 h-4 ml-2" />
                          ) : (
                              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              );

              return (
                <div key={gallery.id} onClick={() => setSelectedGallery(isSelected ? null : gallery)} className="h-full">
                  {CardContent}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Gallery Content (Scroll Animation) */}
        <AnimatePresence mode="wait">
          {selectedGallery && !isMobile && (
            <motion.div
              key={selectedGallery.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="overflow-hidden mt-8"
            >
              <div className="border-t border-neutral-800 pt-8">
                <div className="text-center mb-12">
                  <h3 className="text-4xl md:text-5xl font-food text-amber-200 mb-4">
                    {selectedGallery.title}
                  </h3>
                  {selectedGallery.description && (
                    <div className="text-amber-100/80 max-w-2xl mx-auto prose prose-invert prose-amber">
                      <Markdown>{selectedGallery.description}</Markdown>
                    </div>
                  )}
                </div>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                  {selectedGallery.items?.map((item, index) => (
                    <ScrollElement
                      key={`${selectedGallery.id}-${item.id || index}`}
                      viewport={{ once: true, amount: 0.2 }}
                      className="break-inside-avoid mb-4"
                    >
                      <SliderModal
                        item={item}
                        uniqueId={`${selectedGallery.id}-${item.id || index}`}
                        itemArr={selectedGallery.items}
                      />
                    </ScrollElement>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
