import { TitleBlockUI } from "@/app/ui/titleBlockUI/titleBlockUI";
import {IHorrorsPromise} from "@/app/api/horrors/fetchHorrors";

interface IRulesProps {
  horror: IHorrorsPromise;
}

export default function RulesSection({horror}: IRulesProps) {
  return (
    <section className="rules section--offset">
      <div className="container">
        <div className="rules__block">
          <TitleBlockUI title="Правила посещения" />
          <ul className="text-[#A4A6A8] flex flex-col text-[12px] gap-[8px] md:text-[36px] md:gap-[15px] whitespace-pre-wrap">
            {horror.rules}
          </ul>
        </div>
      </div>
    </section>
  );
}
