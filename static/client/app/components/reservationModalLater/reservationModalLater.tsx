"use client";

import Dialog from "@/app/ui/dialogUI/dialogUI";
import { useState } from "react";
import { IHorrorsPromise } from "@/app/api/horrors/fetchHorrors";
import { FormField } from "@/app/ui/formField/formField";
import { Checkbox } from "@/app/ui/checkbox/checkbox";
import { MoreQuests } from "@/app/widgets/moreQuests/moreQuests";
import { fetchReserv } from "@/app/api/reserv/fetchReserv";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/app/api/queryClient";
import { useForm } from "react-hook-form";
import { ReservLaterScheme, ReservLaterType } from "@/app/types/reservLater";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { OnSuccess } from "../onSuccess/onSuccess";

interface IModal {
  dialogOpen: boolean;
  onClose: () => void;
  questDetails: IHorrorsPromise;
}

const pricingPerPerson = {
  1: 140,
  2: 150,
  3: 160,
  4: 170,
  5: 180,
  6: 190,
} as const;

export const ReservationModalLater = ({
  dialogOpen,
  onClose,
  questDetails,
}: IModal) => {
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [useCertificate, setUseCertificate] = useState<boolean>(false);
  const [useYear, setUseYear] = useState<boolean>(false);
  const [useAgreement, setUseAgreement] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const calculatePrice = () => {
    return pricingPerPerson[numberOfPeople as keyof typeof pricingPerPerson];
  };

  const reservMutate = useMutation(
    {
      mutationFn: ({
        horror,
        data,
        slot,
        phone,
        first_name,
        last_name,
        certificate,
        comment,
        price,
      }: {
        horror: number;
        data: string;
        slot: number;
        phone: string;
        first_name: string;
        last_name: string;
        certificate?: boolean;
        comment?: string;
        price: number;
      }) =>
        fetchReserv({
          horror,
          data,
          slot,
          phone,
          first_name,
          last_name,
          certificate,
          comment,
          price,
        }),
      mutationKey: ["reserv"],
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: ["slots"] });
        setUseCertificate(false);
        setUseAgreement(false);
        setUseYear(false);
        setIsSuccess(true);
        reset();
      },
    },
    queryClient
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReservLaterType>({ resolver: zodResolver(ReservLaterScheme) });

  return (
    <Dialog className="h-[90%!important]" isOpen={dialogOpen} onClose={onClose}>
      <div className="flex flex-col sm:flex-row h-full text-white">
        <div className="bg-[#82D7DB69] h-full min-h-[230px] overflow-hidden max-w-[567px] w-full flex flex-col pt-[53px] px-[24px] md:pt-[60px]">
          <div className="flex flex-col items-center mb-auto">
            <span className="mb-[46px] text-[24px] sm:text-[28px] md:text-[36px] font-bold">
              Бронирование
            </span>
            <span>Квест - перфоманс</span>
            <h2 className="mb-[20px] font-bold text-[24px]">
              {questDetails.name}
            </h2>
          </div>
          <div className="hidden sm:block overflow-y-auto w-full max-w-[400px] mx-auto px-4">
            <MoreQuests />
          </div>
        </div>
        {!isSuccess ? (
          <form
            onSubmit={handleSubmit((data) => {
              reservMutate.mutate({
                horror: questDetails.id,
                data: "123",
                phone: data.phone,
                slot: 1,
                first_name: data.first_name,
                last_name: data.last_name,
                certificate: useCertificate,
                comment: data.comment || "",
                price: calculatePrice(),
              });
            })}
            className="flex flex-col w-full py-[50px] px-[30px] lg:py-[87px] lg:px-[117px]"
          >
            <div className="grid grid-cols-1 gap-y-[30px] lg:gap-x-[52px] lg:gap-y-[30px] lg:grid-cols-2">
              <FormField errors={errors.first_name?.message} label="Имя">
                <input
                  {...register("first_name")}
                  className="pb-[10px] transition ease-in-out outline-none border-b-1 border-solid border-[#8D8D8D] focus:border-[#fff]"
                  type="text"
                  placeholder="Имя"
                />
              </FormField>
              <FormField errors={errors.last_name?.message} label="Фамилия">
                <input
                  {...register("last_name")}
                  className="pb-[10px] transition ease-in-out outline-none border-b-1 border-solid border-[#8D8D8D] focus:border-[#fff]"
                  type="text"
                  placeholder="Фамилия"
                />
              </FormField>
              <FormField label="Дата">
                <input
                  {...register("first_name")}
                  className="pb-[10px] transition ease-in-out outline-none border-b-1 border-solid border-[#8D8D8D] focus:border-[#fff]"
                  type="date"
                  placeholder="Фамилия"
                />
              </FormField>
              <FormField label="Время">
                <input
                  className="pb-[10px] transition ease-in-out outline-none border-b-1 border-solid border-[#8D8D8D] focus:border-[#fff]"
                  type="time"
                  placeholder="Фамилия"
                />
              </FormField>
              <FormField errors={errors.phone?.message} label="Ваш телефон">
                <input
                  {...register("phone")}
                  className="pb-[10px] transition ease-in-out outline-none border-b-1 border-solid border-[#8D8D8D] focus:border-[#fff]"
                  type="tel"
                  placeholder="Ваш телефон"
                />
              </FormField>
              <FormField label="Количество участников">
                <div className="relative h-[21px] mb-[15px]">
                  <span className="label left-[0] absolute">1</span>
                  <span className="label left-[20%] absolute">2</span>
                  <span className="label left-[39%] absolute">3</span>
                  <span className="label left-[58%] absolute">4</span>
                  <span className="label left-[78%] absolute">5</span>
                  <span className="label left-[97%] absolute">6</span>
                </div>
                <input
                    {...register("people")}
                  className="custom-range"
                  type="range"
                  placeholder="Ваш телефон"
                  min={1}
                  max={6}
                  step={1}
                  defaultValue={1}
                  onChange={(e) => setNumberOfPeople(Number(e.target.value))}
                />
                {numberOfPeople === 6 && (
                    <p className="text-[13px] text-[#A4A6A8] md:text-[16px] mt-4">
                      (Бронирование действует при возрасте всех участников до 16 лет)
                    </p>
                )
                }
              </FormField>
            </div>
            <Checkbox
              className="my-6"
              checked={useCertificate}
              onChange={(e) => setUseCertificate(e.target.checked)}
              label="Использовать сертификат"
            />
            <FormField className="mb-auto" label="Комментарий">
              <textarea
                className="pb-[10px] resize-none transition ease-in-out outline-none border-b-1 border-solid border-[#8D8D8D] focus:border-[#fff]"
                placeholder="Введите ваш комментарий"
              ></textarea>
            </FormField>
            <div className="mt-6">
              <Checkbox
                error={errors.year?.message}
                {...register("year")}
                checked={useYear}
                onChange={(e) => setUseYear(e.target.checked)}
                className="mb-2"
                label="Все игроки старше 14 лет"
              />
              <Checkbox
                error={errors.agreement?.message}
                {...register("agreement")}
                checked={useAgreement}
                onChange={(e) => setUseAgreement(e.target.checked)}
                label={
                  <>
                    Я согласен с{" "}
                    <Link className="underline" href={"/agreement"}>
                      Политикой обработки персональных данных
                    </Link>{" "}
                    и{" "}
                    <Link className="underline" href={"/policy"}>
                      пользовательским соглашением
                    </Link>
                  </>
                }
              />
            </div>
            <div className="min-h-[60px] sm:min-h-[98px] bg-[url(assets/webp/btn_bg.png)] bg-no-repeat bg-center bg-size-[100%_60%] sm:bg-size-[100%_70%] flex items-end justify-center">
              <button
                className="text-white max-w-[181px] py-[6px] px-[12px] text-[14px] sm:text-[18px] sm:py-[16px] sm:px-[24px] cursor-pointer bg-(--red) rounded-lg"
                type="submit"
              >
                Забронировать
              </button>
            </div>
          </form>
        ) : (
          <OnSuccess
            onClose={() => {
              onClose();
              setIsSuccess(false);
            }}
          />
        )}
      </div>
    </Dialog>
  );
};
