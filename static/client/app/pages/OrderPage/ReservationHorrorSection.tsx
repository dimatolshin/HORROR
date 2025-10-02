"use client";

import { IHorrorsPromise } from "@/app/api/horrors/fetchHorrors";
import calendar from "@/app/assets/svg/calendar_reservation.svg";
import { ReservationTable } from "@/app/widgets/reservationTable/reservationTable";
import Image from "next/image";
import clock from "@/app/assets/svg/clock_popular.svg";
import { ReservationModalLater } from "@/app/components/reservationModalLater/reservationModalLater";
import { useState } from "react";

interface IReservationHorror {
  horror: IHorrorsPromise;
}

interface IPrice {
  id: string;
  label: string;
  color: string;
}

const PRICE: IPrice[] = [
  {
    id: "1",
    label: "130 Br",
    color: "#11B3D1",
  },
  {
    id: "2",
    label: "140 Br",
    color: "#0A8284",
  },
  {
    id: "3",
    label: "150 Br",
    color: "#A40000",
  },
];

export default function ReservationHorrorSection({
  horror,
}: IReservationHorror) {
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);

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
              {horror.is_active ? (
                <button
                  onClick={() => setIsOpenDialog(true)}
                  className="gap-2 text-[12px] shrink-0 px-[9px] sm:text-[18px] py-[6px] flex justify-center items-center bg-(--red) sm:py-4 sm:px-6 text-white rounded-lg cursor-pointer"
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
            <div className="table"></div>
          </div>
          {horror.is_active && (
            <>
              <div className="flex items-center gap-[29px] text-white flex-wrap md:mb-[102]">
                <span className="text-[12px] text-[#A4A6A8] md:text-[36px]">
                  Стоимость игры:
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
              <ReservationTable quest={horror} />
            </>
          )}
        </div>
      </section>
      <ReservationModalLater
        dialogOpen={isOpenDialog}
        onClose={() => setIsOpenDialog(false)}
        questDetails={horror}
      />
    </>
  );
}
