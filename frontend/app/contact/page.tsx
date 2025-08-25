
 import ContactSection from "@/components/blocks/contact-section";
import { getStrapiData } from "@/lib/utils";
import qs from 'qs';
import React from "react";

export default async function ContactPage() {
    const query = qs.stringify({
        populate: {
            blocks: {
                on: {
                    'section.contact-section': {
                        populate: {
                            socialLinks: true
                        }
                    },
                }
            },
        },
        encodeValuesOnly: true
    });

    const strapiData = await getStrapiData(`/api/contact-page?${query}`);
    const components: any = {
        'section.contact-section': ContactSection,
    }

    return (
        <main>
            {strapiData.data?.blocks.map((block: any) =>
                React.createElement(components[block.__component], { ...block, key: block.__component })
            )}
        </main>
    );
}
