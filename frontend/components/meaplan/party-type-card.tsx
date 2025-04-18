"use client"
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'next-view-transitions';
import { StrapiImage } from '../strapi-image';

interface PartyTypeCardProps {
    title: string;
    id: string;
    caption: string;
    description: string;
    backgroundImage: {
        url: string;
    };
    categories: any[];
}

export default function PartyTypeCard({ title, id, caption, description, backgroundImage, categories }: Readonly<PartyTypeCardProps>) {
    return (
        <Link href={`/cardapio/${caption}`}
            className=' h-[400px] max-h-[60vh]'
        >
            <motion.div
                role='button'
                whileTap={{ scale: 1.02, transition: { duration: .5 } }}
                key={id}
                className=" group select-none relative flex items-center    h-full ">

                <StrapiImage src={backgroundImage.url} alt={title} fill className=" w-full object-cover  group-hover:scale-105 scale-90 transition-transform duration-1000 blur-xl brightness-110  opacity-80 aspect-square object-top z-[-1]" />

                <figure className='absolute overflow-hidden inset-0 z-[-1]'>
                    <StrapiImage src={backgroundImage.url} alt={title} fill className=" w-full object-cover  group-hover:scale-105 transition-transform duration-1000 z-0 brightness-75" />

                </figure>
                <span className="group-hover:translate-y-[120%] text-center transition-all duration-1000 group-hover:scale-125 absolute z-20 top-0 -translate-y-1/4 left-1/2 -translate-x-1/2 flex-grow text-md font-alegreya bg-primary-600 text-primary-100   p-4 ">
                    {description}
                </span>
                <div className='absolute inset-0 overflow-hidden' >
                    <span
                        className='text-5xl xl:text-8xl scale-90 group-hover:scale-100 text-center font-rustic group-hover:-translate-y-[70%] rounded-b-none group-hover:text-primary-500/0 transition-all duration-1000  text-primary-500 bg-neutral-900  p-4 h-full w-full flex justify-center items-center'
                    >
                        {title}
                        <ArrowUpRight className='absolute right-4 -bottom-4  opacity-5 group-hover:opacity-100 group-hover:text-primary-500 h-28 w-28 delay-500 group-hover:translate-x-4 group-hover:-translate-y-4 transition-all duration-1000 ' />

                    </span>
                    <span
                        className='absolute inset-x-8  bottom-0 text-md xl:text-xl  text-center font-semibold  translate-y-full group-hover:translate-y-0  group-hover:text-white text-black/0 transition-all duration-1000  backdrop-blur-md bg-neutral-900/80 p-4 flex flex-col space-y-4 justify-center items-center'
                    >

                        <h3 className='text-muted-foreground font-thin '>Contém:</h3>
                        <div className='flex space-x-2   '>
                            {categories.map((category: any, index: number) => (
                                <div className="p-1 bg-primary-500 text-black text-sm font-thin h-14 flex items-center" key={index}>
                                    {category.title}
                                </div>
                            ))}
                        </div>

                    </span>
                </div>



            </motion.div>
        </Link>
    );
}