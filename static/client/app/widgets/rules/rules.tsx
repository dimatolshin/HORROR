interface IRulesProps {
  title: string;
  children: React.ReactNode;
}

export const Rules: React.FC<IRulesProps> = ({ title, children }) => {
  return (
    <section className={"pt-[96px] sm:pt-[100px] text-white"}>
      <div className="container">
        <p className={"mb-[58px] text-left text-[20px]"}>
          Утверждено 12.03.2025 <br /> г. Индивидуальным предпринимателем <br />
          Жуком Юрием Викторовичем
        </p>
        <h1
          className={
            "mb-[30px] text-[24px] sm:mb-[58px] sm:text-[64px] sm:text-center"
          }
        >
          {title}
        </h1>
        <div className={"flex flex-col gap-[30px]"}>{children}</div>
      </div>
    </section>
  );
};
