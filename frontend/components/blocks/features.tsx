"use client";
import MotionSlidingHeading from "../motion/motion-sliding-heading";
import StickyScrollReveal from "../motion/sticky-scroll-reveal";
import { StrapiImage } from "../strapi-image";
import TextRevealByWord from "../ui/text-reveal";

type Feature = {
    heading: string;
    subHeading: string;
    image: {
        url: string;
        name: string;
        documentId: string;
    };
};

interface FeaturesProps {
    title: string;
    description: string;
    feature: Feature[];
}

export default function Features({ title, description, feature }: Readonly<FeaturesProps>) {


    const content = feature.map((item: Feature, index: number) => {
        return {
            title: item.heading,
            description: item.subHeading,
            content: <StrapiImage key={item.heading} alt="Feature" src={item.image.url} fill className="object-contain md:object-cover object-center min-h-96" />
        }
    })

    return (
        <section className="flex flex-col h-auto relative z-0 bg-neutral-900 items-center " >
            <MotionSlidingHeading className="hidden md:block text-9xl font-rustic text-primary-900  py-10 " >
                {title}
            </MotionSlidingHeading>
            <TextRevealByWord text={description} className="hidden md:block " 
                paragraphProps={{
                    className: "xl:text-primary-500 text-center lg:text-6xl xl:text-7xl  font-food"
                }}
            />
            <StickyScrollReveal content={content} />
        </section>
    );
}