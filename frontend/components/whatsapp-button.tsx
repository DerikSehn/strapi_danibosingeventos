import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import PulsatingButton from "./pulsating-button";

export default function WhatsappButton({ link, className }: { link: string, className?: string }) {
    return (
        <Link href={link} target="_blank" className={cn("flex items-center justify-center", className)}>
            <PulsatingButton className="text-md relative  transition-all rounded-full aspect-square h-12 bg-green-600">
                <Image
                    fill
                    alt="whatsapp"
                    src="/whatsapp.png"
                    className="" />
            </PulsatingButton>
        </Link>
    )
}