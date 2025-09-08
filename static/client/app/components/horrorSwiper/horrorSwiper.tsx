"use client";

import { useState } from "react";
import { api } from "@/app/api/api";
import { IHorrorsPromise } from "@/app/api/horrors/fetchHorrors";
import useCustomMediaQuery from "@/app/hooks/useCustomMediaQuery";
import { CustomSwiper } from "@/app/ui/customSwiper/customSwiper";
import Image from "next/image";
import { Lightbox } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

type HorrorSwiperProps = Pick<IHorrorsPromise, "photos">;

export const HorrorSwiper = ({ photos }: HorrorSwiperProps) => {
  const isMobile = useCustomMediaQuery("(max-width: 576px)");

  const [index, setIndex] = useState<number | null>(null);

  const slides = photos.map((photo) => ({
    src: `${api}${photo.image}`,
  }));

  return (
    <div className="flex flex-col max-w-full overflow-x-hidden w-full">
      <h2 className="border-b-1 mb-[30px] text-center md:text-left border-solid pb-[12px] md:mb-[38px] md:p-0 md:border-none md:text-[24px] text-white font-[700] text-2xl">
        Фотографии
      </h2>
      <CustomSwiper
        isQuest={!isMobile}
        config={{
          spaceBetween: 20,
          slidesPerView: 1,
          breakpoints: {
            768: {
              slidesPerView: 2,
              spaceBetween: 20,
            },

            1024: {
              slidesPerView: 3,
              spaceBetween: 20,
            },

            1280: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
          },
        }}
      >
        {photos.map((element, idx) => (
          <div
            key={idx}
            className="relative aspect-[3/1] md:aspect-[4/5] mx-auto min-h-[400px] md:min-h-[300px] max-w-[calc(100%-5em)] md:max-w-max rounded-[27px] cursor-pointer overflow-hidden"
            onClick={() => setIndex(idx)}
          >
            <Image
              blurDataURL={`${api}${element.image}`}
              placeholder="blur"
              src={`${api}${element.image}`}
              alt={element.image}
              fill
              className="object-cover rounded-[27px]"
              quality={85}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ))}
      </CustomSwiper>

      <Lightbox
        open={index !== null}
        close={() => setIndex(null)}
        slides={slides}
        index={index ?? 0}
      />
    </div>
  );
};
