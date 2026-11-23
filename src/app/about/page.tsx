import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Eye, Scale, Sparkles } from "lucide-react";

import { buttonClasses } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "О проекте",
  description:
    "IS THIS ART? — социальный эксперимент о вкусе. Он не даёт определения искусству, а фиксирует, что видят люди.",
  alternates: { canonical: "/about" },
};

const PRINCIPLES = [
  {
    number: "01",
    title: "Сначала смотрите, потом читайте",
    text: "В игре название, автор и история скрыты, пока вы не вынесете суждение. Подпись — часть работы, но не то, что должно бросаться в глаза первым.",
  },
  {
    number: "02",
    title: "Один человек — один ответ",
    text: "Каждый аккаунт или гостевая сессия может оценить работу один раз. Ограничение зашито в базе данных, а не только в интерфейсе. Накрутка голосов — не мнение.",
  },
  {
    number: "03",
    title: "Проценты — не приговор",
    text: "Цифры описывают собравшихся, а не работу. Работа с 41 % голосов «за» не является искусством на 41 %. Это запись разговора.",
  },
  {
    number: "04",
    title: "Указывайте источник",
    text: "Исторические изображения находятся в общественном достоянии или под лицензией CC0 и снабжены указанием авторства, лицензией и ссылкой на источник. Демо-работы помечены. Сайт никогда не выдумывает происхождение.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="container-page pb-16 pt-12 sm:pb-24 sm:pt-20">
        <div className="max-w-4xl">
          <p className="eyebrow">Эксперимент</p>
          <h1 className="display mt-5 text-[clamp(3rem,8vw,7rem)] leading-[0.86]">
            КТО РЕШАЕТ,
            <br />
            ЧТО ТАКОЕ ИСКУССТВО?
          </h1>
          <p className="mt-7 max-w-2xl text-[15px] leading-[1.8] text-muted">
            IS THIS ART? — небольшой, вдумчивый эксперимент о вкусе. Вам показывают
            изображение без подписи. Вы выносите суждение. Затем появляются
            подпись, история и ответы других.
          </p>
          <p className="mt-4 max-w-2xl text-[15px] leading-[1.8] text-muted">
            Сайт не говорит, что такое искусство. Он просит заметить вашу собственную
            реакцию — и сравнить её с реакциями остальных.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/play" className={buttonClasses({ size: "lg" })}>
              Вынести суждение <ArrowRight size={16} />
            </Link>
            <Link href="/discover" className={buttonClasses({ variant: "secondary", size: "lg" })}>
              Открыть галерею
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-subtle/50">
        <div className="container-page grid gap-8 py-12 sm:grid-cols-3 sm:py-16">
          {[
            {
              icon: <Eye size={18} strokeWidth={1.6} />,
              title: "Игра, а не тест",
              text: "Правильных ответов нет и очков за «правильность» не бывает. Очки поощряют внимание, а не согласие.",
            },
            {
              icon: <Scale size={18} strokeWidth={1.6} />,
              title: "Запись, а не суд",
              text: "Голоса — это мнения. Платформа не оценивает качество, права собственности или художественные достоинства.",
            },
            {
              icon: <Sparkles size={18} strokeWidth={1.6} />,
              title: "Галерея, а не лента",
              text: "По одной работе за раз и с местом для рассматривания. Ни бесконечной прокрутки, ни крючков для вовлечения, ни рекламы.",
            },
          ].map((item, index) => (
            <Reveal key={item.title} delay={index * 0.05} className="flex gap-4">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-paper">
                {item.icon}
              </span>
              <div>
                <h2 className="text-[13.5px] font-medium">{item.title}</h2>
                <p className="mt-1.5 max-w-xs text-[12px] leading-relaxed text-muted">
                  {item.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-page py-20 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow">Четыре принципа</p>
            <h2 className="display mt-4 text-[clamp(2rem,4.4vw,3.6rem)] leading-[0.98]">
              Правил
              <br />
              намеренно мало.
            </h2>
            <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed text-muted">
              Эксперимент устроен так, чтобы чуть сложнее было решить до того, как
              вы посмотрите.
            </p>
          </div>
          <ol className="space-y-8">
            {PRINCIPLES.map((principle, index) => (
              <Reveal key={principle.number} delay={index * 0.04}>
                <li className="grid gap-3 border-t border-line pt-5 sm:grid-cols-[60px_minmax(0,1fr)]">
                  <span className="text-[11px] tabular-nums text-muted">{principle.number}</span>
                  <div>
                    <h3 className="text-[15px] font-medium tracking-tight">{principle.title}</h3>
                    <p className="mt-2 text-[13px] leading-[1.8] text-muted">{principle.text}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-line bg-subtle/40">
        <div className="container-page grid gap-10 py-16 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="eyebrow">Что в галерее</p>
            <h2 className="display mt-4 text-[clamp(1.8rem,3.6vw,2.8rem)] leading-[1.02]">
              Настоящие работы и явно помеченные демо.
            </h2>
            <p className="mt-4 max-w-lg text-[13px] leading-[1.8] text-muted">
              Каталог соединяет изображения из общественного достояния и под лицензией
              CC0 с Wikimedia Commons и небольшое число демонстрационных работ,
              созданных для проекта. У каждой записи указаны авторство и лицензия;
              демо-работы носят заметный бейдж «Демо». Изображения, созданные с
              помощью ИИ, тоже помечены.
            </p>
            <Link href="/credits" className="link-underline mt-5 inline-flex text-[12.5px] font-medium">
              Источники и лицензии изображений
            </Link>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-6">
            <p className="eyebrow">О цифрах</p>
            <p className="mt-3 text-[13px] leading-[1.8] text-muted">
              Проценты рассчитываются из сохранённых голосов на момент, когда вы
              смотрите. Они не взвешиваются по экспертизе, стажу или числу
              подписчиков. Куратор и новый посетитель дают по одному ответу.
            </p>
            <p className="mt-3 text-[13px] leading-[1.8] text-muted">
              Поскольку галерея невелика, а исходные данные отчасти смоделированы,
              цифры здесь демонстрируют механизм, а не научное исследование.
            </p>
          </div>
        </div>
      </section>

      <section className="container-page py-20 text-center sm:py-24">
        <h2 className="display mx-auto max-w-2xl text-[clamp(2rem,4.6vw,3.8rem)] leading-[0.98]">
          Правильных ответов нет.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[13.5px] leading-relaxed text-muted">
          Есть только следующее изображение, ваша первая реакция и другие люди.
        </p>
        <Link href="/play" className={buttonClasses({ size: "lg", className: "mt-7" })}>
          Начать обзор <ArrowRight size={16} />
        </Link>
      </section>
    </>
  );
}
