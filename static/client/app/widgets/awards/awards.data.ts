import { StaticImageData } from "next/image";
import anturazh from "@/app/assets/awards/anturazh.png";
import fear_2024 from "@/app/assets/awards/fear_2024.png";
import plot_2024 from "@/app/assets/awards/plot_2024.png";
import year_2024 from "@/app/assets/awards/year_2024.png";
import person_2024 from "@/app/assets/awards/person_2024.png";
import fear_2021 from "@/app/assets/awards/fear_2021.png";
import fear_2022 from "@/app/assets/awards/fear_2022.png";
import fear_2023 from "@/app/assets/awards/fear_2023.png";
import best_2021 from "@/app/assets/awards/best_2021.png";
import open_2021 from "@/app/assets/awards/open_2021.png";

interface IAwardsCONSTANT {
  id: string;
  name?: string;
  awards: {
    icon: StaticImageData;
  }[];
}

export const AWARDS: IAwardsCONSTANT[] = [
  {
    id: "1",
    name: "зарождение ",
    awards: [
      {
        icon: anturazh,
      },
    ],
  },
  {
    id: "2",
    name: "гаснет свет",
    awards: [
      {
        icon: fear_2024,
      },
      {
        icon: plot_2024,
      },
      {
        icon: year_2024,
      },
      {
        icon: person_2024,
      },
    ],
  },
  {
    id: "3",
    name: "астрал",
    awards: [
      {
        icon: fear_2022,
      },
      {
        icon: fear_2023,
      },
      {
        icon: open_2021,
      },
      {
        icon: best_2021,
      },
    ],
  },
  {
    id: "4",
    name: "заклятие",
    awards: [
      {
        icon: fear_2021,
      },
    ],
  },
];
