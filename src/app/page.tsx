import Link from "next/link";
import { Card, CardBody, Badge } from "@/components/ui";
import { GYM_ENABLED_IDEAS } from "@/lib/roadmap-library";
import { SUGGESTED_SPEAKER_TYPES } from "@/lib/types";

function CTA({ href, children, variant = "primary" }: { href: string; children: React.ReactNode; variant?: "primary" | "secondary" }) {
  const cls =
    variant === "primary"
      ? "bg-brand-600 text-white hover:bg-brand-700"
      : "border border-slate-300 bg-white text-ink hover:bg-slate-50";
  return (
    <Link href={href} className={`inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold transition ${cls}`}>
      {children}
    </Link>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">{children}</h2>;
}

export default function LandingPage() {
  return (
    <div className="space-y-14 pb-8">
      {/* Hero */}
      <section className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white px-6 py-12 sm:px-10 sm:py-16">
        <Badge tone="brand">Long Hill Chapel · Chatham, NJ</Badge>
        <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
          Help Long Hill Chapel serve sports families with wisdom, grace, and practical care.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">
          Youth sports shape family schedules, emotions, identity, relationships, and community
          life. This planning system helps Long Hill Chapel leaders use the church&apos;s
          relationships, gym, and access to sports leaders to build a flexible ministry roadmap for
          parents, athletes, coaches, and families.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <CTA href="/dashboard">Enter the Planning Dashboard</CTA>
          <CTA href="/roadmap" variant="secondary">Build your ministry plan</CTA>
        </div>
        <p className="mt-4 text-xs text-ink-muted">
          Built for church leaders, pastors, ministry staff, and volunteers — not as a family-facing
          AI tool.
        </p>
      </section>

      {/* Why youth sports + why this isn't a fixed program */}
      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardBody>
            <SectionTitle>Why youth sports are a major ministry opportunity</SectionTitle>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              For many families, youth sports are the most active discipleship environment in their
              week — full of pressure, identity, comparison, disappointment, and hope. The church can
              either ignore that pressure or step into it with wisdom, grace, and truth.
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <SectionTitle>Not a fixed program or product funnel</SectionTitle>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              This is a church-led ministry planning system — not a performance clinic, not a product
              campaign, and not direct AI counseling. Leaders choose, reorder, customize, and export
              their own roadmap. From Victory may be referenced only as an optional supportive
              resource after events — never the theme, brand, or center.
            </p>
          </CardBody>
        </Card>
      </section>

      {/* Why Long Hill Chapel is positioned for this */}
      <section>
        <SectionTitle>Long Hill Chapel has a unique opportunity.</SectionTitle>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-muted">
          Long Hill Chapel is positioned to serve sports families because it brings together three
          important assets: a church community that can offer pastoral care, trust, prayer, and
          discipleship; a gym that can host practical, athlete-friendly, family-oriented events; and
          relationships with sports leaders in the NY/NJ area who bring credibility, experience, and
          community reach. This combination lets the church serve families in a way that is both
          practical and spiritually grounded.
        </p>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {[
            {
              title: "A Trusted Church Community",
              text: "Families need more than sports advice. They need wisdom, care, prayer, and a place where their identity is not defined by performance.",
            },
            {
              title: "A Gym for Practical Ministry",
              text: "The gym allows Long Hill Chapel to host workshops, clinics, family nights, coach gatherings, athlete reset sessions, and movement-based events that feel useful and accessible.",
            },
            {
              title: "Access to Sports Leaders",
              text: "NY/NJ coaches, trainers, counselors, former athletes, and sports professionals can help the church convene high-value conversations while keeping the mission centered on faith, family, and formation.",
            },
          ].map((c) => (
            <Card key={c.title} className="h-full">
              <CardBody>
                <h3 className="font-semibold text-ink">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{c.text}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* The gym changes the ministry */}
      <section className="rounded-2xl bg-slate-900 px-6 py-10 text-white sm:px-10">
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
          The gym turns the ministry from a lecture into a lived experience.
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          With a gym available, Long Hill Chapel can do more than host talks. Leaders can design
          events where parents learn, athletes practice reset tools, coaches discuss culture, and
          families experience the church as a place of practical support.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {GYM_ENABLED_IDEAS.map((idea) => (
            <span key={idea} className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
              {idea}
            </span>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-400">These are options, not a required order.</p>
      </section>

      {/* Sports leader network */}
      <section>
        <SectionTitle>Use sports relationships wisely.</SectionTitle>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-muted">
          Access to sports leaders in the NY/NJ area can help Long Hill Chapel create events families
          want to attend. The goal is not to build a performance brand. The goal is to convene
          trusted voices who help families put sports in the right order.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {SUGGESTED_SPEAKER_TYPES.map((t) => (
            <Badge key={t} tone="blue">{t}</Badge>
          ))}
        </div>
        <div className="mt-5 rounded-lg border-l-4 border-brand-300 bg-brand-50 px-4 py-3 text-sm text-ink">
          Every speaker should support the ministry mission: practical wisdom, family health, athlete
          formation, and identity rooted in Christ — not hype, recruiting promises, or performance
          idolatry.
        </div>
      </section>

      {/* How the dashboard helps */}
      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardBody>
            <SectionTitle>A flexible ministry plan</SectionTitle>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              The dashboard helps leaders build a plan from simple, editable steps. Choose a starting
              plan, then make it your own — add steps, reorder them, edit the wording, add your own,
              and remove what doesn&apos;t fit. Everything saves automatically.
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <SectionTitle>Choose, reorder, customize, export</SectionTitle>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              When the plan fits Long Hill Chapel&apos;s relationships, leadership capacity, gym
              availability, and community needs, print it as a PDF for leadership discussion. Adjust
              it as the ministry learns from families, leaders, and partners.
            </p>
            <div className="mt-4">
              <CTA href="/roadmap">Build the Ministry Roadmap</CTA>
            </div>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
