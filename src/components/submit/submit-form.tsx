"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ImagePlus,
  Loader2,
  ShieldCheck,
  UploadCloud,
  X,
} from "lucide-react";

import { buttonClasses } from "@/components/ui/button";
import { CATEGORIES, LIMITS } from "@/lib/constants";
import { cn } from "@/lib/utils";

type SubmitState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; message: string; slug: string };

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

export function SubmitForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [pending, setPending] = useState(false);
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  function chooseFile(next: File | null) {
    setState({ status: "idle" });
    if (!next) {
      setFile(null);
      setPreview(null);
      return;
    }
    if (!ACCEPTED.includes(next.type)) {
      setState({ status: "error", message: "Use a JPG, PNG or WEBP image." });
      return;
    }
    if (next.size > LIMITS.uploadBytes) {
      setState({
        status: "error",
        message: `That image is larger than ${Math.round(LIMITS.uploadBytes / 1024 / 1024)} MB.`,
      });
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setFile(next);
    setPreview(URL.createObjectURL(next));
  }

  function removeFile() {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    if (!file) {
      setState({ status: "error", message: "Choose an image to submit." });
      return;
    }
    setPending(true);
    setState({ status: "idle" });

    try {
      const data = new FormData(form);
      data.set("image", file);
      const response = await fetch("/api/artworks", {
        method: "POST",
        body: data,
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        setState({
          status: "error",
          message: result.error ?? "Could not submit the artwork. Try again.",
        });
        setPending(false);
        return;
      }
      setState({
        status: "success",
        message: result.message ?? "Submitted for review.",
        slug: result.slug,
      });
      formRef.current?.reset();
      removeFile();
      setPending(false);
    } catch {
      setState({ status: "error", message: "Network error. Check your connection and try again." });
      setPending(false);
    }
  }

  if (state.status === "success") {
    return (
      <div className="card p-8 text-center sm:p-12">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-ink">
          <Check size={24} />
        </span>
        <h2 className="display mt-6 text-[clamp(1.8rem,3.5vw,2.6rem)] leading-[1.02]">
          Thank you — it&apos;s in the queue.
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-[13.5px] leading-relaxed text-muted">
          {state.message} A moderator reviews every submission before it appears in
          the gallery. You can follow its status on this page.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/play" className={buttonClasses()}>
            Keep playing <ArrowRight size={15} />
          </Link>
          <button
            type="button"
            onClick={() => setState({ status: "idle" })}
            className={buttonClasses({ variant: "secondary" })}
          >
            Submit another work
          </button>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-7">
      <div>
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor="image" className="text-[12px] font-medium">
            The image
          </label>
          <span className="text-[10.5px] text-muted">JPG, PNG or WEBP · max 8 MB</span>
        </div>

        {preview ? (
          <div className="relative mt-3 overflow-hidden rounded-2xl border border-line bg-subtle">
            <div className="relative flex min-h-[260px] items-center justify-center p-4">
              <Image
                src={preview}
                alt="Selected artwork preview"
                width={800}
                height={800}
                unoptimized
                className="max-h-[420px] w-auto rounded-lg object-contain"
              />
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-line bg-surface px-4 py-2.5">
              <p className="truncate text-[11.5px] text-muted">{file?.name}</p>
              <button
                type="button"
                onClick={removeFile}
                className="inline-flex items-center gap-1 text-[11px] text-muted transition-colors hover:text-ink"
              >
                <X size={12} /> Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              chooseFile(event.dataTransfer.files?.[0] ?? null);
            }}
            className={cn(
              "mt-3 flex min-h-[230px] w-full flex-col items-center justify-center rounded-2xl border border-dashed px-6 text-center transition-colors",
              dragging
                ? "border-ink/40 bg-subtle"
                : "border-line bg-subtle/50 hover:border-ink/25 hover:bg-subtle",
            )}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-surface">
              <UploadCloud size={20} strokeWidth={1.6} />
            </span>
            <span className="mt-4 text-[13.5px] font-medium">
              Drop an image here, or click to browse
            </span>
            <span className="mt-1.5 max-w-xs text-[11.5px] leading-relaxed text-muted">
              At least {LIMITS.minImageSide}px on the shortest side. Your image is
              only visible to moderators until it is approved.
            </span>
          </button>
        )}

        <input
          ref={inputRef}
          id="image"
          name="image"
          type="file"
          accept={ACCEPTED.join(",")}
          className="sr-only"
          onChange={(event) => chooseFile(event.target.files?.[0] ?? null)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Title" htmlFor="title" className="sm:col-span-2">
          <input
            id="title"
            name="title"
            required
            maxLength={120}
            placeholder="Untitled (study in grey)"
            className="field"
          />
        </Field>

        <Field label="Artist or pseudonym" htmlFor="artistName">
          <input
            id="artistName"
            name="artistName"
            required
            maxLength={120}
            placeholder="How should the work be credited?"
            className="field"
          />
        </Field>

        <Field label="Category" htmlFor="category">
          <select id="category" name="category" required defaultValue="" className="field">
            <option value="" disabled>
              Choose a category
            </option>
            {CATEGORIES.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Year" htmlFor="creationYear" hint="Optional">
          <input
            id="creationYear"
            name="creationYear"
            maxLength={24}
            placeholder="2026"
            className="field"
          />
        </Field>

        <Field label="Country" htmlFor="country" hint="Optional">
          <input id="country" name="country" maxLength={80} placeholder="Where was it made?" className="field" />
        </Field>

        <Field label="Location" htmlFor="location" hint="Optional" className="sm:col-span-2">
          <input
            id="location"
            name="location"
            maxLength={160}
            placeholder="Collection, city, or 'private collection'"
            className="field"
          />
        </Field>

        <Field
          label="About the work"
          htmlFor="description"
          hint="20–2000 characters"
          className="sm:col-span-2"
        >
          <textarea
            id="description"
            name="description"
            required
            minLength={20}
            maxLength={2000}
            rows={5}
            placeholder="What should a viewer know before they judge it? Describe the work, not its reputation."
            className="field-area"
          />
        </Field>
      </div>

      <div className="space-y-3 rounded-2xl border border-line bg-subtle/60 p-4">
        <Checkbox name="isOriginal" label="I made this work, or I have permission to share it." defaultChecked />
        <Checkbox name="isAiGenerated" label="This work was generated or co-created with AI." />
        <Checkbox name="isAnonymous" label="Hide my username on the public artwork page." />
        <Checkbox
          name="agree"
          required
          label="I understand every submission is reviewed, and that the platform records opinions rather than facts."
        />
      </div>

      {state.status === "error" && (
        <p className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-[12.5px] text-red-600 dark:text-red-400" role="alert">
          {state.message}
        </p>
      )}

      <div className="flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="inline-flex items-center gap-1.5 text-[11px] text-muted">
          <ShieldCheck size={13} />
          Reviewed by a human moderator
        </p>
        <button type="submit" disabled={pending} className={buttonClasses({ size: "lg" })}>
          {pending ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
          {pending ? "Submitting…" : "Submit for review"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="text-[12px] font-medium">
          {label}
        </label>
        {hint && <span className="text-[10px] text-muted">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Checkbox({
  name,
  label,
  defaultChecked,
  required,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
  required?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-[12px] leading-relaxed text-ink/80">
      <input
        type="checkbox"
        name={name}
        value="true"
        defaultChecked={defaultChecked}
        required={required}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-line accent-[var(--ink)]"
      />
      {label}
    </label>
  );
}
