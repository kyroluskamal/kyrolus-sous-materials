import type { Theme } from "../types";

export type CssDecl = Record<string, string | number | undefined>;

export interface MatchInput {
  name: string;
  negative: boolean;
  arbitrary: boolean;
  arbUtility?: string;
  arbValue?: string;
  theme: Theme;
}

export type Matcher = (input: MatchInput) => CssDecl | null;

export function resolveSpacing(value: string, theme: Theme): string | null {
  if (value in theme.spacing) return theme.spacing[value]!;
  if (value === "auto") return "auto";
  if (value === "full") return "100%";
  if (value === "screen") return "100vw";
  const n = /^(\d+)\/(\d+)$/.exec(value);
  if (n) return `${(Number(n[1]) / Number(n[2])) * 100}%`;
  return null;
}

export function resolveSize(value: string, theme: Theme): string | null {
  if (value in theme.spacing) return theme.spacing[value]!;
  if (value === "auto") return "auto";
  if (value === "full") return "100%";
  if (value === "screen") return "100vh";
  if (value === "min") return "min-content";
  if (value === "max") return "max-content";
  if (value === "fit") return "fit-content";
  const n = /^(\d+)\/(\d+)$/.exec(value);
  if (n) return `${(Number(n[1]) / Number(n[2])) * 100}%`;
  return null;
}

export function resolveColor(
  token: string,
  theme: Theme
): { value: string; opacity?: string } | null {
  const [raw, opacity] = token.split("/");
  if (!raw) return null;

  const colors = theme.colors;

  if (raw in colors) {
    const c = colors[raw];
    if (typeof c === "string") return { value: c, opacity };
  }

  const parts = raw.split("-");
  for (let i = parts.length - 1; i > 0; i--) {
    const name = parts.slice(0, i).join("-");
    const shade = parts.slice(i).join("-");
    if (name in colors) {
      const entry = colors[name];
      if (typeof entry === "object" && shade in entry) {
        return { value: entry[shade]!, opacity };
      }
    }
  }

  return null;
}

export function colorWithOpacity(
  value: string,
  opacityToken: string | undefined,
  theme: Theme
): string {
  if (!opacityToken) return value;
  const o = theme.opacity[opacityToken];
  if (!o) return value;
  if (value.startsWith("#")) {
    const hex = hexToRgb(value);
    if (hex) return `rgb(${hex.r} ${hex.g} ${hex.b} / ${o})`;
  }
  return `color-mix(in srgb, ${value} ${Number(o) * 100}%, transparent)`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const h = hex.replace("#", "");
  if (h.length === 3) {
    return {
      r: Number.parseInt(h[0]! + h[0]!, 16),
      g: Number.parseInt(h[1]! + h[1]!, 16),
      b: Number.parseInt(h[2]! + h[2]!, 16),
    };
  }
  if (h.length === 6) {
    return {
      r: Number.parseInt(h.slice(0, 2), 16),
      g: Number.parseInt(h.slice(2, 4), 16),
      b: Number.parseInt(h.slice(4, 6), 16),
    };
  }
  return null;
}

export function negate(value: string, negative: boolean): string {
  if (!negative) return value;
  if (value === "0" || value === "0px" || value === "0rem") return value;
  if (value.startsWith("-")) return value.slice(1);
  return `-${value}`;
}

export function lookup<T>(
  map: Record<string, T>,
  key: string | undefined
): T | undefined {
  if (key === undefined) return undefined;
  return map[key];
}

export function tryPrefix(name: string, prefix: string): string | null {
  if (name === prefix) return "";
  if (name.startsWith(prefix + "-")) return name.slice(prefix.length + 1);
  return null;
}

export function exact(name: string, target: string): boolean {
  return name === target;
}
