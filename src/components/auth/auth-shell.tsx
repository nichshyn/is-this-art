import Image from "next/image";
import Link from "next/link";

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="container-page py-8 sm:py-14">
      <div className="grid items-stretch gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12">
        <div className="mx-auto flex w-full max-w-[430px] flex-col justify-center py-4 sm:py-8">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="display mt-4 text-[clamp(2.2rem,4.8vw,3.5rem)] leading-[0.96]">
            {title}
          </h1>
          <p className="mt-4 text-[13.5px] leading-relaxed text-muted">{description}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-6 text-[12.5px] text-muted">{footer}</div>
        </div>

        <aside className="relative hidden min-h-[600px] overflow-hidden rounded-[32px] bg-ink lg:block">
          <Image
            src="/artworks/great-wave.jpg"
            alt=""
            fill
            sizes="50vw"
            className="object-cover opacity-55"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10" />
          <div className="absolute inset-x-0 bottom-0 p-9 text-white">
            <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-white/50">
              Социальный эксперимент о вкусе
            </p>
            <blockquote className="mt-4 max-w-sm text-[22px] font-medium leading-[1.25] tracking-tight">
              «Правильных ответов нет. Есть только зал и то, что он видит.»
            </blockquote>
            <p className="mt-5 text-[11.5px] text-white/55">
              Сначала смотрите. Потом оценивайте. Подпись — напоследок.
            </p>
          </div>
          <Link
            href="/play"
            className="absolute right-6 top-6 rounded-full border border-white/20 bg-black/20 px-3.5 py-2 text-[11px] text-white/80 backdrop-blur transition-colors hover:bg-black/40"
          >
            Попробовать без аккаунта
          </Link>
        </aside>
      </div>
    </div>
  );
}

export function GoogleButton({ label = "Продолжить через Google" }: { label?: string }) {
  return (
    <a
      href="/api/auth/google"
      className="inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-full border border-line bg-surface text-[13px] font-medium transition-colors hover:bg-subtle"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[17px] w-[17px]">
        <path
          fill="#4285F4"
          d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.54-5.17 3.54-8.87Z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.15-4.05 1.15-3.12 0-5.77-2.1-6.71-4.93H1.28v3.09A11.99 11.99 0 0 0 12 24Z"
        />
        <path
          fill="#FBBC05"
          d="M5.29 14.31a7.2 7.2 0 0 1 0-4.61V6.61H1.28a12 12 0 0 0 0 10.78l4.01-3.08Z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.76 0 3.34.61 4.58 1.8l3.44-3.44A11.97 11.97 0 0 0 12 0 11.99 11.99 0 0 0 1.28 6.61l4.01 3.09C6.23 6.86 8.88 4.75 12 4.75Z"
        />
      </svg>
      {label}
    </a>
  );
}
