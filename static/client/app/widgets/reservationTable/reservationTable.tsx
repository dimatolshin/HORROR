"use client";

import { IHorrorsPromise } from "@/app/api/horrors/fetchHorrors";
import { fetchSlots } from "@/app/api/slots/fetchSlots";
import { ReservationModal } from "@/app/components/reservationModal/reservationModal";
import Image from "next/image";
import React, { useState } from "react";
import arrow from "@/app/assets/svg/reserv_svg.svg";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/app/api/queryClient";
import calendar from "@/app/assets/svg/calendar_reservation.svg";
import { ReservationModalLater } from "@/app/components/reservationModalLater/reservationModalLater";

interface ReservationProps {
  quest: IHorrorsPromise;
}

const parseDateString = (str: string) => {
  const [day, month, weekday] = str.trim().split(" ");
  return {
    date: `${day} ${month}`,
    weekday,
  };
};

export const ReservationTable = ({ quest }: ReservationProps) => {
  const [showAll, setShowAll] = useState<number>(7);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isDialogOpenLater, setIsDialogOpenLater] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    time: string;
    price: number;
    slot: number;
    date_front: string;
  } | null>(null);

  const { data: slots } = useQuery(
    {
      queryFn: () => fetchSlots(quest.id.toString()),
      queryKey: ["slots", quest.id],
    },
    queryClient
  );

  return (
    <>
      <div className="table w-full pt-[30px] sm:pt-0">
        <div className="grid grid-cols-1 text-white gap-y-[22px]">
          {slots &&
            slots.slice(0, showAll).map((element) => (
              <div
                key={element.date}
                className="flex flex-col sm:flex-row gap-[31px]"
              >
                <span className="sm:max-w-[277px] w-full md:shrink-0 border-t-1 border-solid md:text-[31px] pl-[18px] md:min-h-[65px]">
                  {parseDateString(element.date).date}{" "}
                  {parseDateString(element.date).weekday}
                </span>
                <div className="flex flex-wrap items-center gap-[7px]">
                  {element.slots.map((item, index) => {
                    let bgColor = "";

                    switch (item.price) {
                      case 110:
                        bgColor = "bg-[#11B3D1]";
                        break;
                      case 120:
                        bgColor = "bg-[#0A8284]";
                        break;
                      case 140:
                        bgColor = "bg-(--red)";
                        break;
                      default:
                        bgColor = "bg-[#393939]";
                    }

                    return (
                      <button
                        disabled={item.is_booked}
                        key={item.time}
                        onClick={() => {
                          setSelectedSlot({
                            time: item.time,
                            price: item.price,
                            slot: item.id,
                            date_front: element.date_front,
                          });
                          setIsDialogOpen(true);
                        }}
                        className={`${bgColor} p-2 text-white rounded cursor-pointer md:text-[31px] ${
                          item.is_booked &&
                          "bg-[#393939!important] text-[#5A5A5A!important]"
                        }`}
                      >
                        {item.time}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
        {showAll < 21 ? (
          <div className="flex items-end bg-[url(assets/webp/btn_big.png)] bg-no-repeat bg-center bg-size-[90%_90%] min-h-[60px] sm:bg-size-[98%_90%] sm:min-h-[98px]">
            <button
              onClick={() => setShowAll(showAll + 7)}
              className="mx-auto px-[9px] text-[12px] py-[6px] cursor-pointer flex gap-[8px] justify-center items-center bg-(--red) sm:py-4 sm:px-6 sm:text-[18px] text-white rounded-sm sm:rounded-lg"
            >
              <span>Показать больше дней</span>
              <Image
                className="sm:w-[10px] sm:h-[7px]"
                src={arrow}
                alt="стрелка"
              />
            </button>
          </div>
        ) : (
          <div className="flex items-end bg-[url(assets/webp/btn_big.png)] bg-no-repeat bg-center bg-size-[90%_90%] min-h-[60px] sm:bg-size-[98%_90%] sm:min-h-[98px]">
            <button
              onClick={() => setIsDialogOpenLater(true)}
              className="mx-auto px-[9px] text-[12px] py-[6px] cursor-pointer flex gap-[8px] justify-center items-center bg-(--red) sm:py-4 sm:px-6 sm:text-[18px] text-white rounded-sm sm:rounded-lg"
            >
              <Image
                className="w-[15px] h-[15px] sm:w-auto sm:h-auto"
                src={calendar}
                alt="календарь"
              />
              <span>Оставить заявку на более позднюю дату</span>
            </button>
          </div>
        )}
      </div>
      <ReservationModal
        onClose={() => setIsDialogOpen(false)}
        questDetails={{
          ...quest,
          price: selectedSlot ? selectedSlot.price : 0,
          time: selectedSlot ? selectedSlot?.time : "110",
          slot: selectedSlot ? selectedSlot?.slot : 0,
          date_front: selectedSlot ? selectedSlot.date_front : "",
        }}
        dialogOpen={isDialogOpen}
      />
      <ReservationModalLater
        onClose={() => setIsDialogOpenLater(false)}
        questDetails={{ ...quest }}
        dialogOpen={isDialogOpenLater}
      />
    </>
  );
};
