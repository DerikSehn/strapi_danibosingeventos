"use client";
import MotionEntrance from "../motion/motion-entrance";
import MotionSlidingHeading from "../motion/motion-sliding-heading";
import StickyScrollReveal from "../motion/sticky-scroll-reveal";
import { StrapiImage } from "../strapi-image";
import TextRevealByWord from "../ui/text-reveal";

interface FeaturesProps {
    title: string;
    description: string;
    feature: any[];
}

export default function Features({ title, description, feature }: FeaturesProps) {


    const content = feature.map((item: any, index: number) => {
        return {
            title: item.heading,
            description: item.subHeading,
            content: <StrapiImage key={index} alt="Feature" src={item.image.url} fill className="object-cover object-center" />
        }
    })

    return (
        <section className="h-auto relative z-0 bg-neutral-900 items-center flex flex-col" >
            <MotionSlidingHeading className="text-9xl font-rustic text-primary-900  py-10 " >
                {title}
            </MotionSlidingHeading>
            <TextRevealByWord text={description} className=""
                paragraphProps={{
                    className: "xl:text-primary-500 text-center lg:text-6xl xl:text-7xl  font-food"
                }}
            />
            <StickyScrollReveal content={content} />
        </section>
    );
}