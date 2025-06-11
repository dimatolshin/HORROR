import React from "react";
import { Rules } from "@/app/widgets/rules/rules";
import { POLICY } from "./policy-data";

const PolicyPage = () => {
  return (
    <main className="pb-[32px] md:pb-[100px]">
      <Rules title="Политика обработки пресональных данных">
        <div className={"text-white text-[20px] flex flex-col gap-[30px]"}>
          <p>
            Настоящая Политика обработки персональных данных (далее — Политика)
            определяет принципы и порядок обработки персональных данных, а также
            меры обеспечения их безопасности. Политика применяется к
            персональным данным, которые ИП Жук Юрий Викторович (далее —
            Оператор) получает от пользователей веб-сайта www.quest-house.by в
            процессе его использования. Политика описывает, какие категории
            персональных данных собираются, с какими целями, на каком правовом
            основании и как долго хранятся эти данные. В Политике также изложены
            меры безопасности, принятые Оператором для защиты персональных
            данных, и права пользователей, связанные с их персональными данными.
          </p>
          {POLICY.map((element) => (
            <div key={element.id}>
              <h3 className={"pl-[5px] font-[400] text-[20px] uppercase"}>
                {element.title}
              </h3>
              {element.rules.map((item) => (
                <React.Fragment key={item.id}>
                  <p>
                    {item.id}. {item.title}
                  </p>
                  <ol className={"pl-[15px]"}>
                    {item.rulesInner?.map((itemInner, index) => (
                      <li key={index}>{itemInner}</li>
                    ))}
                  </ol>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </Rules>
    </main>
  );
};

export default PolicyPage;
