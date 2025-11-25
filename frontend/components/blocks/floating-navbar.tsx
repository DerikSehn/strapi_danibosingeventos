"use client";
import { cn } from "@/lib/utils";
import { motion, useMotionValueEvent, useScroll, AnimatePresence } from "framer-motion";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

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

    const pathName = usePathname()

    const [visible, setVisible] = useState(true);
    const [isAtTop, setIsAtTop] = useState(true);   
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


    useMotionValueEvent(scrollYProgress, "change", (current) => {
        // Check if current is not undefined and is a number
        if (typeof current === "number") {
            let direction = current - scrollYProgress.getPrevious()!;
            setIsAtTop(scrollYProgress.get() < 0.05)
            if (scrollYProgress.get() < 0.05) {
                setVisible(true);
            } else if (direction < 0) {
                    setVisible(true);
                } else {
                    setVisible(false);
                }
        }
    });
    return pathName.includes('dashboard') 
    ? null : (

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
                "flex p-4 pb-2 uppercase font-montserrat tracking-widest fixed top-0 inset-x-0 md:mx-auto transition-colors duration-500 bg-black/90 text-white backdrop-blur-sm  z-[5000] items-between justify-between md:space-x-4",
                isAtTop ? (`md:bg-transparent md:bg-gradient-to-t ${pathName === "/" ? "from-neutral-900/20 to-black/20 " : "from-neutral-900/60 to-black/60 "} shadow-lg  `) : "",
                className,
            )}
        >
            <Link href="/" className=" md:block relative max-w-20 md:max-w-[200px]  h-[72px] w-1/2">
                <Image src="/logo.png" alt="logo" fill className="object-contain object-center" />
            </Link>
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

                href={'/encomenda'}

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
                    className={cn(" sm:block relative z-10")}>
                    Encomendar
                </motion.span>
            </Link>
        </motion.div>
    );
}; 
