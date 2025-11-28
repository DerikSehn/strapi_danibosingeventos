import GallerySection from "@/components/blocks/gallery-section";
import { getStrapiData } from "@/lib/utils";
import qs from "qs";
import React from "react";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function GalleryDetailPage({ params }: PageProps) {
  const { id } = await params;
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

  const strapiData = await getStrapiData(`/api/gallery-page?${query}`);
  const blocks = strapiData?.data?.blocks || [];

  // Find the gallery block with the matching ID
  // Note: We need to handle both string and number comparison
  const galleryBlock = blocks.find((block: any) => 
    block.__component === "section.gallery-section" && 
    (block.id?.toString() === id || block.items?.[0]?.id?.toString() === id) // Fallback to item ID if block ID is not reliable/unique enough in this context, but usually block.id is best.
    // Actually, let's stick to block.id as passed in the selector
  ) || blocks.find((block: any, index: number) => 
      // Fallback: if the ID passed was the index (which we used in the map in page.tsx)
      block.__component === "section.gallery-section" && index.toString() === id
  );

  // If we still can't find it by ID, try to find it by the ID passed from the selector which might be the block ID
  const targetBlock = blocks.find((b: any) => b.id?.toString() === id);

  if (!targetBlock || targetBlock.__component !== "section.gallery-section") {
    // If not found, maybe it was an index-based ID from the previous logic?
    // In GallerySelector, we used `gallery.id`.
    return notFound();
  }

  return (
    <main className="min-h-screen bg-neutral-900 pt-24">
      <GallerySection
        {...targetBlock}
        variant="grid"
        backUrl="/gallery"
      />
    </main>
  );
}
