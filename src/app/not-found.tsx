import Link from "next/link";

import { buttonClasses } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-narrow flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">404</p>
      <h1 className="display mt-5 text-[clamp(3rem,9vw,6rem)] leading-[0.9]">
        Не искусство.
        <br />
        Не найдено.
      </h1>
      <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted">
        Возможно, страница была перемещена, отклонена модератором или никогда не
        существовала.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className={buttonClasses({ variant: "primary" })}>
          На главную
        </Link>
        <Link href="/discover" className={buttonClasses({ variant: "secondary" })}>
          Открыть галерею
        </Link>
      </div>
    </div>
  );
}
