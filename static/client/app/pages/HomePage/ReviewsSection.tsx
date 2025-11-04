'use client';
import { useState, useEffect } from "react";
import { useQuest } from "@/app/context/QuestContext"; // Импортируем хук
import fetchReviews, { IReviewsPromise } from "@/app/api/reviews/fetchReviews";
import { ReviewList } from "@/app/components/reviewList/reviewList";
import { TitleBlockUI } from "@/app/ui/titleBlockUI/titleBlockUI";

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<IReviewsPromise[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedQuest } = useQuest(); // Получаем из глобального состояния

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);
      try {
        const data = await fetchReviews(
            selectedQuest?.id_extrareality,
            selectedQuest?.name
        );
        setReviews(data);
      } catch (error) {
        console.error(error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    if (selectedQuest) {
      loadReviews();
    } else {
      setLoading(false);
    }
  }, [selectedQuest?.id_extrareality]); // Перезагружаем при изменении квеста

  return (
      <section id="reviews" className="reviews section--offset">
        <div className="container">
          <div className="reviews__block">
            {/*<TitleBlockUI*/}
            {/*    title="Отзывы"*/}
            {/*    label="Перейти к квестам"*/}
            {/*    href={`horrors/${selectedQuest?.id}`}*/}
            {/*/>*/}
            {loading ? (
                <p>Загрузка...</p>
            ) : reviews && reviews.length > 0 ? (
                <ReviewList review={reviews} />
            ) : (
                <p className="reviews__empty">Отзывы не найдены</p>
            )}
          </div>
        </div>
      </section>
  );
}
