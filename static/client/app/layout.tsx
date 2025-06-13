import { Nunito, Poppins } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import YandexMetrikaContainer from "@/app/lib/yandex";
import { GoogleAnalytics } from "@/app/lib/google";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://quest-house.by"),

  title: "Quest House — Погрузись в мир квестов в Минске",
  description:
    "Выбери квест по душе и открой дверь в захватывающие истории. Удобное бронирование, уникальные сюжеты и незабываемые эмоции — всё в одном месте.",

  keywords: [
    "квест",
    "квесты Минск",
    "квест-рум",
    "хоррор квест",
    "квесты в реальности",
    "бронирование квестов",
    "развлечения Минск",
    "Quest House",
  ],

  authors: [{ name: "Quest House", url: "https://quest-house.by" }],

  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },

  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1a202c" },
    { media: "(prefers-color-scheme: dark)", color: "#a40000" },
  ],

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        type: "image/png",
        url: "/favicon-32x32.png",
        sizes: "32x32",
      },
    ],
  },
  openGraph: {
    title: "Quest House — Погрузись в мир квестов в Минске",
    description:
      "Выбери квест по душе и открой дверь в захватывающие истории. Бронирование онлайн, оригинальные локации и яркие впечатления.",
    url: "https://quest-house.by",
    siteName: "Quest House",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Логотип Quest House на фоне загадочного дома",
      },
    ],
    locale: "ru_RU",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Quest House — Погрузись в мир квестов в Минске",
    description:
      "Удобное бронирование, уникальные сюжеты и незабываемые эмоции.",
    site: "@YourTwitterHandle",
    creator: "@YourTwitterHandle",

    images: ["/twitter-image.jpg"],
  },

  alternates: {
    canonical: "https://quest-house.by",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  formatDetection: {
    telephone: false,
  },

  manifest: "/manifest.json",

  category: "entertainment",
  verification: {
    google: "G-8TQHNHJ2ZM",
    yandex: "102611757",
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html className="scroll-smooth" lang="ru">
      <body className={`${nunito.variable} ${poppins.variable} antialiased`}>
        {children}
        {modal}
        <YandexMetrikaContainer />
        <GoogleAnalytics id="G-8TQHNHJ2ZM" />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5JLSDV78"
            height="0"
            width="0"
            className="invisible hidden"
          ></iframe>
        </noscript>
      </body>
    </html>
  );
}
