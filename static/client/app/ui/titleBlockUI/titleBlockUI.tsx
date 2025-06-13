import Image, { StaticImageData } from "next/image";
import { LinkUI } from "../linkUI/linkUI";

interface ITitleBlock {
  href?: string;
  title: string;
  label?: string;
  icon?: StaticImageData;
  isPopular?: boolean;
}

export const TitleBlockUI = ({
  href,
  isPopular,
  title,
  label,
  icon,
}: ITitleBlock) => {
  return (
    <div className="flex flex-col justify-between items-center gap-3 text-white mb-[30px] lg:mb-[105px] lg:flex-row lg:gap-14">
      <h2 className="font-[700] text-2xl lg:text-[64px] shrink-0">{title}</h2>
      <hr className="w-full" />
      {href && (
        <LinkUI
          className={`gap-2 shrink-0 ${isPopular && "hidden sm:block"}`}
          href={href}
        >
          {icon && <Image width={24} height={24} src={icon} alt={"иконка"} />}
          {label}
        </LinkUI>
      )}
    </div>
  );
};
