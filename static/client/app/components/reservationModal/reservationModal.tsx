"use client";

import Dialog from "@/app/ui/dialogUI/dialogUI";
import {useEffect, useMemo, useState} from "react";
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
import {buildReservScheme, ReservType} from "@/app/types/reserv";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { OnSuccess } from "../onSuccess/onSuccess";

interface ReservationModalPromise extends IHorrorsPromise {
    time: string;
    date_front: string;
    info?: { id: number; count_of_peoples: number; price: number }[];
}

interface IModal {
    dialogOpen: boolean;
    onClose: () => void;
    questDetails: ReservationModalPromise;
}

function buildPeopleOptions(
    questDetails: ReservationModalPromise
): { people: number[]; prices: number[]; ids: number[] } {
    const list = questDetails.info ?? [];

    if (list.length === 0) {
        console.warn("⚠️ questDetails.info пустой!");
        return { people: [], prices: [], ids: [] };
    }

    const sorted = list.slice().sort((a, b) => a.count_of_peoples - b.count_of_peoples);
    return {
        people: sorted.map((i) => i.count_of_peoples),
        prices: sorted.map((i) => i.price),
        ids: sorted.map((i) => i.id),
    };
}

export const ReservationModal = ({
    dialogOpen,
    onClose,
    questDetails,
}: IModal) => {
    const [peopleIndex, setPeopleIndex] = useState(0);
    const [useCertificate, setUseCertificate] = useState<boolean>(false);
    const [useYear, setUseYear] = useState<boolean>(false);
    const [useAgreement, setUseAgreement] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const { people, prices, ids } = useMemo(
        () => buildPeopleOptions(questDetails),
        [questDetails]
    );

    const minIndex = 0;
    const maxIndex = Math.max(0, people.length - 1);

    const numberOfPeople = people.length > 0 ? people[peopleIndex] : 1;
    const selectedPrice = prices.length > 0 ? prices[peopleIndex] : 0;
    const selectedInfoId = ids.length > 0 ? ids[peopleIndex] : undefined;

    const schema = useMemo(() => buildReservScheme(questDetails.older_14), [questDetails.older_14]);

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
                 older_14
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
                older_14: boolean;
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
                    older_14
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
        unregister,
        handleSubmit,
        reset,
        resetField,
        formState: { errors, isSubmitting },
    } = useForm<ReservType>({
        resolver: zodResolver(schema),
        mode: "onChange", // ДОБАВЛЕНО: валидация при изменении полей
    });

    useEffect(() => {
        if (!dialogOpen) {
            setIsSuccess(false);
            setPeopleIndex(0);
            setUseCertificate(false);
            setUseYear(false);
            setUseAgreement(false);
            reset();
        }
    }, [dialogOpen, reset]);

    useEffect(() => {
        if (questDetails.older_14) {
            register("year");
        } else {
            unregister("year", { keepValue: false });
            resetField("year", { defaultValue: false });
            setUseYear(false);
        }
    }, [questDetails.older_14, register, unregister, resetField]);

    useEffect(() => {
        setPeopleIndex(0);
    }, [questDetails.time, questDetails.date_front]);

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
                            <Image className="w-8 h-8 md:w-12 md:h-12" src={calendar} alt="дата" />
                            <span>{questDetails.date_front}</span>
                        </li>
                        <li className="w-full flex flex-col gap-2 text-base sm:text-lg items-center md:border-b-1 border-solid md:pb-6">
                            <Image className="w-8 h-8 md:w-12 md:h-12" src={clock} alt="время" />
                            <span>{questDetails.time}</span>
                        </li>
                        <li className="w-full flex flex-col gap-2 items-center text-base sm:text-lg">
                            <Image className="w-8 h-8 md:w-12 md:h-12" src={money} alt="деньги" />
                            <span>{selectedPrice} Br</span>
                        </li>
                    </ul>
                </div>

                {!isSuccess ? (
                    <form
                        onSubmit={handleSubmit(
                            (data) => {

                                if (!selectedInfoId) {
                                    console.error("❌ selectedInfoId is undefined");
                                    return;
                                }

                                reservMutate.mutate({
                                    horror: questDetails.id,
                                    data: questDetails.date_front,
                                    phone: data.phone,
                                    slot: selectedInfoId,
                                    first_name: data.first_name,
                                    last_name: data.last_name,
                                    certificate: useCertificate,
                                    comment: data.comment || "",
                                    price: selectedPrice,
                                    older_14: useYear,
                                });
                            },
                            (errors) => {
                                // ERROR CALLBACK - когда валидация не прошла
                                console.error("❌ Form validation failed:", errors);
                            }
                        )}
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
                                <div className="relative h-5 mb-4 text-xs flex justify-between px-1">
                                    {people.map((p, idx) => (
                                        <span key={idx} className="label">
                            {p}
                          </span>
                                    ))}
                                </div>

                                <input
                                    className="custom-range w-full"
                                    type="range"
                                    min={minIndex}
                                    max={maxIndex}
                                    step={1}
                                    value={peopleIndex}
                                    onChange={(e) => {
                                        const idx = Number(e.target.value);
                                        setPeopleIndex(idx);
                                    }}
                                    disabled={maxIndex === 0}
                                />

                                {numberOfPeople === 6 && (
                                    <p className="text-[13px] text-[#A4A6A8] md:text-[16px] mt-4">
                                        (Бронирование действует при возрасте всех участников до 16 лет)
                                    </p>
                                )}
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
                            {questDetails.older_14 && (
                                <Checkbox
                                    error={errors.year?.message}
                                    {...register("year")}
                                    checked={useYear}
                                    onChange={(e) => setUseYear(e.target.checked)}
                                    className="mb-2"
                                    label="Все игроки старше 14 лет"
                                />
                            )}
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
                                disabled={isSubmitting} // ИЗМЕНЕНО: блокируем только во время отправки
                            >
                                {isSubmitting ? "Отправка..." : "Забронировать"}
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
