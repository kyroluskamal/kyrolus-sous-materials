import type { Candidate } from "./types";

export function parseCandidate(raw: string): Candidate | null {
  if (!raw || raw.length > 256) return null;
  if (!/[a-zA-Z]/.test(raw)) return null;

  const parts = splitOnUnbracketedColon(raw);
  if (parts.length === 0) return null;

  const base = parts[parts.length - 1]!;
  const variants = parts.slice(0, -1);

  let core = base;
  let negative = false;
  if (core.startsWith("-")) {
    negative = true;
    core = core.slice(1);
  }

  let value: string | undefined;
  let arbitrary = false;

  const arbMatch = core.match(/^([a-zA-Z][a-zA-Z0-9-]*)-\[(.+)\]$/);
  if (arbMatch) {
    arbitrary = true;
    value = arbMatch[2];
    const utilityAndSub = arbMatch[1]!;
    return {
      raw,
      variants,
      base,
      utility: utilityAndSub,
      value,
      negative,
      arbitrary,
    };
  }

  const bareArb = core.match(/^\[(.+)\]$/);
  if (bareArb) {
    arbitrary = true;
    return {
      raw,
      variants,
      base,
      utility: "arbitrary",
      value: bareArb[1],
      negative,
      arbitrary,
    };
  }

  return {
    raw,
    variants,
    base,
    utility: undefined,
    value: undefined,
    negative,
    arbitrary,
  };
}

function splitOnUnbracketedColon(input: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = "";
  for (const ch of input) {
    if (ch === "[") depth++;
    else if (ch === "]") depth = Math.max(0, depth - 1);
    if (ch === ":" && depth === 0) {
      parts.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  if (current) parts.push(current);
  return parts;
}
