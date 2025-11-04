import { z } from "zod";
import { regex } from "@/app/types/reservLater";

export const buildReservScheme = (requireYear: boolean) =>
    z.object({
        first_name: z.string().min(1, { message: "Имя не может быть пустым" }).nonempty(),
        last_name: z.string().min(1, { message: "Фамилия не может быть пустой" }).nonempty(),
        phone: z
            .string()
            .min(1, { message: "Номер телефона не может быть пустым" })
            .refine((val) => regex.test(val), { message: "Формат номера: +375 (**) ***-**-**" }),
        // people: z.string(),
        comment: z.string().optional(),
        certificate: z.boolean().optional(),
        year: requireYear
            ? z.literal(true, { errorMap: () => ({ message: "Все игроки старше 14 лет — отметьте чекбокс" }) })
            : z.boolean().optional(),
        agreement: z.boolean().refine((val) => val === true, { message: "Надо подтвердить" }),
    });

export type ReservType = z.infer<ReturnType<typeof buildReservScheme>>;
