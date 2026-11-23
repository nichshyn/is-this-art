import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy & terms",
  description:
    "What IS THIS ART? stores, how cookies are used, and the terms that apply to this demonstration project.",
  alternates: { canonical: "/privacy" },
};

const SECTIONS = [
  {
    id: "what-we-store",
    title: "What we store",
    body: [
      "If you create an account: your username, email address, a scrypt hash of your password, optional bio and avatar URL, points, streak, achievements and timestamps.",
      "If you play: each judgment (yes / no / not sure) linked to your account or an anonymous guest identifier, plus the artwork judged and the time. Votes are final and one per person per work.",
      "If you participate: comments, likes, follows, reports and submitted artworks, including the image file and the description you provide.",
      "If you sign in with Google: your email address, verified status, display name and profile picture URL. We do not receive your Google password.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies & local storage",
    body: [
      "ita_session is an httpOnly cookie containing a random session token. The server stores only a hash of that token. It expires after 30 days or when you sign out.",
      "ita_guest is an httpOnly, signed cookie used to enforce one vote per guest per artwork. It expires after one year and contains no personal information.",
      "ita_oauth_state is a short-lived httpOnly cookie used to protect the Google sign-in flow.",
      "Your light/dark preference is stored in localStorage under ita-theme. It never leaves your browser.",
      "There are no advertising cookies, third-party analytics scripts or cross-site trackers in this project.",
    ],
  },
  {
    id: "how-we-use-it",
    title: "How it is used",
    body: [
      "To run the game: count votes, calculate percentages, award points, maintain streaks and render the leaderboard.",
      "To moderate the gallery: review submissions, handle reports and prevent abuse such as spam or repeated votes.",
      "To operate accounts: authenticate you, let you manage your profile and respond to password reset requests.",
      "We do not sell personal data, build advertising profiles or share data with data brokers.",
    ],
  },
  {
    id: "retention",
    title: "Retention & deletion",
    body: [
      "Account data is kept until you delete your account. Deleting your account removes your votes, comments, likes, follows, reports and submissions, and signs you out.",
      "Guest votes remain linked to a random identifier until the gallery is reset or the vote is removed by an administrator. They are not linked to a name or email.",
      "Server logs may contain request metadata for a short period for security and debugging. This demonstration stores data in a local SQLite database unless a Supabase deployment is configured.",
    ],
  },
  {
    id: "security",
    title: "Security",
    body: [
      "Passwords are hashed with scrypt and a per-user salt. Session tokens are random, stored hashed, and sent in httpOnly, sameSite cookies.",
      "All mutations validate input server-side and use parameterised SQL. Uploads are checked by file signature and dimensions before being stored.",
      "No system is perfect. If you find a security issue, please report it to the operator of this instance rather than exploiting it.",
    ],
  },
  {
    id: "terms",
    title: "Terms of use",
    body: [
      "This is a demonstration product. Percentages reflect stored opinions, not expert appraisal, market value or legal ownership. Nothing here is art-historical advice.",
      "By submitting an image you confirm you made it or have permission to share it, and you grant this instance permission to display it for the purpose of the experiment. Do not upload illegal, hateful, sexually explicit or non-consensual content.",
      "Moderators may reject, hide or remove content, suspend accounts and reset demonstration data. Approved works can be removed on request.",
      "The service is provided as-is, without warranties. The operator is not liable for decisions made on the basis of votes or comments.",
      "If you are under the age required to consent to data processing in your jurisdiction, do not create an account.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="container-page py-10 sm:py-14">
      <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="eyebrow">The fine print</p>
          <h1 className="display mt-4 text-[clamp(2rem,4.4vw,3.2rem)] leading-[0.96]">
            Privacy
            <br />
            &amp; terms.
          </h1>
          <nav className="mt-6 hidden space-y-2 lg:block" aria-label="On this page">
            {SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block text-[11.5px] text-muted transition-colors hover:text-ink"
              >
                {section.title}
              </a>
            ))}
          </nav>
          <p className="mt-6 text-[10.5px] leading-relaxed text-muted">
            Last updated {new Date().getFullYear()}. This note describes the reference
            implementation in this repository.
          </p>
        </aside>

        <div className="max-w-2xl">
          <p className="text-[14px] leading-[1.8] text-ink/85">
            IS THIS ART? is a small demonstration of a social game about taste. It is
            designed to collect as little as possible while still making votes,
            points and moderation work. This page explains what is stored and the
            terms that apply.
          </p>

          <div className="mt-9 space-y-10">
            {SECTIONS.map((section, index) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <div className="flex items-baseline gap-3 border-b border-line pb-2.5">
                  <span className="text-[10px] tabular-nums text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-[15px] font-medium tracking-tight">{section.title}</h2>
                </div>
                <div className="mt-4 space-y-3">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="text-[13px] leading-[1.8] text-muted">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-line bg-subtle/60 p-5">
            <h2 className="text-[13px] font-medium">Questions or removal requests</h2>
            <p className="mt-2 text-[12px] leading-relaxed text-muted">
              Use the report control on any artwork page to flag a credit, rights or
              content issue. For account deletion, sign in and use{" "}
              <Link href="/settings" className="underline underline-offset-2 hover:text-ink">
                Settings → Danger zone
              </Link>
              . Instance operators should replace this paragraph with a contact
              address before deploying publicly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
