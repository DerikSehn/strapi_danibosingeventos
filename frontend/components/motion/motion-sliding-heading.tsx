"use client"
import { motion } from 'framer-motion';
import { StrapiImage } from '../strapi-image';
import { cn } from '@/lib/utils';

interface MotionBackgroundZoomProps {
    children: React.ReactNode;
    className?: string;
}

export default function MotionSlidingHeading({ children, className }: MotionBackgroundZoomProps) {
    return (
        <motion.h2
            initial={{ x: -400, rotate: -10, scale: 0.8 }}
            whileInView={{ y: 300, x: 0, rotate: 0, scale: 1 }}
            viewport={{ amount: .5 }}
            transition={{ once: true, duration: 2, type: 'spring', bounce: 0.1 }}
            className={cn("w-auto", className)}
        >
            {children}
        </motion.h2>
    )
}