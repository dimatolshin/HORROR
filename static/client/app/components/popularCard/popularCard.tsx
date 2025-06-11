import { api } from "@/app/api/api";
import { RatingUI } from "@/app/ui/ratingUI/ratingUI";
import Image from "next/image";
import Link from "next/link";
import question from "@/app/assets/svg/question.svg";
import clock from "@/app/assets/svg/clock_popular.svg";
import { IHorrorsPromise } from "@/app/api/horrors/fetchHorrors";
import people from "@/app/assets/svg/people_popular.svg";

export const PopularCard = ({
  id,
  novelty,
  rating,
  name,
  location,
  photos_back_card,
  is_active,
  fear,
  complexity,
  travel_time,
  genre,
  count_players,
}: IHorrorsPromise) => {
  return (
    <Link
      style={{ backgroundImage: `url(${api}${photos_back_card[0].image})` }}
      href={`horrors/${id}`}
      className="flex relative flex-col bg-center bg-cover bg-no-repeat text-white min-h-[400px] border-1 border-[#FFFFFF47] rounded-2xl p-3.5"
    >
      <div className="mb-auto flex items-center justify-between">
        {novelty && (
          <span
            style={{ background: "var(--novelty)" }}
            className="text-xs py-[4px] rounded-4xl px-[5px]"
          >
            Новинка
          </span>
        )}
        {is_active ? (
          <RatingUI rating={rating} />
        ) : (
          <div className="ml-auto flex items-center gap-2">
            <Image width={16} height={16} src={clock} alt="скоро анонс" />
            <span>Скоро</span>
          </div>
        )}
      </div>
      {!is_active && (
        <div className="flex flex-col items-center gap-4 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <Image width={70} height={70} src={question} alt="Скоро анонс" />
          <span className="text-[20px]">Скоро анонс</span>
        </div>
      )}
      <div className="flex flex-col gap-[5px] mb-[14px]">
        <strong className="text-[18px] mb-2.5 md:text-[30px]">{name}</strong>
        <span className="text-[12px] md:text-[14px]">{location}</span>
      </div>
      {is_active && (
        <div className="flex items-center">
          <ul className="text-[9px] mb:text-[12px] flex gap-1">
            <li className="flex items-center px-1 gap-1 p-0.5 md:px-2 bg-[#FFFFFF33] rounded-2xl">
              <Image width={10} height={10} src={clock} alt="время квеста" />
              <span>{travel_time} мин</span>
            </li>
            <li className="flex items-center px-1 gap-1 p-0.5 md:px-2 bg-[#FFFFFF33] rounded-2xl">
              <Image
                width={10}
                height={10}
                src={people}
                alt="количество игроков"
              />
              <span>{count_players}</span>
            </li>
            <li className="flex items-center px-1 gap-1 p-0.5 md:px-2 bg-[#FFFFFF33] rounded-2xl">
              <span>{genre}</span>
            </li>
          </ul>

          <div className="flex items-center ml-auto gap-1 md:gap-2 text-[9px] mb:text-[12px] mb:gap-3.5">
            <p className="flex items-center gap-1">
              <span className="text-[#03B9BB]">{fear}</span> Уровень страха
            </p>
            <p className="flex items-center gap-1">
              <span className="text-[#03B9BB]">{complexity}</span> Сложность
            </p>
          </div>
        </div>
      )}
    </Link>
  );
};
