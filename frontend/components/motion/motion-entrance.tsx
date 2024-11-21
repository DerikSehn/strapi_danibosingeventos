import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface MotionEntranceProps {
    children: React.ReactNode;
    y?: number;
    x?: number;
    className?: string;
}

export default function MotionEntrance({ children, className }: MotionEntranceProps) {


    return (
        <motion.span
            initial={{
                x: 10,
                y: 10,
            }}

            animate={{
                x: 0,
                y: 0,
            }}

            transition={{
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "reverse",
                duration: 3.5
            }}
            className={cn("absolute", className)}
        >
            {children}
        </motion.span>
    );
}