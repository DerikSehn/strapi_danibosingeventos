import AboutSection from "@/components/blocks/about";
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

    const strapiData = await getStrapiData(`/api/contact-page?${query}`);

    
    const components: any = {
        'section.about-section': AboutSection,
/*         'section.features-section': AboutFeatures
 */    }

    return (<main >


        {strapiData.data?.blocks.map((block: any) =>
            React.createElement(components[block.__component], { ...block, key: block.__component })
        )}
    </main>
    );
}


