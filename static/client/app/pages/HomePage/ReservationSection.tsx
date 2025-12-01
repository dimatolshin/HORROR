"use client";

import { IHorrorsPromise } from "@/app/api/horrors/fetchHorrors";
import calendar from "@/app/assets/svg/calendar_reservation.svg";
import { ReservationTable } from "@/app/widgets/reservationTable/reservationTable";
import Image from "next/image";
import clock from "@/app/assets/svg/clock_popular.svg";
import { ReservationModalLater } from "@/app/components/reservationModalLater/reservationModalLater";
import {useEffect, useState} from "react";
import { CustomSwiper } from "@/app/ui/customSwiper/customSwiper";
import { RatingUI } from "@/app/ui/ratingUI/ratingUI";
import { api } from "@/app/api/api";
import {useQuest} from "@/app/context/QuestContext";

interface IReservationHorror {
  horror: IHorrorsPromise[];
}

interface IPrice {
  id: string;
  label: string;
  color: string;
}

const PRICE: IPrice[] = [
  {
    id: "1",
    label: "120 Br",
    color: "#11B3D1",
  },
  {
    id: "2",
    label: "130 Br",
    color: "#0A8284",
  },
  {
    id: "3",
    label: "200 Br",
    color: "#A40000",
  },
];

export default function ReservationSection({ horror }: IReservationHorror) {
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const { selectedQuest, setSelectedQuest } = useQuest();
  const activeHorrors = horror.filter((q) => q.is_active);

  useEffect(() => {
    if (!selectedQuest && activeHorrors.length > 0) {
      setSelectedQuest(activeHorrors.find((q) => q.is_active) || activeHorrors[0]);
    }
  }, [activeHorrors, selectedQuest, setSelectedQuest]);

  return (
    <>
      <section id="reservation" className="reservation section--offset">
        <div className="container">
          <div className="reservation__block">
            <div className="flex flex-col justify-between items-center gap-3 text-white mb-[30px] lg:mb-[105px] xl:flex-row lg:gap-14">
              <h2 className="font-[700] text-2xl lg:text-[64px] shrink-0">
                Онлайн бронирование
              </h2>
              <hr className="w-full" />
              {horror ? (
                <button
                  onClick={() => setIsOpenDialog(true)}
                  className="hidden gap-2 text-[12px] shrink-0 px-[9px] sm:text-[18px] py-[6px] sm:flex justify-center items-center bg-(--red) sm:py-4 sm:px-6 text-white rounded-lg cursor-pointer"
                >
                  <Image width={24} height={24} src={calendar} alt={"photo"} />
                  Оставить заявку на более позднюю дату
                </button>
              ) : (
                <div className="flex items-center gap-[13px]">
                  <Image
                    className="md:w-[45px] md:h-[45px]"
                    width={45}
                    height={45}
                    src={clock}
                    alt="скоро"
                  />
                  <span className="md:text-[45px]">Скоро</span>
                </div>
              )}
            </div>
          </div>
          <CustomSwiper
            className="h-[200px]"
            config={{
              slidesPerView: 5,
              spaceBetween: 11,
              breakpoints: {
                320: {
                  slidesPerView: 1,
                  spaceBetween: 8,
                },
                480: {
                  slidesPerView: 1,
                  spaceBetween: 10,
                },
                640: {
                  slidesPerView: 2,
                  spaceBetween: 12,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 14,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 16,
                },
                1280: {
                  slidesPerView: 5,
                  spaceBetween: 18,
                },
              },
              onSlideChange: (swiper) => {
                const index = swiper.realIndex;
                const currentQuest = activeHorrors[index];
                if (currentQuest) {
                  setSelectedQuest(currentQuest);
                }
              },
            }}
          >
            {activeHorrors.map((element, index) => (
              <div
                key={element.id}
                onClick={() => setSelectedQuest(element)}
                className={`text-white border-1 border-solid border-[#ffffff2e] min-h-[168px] mt-[15px] m-auto max-w-[calc(100%-4.5em)] sm:max-w-[290px] transition ease-in-out relative flex justify-end rounded-2xl cursor-pointer ${
                  selectedQuest?.id === element.id
                    ? "shadow-[0px_2.43px_12.13px_0px_#FFFFFF33] sm:scale-[1.08]"
                    : ""
                } ${selectedQuest && index === 0 ? "sm:ml-[20px]" : ""}`}
              >
                <Image
                  className="absolute w-full h-full rounded-2xl aspect-[16/9] object-cover"
                  quality={85}
                  fill
                  src={`${api}${element.photos_back_card[0]?.image}`}
                  alt={element.name}
                />
                <div className="flex items-center self-end max-h-[64px] p-[11px] text-[14px] w-full justify-between relative z-20 bg-[#46464633] backdrop-blur-[19.398px] rounded-2xl">
                  <span>{element.name}</span>
                  <RatingUI rating={element.rating} />
                </div>
              </div>
            ))}
          </CustomSwiper>
          <div className="flex items-center pt-[10px] my-[30px] gap-[29px] border-t-1 border-solid sm:border-0 text-white flex-wrap md:my-[102]">
            <span className="text-[12px] text-[#A4A6A8] md:text-[36px]">
              Стоимость игры от:
            </span>
            <ul className="flex items-center gap-[10px] md:gap-[29px]">
              {PRICE.map((element) => (
                <li
                  style={{ backgroundColor: element.color }}
                  className={`p-1 text-[12px] md:text-[26px] md:p-[11px] rounded-[8px]`}
                  key={element.id}
                >
                  {element.label}
                </li>
              ))}
            </ul>
            <p className="text-[10px] text-[#A4A6A8] md:text-[20px]">
              (Цена игры для одного участника. Точная стоимость – в форме
              бронирования)
            </p>
          </div>
          {selectedQuest && <ReservationTable quest={selectedQuest} />}
        </div>
      </section>
      {selectedQuest && (
        <ReservationModalLater
          dialogOpen={isOpenDialog}
          onClose={() => setIsOpenDialog(false)}
          questDetails={selectedQuest}
        />
      )}
    </>
  );
}
