import { z } from "zod";

export const ReservLaterScheme = z.object({
  first_name: z
    .string()
    .min(1, { message: "Имя не может быть пустым" })
    .nonempty(),
  last_name: z
    .string()
    .min(1, { message: "Фамилия не может быть пустой" })
    .nonempty(),
  phone: z.string().min(1, { message: "Номер телефона не может быть пустым" }),
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
