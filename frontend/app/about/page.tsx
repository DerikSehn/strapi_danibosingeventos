import AboutSection from "@/components/blocks/about";
import AboutFeatures from "@/components/blocks/about-features";
import Features from "@/components/blocks/features";
import Hero from "@/components/blocks/hero";
import { getStrapiData } from "@/lib/utils";
import qs from 'qs';
import React from "react";

export default async function AboutPage() {
    const query = qs.stringify({
        populate: {
            blocks: {

                on: {
                    'section.about-section': {
                        populate: {
                            features: {
                                populate: ['image']
                            }
                        }
                    },


                }

            },
        },
        encodeValuesOnly: true
    });

    const strapiData = await getStrapiData(`/api/about-page?${query}`);


    const components: any = {
        'section.about-section': AboutSection,
/*         'section.features-section': AboutFeatures
 */    }

    return (<main >


        {strapiData.data.blocks.map((block: any, index: number) =>
            React.createElement(components[block.__component], { ...block, key: index })
        )}
    </main>
    );
}


