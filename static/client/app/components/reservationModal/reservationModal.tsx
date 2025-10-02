"use client";

import Dialog from "@/app/ui/dialogUI/dialogUI";
import { useState } from "react";
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
import Link from "next/link";
import { OnSuccess } from "../onSuccess/onSuccess";

interface ReservationModalPromise extends IHorrorsPromise {
  price: number;
  time: string;
  slot: number;
  date_front: string;
}

interface IModal {
  dialogOpen: boolean;
  onClose: () => void;
  questDetails: ReservationModalPromise;
}

const pricingPerPerson = {
  1: 140,
  2: 150,
  3: 160,
  4: 170,
  5: 180,
  6: 190,
} as const;

export const ReservationModal = ({
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
        queryClient.invalidateQueries({ queryKey: ["slots", questDetails.id] });
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
  } = useForm<ReservType>({
    resolver: zodResolver(ReservScheme),
  });

  return (
    <Dialog
      classNameBTN="left-[calc(100%-4em)] sm:left-[calc(100%-4em)!important]"
      classNameContent="h-full overflow-y-auto"
      isOpen={dialogOpen}
      onClose={onClose}
    >
      <div className="flex flex-col sm:flex-row h-full text-white">
        <div className="bg-[#82D7DB69] w-full sm:max-w-[40%] md:max-w-[567px] flex flex-col p-6 sm:py-10 sm:px-6">
          <div className="flex flex-col items-center text-center mb-20">
            <span className="mb-8 text-xl sm:text-2xl md:text-3xl font-bold">
              Бронирование
            </span>
            <span className="text-sm sm:text-base">Квест - перфоманс</span>
            <h2 className="mb-5 font-bold text-lg sm:text-xl md:text-2xl">
              {questDetails.name}
            </h2>
          </div>
          <ul className="flex flex-row justify-around gap-4 md:flex-col sm:gap-8 mx-auto items-center w-full sm:max-w-[315px]">
            <li className="w-full flex flex-col gap-2 text-base sm:text-lg items-center md:border-b-1 border-solid md:pb-6">
              <Image
                className="w-8 h-8 md:w-12 md:h-12"
                src={calendar}
                alt="дата"
              />
              <span>{questDetails.date_front}</span>
            </li>
            <li className="w-full flex flex-col gap-2 text-base sm:text-lg items-center md:border-b-1 border-solid md:pb-6">
              <Image
                className="w-8 h-8 md:w-12 md:h-12"
                src={clock}
                alt="время"
              />
              <span>{questDetails.time}</span>
            </li>
            <li className="w-full flex flex-col gap-2 items-center text-base sm:text-lg">
              <Image
                className="w-8 h-8 md:w-12 md:h-12"
                src={money}
                alt="деньги"
              />
              <span>{calculatePrice()} Br</span>
            </li>
          </ul>
        </div>
        {!isSuccess ? (
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
            className="flex flex-col w-full p-6 sm:p-8 md:p-12 lg:p-16 overflow-y-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <FormField errors={errors.first_name?.message} label="Имя">
                <input
                  className="w-full bg-transparent pb-2 transition ease-in-out outline-none border-b-1 border-solid border-[#8D8D8D] focus:border-[#fff]"
                  type="text"
                  placeholder="Имя"
                  {...register("first_name")}
                />
              </FormField>
              <FormField errors={errors.last_name?.message} label="Фамилия">
                <input
                  className="w-full bg-transparent pb-2 transition ease-in-out outline-none border-b-1 border-solid border-[#8D8D8D] focus:border-[#fff]"
                  type="text"
                  placeholder="Фамилия"
                  {...register("last_name")}
                />
              </FormField>
              <FormField errors={errors.phone?.message} label="Ваш телефон">
                <input
                  className="w-full bg-transparent pb-2 transition ease-in-out outline-none border-b-1 border-solid border-[#8D8D8D] focus:border-[#fff]"
                  type="tel"
                  placeholder="Ваш телефон"
                  {...register("phone")}
                />
              </FormField>
              <FormField label="Количество участников">
                <div className="relative h-5 mb-4 text-xs">
                  <span className="label left-[0] absolute">1</span>
                  <span className="label left-[20%] absolute">2</span>
                  <span className="label left-[39%] absolute">3</span>
                  <span className="label left-[58%] absolute">4</span>
                  <span className="label left-[78%] absolute">5</span>
                  <span className="label left-[97%] absolute">6</span>
                </div>
                <input
                    className="custom-range w-full"
                    type="range"
                    min={1}
                    max={6}
                    step={1}
                    defaultValue={1}
                    {...register("people")}
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
                className="my-4 sm:my-6"
                checked={useCertificate}
                {...register("certificate")}
                onChange={(e) => setUseCertificate(e.target.checked)}
                label="Использовать сертификат"
            />
            <FormField className="mb-auto" label="Комментарий">
              <textarea
                  className="w-full bg-transparent pb-2 resize-none transition ease-in-out outline-none border-b-1 border-solid border-[#8D8D8D] focus:border-[#fff]"
                placeholder="Введите ваш комментарий"
                {...register("comment")}
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
            <div className="mt-6 min-h-[60px] sm:min-h-[98px] bg-[url(assets/webp/btn_bg.png)] bg-no-repeat bg-center bg-contain sm:bg-size-[100%_70%] flex items-end justify-center">
              <button
                className="text-white max-w-[181px] text-sm sm:text-lg py-2 px-4 sm:py-4 sm:px-6 cursor-pointer bg-(--red) rounded-lg"
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
