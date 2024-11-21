"use client";
import { Link } from "next-view-transitions";
import { StrapiImage } from "../strapi-image";
import { Button } from "../ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import MotionEntrance from "../motion/motion-entrance";
import React, { useRef } from "react";
import MotionGlowingHeading from "../motion/motion-glowing-heading";
import MotionGrowingButton from "../motion/motion-growing-button";
import MotionBackgroundZoom from "../motion/motion-background-zoom";

type ButtonProps = {
    href: string;
    title: string;
    variation: string;
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

export default function Hero({ backgroundImage, button, description, heroImage, title }: HeroProps) {

    return (
        <section className="relative z-10 w-full py-12 md:py-48 min-h-screen flex flex-col justify-center bg-neutral-700 overflow-hidden">
            <MotionBackgroundZoom src={backgroundImage.url} alt="Hero" />
            <span className="absolute inset-0  inset-y-[80%] bottom-0  bg-gradient-to-t  from-neutral-900 " />
            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                    <div className="flex flex-col justify-center space-y-4">
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
                    <figure className="relative min-h-[550px] min-w-[550px]">
                        <MotionEntrance className="bottom-0 size-40">
                            <StrapiImage
                                alt="Hero"
                                height={550}
                                width={550}
                                className="select-none object-cover aspect-square rounded-full"
                                src={heroImage[0].url}
                            />
                        </MotionEntrance>
                        <MotionEntrance className="size-96 right-10 top-32">
                            <StrapiImage
                                alt="Hero"
                                height={550}
                                width={550}
                                className="select-none object-cover aspect-square rounded-full"
                                src={heroImage[1].url}
                            />
                        </MotionEntrance>
                        <MotionEntrance className="size-40 left-20 top-0">
                            <StrapiImage
                                alt="Hero"
                                height={550}
                                width={550}
                                className="select-none object-cover aspect-square rounded-full"
                                src={heroImage[2].url}
                            />
                        </MotionEntrance>
                    </figure>
                </div>
            </div>
        </section >
    );
}

function renderButtons(btn: ButtonProps, index: number) {

    const Component = () => React.createElement((btn.variation === 'default' ? MotionGrowingButton : Button), { variant: btn.variation, size: 'lg', className: "font-food text-3xl bg-primary-700" }, btn.title);
    return (
        <Link key={index} href={btn.href}>
            <Component />
        </Link>
    );
}