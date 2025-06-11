import { TitleBlockUI } from "@/app/ui/titleBlockUI/titleBlockUI";

interface IRules {
  id: string;
  label: string;
}

const RULES: IRules[] = [
  {
    id: "1",
    label: "Возрастное ограничение 14+",
  },
  {
    id: "2",
    label:
      "В квест не допускаются лица, находящиеся в алкогольном и наркотическом опьянении, \n а так же под воздействием психотропных веществ.",
  },
  {
    id: "3",
    label:
      "Квест запрещен к прохождению лицам, страдающим сердечно-сосудистыми заболеваниями, а так же лицам, имеющим любые виды травм",
  },
  {
    id: "4",
    label:
      "Не рекомендуется к прохождению лицам, имеющим травму или болезнь глаз, так как \n в квесте присутствуют яркие вспышки стробоскопа",
  },
];

export default function RulesSection() {
  return (
    <section className="rules section--offset">
      <div className="container">
        <div className="rules__block">
          <TitleBlockUI title="Правила посещения" />
          <ul className="text-[#A4A6A8] flex flex-col text-[12px] gap-[8px] md:text-[36px] md:gap-[15px]">
            {RULES.map((element) => (
              <li className="whitespace-pre-line" key={element.id}>
                {element.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
