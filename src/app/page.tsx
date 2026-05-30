import type { ReactNode } from "react";

function Section({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`mx-auto w-full max-w-5xl px-6 ${className}`}>{children}</section>;
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-brand-600">{children}</div>
  );
}

const ASSETS = [
  {
    title: "A trusted church family",
    body: "Families need more than sports advice. They need wisdom, prayer, care, and a place where their worth isn't defined by performance. Long Hill Chapel can be that place.",
  },
  {
    title: "A gym for real ministry",
    body: "Our gym lets us do more than host talks. We can run parent nights, athlete reset workshops, coach gatherings, and family events that feel practical, active, and welcoming.",
  },
  {
    title: "Access to sports leaders",
    body: "Members know coaches, trainers, counselors, and former athletes across the NY/NJ area — trusted voices who can help families put sports in their right place.",
  },
];

const SERVES = [
  { who: "Parents", note: "Support without making performance ultimate." },
  { who: "Athletes", note: "Compete from a secure identity — mistakes aren't the verdict." },
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
  "Practical, warm, and welcoming — including to families who aren't churchgoers.",
  "Sports are a gift to steward, not a god to serve. The gym is for formation, not for proving worth.",
  "We care, we don't counsel — no diagnosis or therapy. Sensitive needs go to a pastor.",
  "Start small, learn, and grow wisely. Every gathering offers one practical takeaway and one clear next step.",
];

const INVOLVED = [
  { title: "Pray", body: "Pray for the sports families in our community and for wisdom as we begin." },
  { title: "Volunteer", body: "Greet, host a table, help in the gym, or join the follow-up team." },
  { title: "Open doors", body: "Introduce us to a coach, trainer, or sports leader who shares the heart." },
  { title: "Spread the word", body: "Invite a sports family to a first gathering — no pressure, all welcome." },
];

export default function LandingPage() {
  return (
    <main className="bg-white text-ink">
      {/* Top bar */}
      <div className="border-b border-slate-100">
        <Section className="flex items-center justify-between py-4">
          <div className="text-sm font-bold text-brand-700">Long Hill Chapel</div>
          <div className="text-xs text-ink-muted">Chatham, New Jersey</div>
        </Section>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-b from-brand-50 to-white">
        <Section className="py-20 sm:py-28 text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-medium text-brand-700">
            A new ministry at Long Hill Chapel
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Serving sports families with wisdom, grace, and practical care.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted">
            Youth sports shape our families&apos; schedules, emotions, identity, and relationships.
            Long Hill Chapel is starting a ministry to walk alongside sports families in the real
            pressures of youth sports — pointing parents, athletes, and coaches to a hope that the
            scoreboard can&apos;t give or take away.
          </p>
        </Section>
      </div>

      {/* Why it matters */}
      <Section className="py-16">
        <Eyebrow>Why this matters</Eyebrow>
        <h2 className="max-w-3xl text-2xl font-bold tracking-tight sm:text-3xl">
          For many families, youth sports are the most active part of the week.
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-muted">
          They&apos;re also where pressure, comparison, identity, disappointment, and hope show up
          most. The church can either stay on the sidelines of that pressure — or step into it with
          wisdom, grace, and truth. We believe Long Hill Chapel is positioned to step in.
        </p>
      </Section>

      {/* Vision pull-quote */}
      <div className="bg-slate-900 text-white">
        <Section className="py-16">
          <p className="text-xl font-medium leading-relaxed sm:text-2xl">
            &ldquo;Long Hill Chapel can become a trusted place where sports families receive
            practical support, biblical hope, and relational care in the real pressures of youth
            sports.&rdquo;
          </p>
          <p className="mt-5 text-sm leading-relaxed text-slate-300">
            We operate <span className="font-semibold text-white">from</span> Christ&apos;s victory,
            not <span className="font-semibold text-white">for</span> it. A child&apos;s worth — and
            a parent&apos;s — is settled in Christ before the game ever starts. The scoreboard can
            report what happened; it cannot name who we are.
          </p>
        </Section>
      </div>

      {/* Why Long Hill Chapel */}
      <Section className="py-16">
        <Eyebrow>Why Long Hill Chapel</Eyebrow>
        <h2 className="max-w-3xl text-2xl font-bold tracking-tight sm:text-3xl">
          We bring together three things many churches can&apos;t.
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {ASSETS.map((a) => (
            <div key={a.title} className="rounded-2xl border border-slate-200 p-6">
              <h3 className="font-semibold text-ink">{a.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{a.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Who we serve */}
      <div className="bg-slate-50">
        <Section className="py-16">
          <Eyebrow>Who we serve</Eyebrow>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SERVES.map((s) => (
              <div key={s.who} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="text-lg font-semibold text-ink">{s.who}</div>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">{s.note}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* How we'll do it */}
      <Section className="py-16">
        <Eyebrow>How we&apos;ll do it</Eyebrow>
        <h2 className="max-w-3xl text-2xl font-bold tracking-tight sm:text-3xl">
          Start small. Serve well. Grow wisely.
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <p className="text-base leading-relaxed text-ink-muted">
            We&apos;ll begin with one small, high-impact gathering — likely a parents&apos; night —
            and learn from it before we expand. Each gathering is practical and biblically grounded,
            with one clear takeaway and one simple next step. Over time we can add athlete workshops,
            coach gatherings, family nights, guest speakers, and follow-up groups.
          </p>
          <p className="text-base leading-relaxed text-ink-muted">
            The planning, content, and follow-up are organized behind the scenes so our leaders and
            volunteers can spend their energy on people, not paperwork. The church stays the host and
            trusted guide; the goal is always relationships and care, not a program or a brand.
          </p>
        </div>

        <div className="mt-8">
          <div className="text-sm font-medium text-ink">What gatherings might look like:</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {GATHERINGS.map((g) => (
              <span key={g} className="rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
                {g}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs text-ink-muted">These are possibilities, not a fixed program — we&apos;ll follow what serves families best.</p>
        </div>
      </Section>

      {/* What we hold onto */}
      <div className="bg-slate-50">
        <Section className="py-16">
          <Eyebrow>What we hold onto</Eyebrow>
          <h2 className="max-w-3xl text-2xl font-bold tracking-tight sm:text-3xl">Our commitments</h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <li key={p} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-ink">
                <span className="mt-0.5 text-brand-600">✓</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* Get involved */}
      <Section className="py-16">
        <Eyebrow>How you can help</Eyebrow>
        <h2 className="max-w-3xl text-2xl font-bold tracking-tight sm:text-3xl">
          This will take the whole church family.
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {INVOLVED.map((i) => (
            <div key={i.title} className="rounded-2xl border border-slate-200 p-6">
              <h3 className="font-semibold text-ink">{i.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{i.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Closing */}
      <div className="bg-brand-600 text-white">
        <Section className="py-16 text-center">
          <h2 className="mx-auto max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
            Let&apos;s serve our sports families together.
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-brand-50">
            If this stirs something in you — to pray, to help, or to open a door — we&apos;d love to
            talk. Reach out to the ministry team at Long Hill Chapel.
          </p>
          <p className="mt-6 text-sm font-medium text-brand-100">
            Long Hill Chapel · Chatham, New Jersey
          </p>
        </Section>
      </div>

      <footer className="border-t border-slate-100 py-8">
        <Section className="text-center text-xs text-ink-muted">
          Long Hill Chapel — Sports Family Ministry. A church-led initiative serving sports families
          with wisdom, grace, and practical care.
        </Section>
      </footer>
    </main>
  );
}
