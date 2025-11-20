"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/blocks/footer";

export default function MaybeFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/dashboard")) return null;
  return <Footer />;
}
