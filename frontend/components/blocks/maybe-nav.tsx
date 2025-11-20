"use client";

import { usePathname } from "next/navigation";
import { FloatingNavBar } from "@/components/blocks/floating-navbar";

export function MaybeNav({ navItems }: { navItems: any }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/dashboard")) return null;
  return <FloatingNavBar navItems={navItems} />;
}
