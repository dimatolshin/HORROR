import { ReviewList } from "@/app/components/reviewList/reviewList";
import { TitleBlockUI } from "@/app/ui/titleBlockUI/titleBlockUI";
import fetchReviews from "@/app/api/reviews/fetchReviews";

export default async function ReviewsSection() {
  const review = await fetchReviews();

  return (
    <section id="reviews" className="reviews section--offset">
      <div className="container">
        <div className="reviews__block">
          <TitleBlockUI
            title="Отзывы"
            label="Перейти к квестам"
            href="horrors/1"
          />
          <ReviewList review={review} />
        </div>
      </div>
    </section>
  );
}
