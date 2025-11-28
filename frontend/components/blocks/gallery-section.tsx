"use client";

import { motion } from "framer-motion";
import { StrapiImage } from "../strapi-image";
import { Link } from "next-view-transitions";
import { ArrowRight, Camera, Images } from "lucide-react";
import MotionGrowingButton from "../motion/motion-growing-button";

interface GalleryItem {
  id: number;
  title: string;
  description?: string;
  category?: string;
  image: {
    url: string;
    name: string;
    documentId?: string;
  };
}

interface GallerySectionProps {
  title: string;
  description?: string;
  items: GalleryItem[];
}

export default function GallerySection({ title, description, items }: Readonly<GallerySectionProps>) {
  return (
    <section className="py-16 md:py-24 bg-neutral-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-amber-400"></div>
            <Camera className="w-8 h-8 text-amber-400" />
            <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-amber-400"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-food text-amber-200 mb-4">
            {title}
          </h2>
          {description && (
            <div 
              className="text-amber-100/80 max-w-2xl mx-auto prose prose-invert prose-amber"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items?.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative aspect-square overflow-hidden rounded-xl bg-neutral-800 cursor-pointer"
            >
              <StrapiImage
                src={item.image?.url}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-neutral-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-lg font-food text-amber-200 mb-1">
                  {item.title}
                </h3>
                {item.category && (
                  <span className="text-sm text-amber-400/80 font-medium">
                    {item.category}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
