import Hero from "@/components/blocks/hero";
import GallerySection from "@/components/blocks/gallery-section";
import GallerySelector from "@/components/blocks/gallery-selector";
import { getStrapiData } from "@/lib/utils";
import qs from "qs";
import React from "react";

export default async function GalleryPage() {
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
    encodeValuesOnly: true,
  });

  const strapiData = await getStrapiData(`/api/gallery-page?${query}`);

  console.log(strapiData)

  const components: Record<string, React.ComponentType<any>> = {
    "section.hero-section": Hero,
    "section.gallery-section": GallerySection,
  };

  if (!strapiData?.data?.blocks) {
    return (
      <main className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-food text-amber-200 mb-4">Galeria</h1>
          <p className="text-amber-100/80">
            A galeria está sendo preparada. Volte em breve!
          </p>
        </div>
      </main>
    );
  }

  const blocks = strapiData?.data?.blocks || [];
  const renderedBlocks: React.ReactNode[] = [];
  let galleryBuffer: any[] = [];
  let hasRenderedFirstGallery = false;

  blocks.forEach((block: any, index: number) => {
    if (block.__component === "section.gallery-section") {
      if (!hasRenderedFirstGallery) {
        // First gallery -> Carousel
        renderedBlocks.push(
          <GallerySection
            key={`gallery-carousel-${index}`}
            {...block}
            variant="carousel"
          />
        );
        hasRenderedFirstGallery = true;
      } else {
        // Subsequent galleries -> Buffer
        galleryBuffer.push({ ...block, id: block.id || index });
      }
    } else {
      // Non-gallery block
      // Flush buffer if needed
      if (galleryBuffer.length > 0) {
        renderedBlocks.push(
          <GallerySelector
            key={`gallery-selector-${index}`}
            galleries={[...galleryBuffer]}
          />
        );
        galleryBuffer = [];
      }

      // Render current block
      const Component = components[block.__component];
      if (Component) {
        renderedBlocks.push(
          <Component key={`${block.__component}-${index}`} {...block} />
        );
      }
    }
  });

  // Flush remaining buffer at the end
  if (galleryBuffer.length > 0) {
    renderedBlocks.push(
      <GallerySelector
        key="gallery-selector-end"
        galleries={[...galleryBuffer]}
      />
    );
  }

  return <main>{renderedBlocks}</main>;
}
