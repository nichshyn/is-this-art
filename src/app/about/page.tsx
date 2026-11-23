import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Eye, Scale, Sparkles } from "lucide-react";

import { buttonClasses } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "About the experiment",
  description:
    "IS THIS ART? is a social experiment about taste. It does not define art; it records what people see.",
  alternates: { canonical: "/about" },
};

const PRINCIPLES = [
  {
    number: "01",
    title: "Look before you read",
    text: "In Play, the title, artist and history are hidden until you have made a judgment. The label is part of the work — but it should not be the first thing you see.",
  },
  {
    number: "02",
    title: "One person, one answer",
    text: "Each account or guest session can judge a work once. The constraint lives in the database, not just the interface. Ballot-stuffing is not an opinion.",
  },
  {
    number: "03",
    title: "Percentages are not verdicts",
    text: "The numbers describe the room, not the work. A work with 41% 'yes' is not 41% art. It is a record of a conversation.",
  },
  {
    number: "04",
    title: "Credit the source",
    text: "Historical images are public domain or CC0 and carry a credit, licence and source link. Demo works are labelled. The site never invents provenance.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="container-page pb-16 pt-12 sm:pb-24 sm:pt-20">
        <div className="max-w-4xl">
          <p className="eyebrow">The experiment</p>
          <h1 className="display mt-5 text-[clamp(3rem,8vw,7rem)] leading-[0.86]">
            WHO DECIDES
            <br />
            WHAT ART IS?
          </h1>
          <p className="mt-7 max-w-2xl text-[15px] leading-[1.8] text-muted">
            IS THIS ART? is a small, deliberate experiment about taste. You are shown
            an image without its label. You make a call. Then the label, the history
            and the room&apos;s answers appear.
          </p>
          <p className="mt-4 max-w-2xl text-[15px] leading-[1.8] text-muted">
            The site does not tell you what art is. It asks you to notice your own
            reaction — and then to see how it compares with everyone else&apos;s.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/play" className={buttonClasses({ size: "lg" })}>
              Make a judgment <ArrowRight size={16} />
            </Link>
            <Link href="/discover" className={buttonClasses({ variant: "secondary", size: "lg" })}>
              Browse the gallery
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-subtle/50">
        <div className="container-page grid gap-8 py-12 sm:grid-cols-3 sm:py-16">
          {[
            {
              icon: <Eye size={18} strokeWidth={1.6} />,
              title: "A game, not a test",
              text: "There are no correct answers and no score for being right. Points reward looking, not agreeing.",
            },
            {
              icon: <Scale size={18} strokeWidth={1.6} />,
              title: "A record, not a court",
              text: "Votes are opinions. The platform does not adjudicate quality, ownership or artistic merit.",
            },
            {
              icon: <Sparkles size={18} strokeWidth={1.6} />,
              title: "A gallery, not a feed",
              text: "One work at a time, with room to look. No infinite scroll, no engagement bait, no ads.",
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
            <p className="eyebrow">Four principles</p>
            <h2 className="display mt-4 text-[clamp(2rem,4.4vw,3.6rem)] leading-[0.98]">
              The rules are
              <br />
              deliberately few.
            </h2>
            <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed text-muted">
              The experiment is built to make one thing slightly harder: deciding
              before you have looked.
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
            <p className="eyebrow">What is in the gallery</p>
            <h2 className="display mt-4 text-[clamp(1.8rem,3.6vw,2.8rem)] leading-[1.02]">
              Real works, clearly labelled demos.
            </h2>
            <p className="mt-4 max-w-lg text-[13px] leading-[1.8] text-muted">
              The catalogue mixes public-domain and CC0 images from Wikimedia Commons
              with a small number of demonstration pieces created for this project.
              Every record shows its credit and licence; demo works carry a visible
              &ldquo;Demo&rdquo; badge. AI-assisted images are marked as such.
            </p>
            <Link href="/credits" className="link-underline mt-5 inline-flex text-[12.5px] font-medium">
              Image credits and licences
            </Link>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-6">
            <p className="eyebrow">A note on the numbers</p>
            <p className="mt-3 text-[13px] leading-[1.8] text-muted">
              Percentages are computed from stored votes at the moment you look. They
              are not weighted by expertise, seniority or follower count. A curator
              and a first-time visitor each get one answer.
            </p>
            <p className="mt-3 text-[13px] leading-[1.8] text-muted">
              Because the gallery is small and the seed data is partly simulated, the
              numbers here are a demonstration of the mechanic, not a scientific
              survey.
            </p>
          </div>
        </div>
      </section>

      <section className="container-page py-20 text-center sm:py-24">
        <h2 className="display mx-auto max-w-2xl text-[clamp(2rem,4.6vw,3.8rem)] leading-[0.98]">
          There is no answer key.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[13.5px] leading-relaxed text-muted">
          There is only the next image, your first reaction, and the room.
        </p>
        <Link href="/play" className={buttonClasses({ size: "lg", className: "mt-7" })}>
          Start exploring <ArrowRight size={16} />
        </Link>
      </section>
    </>
  );
}
