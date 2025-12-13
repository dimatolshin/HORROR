import { TitleBlockUI } from "@/app/ui/titleBlockUI/titleBlockUI";
import {IHorrorsPromise} from "@/app/api/horrors/fetchHorrors";
import parse from "html-react-parser";

interface IRulesProps {
  horror: IHorrorsPromise;
}

export default function RulesSection({horror}: IRulesProps) {
  return (
    <section className="rules section--offset">
      <div className="container">
        <div className="rules__block">
          <TitleBlockUI title="Правила посещения" />
          <div className="text-[#A4A6A8] flex flex-col text-[12px] gap-[8px] md:text-[36px] md:gap-[15px] whitespace-pre-wrap">
            {parse(`${horror.rules|| ''}`)}
          </div>
        </div>
      </div>
    </section>
  );
}
