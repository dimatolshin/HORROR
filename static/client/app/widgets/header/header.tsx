"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/app/assets/svg/logo.svg";
import { LinkUI } from "@/app/ui/linkUI/linkUI";
import { useEffect, useState } from "react";
import burger from "@/app/assets/svg/menu.svg";

interface INav {
  id: string;
  text: string;
  path: string;
}

const NAV: INav[] = [
  {
    id: "1",
    text: "Главная",
    path: "/",
  },
  {
    id: "2",
    text: "Квесты",
    path: "#popular",
  },
  {
    id: "3",
    text: "Бронирование",
    path: "#reservation",
  },
  {
    id: "4",
    text: "Отзывы",
    path: "#reviews",
  },
  {
    id: "5",
    text: "Контакты",
    path: "#contacts",
  },
];

export const Header = () => {
  const [navValue, setNavValue] = useState<string>("/");
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      style={{
        background: isScrolled
          ? "linear-gradient(180deg, rgba(3, 35, 36, 0.85) 0%, rgba(3, 35, 36, 0.7) 100%)"
          : "",
      }}
      className={`header py-5 fixed top-0 left-0 right-0 z-50 transition ease-in-out header-bg bg-(--header-bg)`}
    >
      <div className="container">
        <div className="flex items-center justify-between">
          <Link href={"/"}>
            <Image width={60} height={60} src={logo} alt="лого QuestHouse" />
          </Link>
          <nav className="nav hidden md:block">
            <ul className="flex items-center gap-0.5 text-white">
              {NAV.map((element) => (
                <li key={element.id}>
                  <Link
                    className={`py-3.5 px-7 inline-block rounded-lg ${
                      navValue === element.path && "bg-[#262626]"
                    }`}
                    href={element.path}
                    onClick={() => setNavValue(element.path)}
                  >
                    {element.text}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <LinkUI className="hidden md:block" href="horrors/1">
            Записаться
          </LinkUI>
          <Link href={"/burger"} className="block md:hidden">
            <Image src={burger} alt="burger" />
          </Link>
        </div>
      </div>
    </header>
  );
};
