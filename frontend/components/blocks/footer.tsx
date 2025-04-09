import { generateWhatsAppLink } from "@/lib/utils";
import { Link } from "next-view-transitions";
import Image from "next/image";
import WhatsappButton from "../whatsapp-button";
const LINKS = [
    {
        title: "Sobre Nós",
        items: [
            {
                name: "Informações",
                href: '/about',
            },
            {
                name: "Contato",
                href: '/contact',
            },
        ],
    },
    {
        title: "Empresa",
        items: [
            {
                name: "Início",
                href: '/#',
            },
            {
                name: "Entrar no Sistema",
                href: '/login',
            },

        ],
    },
];


const phoneNumber = "(51) 99671-5643";
const message = "Olá, tudo bem? Vi no seu site que vocês oferecem serviços de buffet e gostaria de saber mais informações sobre os serviços oferecidos. Poderia me ajudar?";

const whatsAppLink = generateWhatsAppLink({ phoneNumber, message });
const currentYear = new Date().getFullYear();

export default function Footer() {

    return (
        <footer className="relative w-full py-20 min-h-[600px] h-auto bg-neutral-900">
            <div className="mx-auto w-full max-w-screen-2xl px-8 text-neutral-400">
                <div className="grid grid-cols-1 md:grid-cols-[1.5fr_0.5fr_0.5fr] gap-4">
                    <div className="not-prose flex flex-col gap-6">
                        <Link href="/">
                            <h3 className="sr-only">Cheff Daniela Bosing</h3>
                            <div className="hidden md:block relative max-w-[200px]  h-[72px] w-1/2">
                                <Image src="/logo.png" alt="logo" fill className="object-contain object-center" />
                            </div>

                        </Link>
                        <p>

                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        {LINKS.map(({ title, items }) => (
                            <ul key={title}>
                                <small className="mb-3 font-medium opacity-40 text-md">{title}</small>
                                {items.map(({ href, name }) => (
                                    <li key={href}>
                                        <Link href={href} className="py-1.5 font-normal transition-colors hover:text-neutral-200">
                                            {name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ))}
                    </div>
                    <div className="flex flex-col gap-2">
                        <h5>Legal</h5>
                        <Link href="/about/privacy-policy">Política de Privacidade</Link>
                        {/* <Link href="/about/terms-of-service">Termos de Serviço</Link> */}
                        {/* <Link href="/about/cookie-policy">Política de Cookies</Link> */}
                    </div>
                </div>
                <div className="flex w-full flex-col items-center justify-between border-t border-neutral-50 py-4 md:flex-row">
                    <div className="flex gap-2">
                        <WhatsappButton link={whatsAppLink} />
                    </div>
                    <small className="mb-4 text-center font-normal  md:mb-0">
                        by: <a href="https://devsehn.com.br">Derik Sehn</a>.
                    </small>
                    <small className="mb-4 text-center font-normal  md:mb-0">
                        &copy; {currentYear} <a href="https://danibosingeventos.com.br/">Cheff Daniela Bosing</a>. All Rights Reserved.
                    </small>
                </div>
            </div>
        </footer>
    );
}


const WhatsApp = () => <Image src="/whatsapp.png" alt="whatsapp" width={24} className="" height={24} />