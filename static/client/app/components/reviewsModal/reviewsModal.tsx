"use client";

import Dialog from "@/app/ui/dialogUI/dialogUI";
import { ReviewUI } from "@/app/ui/reviewUI/reviewUI";
import { RefObject, useEffect, useState } from "react";
import fetchReviews, { IReviewsPromise } from "@/app/api/reviews/fetchReviews";

interface IModal {
  dialogRef: RefObject<HTMLDialogElement | null>;
  onClose: () => void;
}

export const ReviewsModal = ({ dialogRef, onClose }: IModal) => {
  const [reviews, setReviews] = useState<IReviewsPromise[]>([]);

  useEffect(() => {
    const loadReviews = async () => {
      const data = await fetchReviews();
      setReviews(data);
    };

    loadReviews();
  }, []);

  return (
    <Dialog
      classNameBTN="sticky"
      classNameContent="h-[auto!important]"
      ref={dialogRef}
      onClose={onClose}
    >
      <div className="px-[53px] py-[56px] md:px-[120px] overflow-y-auto gap-[20px] grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {reviews.map((element) => (
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
    </Dialog>
  );
};
