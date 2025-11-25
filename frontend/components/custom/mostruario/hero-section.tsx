"use client";

import { motion } from "framer-motion";
import { ChefHat, Utensils, Award, Users, Star } from "lucide-react";

interface HeroSectionProps {
    totalProducts: number;
}

const heroVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 1,
            ease: [0.25, 0.46, 0.45, 0.94]
        }
    }
};

export function HeroSection({ totalProducts }: Readonly<HeroSectionProps>) {
    return (
        <motion.section
            className="relative py-24 pt-28 lg:pt-48 overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={heroVariants}
        >
            {/* Enhanced Decorative Background */}
            <div className="absolute inset-0 opacity-20">
                {/* Floating Circles */}
                <div className="absolute top-10 left-10 w-32 h-32 border-2 border-amber-500/40 rounded-full animate-pulse"></div>
                <div className="absolute top-32 right-20 w-24 h-24 border-2 border-orange-500/40 rounded-full animate-pulse delay-75"></div>
                <div className="absolute bottom-20 left-1/4 w-16 h-16 border-2 border-red-500/40 rounded-full animate-pulse delay-150"></div>
                <div className="absolute bottom-32 right-1/3 w-20 h-20 border-2 border-amber-400/40 rounded-full animate-pulse delay-300"></div>
                
                {/* Geometric Shapes */}
                <div className="absolute top-16 right-1/4 w-12 h-12 border-2 border-amber-300/30 rotate-45 animate-pulse delay-500"></div>
                <div className="absolute bottom-40 left-16 w-8 h-8 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rotate-12 animate-pulse delay-700"></div>
                <div className="absolute top-1/2 left-8 w-6 h-20 bg-gradient-to-b from-amber-500/10 to-transparent rounded-full animate-pulse delay-1000"></div>
                
                {/* Decorative Lines */}
                <div className="absolute top-24 left-1/3 w-32 h-0.5 bg-gradient-to-r from-amber-400/30 to-transparent rotate-12 animate-pulse delay-200"></div>
                <div className="absolute bottom-24 right-1/4 w-24 h-0.5 bg-gradient-to-l from-orange-500/30 to-transparent -rotate-12 animate-pulse delay-400"></div>
                
                {/* Culinary Symbols */}
                <div className="absolute top-20 right-12 text-amber-400/20 text-4xl animate-pulse delay-600">✦</div>
                <div className="absolute bottom-16 left-1/3 text-orange-400/20 text-2xl animate-pulse delay-800">❋</div>
                <div className="absolute top-1/3 right-1/3 text-amber-300/20 text-3xl animate-pulse delay-900">◊</div>
            </div>

            <div className="container mx-auto px-4 text-center relative z-10">
                {/* Title Section */}
                <div className="flex justify-center items-center gap-4 mb-8">
                    <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-amber-400"></div>
                    <ChefHat className="w-12 h-12 text-amber-400" />
                    <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-amber-400"></div>
                </div>

                <h1 className="text-6xl md:text-7xl lg:text-8xl font-food text-amber-200 mb-6 drop-shadow-2xl">
                    Cardápio Completo
                </h1>

                <p className="text-2xl md:text-3xl text-amber-100 max-w-4xl mx-auto leading-relaxed mb-12">
                    Conheça nossa seleção exclusiva de catering food especialmente para eventos únicos e inesquecíveis
                </p>

                {/* Stats Section */}
                {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto lg:pt-10">
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl ring-2 ring-amber-400/30">
                            <Utensils className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-5xl font-rustic text-amber-200">{totalProducts}+</div>
                        <div className="text-xl text-amber-100/80 font-food">Pratos Únicos</div>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl ring-2 ring-orange-400/30">
                            <Award className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-5xl font-rustic text-amber-200">100%</div>
                        <div className="text-xl text-amber-100/80 font-food">Artesanal</div>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl ring-2 ring-red-400/30">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-5xl font-rustic text-amber-200">500+</div>
                        <div className="text-xl text-amber-100/80 font-food">Eventos</div>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl ring-2 ring-pink-400/30">
                            <Star className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-5xl font-rustic text-amber-200">5.0</div>
                        <div className="text-xl text-amber-100/80 font-food">Avaliação</div>
                    </div>
                </div> */}
            </div>
        </motion.section>
    );
}
