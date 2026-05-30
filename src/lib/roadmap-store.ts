/**
 * Persistence for the single shared roadmap (no logins, last-write-wins).
 *
 * Durable store: one Vercel-Marketplace KV (Upstash Redis) document keyed
 * "roadmap:default", read/written over the REST API (no SDK, no deps). When no
 * store env is configured, it falls back to an in-memory singleton so local dev
 * needs zero setup. Matches the repo's "swap the db object" design — every read
 * goes through here; every mutation goes through the server actions that call
 * saveRoadmap.
 */
import { defaultRoadmap, type Roadmap } from "./roadmap-board";

const KEY = "roadmap:default";

function kvConfig(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

async function kvCommand(cfg: { url: string; token: string }, command: string[]): Promise<unknown> {
  const res = await fetch(cfg.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${cfg.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`KV ${command[0]} failed: ${res.status}`);
  const data = (await res.json()) as { result?: unknown };
  return data.result;
}

const globalForRoadmap = globalThis as unknown as { __roadmapMem?: Roadmap };

export async function getRoadmap(): Promise<Roadmap> {
  const cfg = kvConfig();
  if (cfg) {
    const raw = await kvCommand(cfg, ["GET", KEY]);
    if (typeof raw === "string" && raw.length > 0) {
      return JSON.parse(raw) as Roadmap;
    }
    const seeded = defaultRoadmap();
    await kvCommand(cfg, ["SET", KEY, JSON.stringify(seeded)]);
    return seeded;
  }
  // In-memory fallback (shared across requests in a single dev process).
  if (!globalForRoadmap.__roadmapMem) globalForRoadmap.__roadmapMem = defaultRoadmap();
  return globalForRoadmap.__roadmapMem;
}

export async function saveRoadmap(roadmap: Roadmap): Promise<void> {
  const cfg = kvConfig();
  if (cfg) {
    await kvCommand(cfg, ["SET", KEY, JSON.stringify(roadmap)]);
    return;
  }
  globalForRoadmap.__roadmapMem = roadmap;
}
