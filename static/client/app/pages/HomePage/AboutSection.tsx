import { AboutList } from "@/app/components/aboutList/aboutList";
import Image from "next/image";
import hands from "@/app/assets/webp/hands_bg.png";

export default function AboutSection() {
  return (
    <section className="about relative">
      <Image
        className="block sticky bottom-11 mx-auto"
        src={hands}
        alt="поскорее запишись на квест"
      />
      <div className="bg-(--red) pb-[36px] sm:pb-[100px]">
        <div className="container">
          <div className="about__block">
            <h2 className="text-white text-[24px] lg:text-[64px] font-[700] text-center mb-[80px]">
              Как посетить нас:
            </h2>
            <AboutList />
            <p className="text-center text-[18px] text-white mt-[30px] lg:text-[48px] lg:mt-[80px] font-[700]">
              Не забудь заказать видео своей игры!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
