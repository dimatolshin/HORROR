import { api } from "@/app/api/api";
import { IHorrorsPromise } from "@/app/api/horrors/fetchHorrors";
import { RatingUI } from "@/app/ui/ratingUI/ratingUI";
import Image from "next/image";
import Link from "next/link";
import clock from "@/app/assets/svg/clock_popular.svg";

interface MoreQuestsUIProps {
  horrors: IHorrorsPromise[];
  currentHorrorId?: number;
}

const getImageUrl = (photos: Array<{ image: string }>) => {
  const photo = photos.find((item) => item.image);
  return photo ? `${api}${photo.image}` : "";
};

export const MoreQuestsServer = ({
  horrors,
  currentHorrorId,
}: MoreQuestsUIProps) => {
  const questsToShow = currentHorrorId
    ? horrors.filter((h) => h.id !== currentHorrorId)
    : horrors;

  return (
    <ul className="flex flex-col min-h-[450px] overflow-y-auto h-full text-white gap-y-[15px]">
      {questsToShow.map((element) => (
        <li key={element.id}>
          <Link
            style={{
              backgroundImage: `url(${getImageUrl(element.photos_back_card)})`,
            }}
            className="relative rounded-2xl min-h-[168px] flex items-end bg-no-repeat bg-size-[auto_100%] bg-center"
            href={`/horrors/${element.id}`}
          >
            <div className="flex items-center p-[11px] text-[14px] w-full justify-between relative z-20 bg-[#46464633] backdrop-blur-[19.398px] rounded-2xl">
              <span>{element.name}</span>
              {!element.is_active ? (
                <div className="flex items-center gap-2">
                  <Image width={15} height={15} src={clock} alt="clock" />
                  <span>Скоро</span>
                </div>
              ) : (
                <RatingUI isHorror rating={element.rating} />
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};
