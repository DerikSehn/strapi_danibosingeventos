"use client";
import { cn } from "@/lib/utils";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { useState } from "react";

/**
 * Represents a floating navigation bar component.
 *
 * @component
 * @example
 * ```tsx
 * <FloatingNavBar
 *    navItems={[
 *      { name: "Home", link: "/home", icon: <HomeIcon /> },
 *      { name: "About", link: "/about", icon: <AboutIcon /> },
 *      { name: "Contact", link: "/contact", icon: <ContactIcon /> },
 *    ]}
 *    className="navbar"
 * />
 * ```
 */
export const FloatingNavBar = ({
    navItems,
    className,
}: {
    navItems: {
        name: string;
        link: string;
        icon?: JSX.Element;
    }[];
    className?: string;
}) => {
    const { scrollYProgress } = useScroll();

    const [visible, setVisible] = useState(true);
    const [isAtTop, setIsAtTop] = useState(true);


    useMotionValueEvent(scrollYProgress, "change", (current) => {
        // Check if current is not undefined and is a number
        if (typeof current === "number") {
            let direction = current! - scrollYProgress.getPrevious()!;
            setIsAtTop(scrollYProgress.get() < 0.05)
            if (scrollYProgress.get() < 0.05) {
                setVisible(true);
            } else {
                if (direction < 0) {
                    setVisible(true);
                } else {
                    setVisible(false);
                }
            }
        }
    });
    return (

        <motion.div
            layout
            animate={{
                y: visible ? 0 : -200,
                /*                     opacity: visible ? 1 : 0, */

                transition: {
                    duration: 0.6,
                    type: 'just'
                },
            }}
            transition={{
                duration: 0.6,
                type: 'just',
                bounce: 0.25,
                damping: 30
            }}
            style={{
                textShadow: '1px 1px 1px  gray'
            }}
            className={cn(
                "flex p-8 pb-2 uppercase font-montserrat tracking-widest fixed top-0 inset-x-0 md:mx-auto transition-colors duration-500 bg-black/50 text-white backdrop-blur-sm  z-[5000] items-between justify-between md:space-x-4",
                isAtTop ? "md:bg-transparent md:bg-gradient-to-t from-neutral-900/20 to-black/20 shadow-lg  " : "",
                className,
            )}
        >
            <div className="hidden md:block relative max-w-[200px]  h-[72px] w-1/2">
                <Image src="/logo.png" alt="logo" fill className="object-contain object-center" />
            </div>
            <div className="hidden sm:flex justify-end gap-6">
                {navItems.map((navItem: any, idx: number) => (
                    <Link
                        key={`link=${idx}`}
                        href={navItem.link}

                        className={cn(
                            "relative font-bold flex flex-col justify-center items-center space-x-1 group/link px-2",
                            "transition-all duration-500 hover:text-primary-800 "
                        )}
                    >
                        <motion.span className="absolute inset-y-0 transition-all duration-500 w-0 group-hover/link:w-full border-t-2 border-primary-600   group-hover/link:bg-gradient-to-b from-white/10" />
                        <motion.span
                            animate={{
                                fontWeight: isAtTop ? 500 : 600,
                                transition: {
                                    duration: 0.3,
                                    type: 'just'
                                },
                            }}
                            className={cn("hidden sm:block")}>
                            {navItem.name}
                        </motion.span>
                    </Link>
                ))}



            </div>
            <Link

                href={'/cardapio'}

                className={cn(
                    "relative font-bold flex flex-col justify-center items-center space-x-1 group/link px-2",
                    "transition-all duration-500 hover:text-primary-800 "
                )}
            >
                <motion.span className="absolute inset-y-0 z-0 transition-all duration-500 w-0 group-hover/link:w-full  group-hover/link:border-x-2 border-primary-600   bg-gradient-to-r from-primary-300/40 via-primary-300/20 to-primary-300/40" />
                <motion.span
                    animate={{
                        fontWeight: isAtTop ? 500 : 600,
                        transition: {
                            duration: 0.3,
                            type: 'just'
                        },
                    }}
                    className={cn("hidden sm:block relative z-10")}>
                    Montar Cardápio
                </motion.span>
            </Link>
        </motion.div>
    );
}; 
