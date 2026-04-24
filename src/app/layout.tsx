import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://continua-ashen.vercel.app"),
  title: "Continua — Between-Session Therapy Support",
  description:
    "A weekly session is 50 minutes. Continua supports the other 167 hours — grounding tools, AI journaling, session memory, and RTM billing for clinicians.",
  openGraph: {
    title: "Continua — Between-Session Therapy Support",
    description:
      "A weekly session is 50 minutes. Continua supports the other 167 hours — grounding tools, AI journaling, session memory, and RTM billing for clinicians.",
    url: "https://continua-ashen.vercel.app",
    siteName: "Continua",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Continua — Between-Session Therapy Support",
    description:
      "A weekly session is 50 minutes. Continua supports the other 167 hours — grounding tools, AI journaling, session memory, and RTM billing for clinicians.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jost.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text antialiased">
        <Navigation />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
