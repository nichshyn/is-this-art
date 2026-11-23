import type { VoteType } from "./constants";

export type { VoteType };

export type Role = "user" | "admin";
export type ArtworkStatus = "pending" | "approved" | "rejected";
export type ReportStatus = "open" | "resolved" | "dismissed";

export interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: Role;
  points: number;
  streak: number;
  longest_streak: number;
  last_vote_date: string | null;
  is_blocked: number;
  is_demo: number;
  created_at: string;
}

export type PublicUser = Omit<User, "email" | "password_hash" | "is_blocked" | "is_demo">;

export interface Artwork {
  id: string;
  slug: string;
  title: string;
  description: string;
  history: string | null;
  image_url: string;
  image_width: number;
  image_height: number;
  image_credit: string | null;
  image_license: string | null;
  image_source_url: string | null;
  category: string;
  artist_name: string;
  creation_year: string | null;
  country: string | null;
  location: string | null;
  fun_fact: string | null;
  is_ai_generated: number;
  is_verified: number;
  is_anonymous: number;
  is_demo: number;
  submitted_by: string | null;
  status: ArtworkStatus;
  rejection_reason: string | null;
  created_at: string;
}

export interface ArtworkWithStats extends Artwork {
  vote_count: number;
  yes_count: number;
  no_count: number;
  unsure_count: number;
  yes_pct: number;
  no_pct: number;
  unsure_pct: number;
  comment_count?: number;
  like_count?: number;
}

export interface VoteStats {
  total: number;
  yes: number;
  no: number;
  unsure: number;
  yesPct: number;
  noPct: number;
  unsurePct: number;
}

export interface Comment {
  id: string;
  user_id: string;
  artwork_id: string;
  content: string;
  created_at: string;
  username: string;
  avatar_url: string | null;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  sort_order: number;
}

export interface UserAchievement extends Achievement {
  earned_at: string;
}

export interface LeaderboardRow {
  id: string;
  username: string;
  avatar_url: string | null;
  points: number;
  score: number;
  votes: number;
  works: number;
  streak: number;
}

export interface Report {
  id: string;
  user_id: string;
  artwork_id: string;
  reason: string;
  details: string | null;
  status: ReportStatus;
  created_at: string;
  username?: string;
  artwork_title?: string;
  artwork_slug?: string;
  artwork_image?: string;
}

export interface PlayCard {
  id: string;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  alreadyVoted?: boolean;
}

export interface RevealData {
  artwork: Artwork;
  stats: VoteStats;
  yourVote: VoteType;
  pointsEarned: number;
  streak: number;
  newAchievements: Achievement[];
  challengeComplete?: boolean;
  challengeBonus?: number;
}

export interface VoteApiResponse extends RevealData {
  ok: true;
  totalPoints: number;
  challengeComplete: boolean;
  challengeBonus: number;
}
