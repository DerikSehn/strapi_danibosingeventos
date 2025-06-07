export const useAnimationVariants = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const categoryVariants = {
        hidden: { 
            opacity: 0, 
            y: 60,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const productVariants = {
        hidden: { 
            opacity: 0, 
            x: -50,
            rotateY: -15
        },
        visible: {
            opacity: 1,
            x: 0,
            rotateY: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const variantCardVariants = {
        hidden: { 
            opacity: 0, 
            y: 30,
            scale: 0.9
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    };

    return {
        containerVariants,
        categoryVariants,
        productVariants,
        variantCardVariants
    };
};
