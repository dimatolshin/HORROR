import dynamic from "next/dynamic";
import { fetchHorrors } from "../api/horrors/fetchHorrors";
import HeroSection from "../pages/HomePage/HeroSection";

const PopularSection = dynamic(
  () => import("../pages/HomePage/PopularSection")
);
const AboutSection = dynamic(() => import("../pages/HomePage/AboutSection"));
const ReservationSection = dynamic(
  () => import("../pages/HomePage/ReservationSection")
);
const ReviewsSection = dynamic(
  () => import("../pages/HomePage/ReviewsSection")
);
const Contacts = dynamic(() => import("../widgets/contacts/contacts"));

export default async function HomePage() {
  const horrors = await fetchHorrors();

  return (
    <main className="main">
      <HeroSection />
      <PopularSection />
      <AboutSection />
      <ReservationSection horror={horrors} />
      <ReviewsSection />
      <Contacts />
    </main>
  );
}
