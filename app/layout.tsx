import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "South Property | Premium Real Estate",
  description:
    "South Property — an exclusive collection of premium residences redefining luxury living in Australia's most coveted locations.",
  keywords: "luxury real estate, premium residences, South Property, Australian property",
  openGraph: {
    title: "South Property | Premium Real Estate",
    description:
      "South Property — an exclusive collection of premium residences redefining luxury living in Australia's most coveted locations.",
    type: "website",
    locale: "en_AU",
    siteName: "South Property",
  },
  twitter: {
    card: "summary_large_image",
    title: "South Property | Premium Real Estate",
    description:
      "South Property — an exclusive collection of premium residences redefining luxury living in Australia's most coveted locations.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
