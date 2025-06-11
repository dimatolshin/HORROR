"use client";

import Dialog from "@/app/ui/dialogUI/dialogUI";
import { RefObject, useState } from "react";
import { IHorrorsPromise } from "@/app/api/horrors/fetchHorrors";
import { FormField } from "@/app/ui/formField/formField";
import Image from "next/image";
import clock from "@/app/assets/svg/clock_popular.svg";
import calendar from "@/app/assets/svg/calendar_reservation.svg";
import money from "@/app/assets/svg/money.svg";
import { Checkbox } from "@/app/ui/checkbox/checkbox";
import { useMutation } from "@tanstack/react-query";
import { fetchReserv } from "@/app/api/reserv/fetchReserv";
import { queryClient } from "@/app/api/queryClient";
import { useForm } from "react-hook-form";
import { ReservScheme, ReservType } from "@/app/types/reserv";
import { zodResolver } from "@hookform/resolvers/zod";

interface ReservationModalPromise extends IHorrorsPromise {
  price: number;
  time: string;
  slot: number;
  date_front: string;
}

interface IModal {
  dialogRef: RefObject<HTMLDialogElement | null>;
  onClose: () => void;
  questDetails: ReservationModalPromise;
}

const pricingPerPerson = {
  1: 110,
  2: 120,
  3: 130,
  4: 140,
  5: 150,
} as const;

export const ReservationModal = ({
  dialogRef,
  onClose,
  questDetails,
}: IModal) => {
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [useCertificate, setUseCertificate] = useState<boolean>(false);
  const [useYear, setUseYear] = useState<boolean>(false);
  const [useAgreement, setUseAgreement] = useState<boolean>(false);

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
  } = useForm<ReservType>({
    resolver: zodResolver(ReservScheme),
  });

  return (
    <Dialog
      classNameBTN="left-[calc(100%-4em)!important]"
      classNameContent="h-full"
      ref={dialogRef}
      onClose={onClose}
    >
      <div className="flex flex-col sm:flex-row h-full text-white">
        <div className="bg-[#82D7DB69] h-full max-w-[567px] w-full flex flex-col py-[53px] px-[24px] md:py-[60px]">
          <div className="flex flex-col items-center mb-auto">
            <span className="mb-[46px] text-[24px] sm:text-[28px] md:text-[36px] font-bold">
              Бронирование
            </span>
            <span>Квест - перфоманс</span>
            <h2 className="mb-[20px] font-bold text-[24px]">
              {questDetails.name}
            </h2>
          </div>
          <ul className="flex flex-row gap-[9px] md:flex-col sm:gap-[30px] mx-auto items-center max-w-[315px] w-full">
            <li className="w-full flex flex-col gap-[14px] pr-[9px] text-[18px] sm:pr-0 items-center sm:text-[24px] border-r-1 md:border-r-0 md:border-b-1 border-solid md:pb-[30px]">
              <Image
                className="w-[30px] h-[30px] md:w-[54px] md:h-[54px]"
                width={54}
                height={54}
                src={calendar}
                alt={"дата"}
              />
              <span>Дата</span>
            </li>
            <li className="w-full flex flex-col gap-[14px] pr-[9px] text-[18px] sm:pr-0 items-center sm:text-[24px] border-r-1 md:border-r-0 md:border-b-1 border-solid md:pb-[30px]">
              <Image
                className="w-[30px] h-[30px] md:w-[54px] md:h-[54px]"
                width={54}
                height={54}
                src={clock}
                alt={"время"}
              />
              <span>{questDetails.time}</span>
            </li>
            <li className="w-full flex flex-col gap-[14px] items-center text-[18px] sm:text-[24px]">
              <Image
                className="w-[30px] h-[30px] md:w-[54px] md:h-[54px]"
                width={54}
                height={54}
                src={money}
                alt={"деньги"}
              />
              <span>{calculatePrice()} Br</span>
            </li>
          </ul>
        </div>
        <form
          onSubmit={handleSubmit((data) => {
            reservMutate.mutate({
              horror: questDetails.id,
              data: questDetails.date_front,
              phone: data.phone,
              slot: questDetails.slot,
              first_name: data.first_name,
              last_name: data.last_name,
              certificate: useCertificate,
              comment: data.comment || "",
              price: calculatePrice(),
            });
          })}
          className="flex flex-col w-full py-[50px] px-[30px] lg:py-[87px] lg:px-[117px]"
        >
          <div className="grid grid-cols-1 gap-y-[30px] lg:gap-[42px] lg:gap-y-[30px] lg:grid-cols-2">
            <FormField errors={errors.first_name?.message} label="Имя">
              <input
                className="pb-[10px] transition ease-in-out outline-none border-b-1 border-solid border-[#8D8D8D] focus:border-[#fff]"
                type="text"
                placeholder="Имя"
                {...register("first_name")}
              />
            </FormField>
            <FormField errors={errors.last_name?.message} label="Фамилия">
              <input
                className="pb-[10px] transition ease-in-out outline-none border-b-1 border-solid border-[#8D8D8D] focus:border-[#fff]"
                type="text"
                placeholder="Фамилия"
                {...register("last_name")}
              />
            </FormField>
            <FormField errors={errors.phone?.message} label="Ваш телефон">
              <input
                className="pb-[10px] transition ease-in-out outline-none border-b-1 border-solid border-[#8D8D8D] focus:border-[#fff]"
                type="tel"
                placeholder="Ваш телефон"
                {...register("phone")}
              />
            </FormField>
            <FormField label="Количество участников">
              <div className="relative h-[21px] mb-[15px]">
                <span className="label left-[0] absolute">1</span>
                <span className="label left-[24%] absolute">2</span>
                <span className="label left-[48%] absolute">3</span>
                <span className="label left-[72%] absolute">4</span>
                <span className="label left-[97%] absolute">5</span>
              </div>
              <input
                className="custom-range"
                type="range"
                placeholder="Ваш телефон"
                min={1}
                max={5}
                step={1}
                defaultValue={1}
                {...register("people")}
                onChange={(e) => setNumberOfPeople(Number(e.target.value))}
              />
            </FormField>
          </div>
          <Checkbox
            className="my-6"
            checked={useCertificate}
            {...register("certificate")}
            onChange={(e) => setUseCertificate(e.target.checked)}
            label="Использовать сертификат"
          />
          <FormField className="mb-auto" label="Комментарий">
            <textarea
              className="pb-[10px] resize-none transition ease-in-out outline-none border-b-1 border-solid border-[#8D8D8D] focus:border-[#fff]"
              placeholder="Введите ваш комментарий"
              {...register("comment")}
            ></textarea>
          </FormField>

          <Checkbox
            error={errors.year?.message}
            {...register("year")}
            checked={useYear}
            onChange={(e) => setUseYear(e.target.checked)}
            className="mt-4 mb-2"
            label="Все игроки старше 14 лет"
          />
          <Checkbox
            error={errors.agreement?.message}
            {...register("agreement")}
            checked={useAgreement}
            onChange={(e) => setUseAgreement(e.target.checked)}
            label="Я согласен с Политикой обработки персональных данных и пользовательским соглашением"
          />
          <div className="min-h-[60px] sm:min-h-[98px] bg-[url(assets/webp/btn_bg.png)] bg-no-repeat bg-center bg-size-[100%_60%] sm:bg-size-[100%_70%] flex items-end justify-center">
            <button
              className="text-white max-w-[181px] py-[6px] px-[12px] text-[14px] sm:text-[18px] sm:py-[16px] sm:px-[24px] cursor-pointer bg-(--red) rounded-lg"
              type="submit"
            >
              Забронировать
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};
