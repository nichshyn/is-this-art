import { z } from "zod";

import { CATEGORIES, LIMITS, REPORT_REASONS } from "./constants";

const categorySlugs = CATEGORIES.map((c) => c.slug) as [string, ...string[]];

export const usernameSchema = z
  .string()
  .trim()
  .min(3, "Имя пользователя должно содержать не менее 3 символов.")
  .max(24, "Имя пользователя должно содержать не более 24 символов.")
  .regex(/^[a-zA-Z0-9_]+$/, "Используйте только буквы, цифры и подчёркивания.");

export const passwordSchema = z
  .string()
  .min(8, "Пароль должен содержать не менее 8 символов.")
  .max(200, "Пароль слишком длинный.");

export const signupSchema = z.object({
  username: usernameSchema,
  email: z.string().trim().toLowerCase().email("Введите корректный адрес электронной почты."),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Введите корректный адрес электронной почты."),
  password: z.string().min(1, "Введите пароль."),
});

export const forgotSchema = z.object({
  email: z.string().trim().toLowerCase().email("Введите корректный адрес электронной почты."),
});

export const resetSchema = z.object({
  token: z.string().min(10, "Недействительная ссылка для сброса пароля."),
  password: passwordSchema,
});

export const commentSchema = z.object({
  artworkId: z.string().min(1),
  content: z
    .string()
    .trim()
    .min(2, "Введите не менее двух символов.")
    .max(LIMITS.commentLength, `Комментарий может содержать не более ${LIMITS.commentLength} символов.`),
});

export const reportSchema = z.object({
  artworkId: z.string().min(1),
  reason: z.enum(REPORT_REASONS),
  details: z
    .string()
    .trim()
    .max(LIMITS.reportDetails, `Описание может содержать не более ${LIMITS.reportDetails} символов.`)
    .optional()
    .or(z.literal("")),
});

export const profileSchema = z.object({
  bio: z
    .string()
    .trim()
    .max(LIMITS.bioLength, `Описание профиля может содержать не более ${LIMITS.bioLength} символов.`)
    .optional()
    .or(z.literal("")),
  avatarUrl: z
    .string()
    .trim()
    .url("Введите корректный URL изображения.")
    .max(500)
    .optional()
    .or(z.literal("")),
});

const yearSchema = z
  .string()
  .trim()
  .max(24, "Слишком длинное значение года.")
  .optional()
  .or(z.literal(""));

export const artworkSubmissionSchema = z.object({
  title: z.string().trim().min(2, "Укажите название работы.").max(120),
  description: z
    .string()
    .trim()
    .min(20, "Напишите описание работы длиной не менее 20 символов.")
    .max(2000, "Описание может содержать не более 2000 символов."),
  category: z.enum(categorySlugs, { message: "Выберите категорию." }),
  artistName: z.string().trim().min(2, "Укажите имя или псевдоним автора.").max(120),
  creationYear: yearSchema,
  country: z.string().trim().max(80).optional().or(z.literal("")),
  location: z.string().trim().max(160).optional().or(z.literal("")),
  isAiGenerated: z.boolean().default(false),
  isOriginal: z.boolean().default(true),
  isAnonymous: z.boolean().default(false),
  agree: z.literal(true, {
    message: "Подтвердите, что вы имеете право опубликовать это изображение.",
  }),
});

export const adminArtworkSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Slug может содержать только строчные буквы, цифры и дефисы."),
  description: z.string().trim().min(10).max(2000),
  history: z.string().trim().max(4000).optional().or(z.literal("")),
  category: z.enum(categorySlugs, { message: "Выберите категорию." }),
  artistName: z.string().trim().min(1).max(120),
  creationYear: yearSchema,
  country: z.string().trim().max(80).optional().or(z.literal("")),
  location: z.string().trim().max(160).optional().or(z.literal("")),
  funFact: z.string().trim().max(500).optional().or(z.literal("")),
  imageUrl: z.string().trim().max(1000).optional().or(z.literal("")),
  imageCredit: z.string().trim().max(300).optional().or(z.literal("")),
  imageLicense: z.string().trim().max(200).optional().or(z.literal("")),
  imageSourceUrl: z.string().trim().url().max(1000).optional().or(z.literal("")),
  isAiGenerated: z.boolean().default(false),
  isVerified: z.boolean().default(true),
  isDemo: z.boolean().default(false),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ArtworkSubmissionInput = z.infer<typeof artworkSubmissionSchema>;

export function firstError(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Проверьте данные формы и попробуйте снова.";
}
