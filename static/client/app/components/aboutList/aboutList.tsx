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
    title: "Выберите квест",
    text: "Выбор квеста и времени посещения",
  },
  {
    id: "2",
    title: "Бронирование",
    text: "Забронируйте удобное время для посещения",
  },
  {
    id: "3",
    title: "Подтверждение",
    text: "Возможна оплата по месту, онлайн картой, сертификатом",
  },
  {
    id: "4",
    title: "Готово",
    text: "Приезжайте на локацию \n и играйте!",
  },
];

export const AboutList = () => {
  const mediaQuery = useCustomMediaQuery("(max-width: 768px)");

  return (
    <>
      {mediaQuery ? (
        <CustomSwiper isAbout config={{ slidesPerView: 1 }}>
          {CARD.map((element) => (
            <div
              key={element.id}
              className="text-center relative min-h-[250px] flex items-end"
            >
              <span className="absolute text-[#9CBABC] z-30 top-[26%] left-[50%] translate-x-[-50%] translate-y-[-80%] text-[70px] font-[700] md:text-[102px]">
                {element.id}
              </span>
              <div className="mx-auto z-20 w-full bg-[#fff] rounded-2xl px-[27px] py-[35px] min-h-[200px] max-w-[calc(100%-5em)] flex flex-col justify-center gap-5">
                <h3 className="text-[20px] font-[700] lg:text-4xl">
                  {element.title}
                </h3>
                <p className="whitespace-pre-line">{element.text}</p>
              </div>
            </div>
          ))}
        </CustomSwiper>
      ) : (
        <ul className="grid grid-cols-1 md:gap-y-[90px] lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-5">
          {CARD.map((element) => (
            <li key={element.id} className="text-center relative">
              <span className="absolute text-[#9CBABC] z-30 top-[12%] left-[50%] translate-x-[-50%] translate-y-[-80%] text-[70px] font-[700] md:text-[102px]">
                {element.id}
              </span>
              <div className="bg-[#fff] z-20 relative rounded-2xl px-[27px] py-[41px] min-h-[200px] flex flex-col justify-center gap-5">
                <h3 className="text-[20px] font-[700] lg:text-4xl">
                  {element.title}
                </h3>
                <p className="whitespace-pre-line">{element.text}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
