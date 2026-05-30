import { getRoadmap } from "@/lib/roadmap-store";
import { BLOCK_LIBRARY } from "@/lib/roadmap-library";
import { RoadmapBoard } from "./RoadmapBoard";

// Always read the latest shared document (it's a single, mutable doc).
export const dynamic = "force-dynamic";

export default async function RoadmapPage() {
  const roadmap = await getRoadmap();
  const library = BLOCK_LIBRARY.map((b) => ({ id: b.id, title: b.title, category: b.category }));

  return (
    <main className="min-h-screen bg-onyx font-body text-clean">
      <div className="mx-auto w-full max-w-3xl px-5 py-10">
        <RoadmapBoard initial={roadmap} library={library} />
      </div>
    </main>
  );
}
