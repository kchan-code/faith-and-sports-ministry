/** Tiny, dependency-free id + timestamp helpers shared across the data layer. */

let counter = 0;

export function id(prefix: string): string {
  counter += 1;
  const rand = Math.floor(Math.random() * 1e6).toString(36);
  return `${prefix}_${Date.now().toString(36)}${counter.toString(36)}${rand}`;
}

export function now(): string {
  return new Date().toISOString();
}
