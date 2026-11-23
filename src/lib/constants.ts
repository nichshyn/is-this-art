export const SITE = {
  name: "IS THIS ART?",
  shortName: "IS THIS ART?",
  description:
    "Социальный эксперимент о вкусе. Рассмотрите работу, выскажите своё суждение и посмотрите, что думают остальные.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  twitter: "@isthisart",
};

export const CATEGORIES = [
  {
    slug: "contemporary-art",
    name: "Современное искусство",
    description: "Работы живых художников и мастеров недавнего прошлого.",
  },
  {
    slug: "abstract-art",
    name: "Абстрактное искусство",
    description: "Форма, цвет и жест без изобразительного сюжета.",
  },
  {
    slug: "installations",
    name: "Инсталляции",
    description: "Помещения, объекты и ситуации, выстроенные в пространстве.",
  },
  {
    slug: "paintings",
    name: "Живопись и гравюра",
    description: "Двумерные работы — от живописи на досках до гравюр.",
  },
  {
    slug: "sculpture",
    name: "Скульптура",
    description: "Высеченные, вылепленные и отлитые объекты.",
  },
  {
    slug: "photography",
    name: "Фотография",
    description: "Изображения, созданные светом, — от первого снимка на камеру до наших дней.",
  },
  {
    slug: "digital-art",
    name: "Цифровое искусство",
    description: "Работы, созданные с помощью программ, кода и экранов.",
  },
  {
    slug: "ai-art",
    name: "ИИ-искусство",
    description: "Изображения, созданные или доработанные вместе с моделями машинного обучения.",
  },
  {
    slug: "experimental-art",
    name: "Экспериментальное искусство",
    description: "Работы, которые испытывают правила своего медиума.",
  },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c]),
) as Record<string, (typeof CATEGORIES)[number]>;

export const VOTE_TYPES = ["yes", "no", "unsure"] as const;
export type VoteType = (typeof VOTE_TYPES)[number];

export const VOTE_LABELS: Record<VoteType, string> = {
  yes: "Да, это искусство.",
  no: "Нет, это не искусство.",
  unsure: "Не уверен(а).",
};

export const VOTE_SHORT: Record<VoteType, string> = {
  yes: "Да, искусство",
  no: "Не искусство",
  unsure: "Не уверен",
};

export const REPORT_REASONS = [
  "Нарушение авторских прав или прав на изображение",
  "Контент ненависти или причиняющий вред",
  "Откровенно сексуальный контент",
  "Спам или ложная информация",
  "Сцены жестокого насилия",
  "Другое",
] as const;

export const POINTS = {
  vote: 10,
  dailyChallenge: 25,
  approvedArtwork: 50,
  achievement: 20,
} as const;

export const LIMITS = {
  uploadBytes: 8 * 1024 * 1024,
  minImageSide: 240,
  maxImageSide: 12000,
  commentLength: 1200,
  bioLength: 280,
  reportDetails: 600,
} as const;

export const PAGE_SIZE = 12;

export const SESSION_COOKIE = "ita_session";
export const GUEST_COOKIE = "ita_guest";
export const OAUTH_STATE_COOKIE = "ita_oauth_state";
export const SESSION_DAYS = 30;
