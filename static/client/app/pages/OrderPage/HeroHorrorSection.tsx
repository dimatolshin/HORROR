import { api } from "@/app/api/api";
import { HorrorSwiper } from "@/app/components/horrorSwiper/horrorSwiper";
import { RatingUI } from "@/app/ui/ratingUI/ratingUI";
import clock from "@/app/assets/svg/clock_popular.svg";
import Image from "next/image";
import people from "@/app/assets/svg/people_popular.svg";
import { IHorrorsPromise } from "@/app/api/horrors/fetchHorrors";
import { HorrorReviews } from "@/app/components/horrorReviews/horrorReviews";
import { MoreQuestsServer } from "@/app/widgets/moreQuests/moreQuestServer";
import { IReviewsPromise } from "@/app/api/reviews/fetchReviews";

const getImageUrl = (photos: Array<{ image: string }>) => {
  const photo = photos.find((item) => item.image);
  return photo ? api + photo.image : "";
};

const separateLastSentence = (description: string) => {
  const sentences = description.split(".");
  const lastSentence = sentences.pop();
  const rest = sentences.join(".");

  return { rest, lastSentence };
};

interface HeroHorrorSectionProps {
  horror: IHorrorsPromise;
  reviews: IReviewsPromise[];
  allHorrors: IHorrorsPromise[];
}

export default async function HeroHorrorSection({
  horror,
  reviews,
  allHorrors,
}: HeroHorrorSectionProps) {
  const {
    photos,
    photos_back_card,
    photos_blur,
    complexity,
    count_players,
    location,
    genre,
    fear,
    travel_time,
    description,
    is_active,
    rating,
    name,
    novelty,
  } = horror;

  const blurImageUrl = getImageUrl(photos_blur);
  const backCardImageUrl = getImageUrl(photos_back_card);
  const { rest, lastSentence } = separateLastSentence(description);

  return (
    <>
      <section
        className="hero bg-no-repeat bg-top bg-contain sm:bg-center"
        style={{ background: `url(${blurImageUrl})` }}
      >
        <div className="container">
          <div className="pt-[80px] md:pt-[129px]">
            <div className="flex flex-col mb-[33px] gap-[40px] lg:flex-row">
              <div className="hidden xl:block max-w-[347px] w-full max-h-[497px] h-full bg-[#20393A]/70 backdrop-blur-[12px] border-[3px] border-[#FFFFFF47] border-solid rounded-[36px] overflow-y-auto p-[24px] hide-scrollbar shrink-0">
                <h2 className="mb-[24px] text-white text-2xl">Другие квесты</h2>
                <MoreQuestsServer
                  horrors={allHorrors}
                  currentHorrorId={horror.id}
                />
              </div>
              <div className="min-h-[450px] relative md:min-h-auto border-1 border-solid border-[#FFFFFF47] xl:max-h-[497px] w-full p-[14px] md:p-[40px] flex flex-col bg-no-repeat bg-cover bg-center text-white rounded-[24px] shadow-[0px_4px_20px_0px_#FFFFFF33]">
                <div className="absolute rounded-[28px] z-10 aspect-[16/9] top-0 left-0 bottom-0 right-0 w-full h-full">
                  <Image
                    priority
                    className="object-cover rounded-[28px]"
                    fill
                    placeholder="blur"
                    blurDataURL={backCardImageUrl}
                    quality={100}
                    src={backCardImageUrl}
                    alt={name}
                  />
                </div>
                <div className="flex items-center justify-between mb-auto z-20">
                  {novelty && (
                    <span
                      className="text-xs py-[4px] rounded-4xl px-[5px] lg:text-[24px] lg:py-[8x] lg:px-[12px]"
                      style={{ background: "var(--novelty)" }}
                    >
                      Новинка
                    </span>
                  )}
                  {is_active ? (
                    <RatingUI className="ml-auto" rating={rating} />
                  ) : (
                    <div className="ml-auto flex items-center gap-[7px]">
                      <Image width={24} height={24} src={clock} alt={"скоро"} />
                      <span className="text-[24px]">Скоро</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col z-20">
                  {is_active && (
                    <ul className="flex items-center gap-[8px] md:gap-[12px]">
                      <li className="bg-[#FFFFFF33] items-center flex px-[8px] py-[6px] gap-[8px] md:px-[14px] md:py-[7px] rounded-[67px]">
                        <Image width={14} height={14} src={clock} alt="clock" />
                        <span className="text-[12px] md:text-[20px]">
                          {travel_time} мин
                        </span>
                      </li>
                      <li className="bg-[#FFFFFF33] items-center flex px-[8px] py-[6px] gap-[8px] md:px-[14px] md:py-[7px] rounded-[67px]">
                        <Image
                          className="w-[12] md:w-[14]"
                          width={14}
                          height={14}
                          src={people}
                          alt="people"
                        />
                        <span className="text-[12px] md:text-[20px]">
                          {count_players}
                        </span>
                      </li>
                      <li className="bg-[#FFFFFF33] items-center flex px-[8px] py-[6px] gap-[8px] md:px-[14px] md:py-[7px] rounded-[67px]">
                        <span className="text-[12px] md:text-[20px]">
                          {genre}
                        </span>
                      </li>
                    </ul>
                  )}
                  <h1 className="text-[24px] font-[500] md:text-[64px]">
                    {name}
                  </h1>
                  <span className="md:text-[24px] mb-[25px]">{location}</span>
                  <div className="flex flex-col items-start 2xl:items-end gap-[20px] 2xl:flex-row">
                    <p className="text-[10px] md:text-[16px] max-w-[703px]">
                      {rest} <br /> <br />
                      <span>{lastSentence}</span>
                    </p>
                    {is_active && (
                      <ul className="flex items-center 2xl:mr-auto gap-[13px] mr-auto 2xl:ml-auto">
                        <li className="bg-[#FFFFFF33] rounded-[67px] text-[12px] px-[14px] py-[7px] md:text-[20px]">
                          <span className="text-[#03B9BB]">{fear}</span> Уровень
                          страха
                        </li>
                        <li className="bg-[#FFFFFF33] rounded-[67px] text-[12px] px-[14px] py-[7px] md:text-[20px]">
                          <span className="text-[#03B9BB]">{complexity}</span>{" "}
                          Сложность
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {is_active && (
              <>
                <div className="flex md:max-h-[376px] gap-[40px]">
                  <HorrorReviews review={reviews} rating={rating} />
                  <HorrorSwiper photos={photos} />
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
