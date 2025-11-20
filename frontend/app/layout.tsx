import { MaybeNav } from "@/components/blocks/maybe-nav";
import MaybeFooter from "@/components/blocks/maybe-footer";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ChefHat, Contact, HomeIcon, InfoIcon } from "lucide-react";
import type { Metadata } from "next";
import { ViewTransitions } from "next-view-transitions";
import localFont from "next/font/local";
import "./globals.css";
import QueryProvider from "@/components/providers/query-provider";
import { ReactLenis } from 'lenis/react';
import MaybeWhatsapp from "@/components/blocks/maybe-whatsapp";
import { Toaster } from "sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Cheff Daniela Bosing",
  description: "Eventos Gastronômicos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const navItems = [
    { name: "Início", link: "/", icon: <HomeIcon /> },
    { name: "Cardápio", link: "/mostruario", icon: <ChefHat /> },
    { name: "Sobre", link: "/about", icon: <InfoIcon /> },
    { name: "Contato", link: "/contact", icon: <Contact /> },
  ]

  return (
    <ViewTransitions>
      <html lang="en">
        <ReactLenis root options={{ touchMultiplier: 0, syncTouch: false }}>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
          >
            <QueryProvider>
              <AuthProvider>
                <MaybeNav navItems={navItems} />
                {children}
                <MaybeWhatsapp link="https://wa.me/5551996715643?text=Ol%C3%A1%2C%20tudo%20bem%3F%20Vi%20no%20site%20e%20gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os." />
                <MaybeFooter />
                <Toaster richColors position="top-right" />
              </AuthProvider>
            </QueryProvider>
          </body>
        </ReactLenis>
      </html>
    </ViewTransitions>
  );
}
