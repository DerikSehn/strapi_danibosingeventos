import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
interface MotionGlowingHeadingProps {
    children: React.ReactNode;
    className?: string;
}

export default function MotionGlowingHeading({ children, className }: Readonly<MotionGlowingHeadingProps>) {

    return (<motion.h1
        className={cn("text-4xl font-food tracking-tighter sm:text-5xl xl:text-7xl text-primary-600 ", className)}
        initial={{
            textShadow: '6px 4px 1px #feb95920'
        }}
        animate={{
            textShadow: '6px 4px 1px #feb95960'
        }}
        transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 2.4
        }}
    >
        {children}
    </motion.h1>)

}