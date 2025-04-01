import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MotionGrowingButtonProps {
    children: React.ReactNode;
    className?: string;
}

export default function MotionGrowingButton({ children, className, ...props }: Readonly<MotionGrowingButtonProps>) {

    return (<motion.button {...props}
        whileHover={{
            x: -4,
            y: -4,
            backgroundColor: '#feb959',
            boxShadow: '4px 4px 1px #feb95960',
            transition: {
                duration: 0.3
            }
        }}
        whileTap={{ scale: 0.96 }} className={cn(" text-primary-200 rounded-lg px-4 py-1", className)}>
        {children}
    </motion.button>);
}