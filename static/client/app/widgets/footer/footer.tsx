import Link from "next/link";
import arrow from "@/app/assets/svg/footer_arrow.svg";
import Image from "next/image";

interface IPravila {
  id: string;
  path: string;
  label: string;
}

const PRAVILA: IPravila[] = [
  {
    id: "1",
    path: "/agreement",
    label: "Пользовательское соглашение",
  },
  {
    id: "2",
    path: "/policy",
    label: "Политика обработки пресональных данных",
  },
];

export const Footer = () => {
  return (
    <footer className="footer section--offset bg-[url(assets/webp/footer_bg.png)] bg-no-repeat bg-contain">
      <div className="container">
        <div className="text-white flex flex-col justify-between gap-[30px] relative items-center mb-[36px] sm:mb-[102] lg:px-[50px] 2xl:px-0 lg:flex-row">
          <div className="relative order-3 text-[14px] sm:order-1">
            <p className="text-center sm:text-left">
              ИП Жук Юрий Викторович <br /> УНП 592001333 <br /> Гродненская
              область, г. Ивье, ул. Социалистическая 55
            </p>
          </div>
          <div className="order-1 sm:order-2 relative lg:left-[50%] lg:translate-x-[-50%] lg:absolute">
            <Link
              className="flex flex-col items-center gap-2 border-1 rounded-2xl px-[31px] py-[16px]"
              href={"#hero"}
            >
              <Image src={arrow} alt="Наверх" />
              Наверх страницы
            </Link>
          </div>
          <div className="flex flex-col gap-1 text-[14px] underline relative order-2 sm:order-3 text-center sm:text-right">
            {PRAVILA.map((element) => (
              <Link key={element.id} href={element.path}>
                {element.label}
              </Link>
            ))}
          </div>
        </div>
        <div
          style={{ background: "var(--footer)" }}
          className="text-center rounded-3xl"
        >
          © Quest House 2025
        </div>
      </div>
    </footer>
  );
};
