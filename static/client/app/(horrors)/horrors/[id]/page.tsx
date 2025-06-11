import { api } from "@/app/api/api";
import { fetchOneHorror } from "@/app/api/horrors/fetchHorrors";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

const HeroHorrorSection = dynamic(
  () => import("@/app/pages/OrderPage/HeroHorrorSection")
);
const Awards = dynamic(() => import("@/app/widgets/awards/awards"));
const RulesSection = dynamic(
  () => import("@/app/pages/OrderPage/RulesSection")
);
const ReservationHorrorSection = dynamic(
  () => import("@/app/pages/OrderPage/ReservationHorrorSection")
);
const ReviewsSection = dynamic(
  () => import("@/app/pages/HomePage/ReviewsSection")
);
const Contacts = dynamic(() => import("@/app/widgets/contacts/contacts"));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const horrors = await fetchOneHorror(id);

  return {
    title: `Quest House - ${horrors.name}`,
    description: horrors.description,
    keywords: "квест, ужас, приключение, Quest House",
    openGraph: {
      title: `Quest House - ${horrors.name}`,
      description: horrors.description,
      url: `${api}/horrors/${id}`,
      type: "article",
    },
  };
}

export default async function HorrorsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const horrors = await fetchOneHorror(id);

  return (
    <>
      <main className="main">
        <HeroHorrorSection
          complexity={horrors.complexity}
          count_players={horrors.count_players}
          description={horrors.description}
          fear={horrors.fear}
          genre={horrors.genre}
          id={horrors.id}
          is_active={horrors.is_active}
          location={horrors.location}
          name={horrors.name}
          novelty={horrors.novelty}
          photos={horrors.photos}
          photos_back_card={horrors.photos_back_card}
          photos_blur={horrors.photos_blur}
          rating={horrors.rating}
          registration_date={horrors.registration_date}
          travel_time={horrors.travel_time}
        />
        <Awards id={horrors.id} />
        <RulesSection />
        <ReservationHorrorSection horror={horrors} />
        <div className="block md:hidden">
          <ReviewsSection />
        </div>
        <Contacts location={horrors.location} />
      </main>
    </>
  );
}
