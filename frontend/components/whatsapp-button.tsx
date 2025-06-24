import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import PulsatingButton from "./pulsating-button";

export default function WhatsappButton({ link, className }: { link: string, className?: string }) {
    return (
        <Link href={link} target="_blank" className={cn("flex items-center justify-center z-50 fixed bottom-6 right-6 md:bottom-8 md:right-8", className)}>
            <PulsatingButton className="text-md relative  transition-all rounded-full aspect-square h-12 bg-green-600 shadow-lg">
                <Image
                    fill
                    alt="whatsapp"
                    src="/whatsapp.png"
                    className="" />
            </PulsatingButton>
            <span className="sr-only">WhatsApp</span>
        </Link>
    )
}