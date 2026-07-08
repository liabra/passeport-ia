import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible, Bitter } from "next/font/google";
import "./globals.css";
import { ProgressProvider } from "@/lib/progress-context";
import { ToastProvider } from "@/components/ui/Toast";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

// Atkinson Hyperlegible : police conçue pour les malvoyants (choix délibéré).
const corps = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-corps",
  display: "swap",
});

const titre = Bitter({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-titre",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://passeport-ia.example"),
  title: {
    default: "Passeport IA — un voyage pour comprendre l'intelligence artificielle",
    template: "%s · Passeport IA",
  },
  description:
    "Un voyage à travers six territoires pour comprendre l'intelligence artificielle, une notion à la fois. Sans compte, sans donnée collectée.",
  applicationName: "Passeport IA",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Passeport IA", statusBarStyle: "default" },
  icons: { icon: "/icone.svg", apple: "/icone.svg" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#F2ECDB",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${corps.variable} ${titre.variable}`}>
      <body className="fond-papier min-h-dvh">
        <a href="#contenu" className="lien-evitement">
          Aller au contenu
        </a>
        <ProgressProvider>
          <ToastProvider>
            <div id="contenu" tabIndex={-1} className="outline-none">
              {children}
            </div>
          </ToastProvider>
        </ProgressProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
