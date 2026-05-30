import { PageHeader, Card, CardBody } from "@/components/ui";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardBody>
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
        <div className="mt-2 space-y-2 text-sm leading-relaxed text-ink-muted">{children}</div>
      </CardBody>
    </Card>
  );
}

export default function PurposePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Purpose"
        subtitle="Why Long Hill Chapel is well-positioned to serve sports families — and how to keep the gym and sports-leader network in their right place."
      />

      <Section title="A church-led ministry, not a product or performance clinic">
        <p>
          This is a church-led sports-family ministry planning system for Long Hill Chapel. It is not
          the From Victory app, not a product campaign, not direct AI counseling for parents or
          athletes, and not a sports performance clinic promising better outcomes. Long Hill Chapel is
          the ministry host and trusted guide. From Victory may be referenced only as an optional
          supportive resource after events — never the theme, brand, or center.
        </p>
      </Section>

      <Section title="Why Long Hill Chapel can serve this need well">
        <p>
          Long Hill Chapel has more than a message. It has a community, a facility, and relationships.
          The gym creates a practical space for athlete and family events. Access to sports leaders in
          the NY/NJ area creates opportunities for high-trust speakers, panels, workshops, and coach
          conversations. The church can use these assets to serve families without making sports
          ultimate.
        </p>
      </Section>

      <Section title="Facility plus formation">
        <p>
          The gym should not turn the ministry into a performance clinic. It should become a formation
          space — a place where movement, competition, conversation, prayer, and practical wisdom help
          families place sports in the right order.
        </p>
      </Section>

      <div className="rounded-xl border-l-4 border-brand-400 bg-brand-50 px-5 py-4">
        <h2 className="font-semibold text-ink">Theological guardrail</h2>
        <p className="mt-1 text-sm leading-relaxed text-ink">
          The gym is a tool for formation, not a stage for proving worth. Sports leaders are invited
          to serve families, not to make sports ultimate. Every gym-based or sports-leader event
          should reinforce that sports are a gift to steward, not a god to serve.
        </p>
      </div>

      <Section title="What the system helps leaders do">
        <ul className="list-disc pl-5">
          <li>Build a flexible ministry roadmap from reorderable, editable building blocks.</li>
          <li>Use the gym for practical, athlete-friendly, family-oriented events.</li>
          <li>Convene trusted NY/NJ sports leaders while keeping the mission Christ-centered.</li>
          <li>Review all faith content for theology and all sensitive topics for pastoral safety.</li>
          <li>Give every event one practical takeaway and one clear next step.</li>
          <li>Export a roadmap and materials for leadership discussion.</li>
        </ul>
      </Section>
    </div>
  );
}
