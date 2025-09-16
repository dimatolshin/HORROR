import { IReviewsPromise } from "@/app/api/reviews/fetchReviews";
import { ReviewList } from "@/app/components/reviewList/reviewList";
import { TitleBlockUI } from "@/app/ui/titleBlockUI/titleBlockUI";

interface ReviewsSectionProps {
  reviews: IReviewsPromise[];
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  return (
    <section id="reviews" className="reviews section--offset">
      <div className="container">
        <div className="reviews__block">
          <TitleBlockUI
            title="Отзывы"
            label="Перейти к квестам"
            href="horrors/4"
          />
          <ReviewList review={reviews} />
        </div>
      </div>
    </section>
  );
}
