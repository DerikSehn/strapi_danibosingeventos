"use client";

import { motion } from "framer-motion";
import { StrapiImage } from "../strapi-image";
import { Link } from "next-view-transitions";
import { Camera, Images, ArrowRight } from "lucide-react";
import MotionGrowingButton from "../motion/motion-growing-button";
import { useQuery } from "@tanstack/react-query";
import { getStrapiURL } from "@/lib/utils";
import qs from "qs";

interface GalleryItem {
  id: number;
  title: string;
  description?: string;
  category?: string;
  image: {
    url: string;
    name: string;
  };
}

interface GallerySection {
  id: number;
  __component: string;
  title: string;
  description?: string;
  items: GalleryItem[];
}

export default function GalleryPreview() {
  const { data: galleryData, isLoading } = useQuery({
    queryKey: ["gallery-preview"],
    queryFn: async () => {
      const query = qs.stringify({
        populate: {
          blocks: {
            on: {
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
        encodeValuesOnly: true,
      });

      const response = await fetch(`${getStrapiURL()}/api/gallery-page?${query}`);
      if (!response.ok) return null;
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });

  // Get first gallery section with items
  const gallerySection = galleryData?.data?.blocks?.find(
    (block: any) => block.__component === "section.gallery-section" && block.items?.length > 0
  ) as GallerySection | undefined;

  // Get first 4 items for preview
  const previewItems = gallerySection?.items?.slice(0, 4) || [];

  if (isLoading || previewItems.length === 0) {
    return null;
  }

  return (
    <section className="relative py-24 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 left-10 w-32 h-32 border-2 border-amber-500/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 border-2 border-orange-500/20 rounded-full animate-pulse delay-75"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-amber-400"></div>
            <Images className="w-8 h-8 text-amber-400" />
            <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-amber-400"></div>
          </div>
          <h2 className="text-5xl md:text-6xl font-food text-amber-200 mb-4">
            {gallerySection?.title || "Nossa Galeria"}
          </h2>
          <p className="text-xl text-amber-100/80 max-w-2xl mx-auto">
            Confira alguns momentos especiais dos nossos eventos gastronômicos
          </p>
        </motion.div>

        {/* Preview Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {previewItems.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative aspect-square overflow-hidden rounded-xl bg-neutral-800"
            >
              <StrapiImage
                src={item.image?.url}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-sm font-food text-amber-200">
                  {item.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link href="/gallery">
            <MotionGrowingButton className="relative bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-food text-xl px-8 py-4 rounded-xl shadow-lg border-0 group">
              <Camera className="w-6 h-6 inline-block mr-2" />
              Ver Galeria Completa
              <ArrowRight className="w-5 h-5 inline-block ml-2 group-hover:translate-x-1 transition-transform" />
            </MotionGrowingButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
