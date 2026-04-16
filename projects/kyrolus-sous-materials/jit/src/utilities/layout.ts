import type { CssDecl, Matcher, MatchInput } from "./helpers";
import { exact, lookup, resolveSize, resolveSpacing, tryPrefix } from "./helpers";

const DISPLAY_VALUES: Record<string, string> = {
  block: "block",
  "inline-block": "inline-block",
  inline: "inline",
  flex: "flex",
  "inline-flex": "inline-flex",
  grid: "grid",
  "inline-grid": "inline-grid",
  hidden: "none",
  contents: "contents",
  "flow-root": "flow-root",
  table: "table",
  "inline-table": "inline-table",
  "list-item": "list-item",
};

const POSITION_VALUES = ["static", "relative", "absolute", "fixed", "sticky"];

const OVERFLOW_VALUES: Record<string, string> = {
  auto: "auto",
  hidden: "hidden",
  clip: "clip",
  visible: "visible",
  scroll: "scroll",
};

export const displayMatcher: Matcher = ({ name }) => {
  if (name in DISPLAY_VALUES) return { display: DISPLAY_VALUES[name]! };
  return null;
};

export const positionMatcher: Matcher = ({ name }) => {
  if (POSITION_VALUES.includes(name)) return { position: name };
  return null;
};

export const overflowMatcher: Matcher = ({ name }) => {
  if (name.startsWith("overflow-")) {
    const rest = name.slice("overflow-".length);
    if (rest in OVERFLOW_VALUES) return { overflow: OVERFLOW_VALUES[rest]! };
    if (rest.startsWith("x-")) {
      const v = rest.slice(2);
      if (v in OVERFLOW_VALUES) return { "overflow-x": OVERFLOW_VALUES[v]! };
    }
    if (rest.startsWith("y-")) {
      const v = rest.slice(2);
      if (v in OVERFLOW_VALUES) return { "overflow-y": OVERFLOW_VALUES[v]! };
    }
  }
  return null;
};

export const visibilityMatcher: Matcher = ({ name }) => {
  if (name === "visible") return { visibility: "visible" };
  if (name === "invisible") return { visibility: "hidden" };
  if (name === "collapse") return { visibility: "collapse" };
  return null;
};

export const isolationMatcher: Matcher = ({ name }) => {
  if (name === "isolate") return { isolation: "isolate" };
  if (name === "isolation-auto") return { isolation: "auto" };
  return null;
};

export const zIndexMatcher: Matcher = (ctx) => {
  const { name, theme, negative } = ctx;
  if (name === "z-auto") return { "z-index": "auto" };
  const v = tryPrefix(name, "z");
  if (v === null) return null;
  if (ctx.arbitrary && ctx.arbUtility === "z") {
    return { "z-index": ctx.arbValue! };
  }
  const raw = lookup(theme.zIndex, v);
  if (raw === undefined) return null;
  return { "z-index": negative && raw !== "0" ? `-${raw}` : raw };
};

function sideToProperty(side: string, base: "margin" | "padding"): string[] {
  switch (side) {
    case "": return [base];
    case "x": return [`${base}-left`, `${base}-right`];
    case "y": return [`${base}-top`, `${base}-bottom`];
    case "t": return [`${base}-top`];
    case "r": return [`${base}-right`];
    case "b": return [`${base}-bottom`];
    case "l": return [`${base}-left`];
    case "s": return [`${base}-inline-start`];
    case "e": return [`${base}-inline-end`];
    default: return [];
  }
}

function spacingRule(prefixes: string[], base: "margin" | "padding"): Matcher {
  return ({ name, negative, arbitrary, arbUtility, arbValue, theme }) => {
    for (const p of prefixes) {
      if (arbitrary && arbUtility === p) {
        const props = sideToProperty(p.slice(1), base);
        if (!props.length) return null;
        const value = negative ? `-${arbValue!}` : arbValue!;
        const out: CssDecl = {};
        for (const prop of props) out[prop] = value;
        return out;
      }
      const rest = tryPrefix(name, p);
      if (rest === null) continue;
      const resolved = resolveSpacing(rest, theme);
      if (resolved === null) continue;
      const props = sideToProperty(p.slice(1), base);
      if (!props.length) continue;
      const value = negative && resolved !== "0px" && resolved !== "auto"
        ? `-${resolved}`
        : resolved;
      const out: CssDecl = {};
      for (const prop of props) out[prop] = value;
      return out;
    }
    return null;
  };
}

export const paddingMatcher: Matcher = spacingRule(
  ["p", "px", "py", "pt", "pr", "pb", "pl", "ps", "pe"],
  "padding"
);

export const marginMatcher: Matcher = spacingRule(
  ["m", "mx", "my", "mt", "mr", "mb", "ml", "ms", "me"],
  "margin"
);

