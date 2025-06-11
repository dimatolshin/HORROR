"use client";

import useCustomMediaQuery from "@/app/hooks/useCustomMediaQuery";
import { CustomSwiper } from "@/app/ui/customSwiper/customSwiper";

interface ICard {
  id: string;
  title: string;
  text: string;
}

const CARD: ICard[] = [
  {
    id: "1",
    title: "Уровень страха",
    text: "По-настоящему страшные \n и уникальные квесты",
  },
  {
    id: "2",
    title: "Сервис",
    text: "Высокий уровень сервиса, направленный на получение положительных эмоций",
  },
  {
    id: "3",
    title: "Атмосфера",
    text: "Вы поверите в то, \n что вы находитесь в другой реальности",
  },
];

export const HeroList = () => {
  const mediaQuery = useCustomMediaQuery("(max-width: 768px)");

  return (
    <>
      {mediaQuery ? (
        <CustomSwiper config={{ slidesPerView: 1 }}>
          {CARD.map((element) => (
            <div
              className="mx-auto rounded-[30px] p-[23px] border-2 border-[#FFFFFF47] flex flex-col max-w-[calc(100%-5em)] min-h-[160px] justify-center text-white w-full h-full bg-[#23606399]"
              key={element.id}
            >
              <strong className="mb-[17px] text-[18px]">{element.title}</strong>
              <hr className="mb-3.5" />
              <p className="text-[12px] whitespace-pre-line">{element.text}</p>
            </div>
          ))}
        </CustomSwiper>
      ) : (
        <ul className="flex gap-5 ml-auto">
          {CARD.map((element) => (
            <li
              className="rounded-[30px] py-[58px] px-[45px] border-2 border-[#FFFFFF47] flex flex-col text-white max-w-[395px] w-full bg-[#23606399]"
              key={element.id}
            >
              <strong className="mb-[17px] text-4xl">{element.title}</strong>
              <hr className="mb-3.5" />
              <p className="text-xl whitespace-pre-line">{element.text}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
