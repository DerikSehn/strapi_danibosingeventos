import { ChefHat } from "lucide-react";
import { StrapiImage } from "../strapi-image";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
    heading: string;
    subHeading: string;
    className?: string;
    image: {
        url: string;
        name: string;
    };
}

export default function FeatureCard({ heading, subHeading, image, className }: FeatureCardProps) {

    return (
        <div className={cn("bg-gradient-to-br from-primary-100 to-primary-300 p-6 rounded-lg transform rotate-2", className)}>
            <StrapiImage
                src={image.url}
                alt={heading}
                fill
                className="w-12 h-12 text-primary-600 mb-4"
            />
            <h3 className="text-2xl font-food mb-2">{heading}</h3>
            <p>{subHeading}</p>
        </div>
    );
}