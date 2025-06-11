import dynamic from "next/dynamic";
import { fetchHorrors } from "../api/horrors/fetchHorrors";
import HeroSection from "../pages/HomePage/HeroSection";
import fetchReviews from "../api/reviews/fetchReviews";
import PopularSection from "../pages/HomePage/PopularSection";
import AboutSection from "../pages/HomePage/AboutSection";
import ReviewsSection from "../pages/HomePage/ReviewsSection";

const ReservationSection = dynamic(
  () => import("../pages/HomePage/ReservationSection")
);

const Contacts = dynamic(() => import("../widgets/contacts/contacts"));

export default async function HomePage() {
  const horrorsPromise = fetchHorrors();
  const reviewsPromise = fetchReviews();

  const [horrors, reviews] = await Promise.all([
    horrorsPromise,
    reviewsPromise,
  ]);

  return (
    <main className="main">
      <HeroSection />
      <PopularSection horror={horrors} />
      <AboutSection />
      <ReservationSection horror={horrors} />
      <ReviewsSection reviews={reviews} />
      <Contacts />
    </main>
  );
}
