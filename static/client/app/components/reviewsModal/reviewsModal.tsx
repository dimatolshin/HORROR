"use client";

import Dialog from "@/app/ui/dialogUI/dialogUI";
import { ReviewUI } from "@/app/ui/reviewUI/reviewUI";
import { useEffect, useState } from "react";
import fetchReviews, { IReviewsPromise } from "@/app/api/reviews/fetchReviews";

interface IModal {
  dialogOpen: boolean;
  onClose: () => void;
  review?: IReviewsPromise[];
}

export const ReviewsModal = ({ dialogOpen, onClose, review }: IModal) => {
  const [reviews, setReviews] = useState<IReviewsPromise[]>([]);

  useEffect(() => {
    const loadReviews = async () => {
        const data = await fetchReviews();
        setReviews(data);
    };

    if (!review) {
      loadReviews();
    }
  }, [review]);

  const reviewsToShow = review || reviews;

  return (
    <Dialog
      classNameBTN="sticky"
      classNameContent="h-[auto!important]"
      isOpen={dialogOpen}
      onClose={onClose}
    >
      <div className="px-[53px] py-[56px] md:px-[120px] overflow-y-auto gap-[20px] grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {reviewsToShow.map((element) => (
          <ReviewUI
            key={element.id}
            id={element.id}
            datetime={element.datetime}
            name={element.name}
            text={element.text}
            rating={element.rating}
            nameQuest={element.nameQuest}
          />
        ))}
      </div>
    </Dialog>
  );
};
