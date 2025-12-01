import { api } from "@/app/api/api";
import {
  fetchOneHorror,
  getHorrors,
  getOneHorror,
} from "@/app/api/horrors/fetchHorrors";
import fetchReviews from "@/app/api/reviews/fetchReviews";
import { ReviewList } from "@/app/components/reviewList/reviewList";
import HeroHorrorSection from "@/app/pages/OrderPage/HeroHorrorSection";
import RulesSection from "@/app/pages/OrderPage/RulesSection";
import Awards from "@/app/widgets/awards/awards";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

const ReservationHorrorSection = dynamic(
  () => import("@/app/pages/OrderPage/ReservationHorrorSection")
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

  const horrorPromise = getOneHorror(id);
  const allHorrorsPromise = getHorrors();
  const [currentHorror, horrors] = await Promise.all([
    horrorPromise,
    allHorrorsPromise,
  ]);

  const reviewsPromise = fetchReviews(Number(currentHorror.id_extrareality), currentHorror.name);
  const [reviews] = await Promise.all([
    reviewsPromise,
  ]);

  return (
    <>
      <main className="main">
        <HeroHorrorSection
          allHorrors={horrors}
          reviews={reviews}
          horror={currentHorror}
        />
        <Awards id={currentHorror.id} horrorName={currentHorror.name} />
        <RulesSection horror={currentHorror} />
        <ReservationHorrorSection horror={currentHorror} />
        <div className="block md:hidden mt-12">
          <ReviewList review={reviews} />
        </div>
        <Contacts />
      </main>
    </>
  );
}
