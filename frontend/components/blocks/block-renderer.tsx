"use client";
import React from "react";
import Hero from "@/components/blocks/hero";
import Features from "@/components/blocks/features";

interface Block {
  __component: string;
  [key: string]: any;
}

interface BlockRendererProps {
  blocks: Block[];
}

const components: Record<string, React.ElementType> = {
  "section.hero-section": Hero,
  "section.features-section": Features,
};

export default function BlockRenderer({ blocks }: BlockRendererProps) {
  // Se não houver blocos, exibe skeletons (placeholder com animação)
  if (!blocks || blocks.length === 0) {
    return (
      <div className="space-y-4 p-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-12 w-full animate-pulse bg-gray-300 rounded"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <>
      {blocks.map((block: Block, index: number) => {
        const Component = components[block.__component];
        return Component ? (
          <Component key={index} {...block} />
        ) : (
          <div key={index} className="p-4 bg-red-100">
            Componente não encontrado: {block.__component}
          </div>
        );
      })}
    </>
  );
}