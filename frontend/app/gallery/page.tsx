import Hero from "@/components/blocks/hero";
import GallerySection from "@/components/blocks/gallery-section";
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

  return (
    <main>
      {strapiData?.data?.blocks?.map((block: any, index: number) =>
        React.createElement(components[block.__component], {
          ...block,
          key: `${block.__component}-${index}`,
        })
      )}
    </main>
  );
}
