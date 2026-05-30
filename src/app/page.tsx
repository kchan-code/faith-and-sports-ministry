import type { ReactNode } from "react";

function Section({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`mx-auto w-full max-w-5xl px-6 ${className}`}>
      {children}
    </section>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="fv-eyebrow mb-4">{children}</div>;
}

// Hairline card — depth from tint + 1px border, never drop shadow on dark.
function Card({ children }: { children: ReactNode }) {
  return (
    <div className="h-full rounded-[14px] border border-white/[0.08] bg-charcoal p-6 transition-colors duration-150 hover:border-white/[0.14]">
      {children}
    </div>
  );
}

const ASSETS = [
  {
    title: "A trusted church family",
    body: "Families need more than sports advice. They need wisdom, prayer, care, and a place where their worth is not defined by performance. Long Hill Chapel can be that place.",
  },
  {
    title: "A gym for real ministry",
    body: "Our gym lets us do more than host talks. We can run parent nights, athlete reset workshops, coach gatherings, and family events that feel practical, active, and welcoming.",
  },
  {
    title: "Access to sports leaders",
    body: "Members know coaches, trainers, counselors, and former athletes across the NY/NJ area — trusted voices who help families put sports in their right place.",
  },
];

const SERVES = [
  { who: "Parents", note: "Support without making performance ultimate." },
  { who: "Athletes", note: "Compete from a secure identity — a mistake is not the verdict." },
  { who: "Coaches", note: "Build culture and correct without shame." },
  { who: "Families", note: "Healthier rhythms, less pressure, more grace." },
];

const GATHERINGS = [
  "Parents' Night",
  "Athlete Reset Workshop",
  "Parent-Athlete Family Night",
  "Coach Breakfast",
  "Preseason Family Reset",
  "Movement & Mindset Clinic",
  "Sports Parent Prayer Night",
  "Community Sports Panel",
];

const PRINCIPLES = [
  "Church-led, with the church as host and trusted guide.",
  "Christ-centered and biblically responsible — never a performance clinic promising better outcomes.",
  "Practical, warm, and welcoming — including to families who are not churchgoers.",
  "Sports are a gift to steward, not a god to serve. The gym is for formation, not for proving worth.",
  "We care, we do not counsel — no diagnosis or therapy. Sensitive needs go to a pastor.",
  "Start small, learn, and grow wisely. Every gathering offers one practical takeaway and one clear next step.",
];

const INVOLVED = [
  { title: "Pray", body: "Pray for the sports families in our community and for wisdom as we begin." },
  { title: "Volunteer", body: "Greet, host a table, help in the gym, or join the follow-up team." },
  { title: "Open doors", body: "Introduce us to a coach, trainer, or sports leader who shares the heart." },
  { title: "Spread the word", body: "Invite a sports family to a first gathering — no pressure, all welcome." },
];

function PrimaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-full bg-navy px-6 py-3 font-heading text-[15px] font-semibold text-clean transition duration-150 hover:bg-navy-600 hover:shadow-[var(--shadow-glow-navy)] active:scale-[0.97]"
    >
      {children}
    </a>
  );
}

function SecondaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-full border border-white/[0.14] px-6 py-3 font-heading text-[15px] font-semibold text-clean transition duration-150 hover:border-white/[0.28]"
    >
      {children}
    </a>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-onyx font-body text-clean">
      {/* Top bar */}
      <div className="border-b border-white/[0.06]">
        <Section className="flex items-center justify-between py-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/lhc-logo-horizontal.png" alt="Long Hill Chapel" className="h-7 w-auto" />
          <span className="fv-micro">Chatham, NJ</span>
        </Section>
      </div>

      {/* Hero */}
      <div
        className="relative overflow-hidden"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, rgba(24,48,96,0.45), transparent 60%), var(--fv-onyx)",
        }}
      >
        <Section className="py-24 sm:py-32">
          <Eyebrow>Sports Family Ministry</Eyebrow>
          <h1 className="max-w-3xl font-heading text-4xl font-semibold leading-[1.05] tracking-tight sm:text-[56px]">
            Serving sports families with wisdom, grace, and practical care.
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-white/[0.72]">
            Youth sports shape our families&apos; schedules, emotions, identity, and relationships.
            Long Hill Chapel is starting a ministry to walk alongside sports families in the real
            pressures of youth sports — pointing parents, athletes, and coaches to a hope the
            scoreboard can neither give nor take away.
          </p>
          <p className="mt-8 font-display text-2xl font-extrabold uppercase tracking-[0.06em] text-clean">
            Your identity is secure.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <PrimaryButton href="#help">Get involved</PrimaryButton>
            <SecondaryButton href="#vision">Read the vision</SecondaryButton>
          </div>
        </Section>
      </div>

      {/* Why it matters */}
      <Section id="vision" className="py-20">
        <Eyebrow>Why this matters</Eyebrow>
        <h2 className="max-w-3xl font-heading text-2xl font-semibold leading-snug tracking-tight sm:text-[32px]">
          For many families, youth sports are the most active part of the week.
        </h2>
        <p className="mt-5 max-w-3xl text-[17px] leading-relaxed text-white/[0.72]">
          They are also where pressure, comparison, identity, disappointment, and hope show up most.
          The church can stay on the sidelines of that pressure — or step into it with wisdom, grace,
          and truth. We believe Long Hill Chapel is positioned to step in.
        </p>
      </Section>

      {/* Scripture verse card — the brand's signature surface */}
      <Section className="pb-20">
        <div
          className="rounded-[20px] border border-white/[0.08] p-8 sm:p-12"
          style={{
            background:
              "radial-gradient(120% 80% at 30% 0%, rgba(79,121,201,0.10), transparent 60%), var(--fv-charcoal)",
          }}
        >
          <div className="fv-verse-ref mb-4">Romans 8:37</div>
          <p className="fv-scripture max-w-2xl text-2xl sm:text-3xl">
            In all these things we are more than conquerors through him who loved us.
          </p>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/[0.6]">
            We operate <span className="font-semibold text-clean">from</span> Christ&apos;s victory,
            not <span className="font-semibold text-clean">for</span> it. A child&apos;s worth — and a
            parent&apos;s — is settled in Christ before the game ever starts. The scoreboard can
            report what happened; it cannot name who we are.
          </p>
        </div>
      </Section>

      {/* Why Long Hill Chapel */}
      <Section className="py-20">
        <Eyebrow>Why Long Hill Chapel</Eyebrow>
        <h2 className="max-w-3xl font-heading text-2xl font-semibold leading-snug tracking-tight sm:text-[32px]">
          We bring together three things that make this possible.
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {ASSETS.map((a) => (
            <Card key={a.title}>
              <h3 className="font-heading text-[17px] font-semibold text-clean">{a.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/[0.72]">{a.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Who we serve */}
      <div className="border-y border-white/[0.06] bg-charcoal/40">
        <Section className="py-20">
          <Eyebrow>Who we serve</Eyebrow>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SERVES.map((s) => (
              <div key={s.who} className="rounded-[14px] border border-white/[0.08] bg-charcoal p-5">
                <div className="font-heading text-lg font-semibold text-clean">{s.who}</div>
                <p className="mt-1.5 text-[14px] leading-relaxed text-white/[0.6]">{s.note}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* How we'll do it */}
      <Section className="py-20">
        <Eyebrow>How we&apos;ll do it</Eyebrow>
        <h2 className="max-w-3xl font-heading text-2xl font-semibold leading-snug tracking-tight sm:text-[32px]">
          Start small. Serve well. Grow wisely.
        </h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <p className="text-[17px] leading-relaxed text-white/[0.72]">
            We will begin with one small, high-impact gathering — likely a parents&apos; night — and
            learn from it before we expand. Each gathering is practical and biblically grounded, with
            one clear takeaway and one simple next step. Over time we can add athlete workshops, coach
            gatherings, family nights, guest speakers, and follow-up groups.
          </p>
          <p className="text-[17px] leading-relaxed text-white/[0.72]">
            The planning and follow-up are organized behind the scenes so our leaders and volunteers
            can spend their energy on people, not paperwork. The church stays the host and trusted
            guide; the goal is always relationships and care, not a program or a brand.
          </p>
        </div>

        <div className="mt-10">
          <div className="fv-micro mb-3">What gatherings might look like</div>
          <div className="flex flex-wrap gap-2">
            {GATHERINGS.map((g) => (
              <span
                key={g}
                className="rounded-full border border-white/[0.06] bg-navy-bright/[0.12] px-3.5 py-1.5 text-[14px] font-medium text-navy-ink"
              >
                {g}
              </span>
            ))}
          </div>
          <p className="mt-3 text-[13px] text-white/[0.48]">
            These are possibilities, not a fixed program — we will follow what serves families best.
          </p>
        </div>
      </Section>

      {/* Commitments */}
      <div className="border-y border-white/[0.06] bg-charcoal/40">
        <Section className="py-20">
          <Eyebrow>What we hold onto</Eyebrow>
          <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-[32px]">Our commitments</h2>
          <ul className="mt-8 grid gap-3 md:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <li
                key={p}
                className="flex gap-3 rounded-[14px] border border-white/[0.08] bg-charcoal p-4 text-[15px] leading-relaxed text-clean"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-navy-bright" aria-hidden />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* Get involved */}
      <Section id="help" className="py-20">
        <Eyebrow>How you can help</Eyebrow>
        <h2 className="max-w-3xl font-heading text-2xl font-semibold leading-snug tracking-tight sm:text-[32px]">
          This will take the whole church family.
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {INVOLVED.map((i) => (
            <Card key={i.title}>
              <h3 className="font-heading text-[17px] font-semibold text-clean">{i.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/[0.72]">{i.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Closing — the one navy fill */}
      <div className="bg-navy">
        <Section className="py-20 text-center">
          <h2 className="mx-auto max-w-2xl font-heading text-2xl font-semibold tracking-tight text-clean sm:text-[32px]">
            Let&apos;s serve our sports families together.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-white/[0.8]">
            If this stirs something in you — to pray, to help, or to open a door — we would love to
            talk. Reach out to the ministry team at Long Hill Chapel.
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href="mailto:info@lhcnj.net"
              className="inline-flex items-center justify-center rounded-full bg-clean px-6 py-3 font-heading text-[15px] font-semibold text-navy transition hover:bg-white"
            >
              Contact the ministry team
            </a>
          </div>
        </Section>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-10">
        <Section className="flex flex-col items-center gap-3 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/lhc-mark.png" alt="Long Hill Chapel" className="h-9 w-9" />
          <p className="fv-micro">Long Hill Chapel · Chatham, New Jersey</p>
          <p className="max-w-md text-[13px] leading-relaxed text-white/[0.48]">
            Sports Family Ministry — a church-led initiative serving sports families with wisdom,
            grace, and practical care.
          </p>
        </Section>
      </footer>
    </main>
  );
}
