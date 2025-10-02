"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/app/assets/svg/logo.svg";
import { LinkUI } from "@/app/ui/linkUI/linkUI";
import { useEffect, useState } from "react";
import { ReviewsModal } from "@/app/components/reviewsModal/reviewsModal";
import burger from "@/app/assets/svg/menu.svg";

interface INav {
  id: string;
  text: string;
  path: string;
  onClick?: boolean;
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
    path: "#",
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
    onClick: true,
  },
  {
    id: "5",
    text: "Контакты",
    path: "#contacts",
  },
];

export const HeaderHorror = () => {
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [navValue, setNavValue] = useState<string>("#");
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
    <>
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
            <div className="flex items-center gap-20">
              <Link href={"/"}>
                <Image width={60} height={60} src={logo} alt="лого QuestHouse"/>
              </Link>
              <nav className="nav hidden md:block">
                <ul className="flex items-center gap-0.5 text-white">
                  {NAV.map((element) => (
                      <li key={element.id}>
                        {!element.onClick ? (
                            <Link
                                className={`py-3.5 px-7 inline-block rounded-lg ${
                                    navValue === element.path && "bg-[#262626]"
                                }`}
                                href={element.path}
                                onClick={() => setNavValue(element.path)}
                            >
                              {element.text}
                            </Link>
                        ) : (
                            <button
                                className={`py-3.5 px-7 inline-block rounded-lg cursor-pointer ${
                                    navValue === element.path && "bg-[#262626]"
                                }`}
                                onClick={() => setIsOpenDialog(true)}
                            >
                              {element.text}
                            </button>
                        )}
                      </li>
                  ))}
                </ul>
              </nav>
            </div>
            <div className="flex items-center gap-14 text-white">
              <div className={"flex-col text-white hidden xl:flex"}>
                <span className="text-[12px]">Телефон:</span>
                <a className={"text-[16px] xl:text-[20px]"} href="tel:+(375) 445 33 02 78 ">
                  +(375) 445 33 02 78
                </a>
              </div>
              <LinkUI className="hidden md:block" href="#reservation">
                Записаться
              </LinkUI>
              <Link href={"/burger"} className="block md:hidden">
                <Image src={burger} alt="burger"/>
              </Link>
            </div>
          </div>
        </div>
      </header>
      <ReviewsModal
          dialogOpen={isOpenDialog}
          onClose={() => setIsOpenDialog(false)}
      />
    </>
  );
};
