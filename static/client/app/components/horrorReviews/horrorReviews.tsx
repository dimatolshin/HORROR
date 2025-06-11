"use client";

import starIcon from "@/app/assets/svg/star_review.svg";
import Image from "next/image";
import { ReviewsModal } from "@/app/components/reviewsModal/reviewsModal";
import { IReviewsPromise } from "@/app/api/reviews/fetchReviews";
import { useState } from "react";

interface IReviews {
  review: IReviewsPromise[];
  rating: number;
}

const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 0; i < rating; i++) {
    stars.push(
      <Image key={i} src={starIcon} alt="star" width={20} height={20} />
    );
  }
  return stars;
};

export const HorrorReviews = ({ review, rating }: IReviews) => {
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);

  return (
    <>
      <div className="hidden max-w-[347px] w-full max-h-[376px] lg:block bg-[#20393A]/70 backdrop-blur-[12px] border-[3px] border-[#FFFFFF47] border-solid rounded-[36px] overflow-y-auto p-[24px] hide-scrollbar shrink-0">
        <h2 className="mb-[24px] text-white text-2xl">Отзывы</h2>
        <ul className="flex flex-col gap-[24px] text-[13px]">
          {review.slice(0, 3).map((item) => (
            <li className="text-white" key={item.id}>
              <span className="flex items-center mb-[15px]">
                {renderStars(rating)}
              </span>
              <p>{item.text}</p>
            </li>
          ))}
          <li>
            <button
              onClick={() => setIsOpenDialog(true)}
              className="text-[#11B3D1] cursor-pointer border-b-1 border-dashed text-sm"
            >
              Читать все отзывы
            </button>
          </li>
        </ul>
      </div>
      <ReviewsModal
        dialogOpen={isOpenDialog}
        onClose={() => setIsOpenDialog(false)}
      />
    </>
  );
};
