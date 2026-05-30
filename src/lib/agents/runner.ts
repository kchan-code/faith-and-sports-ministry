import { z } from "zod";
import type { AgentId } from "../types";
import { AGENTS, SHARED_GUARDRAILS } from "./registry";
import { saveAgentOutput } from "../store";
import { id, now } from "../id";

export interface RunContext {
  initiativeId?: string;
  eventId?: string;
}

export interface RunResult<T> {
  data: T;
  offline: boolean;
  model: string;
}

function isOffline(): boolean {
  if (process.env.MINISTRY_OFFLINE === "1") return true;
  return !process.env.AI_GATEWAY_API_KEY;
}

function model(): string {
  return process.env.MINISTRY_MODEL || "anthropic/claude-sonnet-4-6";
}

/**
 * Runs an agent operation. When a Vercel AI Gateway key is present it asks the
 * model for a schema-validated object; otherwise it returns a deterministic
 * offline draft so the whole app is fully usable with zero configuration.
 *
 * Every run is recorded as an AgentOutput for the audit trail.
 */
export async function runAgent<T>(
  agentId: AgentId,
  args: {
    /** Operation-specific instructions for the model. */
    prompt: string;
    schema: z.ZodType<T>;
    /** Deterministic draft used when offline (or as a guaranteed fallback). */
    offlineDraft: () => T;
    /** Short human summary for the audit trail. */
    summarize: (data: T) => string;
    context?: RunContext;
  }
): Promise<RunResult<T>> {
  const meta = AGENTS[agentId];
  const offline = isOffline();
  // Per-agent override (e.g. the Pastoral Theology specialist) wins over the default.
  const usedModel = meta.model || model();

  let data: T;
  let ranOffline = offline;

  if (offline) {
    data = args.offlineDraft();
  } else {
    try {
      // Lazy import keeps the AI SDK out of the bundle when running offline.
      const { generateObject } = await import("ai");
      const system = `${meta.systemPrompt}\n\n${SHARED_GUARDRAILS}`;
      const result = await generateObject({
        model: usedModel,
        schema: args.schema as z.ZodType<T>,
        system,
        prompt: args.prompt,
      });
      data = result.object as T;
    } catch (err) {
      // Never fail a planning action because the model is unreachable.
      console.error(`[agent:${agentId}] falling back to offline draft:`, err);
      data = args.offlineDraft();
      ranOffline = true;
    }
  }

  saveAgentOutput({
    id: id("agout"),
    agentId,
    initiativeId: args.context?.initiativeId,
    eventId: args.context?.eventId,
    summary: args.summarize(data),
    payload: data,
    model: usedModel,
    offline: ranOffline,
    createdAt: now(),
  });

  return { data, offline: ranOffline, model: usedModel };
}
