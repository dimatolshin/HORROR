"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import Image from "next/image";
import close from "@/app/assets/svg/close_burger.svg";

interface INav {
  id: string;
  path: string;
  text: string;
}

const NAV: INav[] = [
  {
    id: "1",
    path: "/",
    text: "Главная",
  },
  {
    id: "2",
    path: "/#popular",
    text: "Квесты",
  },
  {
    id: "3",
    path: "/#reservation",
    text: "Бронирование",
  },
  {
    id: "4",
    path: "/#reviews",
    text: "Отзывы",
  },
  {
    id: "5",
    path: "/#contacts",
    text: "Контакты",
  },
];

const BurgerModal = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && typeof dialog.showModal === "function" && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleCloseModal = (path: string) => {
    dialogRef.current?.close();
    setTimeout(() => {
      router.push(path);
    }, 50);
  };

  return (
    <dialog
      style={{
        padding: 0,
        margin: 0,
        border: "none",
        maxWidth: "100vw",
        maxHeight: "100vh",
      }}
      className={"bg-[#0F0F0F] text-white w-screen h-screen "}
      ref={dialogRef}
      onClose={() => router.back()}
    >
      <div className="px-[23px] py-[15px] h-[90%] w-full flex flex-col">
        <div className={"mb-[59px] flex justify-between items-center"}>
          <span
            style={{ fontFamily: "var(--font-poppins)" }}
            className={"text-[30px] font-[800] text-(--red)"}
          >
            Quest House
          </span>
          <button
            className={"outline-none border-none bg-none"}
            onClick={() => dialogRef.current?.close()}
          >
            <Image src={close} alt="close modal" />
          </button>
        </div>
        <ul className={"flex flex-col gap-[15px] mb-auto"}>
          {NAV.map((element) => (
            <li key={element.id}>
              <button
                className={""}
                onClick={() => handleCloseModal(element.path)}
              >
                {element.text}
              </button>
            </li>
          ))}
        </ul>

        <div className={"flex flex-col"}>
          <span className="text-[12px]">Телефон:</span>
          <a className={"text-[20px]"} href="tel:+(375) 445 33 02 78 ">
            +(375) 445 33 02 78
          </a>
        </div>
      </div>
    </dialog>
  );
};

export default BurgerModal;
