import { cn } from '@/lib/utils';
import { motion } from 'framer-motion'

interface MotionEntranceProps {
    children: React.ReactNode;
    y?: number;
    x?: number;
    className?: string;
}

export default function MotionEntrance({ children, y = -10, x = 500, className }: MotionEntranceProps) {
    return (<motion.span
        initial={{
            x,
            y,
            opacity: .1,
            scale: 1.9,
        }}
        animate={{
            y: 0,
            opacity: 1,
            x: 0,
            scale: 1
        }}
        transition={{
            duration: 1.2,
            type: 'ease',
        }}
        className={cn("absolute  ", className)}
    >
        {children}
    </motion.span>)
}