"use client";

import { motion } from "framer-motion";
import { ChefHat, Utensils, Star, ArrowRight, Eye, Beef } from "lucide-react";
import { Link } from "next-view-transitions";
import { Button } from "../ui/button";
import MotionGrowingButton from "../motion/motion-growing-button";
import PulsatingButton from "../pulsating-button";

export default function MenuShowcase() {
    return (
        <section className="relative py-24 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 overflow-hidden">
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

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex justify-center items-center gap-4 mb-6"                    >
                        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-amber-400"></div>
                        <ChefHat className="w-8 h-8 text-amber-400" />
                        <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-amber-400"></div>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-6xl lg:text-7xl font-food text-amber-200 mb-4 drop-shadow-2xl"
                    >
                        Nossos Sabores
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl md:text-2xl text-amber-100 max-w-3xl mx-auto font-rustic leading-relaxed"
                    >
                        Descubra uma seleção cuidadosamente elaborada de pratos que combinam tradição,
                        sabor e apresentação excepcional para tornar seu evento inesquecível.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {/* Feature Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-center"
                    >                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl ring-2 ring-amber-400/30">
                            <Utensils className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-food text-amber-200 mb-2">Pratos Exclusivos</h3>
                        <p className="text-amber-100/80 font-food">Receitas únicas desenvolvidas especialmente para eventos</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-center"
                    >                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl ring-2 ring-orange-400/30">
                            <Star className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-food text-amber-200 mb-2">Qualidade Premium</h3>
                        <p className="text-amber-100/80 font-food">Ingredientes selecionados e preparo artesanal</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="text-center"
                    >                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl ring-2 ring-red-400/30">
                            <ChefHat className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-food text-amber-200 mb-2">Chef Especialista</h3>
                        <p className="text-amber-100/80 font-food">Experiência culinária de alto nível</p>
                    </motion.div>
                </div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-center"
                >                    <div className="bg-neutral-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-amber-500/20 max-w-2xl mx-auto ring-1 ring-amber-400/10">
                        <h3 className="text-3xl md:text-4xl font-food text-amber-200 mb-4">
                            Conheça Nossos Produtos
                        </h3>                        <p className="text-amber-100/80 font-food mb-8 text-lg">
                            Explore nosso mostruário completo de pratos e descubra as opções perfeitas
                            para criar um orçamento personalizado para seu próximo evento especial.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/mostruario">
                                <MotionGrowingButton className="relative bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-food text-xl px-8 py-4 rounded-xl shadow-lg border-0 group">

                                    <Eye className="w-6 h-6 absolute right-1 opacity-50 group-hover:opacity-100 -top-0 translate-y-1/4  group-hover:translate-x-1 transition-transform" />
                                    Ver Mostruário
                                </MotionGrowingButton>
                            </Link>
                            <Link href="/cardapio">
                                <MotionGrowingButton className="relative bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-food text-xl px-8 py-4 rounded-xl shadow-lg border-0 group">
                                    <ChefHat className="w-6 h-6 absolute right-1 opacity-50 group-hover:opacity-100 -top-0 translate-y-1/4  group-hover:translate-x-1 transition-transform" />
                                    Criar Orçamento
                                </MotionGrowingButton>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>            {/* Bottom Decorative Wave */}
            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-r from-transparent to-transparent ">
                <svg viewBox="0 0 1200 120" fill="none" className="w-full h-full">
                    <path d="M0,60 C300,100 900,20 1200,60 L1200,120 L0,120 Z" fill="currentColor" className="text-primary-500/60" />
                </svg>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-b from-transparent to-neutral-800 opacity-60" />

        </section>
    );
}