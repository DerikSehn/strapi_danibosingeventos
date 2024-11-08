// components/meal-planner/party-type-selector.tsx
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface PartyTypeSelectorProps {
    partyTypes: {
        id: number;
        name: string;
    }[];
    onSelect: (partyTypeId: number) => void;
}

const PartyTypeSelector: React.FC<PartyTypeSelectorProps> = ({ partyTypes, onSelect }) => {
    return (
        <div >

            <h2 className="text-2xl w-full text-center font-semibold mb-4 text-primary-900 xl:text-4xl">Qual festa você deseja contratar?</h2>
            <div className="gap-4 grid lg:grid-cols-2 mt-20">
                {partyTypes.map(type => (
                    <motion.div
                        role='button'
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelect(type.id)}
                        animate={{
                            transition: {
                                duration: 1000
                            }
                        }}
                        key={type.id} className=" group select-none relative flex items-center p-8 bg-black-500 backdrop-blur   shadow h-[400px] max-h-[60vh] rounded-xl">

                        {/*   <figure className="relative h-40 max-h-40  bg-white-800 mb-2 w-full rounded-lg" >
                               {type.image?.url ?
                               <Image src={type.image.url} alt={type.name} fill className="w-full object-cover rounded-t-lg" />
                               : null
                               } 
                               </figure> */}
                        <motion.span className="absolute inset-x-0 z-20 transition-all duration-500 h-0 group-hover/link:h-full  group-hover/link:border-x-2 border-primary-600   bg-gradient-to-b from-primary-300/40 via-primary-300/20 to-primary-300/40" />

                        <span className='absolute overflow-hidden inset-0 z-[-1] rounded-xl'>

                            <Image src={'/background/hero.jpeg'} alt={type.name} fill className=" w-full object-cover  group-hover:scale-105 transition-transform duration-700" />
                        </span>
                        <span className=" absolute z-20 top-0 -translate-y-1/4 left-1/2 -translate-x-1/2 flex-grow text-4xl font-alegreya bg-primary-600 text-black-500  rounded-lg p-4 ">
                            {type.name}
                        </span>
                        <div className='absolute inset-0 overflow-hidden' >
                            <span className=" absolute z-10 bottom-0 left-1/2 scale-150 flex-grow text-9xl -rotate-12 font-moglan text-primary-500/5 ">
                                {type.name}
                            </span>
                        </div>
                        <span
                            className='text-2xl xl:text-5xl rounded-xl text-center font-semibold group-hover:opacity-50 group-hover:translate-x-10 group-hover:scale-90 transition-all duration-700  text-white bg-black-300 p-4 uppercase h-full w-full flex justify-center items-center'
                        >
                            Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default PartyTypeSelector;