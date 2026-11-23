export const SITE = {
  name: "IS THIS ART?",
  shortName: "IS THIS ART?",
  description:
    "A social experiment about taste. Look at an artwork, make your judgment, and see what the world thinks.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  twitter: "@isthisart",
};

export const CATEGORIES = [
  {
    slug: "contemporary-art",
    name: "Contemporary Art",
    description: "Work made by living artists and the recent past.",
  },
  {
    slug: "abstract-art",
    name: "Abstract Art",
    description: "Form, colour and gesture without a representational subject.",
  },
  {
    slug: "installations",
    name: "Installations",
    description: "Rooms, objects and situations staged in space.",
  },
  {
    slug: "paintings",
    name: "Paintings & Prints",
    description: "Two-dimensional works, from panel paintings to woodblock prints.",
  },
  {
    slug: "sculpture",
    name: "Sculpture",
    description: "Carved, modelled and cast objects.",
  },
  {
    slug: "photography",
    name: "Photography",
    description: "Images made with light, from the first camera photograph to the present.",
  },
  {
    slug: "digital-art",
    name: "Digital Art",
    description: "Work made with software, code and screens.",
  },
  {
    slug: "ai-art",
    name: "AI Art",
    description: "Images generated or co-created with machine-learning models.",
  },
  {
    slug: "experimental-art",
    name: "Experimental Art",
    description: "Work that tests the rules of its own medium.",
  },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c]),
) as Record<string, (typeof CATEGORIES)[number]>;

export const VOTE_TYPES = ["yes", "no", "unsure"] as const;
export type VoteType = (typeof VOTE_TYPES)[number];

export const VOTE_LABELS: Record<VoteType, string> = {
  yes: "Yes, it's art.",
  no: "No, it's not art.",
  unsure: "I'm not sure.",
};

export const VOTE_SHORT: Record<VoteType, string> = {
  yes: "Yes, art",
  no: "Not art",
  unsure: "Not sure",
};

export const REPORT_REASONS = [
  "Copyright or ownership issue",
  "Hateful or harmful content",
  "Sexually explicit content",
  "Spam or misleading information",
  "Graphic violence",
  "Other",
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
