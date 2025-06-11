"use client";

import { api } from "@/app/api/api";
import { fetchHorrors, IHorrorsPromise } from "@/app/api/horrors/fetchHorrors";
import { RatingUI } from "@/app/ui/ratingUI/ratingUI";
import Image from "next/image";
import Link from "next/link";
import clock from "@/app/assets/svg/clock_popular.svg";
import { useEffect, useState } from "react";

export const MoreQuests = () => {
  const [horrors, setHorrors] = useState<IHorrorsPromise[]>([]);

  useEffect(() => {
    const getHorrors = async () => {
      const data = await fetchHorrors();
      setHorrors(data);
    };

    getHorrors();
  }, []);

  return (
    <>
      <ul className="flex flex-col overflow-y-auto h-full text-white gap-y-[15px]">
        {horrors.map((element) => (
          <li key={element.id}>
            <Link
              style={{
                backgroundImage: `url(${api}${
                  element.photos_back_card.find((item) => {
                    return item.image;
                  })?.image
                })`,
              }}
              className="relative rounded-2xl min-h-[168px] flex items-end bg-no-repeat bg-size-[auto_100%] bg-center"
              href={`/horrors/${element.id}`}
            >
              <div className="flex items-center p-[11px] text-[14px] w-full justify-between relative z-20 bg-[#46464633] backdrop-blur-[19.398px] rounded-2xl">
                <span>{element.name}</span>
                {!element.is_active ? (
                  <div className="flex items-center gap-2">
                    <Image width={15} height={15} src={clock} alt="clock" />
                    <span>Скоро</span>
                  </div>
                ) : (
                  <RatingUI isHorror rating={element.rating} />
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};
