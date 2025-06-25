"use client";
import { Phone, Mail, MapPin, Send, Instagram } from "lucide-react";
import GradualSpacing from "../ui/gradual-spacing";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import Image from "next/image";

interface SocialLink {
    url: string;
    icon: string;
    text: string;
}

interface ContactSectionProps {
    heading: string;
    subHeading: string;
    address: string;
    phone: string;
    email: string;
    socialLinks: SocialLink[];
}

export default function ContactSection({ 
    heading, 
    subHeading, 
    address, 
    phone, 
    email, 
    socialLinks 
}: Readonly<ContactSectionProps>) {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-8 py-12 md:py-24">
            <div className="max-w-screen-xl w-full">
                <header className="mb-16 text-center">
                    <GradualSpacing
                        delayMultiple={.02} 
                        duration={1.2}
                        text={heading || "Entre em Contato"}
                        className="text-4xl lg:text-7xl font-food text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800"
                    />
                    <p className="text-xl mt-4 max-w-3xl mx-auto text-gray-300">
                        {subHeading || "Estamos aqui para ajudar a tornar seu evento inesquecível. Preencha o formulário ou utilize nossos canais de atendimento."}
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                    <div className="space-y-8">
                        <div className="relative group">
                            <div className="absolute duration-500 transition-all -top-2 -left-2 w-full h-full border-2 border-primary-600"/>
                            <div className="relative z-10 bg-gray-900 p-8 space-y-6">
                                <h3 className="text-2xl font-food text-primary-600">Informações de Contato</h3>
                                <div className="flex items-center space-x-4">
                                    <MapPin className="w-6 h-6 text-primary-600" />
                                    <p>{address || "Endereço não fornecido"}</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <Phone className="w-6 h-6 text-primary-600" />
                                    <p>{phone || "Telefone não fornecido"}</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <Mail className="w-6 h-6 text-primary-600" />
                                    <p>{email || "Email não fornecido"}</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative group">
                             <div className="absolute  duration-500 transition-all -top-2 -left-2 w-full h-full border-2 border-primary-600"/>
                             <div className="relative z-10 bg-gray-900 p-8 space-y-4">
                                <h3 className="text-2xl font-food text-primary-600">Siga-nos</h3>
                                <div className="flex flex-col space-y-4">
                                    {socialLinks?.some(link => link.icon === 'instagram') && (
                                        <a href={socialLinks.find(link => link.icon === 'instagram')?.url} 
                                        className="relative w-full h-64 overflow-visible bg-[#fff] rounded-lg mb-4">
                                            <Image
                                                src="/instagram-mock.jpeg"
                                                alt="Instagram Preview"
                                                fill
                                                className="object-contain"
                                                loading="lazy"
                                            />
                                        <span className="md:absolute inset-0 flex items-center justify-center bg-black opacity-0 text-white text-lg font-bold transition-opacity duration-300 md:hover:opacity-50">
                                                Ver perfil no Instagram
                                        </span>
                                        <h4 className="absolute -bottom-8  text-primary-700 text-lg font-bold ">
                                            Ver perfil no Instagram
                                        </h4>
                                        </a>
                                    )}
                                    <div className="flex space-x-4">
                                    {socialLinks?.filter(link => link.icon !== 'instagram').map(link => (
                                        <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="text-xl text-primary-600 hover:text-primary-400">
                                            <span>{link.text}</span>
                                        </a>
                                    ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute group-hover:top-2 group-hover:left-2 duration-500 transition-all -top-2 -left-2 w-full h-full border-2 border-primary-600"/>
                        <form className="relative z-10 bg-gray-900 p-8 space-y-6">
                            <h3 className="text-2xl font-food text-primary-600">Envie uma Mensagem</h3>
                            <Input placeholder="Seu nome" className="bg-gray-800 border-gray-700" />
                            <Input placeholder="Seu e-mail" type="email" className="bg-gray-800 border-gray-700" />
                            <Textarea placeholder="Sua mensagem" className="bg-gray-800 border-gray-700" rows={5} />
                            <Button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2">
                                <Send className="w-5 h-5" />
                                <span>Enviar</span>
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
