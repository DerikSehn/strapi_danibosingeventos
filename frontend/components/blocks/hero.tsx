import { Link } from "next-view-transitions";
import { StrapiImage } from "../strapi-image";
import { Button } from "../ui/button";


interface HeroProps {
    title: string;
    description: string;
    ctaLink: string;
    ctaText: string;
    heroImage: {
        url: string;
    }
}

export default function Hero({ title, description, ctaLink, ctaText, heroImage }: HeroProps) {


    return (
        <section className="relative z-10 w-full py-12 md:py-24 lg:py-32 xl:py-48 min-h-screen"
            style={{
                backgroundColor: 'hsla(29,100%,99%,1)',
                backgroundImage: 'radial-gradient(at 29% 37%, hsla(44,61%,88%,1) 0px, transparent 50%),radial-gradient(at 58% 58%, hsla(120,8%,91%,1) 0px, transparent 50%),radial-gradient(at 44% 20%, hsla(103,26%,74%,1) 0px, transparent 50%),radial-gradient(at 50% 4%, hsla(31,81%,70%,1) 0px, transparent 50%),radial-gradient(at 92% 90%, hsla(12,56%,79%,1) 0px, transparent 50%),radial-gradient(at 38% 62%, hsla(138,23%,86%,1) 0px, transparent 50%),radial-gradient(at 93% 52%, hsla(174,72%,75%,1) 0px, transparent 50%)'
            }}>
            <span className="absolute bottom-0 w-full bg-gradient-to-t from-white from-20% h-[15%] z-20" />
            <div className="container px-4 md:px-6 mx-auto">
                <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                    <div className="flex flex-col justify-center space-y-4">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                                {title}
                            </h1>
                            <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                {description}
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 min-[400px]:flex-row">
                            <Link href={ctaLink}>
                                <Button size="lg">{ctaText}</Button>
                            </Link>
                            <Link href={'/about'}>
                                <Button size="lg" variant="outline">
                                    Saiba mais
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <StrapiImage
                        alt="Hero"
                        className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                        height={550}
                        src={heroImage.url}
                        width={550}
                    />
                </div>
            </div>
        </section>
    );
}

