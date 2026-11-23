"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ExternalLink,
  HelpCircle,
  Loader2,
  RotateCcw,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { ArtworkImage } from "./artwork-image";
import { VoteBars } from "./vote-bars";
import { Avatar } from "@/components/ui/avatar";
import { buttonClasses } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/reveal";
import { CATEGORY_MAP, VOTE_LABELS, VOTE_SHORT, type VoteType } from "@/lib/constants";
import type { PlayCard, VoteApiResponse } from "@/lib/types";
import { cn, formatNumber, plural } from "@/lib/utils";

type Phase = "voting" | "revealed" | "already" | "loading" | "done";

export function PlayClient({
  initialCard,
  mode = "play",
  challengeCards = [],
  signedIn,
  challengeVotedCount = 0,
  challengeAlreadyComplete = false,
  userPoints = 0,
}: {
  initialCard: PlayCard | null;
  mode?: "play" | "challenge";
  challengeCards?: PlayCard[];
  signedIn: boolean;
  challengeVotedCount?: number;
  challengeAlreadyComplete?: boolean;
  userPoints?: number;
}) {
  const challengeTotal = 5;
  const firstCard =
    mode === "challenge" ? challengeCards[0] ?? null : initialCard;
  const [card, setCard] = useState<PlayCard | null>(firstCard);
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>(
    firstCard ? "voting" : challengeAlreadyComplete ? "done" : "done",
  );
  const [reveal, setReveal] = useState<VoteApiResponse | null>(null);
  const [selected, setSelected] = useState<VoteType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [sessionPoints, setSessionPoints] = useState(0);
  const [judged, setJudged] = useState(0);
  const [results, setResults] = useState<
    Array<{ card: PlayCard; vote: VoteType; response: VoteApiResponse }>
  >([]);
  const [finished, setFinished] = useState(
    mode === "challenge" && challengeAlreadyComplete,
  );
  const revealRef = useRef<HTMLDivElement>(null);
  const voteRef = useRef<(type: VoteType) => void>(() => {});

  const completedCount = challengeVotedCount + results.length;

  const handleVote = useCallback(
    async (type: VoteType) => {
      if (!card || pending || phase !== "voting") return;
      setPending(true);
      setSelected(type);
      setError(null);
      try {
        const response = await fetch("/api/vote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ artworkId: card.id, voteType: type }),
        });
        const data = await response.json();
        if (!response.ok) {
          if (data.code === "already_voted") {
            setPhase("already");
            setError("Вы уже оценили эту работу. Переходите к следующей.");
          } else {
            setError(data.message ?? "Не удалось сохранить ваш голос.");
            setSelected(null);
          }
          setPending(false);
          return;
        }
        setReveal(data as VoteApiResponse);
        setPhase("revealed");
        setPending(false);
        setSessionPoints((points) => points + (data.pointsEarned ?? 0));
        setJudged((count) => count + 1);
        setResults((prev) => [
          ...prev,
          { card, vote: type, response: data as VoteApiResponse },
        ]);
      } catch {
        setError("Ошибка сети. Проверьте подключение и попробуйте снова.");
        setSelected(null);
        setPending(false);
      }
    },
    [card, pending, phase],
  );

  voteRef.current = handleVote;

  useEffect(() => {
    if (phase !== "voting") return;
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "1") voteRef.current("yes");
      if (event.key === "2") voteRef.current("no");
      if (event.key === "3") voteRef.current("unsure");
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phase]);

  useEffect(() => {
    if (phase === "revealed" && window.innerWidth < 1024) {
      window.setTimeout(() => {
        revealRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 350);
    }
  }, [phase]);

  async function next() {
    setError(null);
    if (mode === "challenge") {
      const nextStep = step + 1;
      if (nextStep >= challengeCards.length) {
        setFinished(true);
        setPhase("done");
        return;
      }
      setStep(nextStep);
      setCard(challengeCards[nextStep]!);
      setReveal(null);
      setSelected(null);
      setPhase("voting");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setPhase("loading");
    try {
      const response = await fetch(
        `/api/play/next?exclude=${encodeURIComponent(card?.id ?? "")}`,
        { cache: "no-store" },
      );
      const data = await response.json();
      if (!data.card) {
        setCard(null);
        setPhase("done");
        return;
      }
      setCard(data.card as PlayCard);
      setReveal(null);
      setSelected(null);
      setPhase("voting");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Не удалось загрузить следующую работу.");
      setPhase("revealed");
    }
  }

  if (phase === "done" || finished || !card) {
    return (
      <DoneState
        mode={mode}
        sessionPoints={sessionPoints}
        judged={judged}
        results={results}
        challengeComplete={challengeAlreadyComplete}
        completedCount={completedCount}
        challengeTotal={challengeTotal}
      />
    );
  }

  const progressValue =
    mode === "challenge" ? completedCount : judged + 1;

  return (
    <div className="container-page pb-16 pt-6 sm:pt-8 lg:pb-24">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="eyebrow">
            {mode === "challenge" ? "Задание дня" : "Игра"}
          </span>
          {mode === "challenge" ? (
            <div className="flex items-center gap-1.5" aria-label={`Оценено ${completedCount} из ${challengeTotal}`}>
              {Array.from({ length: challengeTotal }).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 w-5 rounded-full transition-colors",
                    i < completedCount ? "bg-ink" : "bg-line",
                  )}
                />
              ))}
            </div>
          ) : (
            <span className="text-[11px] tabular-nums text-muted">
              За сессию: {formatNumber(judged + 1)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-[11px] text-muted">
          {signedIn ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1">
              <Sparkles size={12} />
              {formatNumber(userPoints + sessionPoints)} очк.
            </span>
          ) : (
            <span>Бесплатно — аккаунт не нужен</span>
          )}
        </div>
      </div>

      <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1.12fr)_minmax(380px,0.88fr)] lg:gap-12">
        <div className="lg:sticky lg:top-24">
          <div className="relative flex min-h-[38vh] items-center justify-center overflow-hidden rounded-3xl border border-line bg-subtle p-3 sm:min-h-[48vh] sm:p-5 lg:min-h-[66vh]">
            <AnimatePresence mode="wait">
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="flex max-h-[64vh] w-full items-center justify-center"
              >
                <ArtworkImage
                  src={card.imageUrl}
                  alt="Работа ждёт вашей оценки"
                  width={card.imageWidth}
                  height={card.imageHeight}
                  priority
                  className="max-h-[58vh] rounded-lg shadow-[0_20px_60px_-25px_rgba(0,0,0,0.35)] lg:max-h-[64vh]"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 text-[10.5px] text-muted">
            <span>Подробности появятся после вашей оценки.</span>
            <span className="hidden items-center gap-1 sm:inline-flex">
              <span className="rounded border border-line px-1.5 py-0.5 text-[9px]">1</span>
              <span className="rounded border border-line px-1.5 py-0.5 text-[9px]">2</span>
              <span className="rounded border border-line px-1.5 py-0.5 text-[9px]">3</span>
            </span>
          </div>
        </div>

        <div ref={revealRef} className="scroll-mt-24 lg:pt-4">
          <AnimatePresence mode="wait">
            {phase === "voting" || phase === "already" ? (
              <motion.div
                key="voting"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <VotePanel
                  mode={mode}
                  step={step}
                  challengeTotal={challengeTotal}
                  selected={selected}
                  pending={pending}
                  error={error}
                  onVote={handleVote}
                  signedIn={signedIn}
                  already={phase === "already"}
                  onNext={next}
                />
              </motion.div>
            ) : phase === "loading" ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4 pt-10"
              >
                <div className="skeleton h-8 w-2/3 rounded-lg" />
                <div className="skeleton h-4 w-1/2 rounded" />
                <div className="skeleton h-40 w-full rounded-2xl" />
                <div className="skeleton h-24 w-full rounded-2xl" />
              </motion.div>
            ) : reveal ? (
              <motion.div
                key="revealed"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <RevealPanel
                  reveal={reveal}
                  signedIn={signedIn}
                  onNext={next}
                  isLastChallenge={
                    mode === "challenge" && step + 1 >= challengeCards.length
                  }
                  challengeVotedCount={completedCount}
                  challengeTotal={challengeTotal}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function VotePanel({
  mode,
  step,
  challengeTotal,
  selected,
  pending,
  error,
  onVote,
  signedIn,
  already,
  onNext,
}: {
  mode: "play" | "challenge";
  step: number;
  challengeTotal: number;
  selected: VoteType | null;
  pending: boolean;
  error: string | null;
  onVote: (type: VoteType) => void;
  signedIn: boolean;
  already: boolean;
  onNext: () => void;
}) {
  return (
    <div>
      <p className="eyebrow">
        {mode === "challenge" ? `Изображение ${step + 1} из ${challengeTotal}` : "Ваша оценка"}
      </p>
      <h1 className="display mt-4 text-[clamp(2.9rem,6.6vw,4.6rem)] leading-[0.9]">
        IS THIS
        <br />
        ART?
      </h1>
      <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-muted">
        Доверьтесь первой реакции. Правильного ответа нет — есть только ваш.
      </p>

      {already ? (
        <div className="mt-8 rounded-2xl border border-line bg-surface p-5">
          <p className="text-[13.5px] leading-relaxed text-ink/80">{error}</p>
          <button type="button" onClick={onNext} className={cn(buttonClasses(), "mt-4 w-full")}>
            Продолжить
            <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <>
          <div className="mt-8 space-y-2.5">
            <VoteButton
              type="yes"
              selected={selected === "yes"}
              pending={pending}
              onClick={() => onVote("yes")}
              primary
            />
            <VoteButton
              type="no"
              selected={selected === "no"}
              pending={pending}
              onClick={() => onVote("no")}
            />
            <VoteButton
              type="unsure"
              selected={selected === "unsure"}
              pending={pending}
              onClick={() => onVote("unsure")}
            />
          </div>
          {error && (
            <p className="mt-4 text-[12px] leading-relaxed text-red-500" role="alert">
              {error}
            </p>
          )}
          <p className="mt-4 text-[11px] text-muted">
            Ваш голос окончателен. Одна оценка на работу.
          </p>
          {!signedIn && (
            <div className="mt-7 rounded-2xl border border-line bg-subtle p-4">
              <p className="text-[12.5px] font-medium">Вы играете как гость</p>
              <p className="mt-1 text-[11.5px] leading-relaxed text-muted">
                Ваши голоса учитываются. Войдите, чтобы сохранить очки, серии дней и достижения.
              </p>
              <div className="mt-3 flex gap-2">
                <Link href="/signup" className={buttonClasses({ size: "sm" })}>
                  Создать аккаунт
                </Link>
                <Link
                  href="/login"
                  className={buttonClasses({ variant: "ghost", size: "sm" })}
                >
                  Войти
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function VoteButton({
  type,
  selected,
  pending,
  onClick,
  primary,
}: {
  type: VoteType;
  selected: boolean;
  pending: boolean;
  onClick: () => void;
  primary?: boolean;
}) {
  const icon =
    type === "yes" ? <Check size={19} strokeWidth={2} /> : type === "no" ? <X size={19} strokeWidth={2} /> : <HelpCircle size={18} strokeWidth={1.8} />;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className={cn(
        "group flex h-[60px] w-full items-center justify-between rounded-2xl px-5 text-left text-[15px] font-medium transition-all duration-200 disabled:opacity-70",
        primary
          ? "bg-accent text-accent-ink hover:opacity-92"
          : type === "no"
            ? "border border-line bg-surface text-ink hover:border-ink/25 hover:bg-subtle"
            : "bg-subtle text-ink hover:bg-line/60",
        selected && "ring-2 ring-ink/20 ring-offset-2 ring-offset-paper",
      )}
    >
      <span className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full",
            primary ? "bg-white/15" : "bg-paper",
          )}
        >
          {pending && selected ? <Loader2 size={16} className="animate-spin" /> : icon}
        </span>
        {VOTE_LABELS[type]}
      </span>
      <span
        className={cn(
          "text-[10px] font-normal",
          primary ? "text-white/50" : "text-muted",
        )}
      >
        {type === "yes" ? "1" : type === "no" ? "2" : "3"}
      </span>
    </button>
  );
}

function RevealPanel({
  reveal,
  signedIn,
  onNext,
  isLastChallenge,
  challengeVotedCount,
  challengeTotal,
}: {
  reveal: VoteApiResponse;
  signedIn: boolean;
  onNext: () => void;
  isLastChallenge: boolean;
  challengeVotedCount: number;
  challengeTotal: number;
}) {
  const { artwork, stats, yourVote, pointsEarned, streak, newAchievements } = reveal;
  const category = CATEGORY_MAP[artwork.category]?.name ?? artwork.category;
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="eyebrow">Открыто</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-subtle px-2.5 py-1 text-[10.5px] font-medium">
          Вы выбрали: {VOTE_SHORT[yourVote].toLowerCase()}
        </span>
        {artwork.is_demo === 1 && (
          <span className="rounded-full border border-line px-2 py-0.5 text-[9px] uppercase tracking-[0.1em] text-muted">
            Демо
          </span>
        )}
      </div>

      <h1 className="display mt-4 text-[clamp(1.9rem,3.7vw,2.9rem)] leading-[1.05]">
        {artwork.title}
      </h1>
      <p className="mt-2.5 text-[13.5px] text-muted">
        {artwork.artist_name}
        {artwork.creation_year ? ` · ${artwork.creation_year}` : ""}
        {artwork.country ? ` · ${artwork.country}` : ""}
      </p>

      <div className="mt-6 rounded-2xl border border-line bg-surface p-5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-[12px] font-medium">Что думают другие</p>
          <p className="text-[11px] tabular-nums text-muted">
            {plural(stats.total, "оценка", "оценки", "оценок")}
          </p>
        </div>
        <VoteBars stats={stats} yourVote={yourVote} className="mt-4" />
      </div>

      <p className="mt-6 text-[14px] leading-[1.75] text-ink/85">
        {artwork.description}
      </p>

      {artwork.history && (
        <details className="group mt-5 border-t border-line pt-4">
          <summary className="flex cursor-pointer list-none items-center justify-between text-[12.5px] font-medium text-ink/80">
            История создания работы
            <ChevronDown size={15} className="text-muted transition-transform group-open:rotate-180" />
          </summary>
          <p className="mt-3 text-[13px] leading-[1.75] text-muted">{artwork.history}</p>
        </details>
      )}

      {artwork.fun_fact && (
        <div className="mt-5 rounded-2xl bg-subtle p-4">
          <p className="eyebrow">Интересный факт</p>
          <p className="mt-2 text-[12.5px] leading-relaxed text-ink/80">{artwork.fun_fact}</p>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-muted">
        <Link href={`/discover?category=${artwork.category}`} className="hover:text-ink">
          {category}
        </Link>
        {artwork.location && <span>{artwork.location}</span>}
        {artwork.is_ai_generated ? <span>Сгенерировано ИИ</span> : null}
      </div>

      {signedIn && (pointsEarned > 0 || newAchievements.length > 0) && (
        <FadeIn className="mt-5 rounded-2xl border border-line bg-surface p-4" delay={0.15}>
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-[12.5px] font-medium">
              <Sparkles size={14} />
              +{pointsEarned} очк.
            </span>
            {streak > 0 && (
              <span className="text-[11px] text-muted">{streak} дней подряд</span>
            )}
          </div>
          {newAchievements.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {newAchievements.map((achievement) => (
                <span
                  key={achievement.id}
                  className="inline-flex items-center gap-1 rounded-full bg-subtle px-2.5 py-1 text-[10.5px]"
                >
                  <Trophy size={11} />
                  {achievement.name}
                </span>
              ))}
            </div>
          )}
        </FadeIn>
      )}

      {!signedIn && (
        <div className="mt-5 rounded-2xl border border-line bg-subtle p-4">
          <p className="text-[12px] font-medium">Ваш голос учитывается, очки пока не начисляются.</p>
          <p className="mt-1 text-[11.5px] leading-relaxed text-muted">
            Создайте бесплатный аккаунт, чтобы вести серию дней и попасть в таблицу лидеров.
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
        <button type="button" onClick={onNext} className={cn(buttonClasses({ size: "lg" }), "w-full sm:flex-1")}>
          {isLastChallenge ? "Посмотреть результаты задания" : "Следующая работа"}
          <ArrowRight size={17} />
        </button>
        <Link
          href={`/artwork/${artwork.slug}`}
          className={buttonClasses({ variant: "secondary", size: "lg" })}
        >
          Открыть страницу работы
        </Link>
      </div>

      <p className="mt-4 text-[10px] leading-relaxed text-muted">
        {artwork.image_credit ? `Изображение: ${artwork.image_credit}` : "Изображение: демо-контент"}
        {artwork.image_license ? ` · ${artwork.image_license}` : ""}
        {artwork.image_source_url && (
          <>
            {" · "}
            <a
              href={artwork.image_source_url}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-0.5 underline underline-offset-2 hover:text-ink"
            >
              Источник <ExternalLink size={9} />
            </a>
          </>
        )}
      </p>

      {isLastChallenge && (
        <p className="mt-2 text-[10.5px] text-muted">
          {challengeVotedCount} из {challengeTotal} работ оценено в задании дня.
        </p>
      )}
    </div>
  );
}

function DoneState({
  mode,
  sessionPoints,
  judged,
  results,
  challengeComplete,
  completedCount,
  challengeTotal,
}: {
  mode: "play" | "challenge";
  sessionPoints: number;
  judged: number;
  results: Array<{ card: PlayCard; vote: VoteType; response: VoteApiResponse }>;
  challengeComplete: boolean;
  completedCount: number;
  challengeTotal: number;
}) {
  if (mode === "challenge") {
    return (
      <div className="container-narrow py-16 sm:py-24">
        <FadeIn className="text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-ink">
            <Check size={24} />
          </span>
          <p className="eyebrow mt-6">Задание дня</p>
          <h1 className="display mt-4 text-[clamp(2.4rem,6vw,4.4rem)] leading-[0.95]">
            {challengeComplete || completedCount >= challengeTotal
              ? "Все пять работ на сегодня оценены."
              : "Хорошее начало."}
          </h1>
          <p className="mx-auto mt-5 max-w-md text-[14px] leading-relaxed text-muted">
            Сегодня оценено {completedCount} из {challengeTotal} работ. Одинаковые пять
            работ ждут всех; возвращайтесь завтра за новым набором.
          </p>
        </FadeIn>

        {results.length > 0 && (
          <div className="mt-10 space-y-2">
            {results.map(({ card, vote, response }) => (
              <div
                key={card.id}
                className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-3"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-subtle">
                  <ArtworkImage
                    src={card.imageUrl}
                    alt={response.artwork.title}
                    width={card.imageWidth}
                    height={card.imageHeight}
                    className="h-full w-full object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium">{response.artwork.title}</p>
                  <p className="truncate text-[11px] text-muted">{response.artwork.artist_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-[12px] font-medium">{VOTE_SHORT[vote]}</p>
                  <p className="text-[10.5px] text-muted">{response.stats.yesPct}% считают искусством</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {sessionPoints > 0 && (
          <p className="mt-8 text-center text-[13px] text-muted">
            <span className="font-medium text-ink">+{sessionPoints} очк.</span> за эту
            сессию.
          </p>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/leaderboard" className={buttonClasses()}>
            Посмотреть таблицу лидеров
          </Link>
          <Link href="/discover" className={buttonClasses({ variant: "secondary" })}>
            Открыть галерею
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-narrow py-16 sm:py-24">
      <FadeIn className="text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-line bg-surface">
          <RotateCcw size={22} className="text-muted" />
        </span>
        <p className="eyebrow mt-6">Внимательный взгляд</p>
        <h1 className="display mt-4 text-[clamp(2.4rem,6vw,4.4rem)] leading-[0.95]">
          Вы оценили
          <br />
          всё.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-[14px] leading-relaxed text-muted">
          Пока всё. Новые работы поступают от сообщества и из очереди модерации.
          Возвращайтесь завтра за новым заданием дня.
        </p>
        {sessionPoints > 0 && (
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-[12.5px]">
            <Sparkles size={14} />+{plural(sessionPoints, "очко", "очка", "очков")} за сессию
            {judged > 0 ? ` · ${plural(judged, "оценка", "оценки", "оценок")}` : ""}
          </p>
        )}
      </FadeIn>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/challenge" className={buttonClasses()}>
          Пройти задание дня
        </Link>
        <Link href="/discover" className={buttonClasses({ variant: "secondary" })}>
          Просмотреть галерею
        </Link>
        <Link href="/submit" className={buttonClasses({ variant: "ghost" })}>
          Предложить работу
        </Link>
      </div>
    </div>
  );
}