export const gapMatcher: Matcher = ({ name, theme, arbitrary, arbUtility, arbValue }) => {
  for (const [prefix, prop] of [
    ["gap-x", "column-gap"],
    ["gap-y", "row-gap"],
    ["gap", "gap"],
  ] as const) {
    if (arbitrary && arbUtility === prefix) return { [prop]: arbValue! };
    const rest = tryPrefix(name, prefix);
    if (rest === null) continue;
    const resolved = resolveSpacing(rest, theme);
    if (resolved !== null) return { [prop]: resolved };
  }
  return null;
};

export const spaceMatcher: Matcher = ({ name, theme, negative }) => {
  const xMatch = tryPrefix(name, "space-x");
  const yMatch = tryPrefix(name, "space-y");
  const rest = xMatch ?? yMatch;
  if (rest === null || rest === undefined) return null;
  const resolved = resolveSpacing(rest, theme);
  if (!resolved) return null;
  const v = negative && resolved !== "0px" ? `-${resolved}` : resolved;
  if (xMatch !== null) {
    return {
      "--ks-space-x-reverse": "0",
      "margin-right": `calc(${v} * var(--ks-space-x-reverse))`,
      "margin-left": `calc(${v} * calc(1 - var(--ks-space-x-reverse)))`,
    };
  }
  return {
    "--ks-space-y-reverse": "0",
    "margin-top": `calc(${v} * calc(1 - var(--ks-space-y-reverse)))`,
    "margin-bottom": `calc(${v} * var(--ks-space-y-reverse))`,
  };
};

function sizingRule(prefix: string, prop: string, extraFull = true): Matcher {
  return ({ name, theme, arbitrary, arbUtility, arbValue }) => {
    if (arbitrary && arbUtility === prefix) return { [prop]: arbValue! };
    const rest = tryPrefix(name, prefix);
    if (rest === null) return null;
    const resolved = resolveSize(rest, theme);
    if (resolved === null) return null;
    return { [prop]: resolved };
  };
}

export const widthMatcher = sizingRule("w", "width");
export const heightMatcher = sizingRule("h", "height");
export const minWidthMatcher = sizingRule("min-w", "min-width");
export const minHeightMatcher = sizingRule("min-h", "min-height");
export const maxWidthMatcher = sizingRule("max-w", "max-width");
export const maxHeightMatcher = sizingRule("max-h", "max-height");

export const sizeMatcher: Matcher = (ctx) => {
  const { name, theme, arbitrary, arbUtility, arbValue } = ctx;
  if (arbitrary && arbUtility === "size") {
    return { width: arbValue!, height: arbValue! };
  }
  const rest = tryPrefix(name, "size");
  if (rest === null) return null;
  const resolved = resolveSize(rest, theme);
  if (!resolved) return null;
  return { width: resolved, height: resolved };
};

export const insetMatcher: Matcher = (ctx) => {
  const { name, theme, negative, arbitrary, arbUtility, arbValue } = ctx;
  const prefixes: Array<[string, string[]]> = [
    ["inset-x", ["left", "right"]],
    ["inset-y", ["top", "bottom"]],
    ["inset", ["top", "right", "bottom", "left"]],
    ["top", ["top"]],
    ["right", ["right"]],
    ["bottom", ["bottom"]],
    ["left", ["left"]],
    ["start", ["inset-inline-start"]],
    ["end", ["inset-inline-end"]],
  ];
  for (const [prefix, props] of prefixes) {
    if (arbitrary && arbUtility === prefix) {
      const value = negative ? `-${arbValue!}` : arbValue!;
      const out: CssDecl = {};
      for (const p of props) out[p] = value;
      return out;
    }
    const rest = tryPrefix(name, prefix);
    if (rest === null) continue;
    const resolved = resolveSpacing(rest, theme);
    if (resolved === null) continue;
    const value = negative && resolved !== "0px" && resolved !== "auto"
      ? `-${resolved}`
      : resolved;
    const out: CssDecl = {};
    for (const p of props) out[p] = value;
    return out;
  }
  return null;
};

export const aspectRatioMatcher: Matcher = ({ name, theme, arbitrary, arbUtility, arbValue }) => {
  if (arbitrary && arbUtility === "aspect") return { "aspect-ratio": arbValue! };
  const rest = tryPrefix(name, "aspect");
  if (rest === null) return null;
  const v = theme.aspectRatio[rest];
  if (!v) return null;
  return { "aspect-ratio": v };
};

export const layoutMatchers: Matcher[] = [
  displayMatcher,
  positionMatcher,
  overflowMatcher,
  visibilityMatcher,
  isolationMatcher,
  zIndexMatcher,
  paddingMatcher,
  marginMatcher,
  gapMatcher,
  spaceMatcher,
  widthMatcher,
  heightMatcher,
  minWidthMatcher,
  minHeightMatcher,
  maxWidthMatcher,
  maxHeightMatcher,
  sizeMatcher,
  insetMatcher,
  aspectRatioMatcher,
];

export { exact };
