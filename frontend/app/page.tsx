import Features from "@/components/blocks/features";
import Hero from "@/components/blocks/hero";
import { getStrapiData } from "@/lib/utils";
import qs from 'qs';
import React from "react";

export default async function HomePage() {
  const query = qs.stringify({
    populate: {
      blocks: {
        populate: {
          heroImage: true,
          backgroundImage: true,

        },
        on: {
          'section.hero-section': {
            populate: '*'
          },
          'section.features-section': {
            populate: {
              feature: {
                populate: ['image']
              }
            }
          }

        }

      },
    },
    encodeValuesOnly: true
  });

  const strapiData = await getStrapiData(`/api/home-page?${query}`);


  const components: any = {
    'section.hero-section': Hero,
    'section.features-section': Features
  }

  return (<main >


    {strapiData.data.blocks.map((block: any, index: number) =>
      React.createElement(components[block.__component], { ...block, key: index })
    )}
  </main>
  );
}


