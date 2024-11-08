"use client"
import { motion } from 'framer-motion';
import { StrapiImage } from '../strapi-image';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'next-view-transitions';

export default function PartyTypeCard({ title, id, caption, description, backgroundImage, categories }) {
    return (
        <Link href={`/cardapio/${caption}`}
            className=' h-[400px] max-h-[60vh]'
        >
            <motion.div
                role='button'
                whileTap={{ scale: 1.02, transition: { duration: .5 } }}
                key={id}
                className=" group select-none relative flex items-center p-8 backdrop-blur h-full ">

                <StrapiImage src={backgroundImage.url} alt={title} fill className=" w-full object-cover  group-hover:scale-105 transition-transform duration-1000 blur-xl   opacity-80 aspect-square object-top z-[-1]" />

                <span className='absolute overflow-hidden inset-0 z-[-1]'>
                    <StrapiImage src={backgroundImage.url} alt={title} fill className=" w-full object-cover  group-hover:scale-105 transition-transform duration-1000 z-0" />

                </span>
                <span className="group-hover:translate-y-[70%] transition-all duration-1000 group-hover:scale-125 absolute z-20 top-0 -translate-y-1/4 left-1/2 -translate-x-1/2 flex-grow text-4xl font-alegreya bg-primary-600 text-black-500   p-4 ">
                    {title}
                </span>
                <div className='absolute inset-0 overflow-hidden' >
                    <span
                        className='text-2xl xl:text-5xl scale-90  text-center font-semibold group-hover:-translate-y-[70%] rounded-b-none group-hover:text-primary/0 transition-all duration-1000  text-primary bg-white p-4 h-full w-full flex justify-center items-center'
                    >
                        {description}
                        {/* seta de link para selecionar */}
                        <ArrowUpRight className='absolute right-4 -bottom-4  opacity-5 group-hover:opacity-100 group-hover:text-primary h-28 w-28 delay-500 group-hover:translate-x-4 group-hover:-translate-y-4 transition-all duration-1000 ' />

                    </span>
                    <span
                        className='absolute inset-x-8 rounded-t-full bottom-0 text-md xl:text-xl  text-center font-semibold  translate-y-full group-hover:translate-y-0  group-hover:text-black text-white/0 transition-all duration-1000   bg-white p-4 flex flex-col space-y-4 justify-center items-center'
                    >

                        <h3 className='text-muted-foreground font-thin'>Contém:</h3>
                        {categories.map((category: any, index: number) => (
                            <ol key={index}>
                                {category.title}
                            </ol>
                        ))}

                    </span>
                    <span className=" absolute z-0 bottom-0 left-1/2 scale-150  flex-grow text-9xl -rotate-12 font-moglan text-white-500/10 ">
                        {title}
                    </span>
                </div>



            </motion.div>
        </Link>
    );
}