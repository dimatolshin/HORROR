import { HeroList } from "@/app/components/heroList/heroList";
import { HeroVideo } from "@/app/components/heroVideo/heroVideo";

const HeroSection = () => {
  return (
    <section className="hero" id="hero">
      <HeroVideo />
      <div className="container">
        <div className="flex flex-col min-h-screen relative z-20">
          <div className="mb-[121px] pt-[80px] md:pt-[181px] md:mb-auto">
            <h1
              style={{ fontFamily: "var(--font-poppins)" }}
              className="max-w-max text-[53px] leading-none capitalize bg-gradient-to-r from-[#000000] to-[#a40000] bg-clip-text text-transparent font-[800] md:text-[160px]"
            >
              Quest <br /> House
            </h1>
          </div>
          <HeroList />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
