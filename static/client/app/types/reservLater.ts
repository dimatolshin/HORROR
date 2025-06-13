import { z } from "zod";

export const regex = /^\+375(29|33|44|25|17)\d{7}$/;

export const ReservLaterScheme = z.object({
  first_name: z
    .string()
    .min(1, { message: "Имя не может быть пустым" })
    .nonempty(),
  last_name: z
    .string()
    .min(1, { message: "Фамилия не может быть пустой" })
    .nonempty(),
  phone: z
    .string()
    .min(1, { message: "Номер телефона не может быть пустым" })
    .refine((val) => regex.test(val), {
      message: "Формат номера: +375 (**) ***-**-**",
    }),
  people: z.string(),
  comment: z.string().optional(),
  certificate: z.boolean().optional(),
  year: z
    .boolean()
    .refine((val) => val === true, { message: "Надо подтвердить" }),
  agreement: z
    .boolean()
    .refine((val) => val === true, { message: "Надо подтвердить" }),
});

export type ReservLaterType = z.infer<typeof ReservLaterScheme>;
