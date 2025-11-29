"use client";

import { motion } from "framer-motion";
import { StrapiImage } from "../strapi-image";
import { Link } from "next-view-transitions";
import { ArrowRight, Camera, Images, ChevronLeft } from "lucide-react";
import MotionGrowingButton from "../motion/motion-growing-button";
import Markdown from "react-markdown";
import {
  SliderBtnGroup,
  ProgressSlider,
  SliderBtn,
  SliderContent,
  SliderWrapper,
} from '@/components/uilayouts/progressive-carousel';
import { getStrapiMedia } from "@/lib/utils";
import Image from "next/image";

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
  variant?: 'carousel' | 'grid';
  backUrl?: string;
}

export default function GallerySection({ title, description, items, variant = 'grid', backUrl }: Readonly<GallerySectionProps>) {
  if (variant === 'carousel') {
    return (
      <section className="py-16 md:py-24 bg-neutral-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-food text-amber-200 mb-4">
              {title}
            </h2>
            {description && (
              <div className="text-amber-100/80 max-w-2xl mx-auto prose prose-invert prose-amber">
                <Markdown>{description}</Markdown>
              </div>
            )}
          </motion.div>

          <ProgressSlider vertical={false} activeSlider={items?.[0]?.id?.toString() || '0'}>
            <SliderContent>
              {items?.map((item, index) => (
                <SliderWrapper key={item.id || index} value={item.id?.toString() || index.toString()}>
                  <div className="relative w-full h-[350px] 2xl:h-[500px] rounded-xl overflow-hidden">
                    <StrapiImage
                      className='object-cover'
                      src={item.image?.url}
                      fill
                      alt={item.title}
                    />
                  </div>
                </SliderWrapper>
              ))}
            </SliderContent>

            <SliderBtnGroup className='absolute bottom-0 h-fit dark:text-white text-black dark:bg-black/40 bg-white/40 backdrop-blur-md overflow-hidden grid grid-cols-2 md:grid-cols-4 rounded-md w-full'>
              {items?.map((item, index) => (
                <SliderBtn
                  key={item.id || index}
                  value={item.id?.toString() || index.toString()}
                  className='text-left p-3 border-r border-white/10 last:border-r-0'
                  progressBarClass='bg-amber-500 h-full'
                >
                  <h2 className='relative px-4 rounded-full w-fit text-white bg-neutral-900 mb-2 text-sm font-bold'>
                    {item.title}
                  </h2>
                  {item.description && (
                    <div className='text-sm font-medium line-clamp-2 text-neutral-200'>
                       <Markdown>{item.description}</Markdown>
                    </div>
                  )}
                </SliderBtn>
              ))}
            </SliderBtnGroup>
          </ProgressSlider>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-neutral-900">
      <div className="container mx-auto px-4">
        {backUrl && (
          <div className="mb-8">
             {/* Mobile Style */}
             <div className="md:hidden">
                <Link href={backUrl} className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm hover:bg-white/20 transition-colors text-white">
                  <ChevronLeft className="h-6 w-6" />
                </Link>
             </div>
             {/* Desktop Style */}
             <div className="hidden md:block">
                <Link href={backUrl} className="inline-flex items-center text-amber-500 hover:text-amber-400 transition-colors">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Voltar para Galerias
                </Link>
             </div>
          </div>
        )}

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-food text-amber-200 mb-4">
            {title}
          </h2>
          {description && (
            <div className="text-amber-100/80 max-w-2xl mx-auto prose prose-invert prose-amber">
              <Markdown>{description}</Markdown>
            </div>
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
                {item.description && (
                  <div className="text-sm text-amber-400/80 font-medium">
                    <Markdown>{item.description}</Markdown>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
