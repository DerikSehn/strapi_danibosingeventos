"use client";

import { usePathname } from "next/navigation";
import WhatsappButton from "@/components/whatsapp-button";

export default function MaybeWhatsapp({ link }: { link: string }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/dashboard")) return null;
  return <WhatsappButton link={link} />;
}
