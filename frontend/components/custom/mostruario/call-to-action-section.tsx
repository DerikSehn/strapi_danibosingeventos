"use client";

import { motion } from "framer-motion";
import { ChefHat, Utensils } from "lucide-react";

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

export function CallToActionSection() {
    return (
        <motion.section 
            className="py-20 bg-gradient-to-r from-neutral-800 to-neutral-700 relative overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={heroVariants}
        >
            {/* CTA Decorative Background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-8 left-8 w-24 h-24 border-2 border-amber-400/30 rounded-full animate-pulse"></div>
                <div className="absolute top-16 right-12 w-16 h-16 border border-orange-400/40 rotate-45 animate-pulse delay-200"></div>
                <div className="absolute bottom-12 left-1/4 text-amber-300/40 text-4xl animate-pulse delay-400">✦</div>
                <div className="absolute bottom-8 right-8 w-20 h-20 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full animate-pulse delay-600"></div>
                <div className="absolute top-1/2 left-12 w-2 h-16 bg-gradient-to-b from-amber-400/30 to-transparent rounded-full animate-pulse delay-800"></div>
                <div className="absolute top-1/3 right-1/3 text-orange-400/30 text-2xl animate-pulse delay-1000">❋</div>
            </div>

            <div className="container mx-auto px-4 text-center relative z-10">
                <div className="max-w-4xl mx-auto">
                    {/* Enhanced CTA Header */}
                    <div className="mb-6">
                        <div className="flex justify-center items-center gap-4 mb-4">
                            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-amber-400/50"></div>
                            <ChefHat className="w-8 h-8 text-amber-400" />
                            <div className="w-20 h-0.5 bg-gradient-to-l from-transparent via-amber-400 to-amber-400/50"></div>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-food text-amber-200 relative">
                            Pronto para Criar Seu Evento?
                        </h2>
                    </div>                    <p className="text-xl text-amber-100/80 font-rustic mb-10 leading-relaxed">
                        Gostou do que viu em nosso mostruário? Crie um orçamento personalizado 
                        para sua festa com os pratos que mais despertaram seu interesse. Nossa equipe está pronta para tornar sua celebração inesquecível.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <a
                            href="/cardapio"
                            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-food text-xl rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
                        >
                            <ChefHat className="w-5 h-5 mr-2" />
                            Criar Orçamento de Festa
                        </a>
                        
                        <a
                            href="/encomenda"
                            className="inline-flex items-center justify-center px-8 py-4 border-2 border-amber-500 text-amber-300 hover:bg-amber-500/10 hover:border-amber-400 font-food text-xl rounded-xl transition-all duration-300"
                        >
                            <Utensils className="w-5 h-5 mr-2" />
                            Encomendar Direto
                        </a>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
