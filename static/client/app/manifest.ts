import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Quest House — Квесты в Минске",

    short_name: "Quest House",

    description:
      "Погрузитесь в мир ужаса и загадок. Бронируйте хоррор-квесты в Минске онлайн.",

    start_url: "/",

    display: "standalone",

    background_color: "#080f0f",

    theme_color: "#a40000",

    orientation: "any",

    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icons/icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
      },
      {
        src: "/icons/icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        src: "/icons/icon-128x128.png",
        sizes: "128x128",
        type: "image/png",
      },
      {
        src: "/icons/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",

        purpose: "maskable",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],

    screenshots: [
      {
        src: "/screenshots/screenshot-1.jpg",
        sizes: "1080x1920",
        type: "image/jpeg",
        form_factor: "narrow",
        label: "Главный экран с выбором квестов",
      },
      {
        src: "/screenshots/screenshot-2.jpg",
        sizes: "1080x1920",
        type: "image/jpeg",
        form_factor: "narrow",
        label: "Страница бронирования сеанса",
      },
    ],

    categories: ["entertainment", "games", "lifestyle"],
  };
}
