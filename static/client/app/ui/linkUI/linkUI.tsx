import classNames from "classnames";
import Link from "next/link";

interface ILinkUI extends React.HTMLAttributes<HTMLLinkElement> {
  href: string;
  className?: string;
}

export const LinkUI: React.FC<ILinkUI> = ({ href, children, className }) => {
  return (
    <Link
      className={classNames(
        className,
        "px-[9px] text-[12px] py-[6px] flex justify-center items-center bg-(--red) sm:py-4 sm:px-6 sm:text-[18px] text-white rounded-lg"
      )}
      href={href}
    >
      {children}
    </Link>
  );
};
