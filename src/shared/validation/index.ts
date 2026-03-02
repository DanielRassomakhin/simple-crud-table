import { z } from "zod";

export const fullNameSchema = z
  .string()
  .min(1, "ФИО обязательно")
  .transform((v) => v.trim().replace(/\s+/g, " "))
  .refine(
    (v) => v.split(" ").length === 3,
    "Укажите фамилию, имя и отчество через пробел"
  )
  .refine(
    (v) => v.split(" ").every((part) => /^[A-Za-zА-Яа-яЁё]+$/u.test(part)),
    "ФИО должно содержать только буквы"
  );

export const phoneRuSchema = z
  .string()
  .min(1, "Телефон обязателен")
  .refine(
    (v) => v.replace(/\D/g, "").length === 11,
    "Телефон должен содержать 11 цифр"
  );
