import { z } from "zod";

export const regex = /^\+375(29|33|44|25|17)\d{7}$/;

export const buildReservLaterScheme = (requireYear: boolean) =>
    z.object({
      first_name: z.string().min(1, { message: "Имя не может быть пустым" }).nonempty(),
      last_name: z.string().min(1, { message: "Фамилия не может быть пустой" }).nonempty(),
      phone: z
          .string()
          .min(1, { message: "Номер телефона не может быть пустым" })
          .refine((val) => regex.test(val), { message: "Формат номера: +375 (**) ***-**-**" }),
      people: z.coerce.number().min(1, { message: "Минимум один участник" }),
      date: z.string().min(1, { message: "Дата не может быть пустой" }).nonempty(),
      time: z.string().min(1, { message: "Время не может быть пустым" }).nonempty(),
      comment: z.string().optional(),
      certificate: z.boolean().optional(),
      year: requireYear
          ? z.literal(true, { errorMap: () => ({ message: "Надо подтвердить" }) })
          : z.boolean().optional(),
      agreement: z.boolean().refine((val) => val === true, { message: "Надо подтвердить" }),
    });

export type ReservLaterType = z.infer<ReturnType<typeof buildReservLaterScheme>>;
