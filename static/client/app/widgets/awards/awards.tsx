import { TitleBlockUI } from "@/app/ui/titleBlockUI/titleBlockUI";
import { AWARDS } from "./awards.data";
import Image from "next/image";

interface IAwardsProps {
  id: number;
}

const Awards = ({ id }: IAwardsProps) => {
  const quest = AWARDS.find((element) => {
    if (element.id === id.toString()) {
      return element;
    }
  });

  if (!quest) {
    return null;
  }

  return (
    <section className="awards section--offset">
      <div className="container">
        <div className="awards__block">
          <TitleBlockUI title="Награды квеста" />
          <div className="flex flex-wrap justify-center gap-y-[30px] sm:justify-between">
            {quest?.awards.map((element, index) => (
              <div
                className="relative max-w-[323px] w-full min-h-[320px] aspect-[16/9]"
                key={index}
              >
                <Image
                  src={element.icon}
                  alt="награда"
                  fill
                  quality={100}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Awards;
