"use client";

import useCustomMediaQuery from "@/app/hooks/useCustomMediaQuery";
import { CustomSwiper } from "@/app/ui/customSwiper/customSwiper";
import { ReviewUI } from "@/app/ui/reviewUI/reviewUI";

interface IReviewsPromise {
  id: number;
  datetime: string;
  name: string;
  text: string;
  rating: number;
}

interface IReviews {
  review: IReviewsPromise[];
}

export const ReviewList = ({ review }: IReviews) => {
  const mediaQuery = useCustomMediaQuery("(max-width: 768px)");

  const reviewsToRender = review.slice(0, 12);

  return (
    <>
      {mediaQuery ? (
        <CustomSwiper
          swiperSlide="m-auto min-h-[430px] items-center"
          config={{ slidesPerView: 1 }}
        >
          {reviewsToRender.map((element) => (
            <ReviewUI
              className="max-w-[calc(100%-5em)] m-auto min-h-[430px]"
              key={element.id}
              id={element.id}
              datetime={element.datetime}
              name={element.name}
              text={element.text}
              rating={element.rating}
            />
          ))}
        </CustomSwiper>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-[100px]">
          {reviewsToRender.map((element) => (
            <ReviewUI
              key={element.id}
              id={element.id}
              datetime={element.datetime}
              name={element.name}
              text={element.text}
              rating={element.rating}
            />
          ))}
        </div>
      )}
    </>
  );
};
