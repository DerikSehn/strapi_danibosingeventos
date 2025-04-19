"use client";
import { motion } from "framer-motion";
import { Link } from "next-view-transitions";
import MotionBackgroundZoom from "../motion/motion-background-zoom";
import MotionGlowingHeading from "../motion/motion-glowing-heading";
import MotionGrowingButton from "../motion/motion-growing-button";
import { StrapiImage } from "../strapi-image";
import { Button } from "../ui/button";

type ButtonProps = {
    href: string;
    title: string;
    variation:  'default' |'destructive' |'outline' |'secondary' |'ghost' |'link'
}

interface HeroProps {
    backgroundImage: {
        documentId: string;
        url: string;
        name: string;
    };
    button: ButtonProps[];
    description: string;
    heroImage: {
        documentId: string;
        url: string;
        name: string;
    }[];
    title: string;
}

export default function Hero({ backgroundImage, button, description, heroImage, title }: Readonly<HeroProps>) {

    return (
        <section className="relative z-10 w-full py-24 sm:py-36 md:py-48 min-h-screen flex flex-col justify-center bg-neutral-700 overflow-hidden">
            <MotionBackgroundZoom src={backgroundImage.url} alt="Hero" />
         <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 from-10% to-neutral-900/20 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-20% z-0"></div>            
        <div className="container px-4 md:px-6 mx-auto relative z-10 pt-10 md:pt-0">
                <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                    <div className="relative z-50 flex flex-col justify-center space-y-4  ">
                        <div className="space-y-2">
                            <MotionGlowingHeading>
                              {title}
                            </MotionGlowingHeading>
                            <p className="max-w-[600px] md:text-xl text-white">
                                {description}
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 min-[400px]:flex-row">
                            {button.map(renderButtons)}
                        </div>
                    </div>
                    <motion.figure 
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ duration: 1 }}
                     className="relative  min-h-[350px] min-w-[350px]  sm:min-h-[550px] sm:min-w-[550px]">
                            <StrapiImage
                                alt="Hero"
                                fill                
                                className="select-none object-contain aspect-square xl:scale-[1.4] 2xl:scale-[1.8]"
                                src={heroImage[0].url}
                                />
                    </motion.figure>
                </div>
            </div>
        </section >
    );
}

function renderButtons(btn: ButtonProps, index: number) {
    const Component = () => {
        if (btn.variation === 'default') {
            return <MotionGrowingButton className="font-food text-3xl bg-primary-700">{btn.title}</MotionGrowingButton>;
        }
        return <Button variant={btn.variation} size="lg" className="font-food text-3xl bg-primary-700">{btn.title}</Button>;
    };
    return (
        <Link key={index} href={btn.href}>
            <Component />
        </Link>
    );
}