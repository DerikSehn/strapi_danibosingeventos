import Features from "@/components/blocks/features";
import Hero from "@/components/blocks/hero";
import MenuShowcase from "@/components/blocks/menu-showcase";
import { getStrapiData } from "@/lib/utils";
import qs from 'qs';
import React from "react";
import DynamicComponentProps from "types/dynamic-component-props";

 
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

  const components: DynamicComponentProps = {
    'section.hero-section': Hero,
    'section.features-section': Features
  }

  return (<main >
    {strapiData?.data?.blocks?.map((block: any, index: number) => {
      if (block.__component === 'section.hero-section') {
        return (
          <React.Fragment key={block.__component}>
            {React.createElement(components[block.__component], { ...block, key: block.__component })}
            <MenuShowcase />
          </React.Fragment>
        );
      }
      return React.createElement(components[block.__component], { ...block, key: `${block.__component}-${index}` });
    })}
  </main>
  );
}


