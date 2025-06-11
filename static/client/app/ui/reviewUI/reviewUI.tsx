"use client";

import Image from "next/image";
import { useState } from "react";
import starIcon from "@/app/assets/svg/star_review.svg";
import reviewQuote from "@/app/assets/svg/review_quote.svg";
import avatar from "@/app/assets/webp/review_avatar.png";
import { IReviewsPromise } from "@/app/api/reviews/fetchReviews";

interface IReview extends IReviewsPromise {
  className?: string;
}

const getFullYear = (date: string): string => {
  const customDate = new Date(date);
  const day = customDate.getDay() + 1;
  const month = customDate.getMonth() + 1;
  const year = customDate.getFullYear();

  return `${day}.${month}.${year}`;
};

export const ReviewUI = ({
  id,
  name,
  text,
  datetime,
  rating,
  className,
}: IReview) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(
        <Image key={i} src={starIcon} alt="star" width={20} height={20} />
      );
    }
    return stars;
  };

  return (
    <div
      className={`${className} text-white flex flex-col bg-[#82D7DB69] rounded-[31px] py-[16px] px-[20px] border-3 border-[#FFFFFF47]`}
      key={id}
    >
      <div className={"flex items-center gap-2.5 mb-[18px]"}>
        <Image width={35} height={35} src={avatar} alt="avatar" />
        <div className={"flex flex-col gap-1"}>
          <span className={"text-[14px]"}>{name}</span>
          <span className={"text-[#C7C7C7] text-[12px]"}>
            {getFullYear(datetime)}
          </span>
        </div>
      </div>
      <div className={"flex flex-col text-[16px] pl-[10px] mb-[7px]"}>
        <span className={"text-white"}>Перфоманс</span>
        <h3 className={"text-[#11B3D1]"}>Квест</h3>
      </div>
      <Image style={{ marginBottom: "8px" }} src={reviewQuote} alt="отзыв" />
      <div className="mb-auto">
        <blockquote className="mb-[17px] text-sm">
          {isExpanded || text.length <= 307 ? text : `${text.slice(0, 307)}...`}
        </blockquote>
        <div className="mb-5">
          {text.length > 307 && (
            <button
              className="text-[#11B3D1] border-b-1 border-dashed cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Скрыть отзыв" : "Читать отзыв полностью"}
            </button>
          )}
        </div>
      </div>
      <span className={"flex"}>{renderStars(rating)}</span>
    </div>
  );
};
