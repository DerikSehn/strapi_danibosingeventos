"use client";

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  AnimatePresence,
  motion,
} from 'motion/react';
import { X } from 'lucide-react';
import { StrapiImage } from '@/components/strapi-image';

interface GalleryItem {
  id: number;
  title: string;
  description?: string;
  image: {
    url: string;
    name: string;
  };
}

type ImageModalProps = {
  item: GalleryItem;
  uniqueId: string;
  itemArr: GalleryItem[];
};

export const SliderModal = ({ item, uniqueId, itemArr }: ImageModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newItem, setNewItem] = useState<GalleryItem | null>(item);
  const [constraints, setConstraints] = useState(0);
  const [mounted, setMounted] = useState(false);
  const carousel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const element = carousel.current;
    if (element) {
        const viewportHeight = element.offsetHeight;
        const viewScrollHeight = element.scrollHeight;
        setConstraints(Number(viewportHeight) - Number(viewScrollHeight));
    }
  }, [carousel, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <motion.div
        onClick={() => {
          setIsOpen(true);
          setNewItem(item);
        }}
        className='cursor-pointer h-full'
        layoutId={uniqueId}
      >
          <div className="relative rounded-lg overflow-hidden group h-full">
            <StrapiImage
                src={item.image?.url}
                alt={item.title || "Gallery Image"}
                width={600}
                height={800}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {item.title && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white font-medium">{item.title}</p>
                </div>
            )}
          </div>
      </motion.div>

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 z-[9999] top-0 left-0 right-0 bottom-0 flex flex-col items-center w-full h-screen justify-center dark:bg-black/90 bg-gray-900/95 backdrop-blur-lg cursor-zoom-out'
              onClick={() => {
                setNewItem(null);
                setIsOpen(false);
              }}
            >
              <button
                className='absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50'
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                }}
              >
                <X size={24} />
              </button>
              
              <motion.div
                layoutId={uniqueId}
                className='rounded-md w-full h-full max-h-[90vh] flex gap-4 items-center justify-center p-4 cursor-auto'
                onClick={(e) => e.stopPropagation()}
              >
                {newItem && (
                  <div className="flex-1 h-full flex items-center justify-center relative">
                    <AnimatePresence mode='popLayout'>
                        <motion.figure
                          key={newItem.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                          className='relative w-full h-full flex items-center justify-center'
                        >
                            <StrapiImage
                              src={newItem.image?.url}
                              width={1200}
                              height={1200}
                              alt={newItem.title || 'preview_img'}
                              className='object-contain max-h-[85vh] max-w-full rounded-md shadow-2xl'
                            />
                        </motion.figure>
                    </AnimatePresence>
                  </div>
                )}

                {/* Sidebar Thumbnails */}
                <motion.div
                  className='h-[80vh] w-24 md:w-32 overflow-hidden bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl hidden sm:block'
                  ref={carousel}
                >
                  <motion.div
                    drag='y'
                    dragConstraints={{ top: constraints, bottom: 0 }}
                    className='p-2 space-y-2'
                  >
                    {itemArr?.map((itemData) => (
                      <motion.div
                        key={itemData.id}
                        className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all ${
                          itemData.id === newItem?.id ? 'ring-2 ring-amber-500 opacity-100' : 'opacity-60 hover:opacity-100'
                        }`}
                        onClick={() => setNewItem(itemData)}
                      >
                        <StrapiImage
                          src={itemData.image?.url}
                          width={200}
                          height={200}
                          alt={itemData.title || 'thumbnail'}
                          className='w-full h-full object-cover'
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};
