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

export default function FeatureCard({ heading, subHeading, className }: FeatureCardProps) {

    return (
        <div className={cn(" p-6 rounded-lg transform  overflow-visible relative w-full", className)}>
            <StrapiImage
                src={'http://localhost:1337/uploads/image_table_wood_knife_ceb6995746.webp'}
                alt={heading}
                fill
                className="object-contain object-center scale-[2] z-0 brightness-75"
            />
            <StrapiImage
                src={'http://localhost:1337/uploads/logo_strapi_72aec661ef.png'}
                alt={heading}
                fill
                className="object-contain scale-50 opacity-25 z-10"
            />
            <span className="relative z-10">

                <h3 className="relative z-10 text-2xl font-food mb-2">{heading}</h3>
                <p className="relative z-10" >{subHeading}</p>
            </span>
        </div>
    );
}