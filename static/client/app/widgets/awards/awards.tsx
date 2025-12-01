import { TitleBlockUI } from "@/app/ui/titleBlockUI/titleBlockUI";
import { AWARDS } from "./awards.data";
import Image from "next/image";

interface IAwardsProps {
  id?: number;
  horrorName?: string;
}

const Awards = ({ horrorName }: IAwardsProps) => {
  const quest = AWARDS.find((element) => {
    if (horrorName && element.name) {
      const normalizedQuestName = element.name.toLowerCase();
      const normalizedHorrorName = horrorName.toLowerCase();

      return normalizedHorrorName.includes(normalizedQuestName);
    }

    return false;
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
