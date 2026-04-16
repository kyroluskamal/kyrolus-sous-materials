import type { CssDecl, Matcher } from "./helpers";
import { resolveSpacing, tryPrefix } from "./helpers";

const FLEX_DIRECTION: Record<string, string> = {
  "flex-row": "row",
  "flex-row-reverse": "row-reverse",
  "flex-col": "column",
  "flex-col-reverse": "column-reverse",
};

const FLEX_WRAP: Record<string, string> = {
  "flex-wrap": "wrap",
  "flex-wrap-reverse": "wrap-reverse",
  "flex-nowrap": "nowrap",
};

const ITEMS: Record<string, string> = {
  "items-start": "flex-start",
  "items-center": "center",
  "items-end": "flex-end",
  "items-baseline": "baseline",
  "items-stretch": "stretch",
};

const JUSTIFY: Record<string, string> = {
  "justify-start": "flex-start",
  "justify-center": "center",
  "justify-end": "flex-end",
  "justify-between": "space-between",
  "justify-around": "space-around",
  "justify-evenly": "space-evenly",
  "justify-normal": "normal",
  "justify-stretch": "stretch",
};

const JUSTIFY_ITEMS: Record<string, string> = {
  "justify-items-start": "start",
  "justify-items-center": "center",
  "justify-items-end": "end",
  "justify-items-stretch": "stretch",
};

const CONTENT: Record<string, string> = {
  "content-start": "flex-start",
  "content-center": "center",
  "content-end": "flex-end",
  "content-between": "space-between",
  "content-around": "space-around",
  "content-evenly": "space-evenly",
  "content-stretch": "stretch",
  "content-baseline": "baseline",
  "content-normal": "normal",
};

const SELF: Record<string, string> = {
  "self-auto": "auto",
  "self-start": "flex-start",
  "self-center": "center",
  "self-end": "flex-end",
  "self-stretch": "stretch",
  "self-baseline": "baseline",
};

const JUSTIFY_SELF: Record<string, string> = {
  "justify-self-auto": "auto",
  "justify-self-start": "start",
  "justify-self-center": "center",
  "justify-self-end": "end",
  "justify-self-stretch": "stretch",
};

const PLACE_ITEMS: Record<string, string> = {
  "place-items-start": "start",
  "place-items-center": "center",
  "place-items-end": "end",
  "place-items-stretch": "stretch",
  "place-items-baseline": "baseline",
};

const FLEX_SHORTHAND: Record<string, string> = {
  "flex-1": "1 1 0%",
  "flex-auto": "1 1 auto",
  "flex-initial": "0 1 auto",
  "flex-none": "none",
};

export const flexGridMatchers: Matcher[] = [
  ({ name }) => (name in FLEX_DIRECTION ? { "flex-direction": FLEX_DIRECTION[name]! } : null),
  ({ name }) => (name in FLEX_WRAP ? { "flex-wrap": FLEX_WRAP[name]! } : null),
  ({ name }) => (name in FLEX_SHORTHAND ? { flex: FLEX_SHORTHAND[name]! } : null),
  ({ name }) => (name in ITEMS ? { "align-items": ITEMS[name]! } : null),
  ({ name }) => (name in JUSTIFY ? { "justify-content": JUSTIFY[name]! } : null),
  ({ name }) => (name in JUSTIFY_ITEMS ? { "justify-items": JUSTIFY_ITEMS[name]! } : null),
  ({ name }) => (name in JUSTIFY_SELF ? { "justify-self": JUSTIFY_SELF[name]! } : null),
  ({ name }) => (name in CONTENT ? { "align-content": CONTENT[name]! } : null),
  ({ name }) => (name in SELF ? { "align-self": SELF[name]! } : null),
  ({ name }) => (name in PLACE_ITEMS ? { "place-items": PLACE_ITEMS[name]! } : null),
  // grow / shrink
  ({ name }) => {
    if (name === "grow") return { "flex-grow": "1" };
    if (name === "grow-0") return { "flex-grow": "0" };
    if (name === "shrink") return { "flex-shrink": "1" };
    if (name === "shrink-0") return { "flex-shrink": "0" };
    return null;
  },
  // order
  ({ name, negative }) => {
    const rest = tryPrefix(name, "order");
    if (rest === null) return null;
    if (rest === "first") return { order: "-9999" };
    if (rest === "last") return { order: "9999" };
    if (rest === "none") return { order: "0" };
    if (/^\d+$/.test(rest)) return { order: negative ? `-${rest}` : rest };
    return null;
  },
  // basis
  ({ name, theme, arbitrary, arbUtility, arbValue }) => {
    if (arbitrary && arbUtility === "basis") return { "flex-basis": arbValue! };
    const rest = tryPrefix(name, "basis");
    if (rest === null) return null;
    const v = resolveSpacing(rest, theme);
    if (v === null) return null;
    return { "flex-basis": v };
  },
  // grid-cols-*
  ({ name, arbitrary, arbUtility, arbValue }) => {
    if (arbitrary && arbUtility === "grid-cols") return { "grid-template-columns": arbValue! };
    const rest = tryPrefix(name, "grid-cols");
    if (rest === null) return null;
    if (rest === "none") return { "grid-template-columns": "none" };
    if (rest === "subgrid") return { "grid-template-columns": "subgrid" };
    if (/^\d+$/.test(rest)) {
      return { "grid-template-columns": `repeat(${rest}, minmax(0, 1fr))` };
    }
    return null;
  },
  // grid-rows-*
  ({ name, arbitrary, arbUtility, arbValue }) => {
    if (arbitrary && arbUtility === "grid-rows") return { "grid-template-rows": arbValue! };
    const rest = tryPrefix(name, "grid-rows");
    if (rest === null) return null;
    if (rest === "none") return { "grid-template-rows": "none" };
    if (rest === "subgrid") return { "grid-template-rows": "subgrid" };
    if (/^\d+$/.test(rest)) {
      return { "grid-template-rows": `repeat(${rest}, minmax(0, 1fr))` };
    }
    return null;
  },
  // col-span-* / row-span-*
  ({ name }) => {
    const colSpan = tryPrefix(name, "col-span");
    if (colSpan !== null) {
      if (colSpan === "full") return { "grid-column": "1 / -1" };
      if (/^\d+$/.test(colSpan)) return { "grid-column": `span ${colSpan} / span ${colSpan}` };
    }
    const rowSpan = tryPrefix(name, "row-span");
    if (rowSpan !== null) {
      if (rowSpan === "full") return { "grid-row": "1 / -1" };
      if (/^\d+$/.test(rowSpan)) return { "grid-row": `span ${rowSpan} / span ${rowSpan}` };
    }
    return null;
  },
  // col-start-* / col-end-* / row-start-* / row-end-*
  ({ name }) => {
    const pairs: Array<[string, string]> = [
      ["col-start", "grid-column-start"],
      ["col-end", "grid-column-end"],
      ["row-start", "grid-row-start"],
      ["row-end", "grid-row-end"],
    ];
    for (const [p, prop] of pairs) {
      const rest = tryPrefix(name, p);
      if (rest === null) continue;
      if (rest === "auto") return { [prop]: "auto" };
      if (/^\d+$/.test(rest)) return { [prop]: rest };
    }
    return null;
  },
  // flex numeric (flex-2, flex-[2 2 0%])
  ({ name, arbitrary, arbUtility, arbValue }) => {
    if (arbitrary && arbUtility === "flex") return { flex: arbValue! };
    return null;
  },
];

export type { CssDecl };
