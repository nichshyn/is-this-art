"use client";

import { useEffect, useRef, useState, useActionState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Check,
  ExternalLink,
  ImagePlus,
  Loader2,
  UploadCloud,
} from "lucide-react";

import {
  adminCreateArtworkAction,
  adminUpdateArtworkAction,
} from "@/app/actions/admin";
import type { FormState } from "@/app/actions/auth";
import { buttonClasses } from "@/components/ui/button";
import type { Artwork } from "@/lib/types";

const initial: FormState = {};

export function AdminArtworkForm({
  artwork,
  categories,
}: {
  artwork?: Artwork;
  categories: Array<{ slug: string; name: string }>;
}) {
  const action = artwork ? adminUpdateArtworkAction : adminCreateArtworkAction;
  const [state, formAction, pending] = useActionState(action, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState(artwork?.image_url ?? "");

  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  const preview = filePreview || imageUrl;

  if (state.success) {
    return (
      <div className="card p-8 text-center sm:p-12">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-ink">
          <Check size={21} />
        </span>
        <h2 className="display mt-5 text-[clamp(1.6rem,3vw,2.2rem)]">
          {artwork ? "Artwork updated." : "Artwork created."}
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-[12.5px] leading-relaxed text-muted">
          {state.success}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link href="/admin/artworks" className={buttonClasses({ size: "sm" })}>
            Back to catalog
          </Link>
          {!artwork && (
            <button
              type="button"
              onClick={() => window.location.reload()}
              className={buttonClasses({ variant: "secondary", size: "sm" })}
            >
              Add another
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-7">
      {artwork && <input type="hidden" name="id" value={artwork.id} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Title" htmlFor="title" className="sm:col-span-2">
          <input
            id="title"
            name="title"
            required
            maxLength={120}
            defaultValue={artwork?.title ?? ""}
            className="field"
          />
        </Field>
        <Field label="Slug" htmlFor="slug" hint="Lowercase, numbers, hyphens">
          <input
            id="slug"
            name="slug"
            required
            maxLength={80}
            pattern="[a-z0-9-]+"
            defaultValue={artwork?.slug ?? ""}
            placeholder="the-great-wave"
            className="field"
          />
        </Field>
        <Field label="Artist name" htmlFor="artistName">
          <input
            id="artistName"
            name="artistName"
            required
            maxLength={120}
            defaultValue={artwork?.artist_name ?? ""}
            className="field"
          />
        </Field>
        <Field label="Category" htmlFor="category">
          <select
            id="category"
            name="category"
            required
            defaultValue={artwork?.category ?? ""}
            className="field"
          >
            <option value="" disabled>
              Choose a category
            </option>
            {categories.map((category) => (
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
            defaultValue={artwork?.creation_year ?? ""}
            className="field"
          />
        </Field>
        <Field label="Country" htmlFor="country" hint="Optional">
          <input
            id="country"
            name="country"
            maxLength={80}
            defaultValue={artwork?.country ?? ""}
            className="field"
          />
        </Field>
        <Field label="Location" htmlFor="location" hint="Optional">
          <input
            id="location"
            name="location"
            maxLength={160}
            defaultValue={artwork?.location ?? ""}
            className="field"
          />
        </Field>
        <Field label="Description" htmlFor="description" className="sm:col-span-2">
          <textarea
            id="description"
            name="description"
            required
            minLength={10}
            maxLength={2000}
            rows={4}
            defaultValue={artwork?.description ?? ""}
            className="field-area"
          />
        </Field>
        <Field label="History" htmlFor="history" hint="Optional · shown after voting" className="sm:col-span-2">
          <textarea
            id="history"
            name="history"
            maxLength={4000}
            rows={4}
            defaultValue={artwork?.history ?? ""}
            className="field-area"
          />
        </Field>
        <Field label="Interesting fact" htmlFor="funFact" hint="Optional" className="sm:col-span-2">
          <input
            id="funFact"
            name="funFact"
            maxLength={500}
            defaultValue={artwork?.fun_fact ?? ""}
            className="field"
          />
        </Field>
      </div>

      <div className="rounded-2xl border border-line p-4 sm:p-5">
        <h3 className="text-[12px] font-medium">Image</h3>
        <p className="mt-1 text-[11px] text-muted">
          Upload a file, or point to a local /artworks path or an https URL.
        </p>
        <div className="mt-4 grid gap-5 sm:grid-cols-[220px_minmax(0,1fr)]">
          <div className="relative flex min-h-[170px] items-center justify-center overflow-hidden rounded-xl border border-line bg-subtle p-2">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="Artwork preview"
                className="max-h-[220px] max-w-full rounded-md object-contain"
              />
            ) : (
              <span className="flex flex-col items-center gap-2 text-[10.5px] text-muted">
                <ImagePlus size={20} />
                No image selected
              </span>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="image" className="mb-1.5 block text-[11px] font-medium">
                Upload file
              </label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (filePreview) URL.revokeObjectURL(filePreview);
                  setFilePreview(file ? URL.createObjectURL(file) : null);
                }}
                className="block w-full text-[11px] text-muted file:mr-3 file:rounded-full file:border-0 file:bg-subtle file:px-3 file:py-1.5 file:text-[11px] file:font-medium file:text-ink hover:file:bg-line"
              />
            </div>
            <div>
              <label htmlFor="imageUrl" className="mb-1.5 block text-[11px] font-medium">
                Or image URL / local path
              </label>
              <input
                id="imageUrl"
                name="imageUrl"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="/artworks/mona-lisa.jpg"
                className="field text-[12px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Width" htmlFor="imageWidth" hint="px">
                <input
                  id="imageWidth"
                  name="imageWidth"
                  type="number"
                  min={1}
                  defaultValue={artwork?.image_width ?? 1200}
                  className="field text-[12px]"
                />
              </Field>
              <Field label="Height" htmlFor="imageHeight" hint="px">
                <input
                  id="imageHeight"
                  name="imageHeight"
                  type="number"
                  min={1}
                  defaultValue={artwork?.image_height ?? 1200}
                  className="field text-[12px]"
                />
              </Field>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Image credit" htmlFor="imageCredit" hint="Optional">
            <input
              id="imageCredit"
              name="imageCredit"
              maxLength={300}
              defaultValue={artwork?.image_credit ?? ""}
              className="field text-[12px]"
            />
          </Field>
          <Field label="Licence" htmlFor="imageLicense" hint="Optional">
            <input
              id="imageLicense"
              name="imageLicense"
              maxLength={200}
              defaultValue={artwork?.image_license ?? ""}
              className="field text-[12px]"
            />
          </Field>
          <Field label="Source URL" htmlFor="imageSourceUrl" hint="Optional · https" className="sm:col-span-2">
            <input
              id="imageSourceUrl"
              name="imageSourceUrl"
              type="url"
              maxLength={1000}
              defaultValue={artwork?.image_source_url ?? ""}
              className="field text-[12px]"
            />
          </Field>
        </div>
        {artwork?.image_source_url && (
          <a
            href={artwork.image_source_url}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-2 inline-flex items-center gap-1 text-[10px] text-muted underline underline-offset-2"
          >
            Current source <ExternalLink size={9} />
          </a>
        )}
      </div>

      <div className="flex flex-wrap gap-5 rounded-2xl border border-line bg-subtle/50 p-4">
        <CheckField name="isAiGenerated" label="AI-generated" defaultChecked={artwork?.is_ai_generated === 1} />
        <CheckField name="isVerified" label="Verified source" defaultChecked={artwork ? artwork.is_verified === 1 : true} />
        <CheckField name="isDemo" label="Demo content" defaultChecked={artwork?.is_demo === 1} />
      </div>

      {state.error && (
        <p className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-[12px] text-red-600 dark:text-red-400">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          {state.error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2 border-t border-line pt-5">
        <button type="submit" disabled={pending} className={buttonClasses({ size: "md" })}>
          {pending ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
          {artwork ? "Save changes" : "Create artwork"}
        </button>
        <Link href="/admin/artworks" className={buttonClasses({ variant: "ghost", size: "md" })}>
          Cancel
        </Link>
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
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <label htmlFor={htmlFor} className="text-[11px] font-medium">
          {label}
        </label>
        {hint && <span className="text-[9.5px] text-muted">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function CheckField({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-[11.5px] text-ink/80">
      <input
        type="checkbox"
        name={name}
        value="true"
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-line accent-[var(--ink)]"
      />
      {label}
    </label>
  );
}
