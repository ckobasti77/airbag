import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AirbagExpert.rs | Vazdušni Jastuci za Automobile — Srbija",
    template: "%s | AirbagExpert.rs",
  },
  description:
    "Prodaja vazdušnih jastuka (airbagova) za VW, Audi i Škoda. Originalni OEM delovi, brza isporuka u Srbiji. Airbag volana, table, bočni i zavesni.",
  keywords: [
    "airbagovi srbija",
    "vazdušni jastuci",
    "prodaja airbagova",
    "airbag volana",
    "airbag table",
    "vw golf airbag",
    "audi a4 airbag",
    "škoda octavia airbag",
    "auto airbag beograd",
    "oem airbag delovi",
  ],
  openGraph: {
    title: "AirbagExpert.rs | Premium Vazdušni Jastuci",
    description:
      "Specijalizovana prodaja airbagova za VW, Audi i Škoda vozila u Srbiji.",
    locale: "sr_RS",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0D0D0D] text-zinc-100`}
      >
        {children}
      </body>
    </html>
  );
}
