"use client";
import MotionGlowingHeading from "../motion/motion-glowing-heading";
import StickyScrollReveal from "../motion/sticky-scroll-reveal";
import { StrapiImage } from "../strapi-image";

/* {
    content: {
        title: string;
        description: string;
        content?: React.ReactNode | any;
    }[];
    contentClassName?: string;
    bgColors?: string[];
} */

export default function Features({ title, description, feature }) {

    console.log(feature)

    const content = feature.map((item: any, index: number) => {
        return {
            title: item.heading,
            description: item.subHeading,
            content: <StrapiImage alt="Feature" src={item.image.url} fill className="object-cover object-center" />
        }
    })

    return (
        <section className="h-auto relative z-0" >

            <StickyScrollReveal content={content} />


        </section>
    );
}