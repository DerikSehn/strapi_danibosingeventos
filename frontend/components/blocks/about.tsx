import { Star } from "lucide-react";
import { StrapiImage } from "../strapi-image";
import GradualSpacing from "../ui/gradual-spacing";
import FeatureCard from "../cards/feature-card";


interface AboutSectionProps {
    features: {
        heading: string;
        subHeading: string;
        image: {
            url: string;
            name: string;
        };
    }[];
    heading: string;
    subHeading: string;
}

export default function AboutSection({ features, heading, subHeading }: AboutSectionProps) {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-8 py-12 md:py-48">
            <div className="max-w-6xl w-full">
                <header className="mb-16">
                    <GradualSpacing
                        delayMultiple={.02} duration={1.2}

                        text={heading}
                        className="text-8xl font-rustic text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800" />
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="relative  min-h-[590px] ">
                        <div className="absolute -top-4  min-h-[590px] -left-4 w-full h-full border-2 border-primary-600"></div>
                        <StrapiImage
                            src="/uploads/daniela_photo_06a81ad4b4.jpg"
                            alt="Chef Élégance"
                            fill
                            className="aspect-square min-h-[600px] relative z-10 object-cover"
                        />
                    </div>

                    <div className="space-y-6">
                        <p className="text-xl leading-relaxed">
                            {subHeading}
                        </p>
                        <div className="flex items-center space-x-2 text-primary-600">
                            <Star className="w-6 h-6 fill-current" />
                            <Star className="w-6 h-6 fill-current" />
                            <Star className="w-6 h-6 fill-current" />
                            <span className="text-lg font-food">Garantia de excelência por três vezes no Litoral Gaúcho </span>
                        </div>
                        <p className="text-xl leading-relaxed">
                            Nossa equipe é formada por profissionais experientes e qualificados,
                            que estão sempre buscando as melhores receitas e técnicas para garantir
                            o sabor e a apresentação perfeitos para cada evento.
                        </p>
                    </div>
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <FeatureCard key={idx} {...feature} />
                    ))}

                </div>

                <footer className="mt-24 text-center">
                    <p className="text-2xl font-light italic text-primary-600">
                        "Uma frase de impacto."
                    </p>
                    <p className="mt-2 text-xl font-semibold">- Chef Élégance</p>
                </footer>
            </div>
        </div>
    );
}