import dynamic from "next/dynamic";
import { getHorrors } from "../api/horrors/fetchHorrors";
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
  const horrorsPromise = getHorrors();
  const [horrors] = await Promise.all([
    horrorsPromise
  ]);
    console.log(horrors)
  return (
    <main className="main">
      <HeroSection />
      <PopularSection horror={horrors} />
      <AboutSection />
      <ReservationSection horror={horrors} />
      <ReviewsSection horror={horrors} />
      <Contacts />
    </main>
  );
}
