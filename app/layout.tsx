import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import ElementsBackground from "@/components/elements-background"
import { Toaster } from "@/components/ui/toaster"
import AudioPlayerWrapper from "./components/AudioPlayerWrapper"
import "./globals.css"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PALMAR - Reconocimiento Anual 2025",
  description: "Sistema de votación corporativa con estilo Neo-Maya",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ElementsBackground />
        <div className="content-wrapper relative z-10">
          {children}
        </div>
        <AudioPlayerWrapper />
        <Toaster />
        
        {/* Script para evitar FOUC (Flash of Unstyled Content) */}
        <Script id="prevent-fouc" strategy="afterInteractive">
          {`
            (function() {
              // Este script asegura que el contenido esté completamente cargado
              document.documentElement.classList.add('js-loaded');
              
              // Forzar reflow para asegurar renderizado completo
              window.addEventListener('load', function() {
                setTimeout(function() {
                  const body = document.body;
                  body.style.display = 'none';
                  // Forzar reflow
                  void body.offsetHeight;
                  body.style.display = '';
                }, 0);
              });
            })();
          `}
        </Script>
      </body>
    </html>
  )
}
