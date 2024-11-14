"use client"
import { motion } from 'framer-motion';
import { StrapiImage } from '../strapi-image';
import { cn } from '@/lib/utils';

interface MotionBackgroundZoomProps {
    src: string;
    alt: string;
    className?: string;
}

export default function MotionBackgroundZoom({ src, alt, className }: MotionBackgroundZoomProps) {
    return (
        <motion.span
            initial={{ scale: 1.2, y: -100 }}
            whileInView={{ scale: 1, y: 0 }}
            viewport={{ amount: .5 }}
            transition={{ duration: 1, type: 'spring', bounce: 0.1 }}
            className={cn("absolute inset-0 ", className)}
        >
            <StrapiImage src={src} alt={alt} fill className="object-cover object-center z-0 brightness-[.2] select-none" />
        </motion.span>
    )
}