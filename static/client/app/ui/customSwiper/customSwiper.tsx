"use client";

import { Children, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import nextArrow from "@/app/assets/svg/swiper_next.svg";
import nextWhite from "@/app/assets/svg/swiper_next_white.svg";
import type { SwiperProps } from "swiper/react";
import pc_arrow from "@/app/assets/svg/swiper_pc_arrow.svg";
import type { Swiper as SwiperType } from "swiper";

interface ICustomSwiper {
  children: React.ReactNode;
  config?: SwiperProps;
  swiperSlide?: string;
  isAbout?: boolean;
  isQuest?: boolean;
  className?: string;
}

export const CustomSwiper = ({
  children,
  config,
  swiperSlide,
  isAbout,
  isQuest,
  className,
}: ICustomSwiper) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const [swiperState, setSwiperState] = useState({
    isBeginning: true,
    isEnd: false,
  });

  const handleSwiper = (swiper: SwiperType) => {
    swiperRef.current = swiper;
    setSwiperState({
      isBeginning: swiper.isBeginning,
      isEnd: swiper.isEnd,
    });
  };

  useEffect(() => {
    const swiper = swiperRef.current;

    if (
      swiper &&
      prevRef.current &&
      nextRef.current &&
      !swiper.destroyed &&
      swiper.params.navigation &&
      swiper.navigation
    ) {
      const navigationParams = swiper.params.navigation;

      if (typeof navigationParams === "object") {
        navigationParams.prevEl = prevRef.current;
        navigationParams.nextEl = nextRef.current;
        swiper.navigation.init();
        swiper.navigation.update();
      }
    }
  }, []);

  const arrowIcon = isAbout ? nextWhite : isQuest ? pc_arrow : nextArrow;

  return (
    <div className="relative w-full">
      <Swiper
        modules={[A11y, Navigation]}
        {...config}
        onSwiper={handleSwiper}
        onSlideChange={(swiper) => {
          handleSwiper(swiper);
          config?.onSlideChange?.(swiper);
        }}
        className={`swiper w-full ${className}`}
      >
        {Children.map(children, (child, index) => (
          <SwiperSlide className={swiperSlide} key={index}>
            {child}
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        className={`absolute z-20 pointer-events-none w-full ${
          isQuest
            ? "top-[-65px] right-4 justify-end gap-[34px] hidden xl:flex"
            : "top-1/2 -translate-y-1/2 justify-between px-1 flex xl:hidden"
        }`}
      >
        <button
          ref={prevRef}
          className={`pointer-events-auto rotate-180 cursor-pointer ${
            swiperState.isBeginning ? "opacity-50 cursor-not-allowed" : ""
          } ${isQuest ? "w-[12.5px] h-[18px]" : "w-[25px] h-[20px]"}`}
          aria-label="Назад"
        >
          <Image src={arrowIcon} alt="Назад" width={25} height={25} />
        </button>
        <button
          ref={nextRef}
          className={`pointer-events-auto cursor-pointer ${
            swiperState.isEnd ? "opacity-50 cursor-not-allowed" : ""
          } ${isQuest ? "w-[12.5px] h-[18px]" : "w-[25px] h-[20px]"}`}
          aria-label="Вперёд"
        >
          <Image src={arrowIcon} alt="Вперёд" width={25} height={25} />
        </button>
      </div>
    </div>
  );
};
