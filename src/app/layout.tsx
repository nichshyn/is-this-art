import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "./globals.css";

import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "IS THIS ART? — Who decides what art is?",
    template: "%s — IS THIS ART?",
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "art",
    "social game",
    "contemporary art",
    "art gallery",
    "taste",
    "voting",
    "AI art",
  ],
  authors: [{ name: "IS THIS ART?" }],
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.name,
    title: "IS THIS ART? — Who decides what art is?",
    description: SITE.description,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "IS THIS ART? — a social experiment about taste",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IS THIS ART?",
    description: SITE.description,
    images: ["/og.png"],
  },
  icons: {
    icon: "/icon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem('ita-theme');
    var dark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', dark);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-paper font-sans text-ink antialiased">
        <Header />
        <main className="min-h-[70vh] pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
