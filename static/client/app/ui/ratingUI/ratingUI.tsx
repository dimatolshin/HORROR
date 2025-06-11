import star from "@/app/assets/svg/rating_star.svg";
import Image from "next/image";
import rating_bg from "@/app/assets/svg/rating_bg.svg";

interface IRatingUI {
  rating: number;
  className?: string;
  isHorror?: boolean;
}

export const RatingUI = ({ rating, className, isHorror }: IRatingUI) => {
  return (
    <div
      className={`${className} flex items-center w-[89px] bg-no-repeat bg-cover justify-center gap-2 pl-3`}
      style={{
        backgroundImage: `url(${rating_bg.src})`,
      }}
    >
      <Image width={20} height={20} src={star} alt="рейтинг" />
      <span className={`${isHorror ? "text-[14px]" : "text-xl"}`}>
        {rating}
      </span>
    </div>
  );
};
