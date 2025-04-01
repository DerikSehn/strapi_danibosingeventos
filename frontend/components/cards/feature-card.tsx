import { cn } from "@/lib/utils";
import { StrapiImage } from "../strapi-image";

interface FeatureCardProps {
    heading: string;
    subHeading: string;
    className?: string;
    image: {
        url: string;
        name: string;
    };
}

export default function FeatureCard({ heading, subHeading, className }: Readonly<FeatureCardProps>) {

    return (
        <div className={cn(" p-6 rounded-lg transform  overflow-visible relative xl:max-h-44 text-ellipsis flex justify-center", className)}>
           
            <StrapiImage
                src={'http://127.0.0.1:1337/uploads/image_table_wood_knife_ceb6995746.webp'}
                alt={heading}
                fill
                className="object-contain object-center scale-[1.4] z-0 brightness-[.6] shadow-xl"
            />
            <StrapiImage
                src={'http://127.0.0.1:1337/uploads/logo_strapi_72aec661ef.png'}
                alt={heading}
                fill
                className="object-contain scale-50 opacity-25 z-10"
            />
            <span className="relative z-10 ">

                <h3 className="relative z-10 text-2xl font-food mb-2 max-w-80">{heading}</h3>
                <p className="relative z-10 max-w-80" >{subHeading}</p>
            </span>
        </div>
    );
}