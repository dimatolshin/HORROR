import { Rules } from "@/app/widgets/rules/rules";
import React from "react";
import { AGREEMENT } from "./agreement-data";

const AgreementPage = () => {
  return (
    <main className="pb-[32px] md:pb-[100px]">
      <Rules title="Пользовательское соглашение">
        <div className={"text-white text-[20px] flex flex-col gap-[30px]"}>
          <p>
            Индивидуальный предприниматель Жук Юрий Викторович (далее – ИП Жук)
            предлагает физическим лицам (далее – Пользователям) использовать
            сайт quest-house.by на условиях настоящего Соглашения.
          </p>
          <p>
            Настоящее Соглашение является публичной офертой. С момента начала
            использования сайта quest-house.by, Пользователь считается
            ознакомленным и согласным с условиями <br /> Соглашения и вступившим
            в договорные отношения с ИП Жук. Пользователь подтверждает понимание
            всех терминов и выражений, используемых в <br /> Соглашении и на
            сайте, в соответствии с их законодательным определением. <br />{" "}
            Настоящее соглашение состоит из “Пользовательского соглашения” и
            “Политики обработки персональных данных” <br /> Настоящее Соглашение
            не требует подписания и имеет юридическую силу в электронном виде.
          </p>
          {AGREEMENT.map((element) => (
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

export default AgreementPage;
