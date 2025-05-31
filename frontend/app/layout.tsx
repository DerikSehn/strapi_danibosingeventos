import { FloatingNavBar } from "@/components/blocks/floating-navbar";
import Footer from "@/components/blocks/footer";
import { Contact, HomeIcon, InfoIcon } from "lucide-react";
import type { Metadata } from "next";
import { ViewTransitions } from "next-view-transitions";
import localFont from "next/font/local";
import "./globals.css";
import QueryProvider from "@/components/providers/query-provider";
import { ReactLenis } from 'lenis/react';

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
              <FloatingNavBar navItems={navItems} />
              {children}
              <Footer />
            </QueryProvider>
          </body>
        </ReactLenis>
      </html>
    </ViewTransitions>
  );
}
