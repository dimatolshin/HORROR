import { Footer } from "../widgets/footer/footer";
import { Header } from "../widgets/header/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quest House — Погрузись в мир квестов",
  description:
    "Выбери квест по душе и открой дверь в захватывающие истории. Удобное бронирование, уникальные сюжеты и незабываемые эмоции — всё в одном месте.",
  openGraph: {
    title: "Quest House — Погрузись в мир квестов",
    description:
      "Выбери квест по душе и открой дверь в захватывающие истории. Бронирование онлайн, оригинальные локации и яркие впечатления.",
    url: "https://quest-house.by",
    type: "website",
  },
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
