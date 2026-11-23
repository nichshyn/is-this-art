import { z } from "zod";

import { CATEGORIES, LIMITS, REPORT_REASONS } from "./constants";

const categorySlugs = CATEGORIES.map((c) => c.slug) as [string, ...string[]];

export const usernameSchema = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters.")
  .max(24, "Username must be at most 24 characters.")
  .regex(/^[a-zA-Z0-9_]+$/, "Use letters, numbers and underscores only.");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(200, "Password is too long.");

export const signupSchema = z.object({
  username: usernameSchema,
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export const forgotSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
});

export const resetSchema = z.object({
  token: z.string().min(10, "This reset link is invalid."),
  password: passwordSchema,
});

export const commentSchema = z.object({
  artworkId: z.string().min(1),
  content: z
    .string()
    .trim()
    .min(2, "Write at least two characters.")
    .max(LIMITS.commentLength, `Comments are limited to ${LIMITS.commentLength} characters.`),
});

export const reportSchema = z.object({
  artworkId: z.string().min(1),
  reason: z.enum(REPORT_REASONS),
  details: z
    .string()
    .trim()
    .max(LIMITS.reportDetails, `Details are limited to ${LIMITS.reportDetails} characters.`)
    .optional()
    .or(z.literal("")),
});

export const profileSchema = z.object({
  bio: z
    .string()
    .trim()
    .max(LIMITS.bioLength, `Bio is limited to ${LIMITS.bioLength} characters.`)
    .optional()
    .or(z.literal("")),
  avatarUrl: z
    .string()
    .trim()
    .url("Enter a valid image URL.")
    .max(500)
    .optional()
    .or(z.literal("")),
});

const yearSchema = z
  .string()
  .trim()
  .max(24, "Year is too long.")
  .optional()
  .or(z.literal(""));

export const artworkSubmissionSchema = z.object({
  title: z.string().trim().min(2, "Give the work a title.").max(120),
  description: z
    .string()
    .trim()
    .min(20, "Write at least 20 characters about the work.")
    .max(2000, "Description is limited to 2000 characters."),
  category: z.enum(categorySlugs, { message: "Choose a category." }),
  artistName: z.string().trim().min(2, "Add an artist name or pseudonym.").max(120),
  creationYear: yearSchema,
  country: z.string().trim().max(80).optional().or(z.literal("")),
  location: z.string().trim().max(160).optional().or(z.literal("")),
  isAiGenerated: z.boolean().default(false),
  isOriginal: z.boolean().default(true),
  isAnonymous: z.boolean().default(false),
  agree: z.literal(true, {
    message: "You must confirm you have the right to share this image.",
  }),
});

export const adminArtworkSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Slug may contain lowercase letters, numbers and hyphens."),
  description: z.string().trim().min(10).max(2000),
  history: z.string().trim().max(4000).optional().or(z.literal("")),
  category: z.enum(categorySlugs, { message: "Choose a category." }),
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
  return error.issues[0]?.message ?? "Please check the form and try again.";
}
