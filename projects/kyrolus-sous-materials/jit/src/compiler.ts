import { parseCandidate } from "./parser";
import type { Theme } from "./types";
import { allMatchers } from "./utilities";
import type { MatchInput } from "./utilities/helpers";
import { resolveVariant } from "./variants";

export interface CompileInput {
  candidates: Iterable<string>;
  theme: Theme;
  darkMode: "class" | "dataAttribute";
  layer: string;
}

export interface CompileResult {
  css: string;
  matched: number;
  unmatched: string[];
}

interface Rule {
  selector: string;
  atRules: string[];
  decls: Record<string, string | number | undefined>;
  order: number;
  sourceIndex: number;
}

export function compile(input: CompileInput): CompileResult {
  const { candidates, theme, darkMode, layer } = input;
  const rules: Rule[] = [];
  const unmatched: string[] = [];
  let sourceIndex = 0;

  for (const raw of candidates) {
    sourceIndex++;
    const candidate = parseCandidate(raw);
    if (!candidate) continue;

    const matchInput: MatchInput = {
      name: candidate.arbitrary && candidate.utility
        ? `${candidate.utility}-[${candidate.value}]`
        : candidate.base.replace(/^-/, ""),
      negative: candidate.negative,
      arbitrary: candidate.arbitrary,
      arbUtility: candidate.utility,
      arbValue: candidate.value,
      theme,
    };

    let decls: Record<string, string | number | undefined> | null = null;
    for (const matcher of allMatchers) {
      const result = matcher(matchInput);
      if (result) {
        decls = result;
        break;
      }
    }
    if (!decls) {
      unmatched.push(raw);
      continue;
    }

    const resolvedVariants = [];
    let ok = true;
    for (const v of candidate.variants) {
      const resolved = resolveVariant(v, theme, darkMode);
      if (!resolved) {
        ok = false;
        break;
      }
      resolvedVariants.push(resolved);
    }
    if (!ok) {
      unmatched.push(raw);
      continue;
    }

    resolvedVariants.sort((a, b) => a.order - b.order);

    let selector = `.${cssEscape(raw)}`;
    const atRules: string[] = [];
    let order = 0;

    for (const v of resolvedVariants) {
      const applied = v.apply(selector);
      selector = applied.selector;
      if (applied.atRule) atRules.push(applied.atRule);
      order = Math.max(order, v.order);
    }

    rules.push({ selector, atRules, decls, order, sourceIndex });
  }

  rules.sort((a, b) => a.order - b.order || a.sourceIndex - b.sourceIndex);

  const css = serialize(rules, layer);
  return { css, matched: rules.length, unmatched };
}

function serialize(rules: Rule[], layer: string): string {
  if (rules.length === 0) return `@layer ${layer} {}\n`;

  const lines: string[] = [];
  lines.push(`@layer ${layer} {`);

  for (const rule of rules) {
    const declBody = Object.entries(rule.decls)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => `    ${k}: ${v};`)
      .join("\n");
    let block = `  ${rule.selector} {\n${declBody}\n  }`;
    for (let i = rule.atRules.length - 1; i >= 0; i--) {
      block = `  ${rule.atRules[i]} {\n  ${indent(block)}\n  }`;
    }
    lines.push(block);
  }

  lines.push(`}`);
  return lines.join("\n") + "\n";
}

function indent(s: string): string {
  return s.split("\n").map((l) => "  " + l).join("\n");
}

const ESCAPE_RE = /[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]/g;

export function cssEscape(value: string): string {
  return value.replace(ESCAPE_RE, "\\$&");
}
