import type { CssDecl, Matcher } from "./helpers";
import { tryPrefix } from "./helpers";

const BORDER_STYLE = ["solid", "dashed", "dotted", "double", "hidden", "none"];

const SIDE_MAP: Record<string, string[]> = {
  "": ["border-width"],
  t: ["border-top-width"],
  r: ["border-right-width"],
  b: ["border-bottom-width"],
  l: ["border-left-width"],
  s: ["border-inline-start-width"],
  e: ["border-inline-end-width"],
  x: ["border-left-width", "border-right-width"],
  y: ["border-top-width", "border-bottom-width"],
};

const RADIUS_SIDE_MAP: Record<string, string[]> = {
  "": ["border-radius"],
  t: ["border-top-left-radius", "border-top-right-radius"],
  r: ["border-top-right-radius", "border-bottom-right-radius"],
  b: ["border-bottom-left-radius", "border-bottom-right-radius"],
  l: ["border-top-left-radius", "border-bottom-left-radius"],
  tl: ["border-top-left-radius"],
  tr: ["border-top-right-radius"],
  bl: ["border-bottom-left-radius"],
  br: ["border-bottom-right-radius"],
  ss: ["border-start-start-radius"],
  se: ["border-start-end-radius"],
  es: ["border-end-start-radius"],
  ee: ["border-end-end-radius"],
};

export const borderMatchers: Matcher[] = [
  // border-style (must match before border-width since "border-solid" vs "border-2")
  ({ name }) => {
    const rest = tryPrefix(name, "border");
    if (rest === null) return null;
    if (BORDER_STYLE.includes(rest)) return { "border-style": rest };
    return null;
  },
  // border-width: "border" | "border-<n>" | "border-x-<n>" | "border-t-<n>" etc.
  ({ name, theme, arbitrary, arbUtility, arbValue }) => {
    if (arbitrary && (arbUtility === "border" || arbUtility?.startsWith("border-"))) {
      const sideKey = arbUtility === "border" ? "" : arbUtility!.slice("border-".length);
      const props = SIDE_MAP[sideKey];
      if (!props) return null;
      const out: CssDecl = {};
      for (const p of props) out[p] = arbValue!;
      return out;
    }
    const rest = tryPrefix(name, "border");
    if (rest === null && name !== "border") return null;
    if (name === "border") {
      return { "border-width": theme.borderWidth.DEFAULT ?? "1px" };
    }
    // Determine side + width
    let side = "";
    let width = rest!;
    const sideMatch = /^([trblsxey])(?:-(.+))?$/.exec(rest!);
    if (sideMatch) {
      side = sideMatch[1]!;
      width = sideMatch[2] ?? "";
    }
    const props = SIDE_MAP[side];
    if (!props) return null;
    // If no width specified but side is, default to DEFAULT width
    if (width === "") {
      const out: CssDecl = {};
      for (const p of props) out[p] = theme.borderWidth.DEFAULT ?? "1px";
      return out;
    }
    const value = theme.borderWidth[width];
    if (value === undefined) return null;
    const out: CssDecl = {};
    for (const p of props) out[p] = value;
    return out;
  },
  // rounded / rounded-<size> / rounded-<side>-<size>
  ({ name, theme, arbitrary, arbUtility, arbValue }) => {
    if (arbitrary && (arbUtility === "rounded" || arbUtility?.startsWith("rounded-"))) {
      const sideKey = arbUtility === "rounded" ? "" : arbUtility!.slice("rounded-".length);
      const props = RADIUS_SIDE_MAP[sideKey];
      if (!props) return null;
      const out: CssDecl = {};
      for (const p of props) out[p] = arbValue!;
      return out;
    }
    if (name === "rounded") {
      return { "border-radius": theme.radius.DEFAULT ?? "0.25rem" };
    }
    const rest = tryPrefix(name, "rounded");
    if (rest === null) return null;
    // Check if it's a side prefix
    const sidePrefixes = Object.keys(RADIUS_SIDE_MAP).filter((k) => k).sort((a, b) => b.length - a.length);
    for (const s of sidePrefixes) {
      if (rest === s) {
        const props = RADIUS_SIDE_MAP[s]!;
        const out: CssDecl = {};
        for (const p of props) out[p] = theme.radius.DEFAULT ?? "0.25rem";
        return out;
      }
      if (rest.startsWith(s + "-")) {
        const sizeKey = rest.slice(s.length + 1);
        const value = theme.radius[sizeKey];
        if (value === undefined) continue;
        const props = RADIUS_SIDE_MAP[s]!;
        const out: CssDecl = {};
        for (const p of props) out[p] = value;
        return out;
      }
    }
    // Just rounded-<size>
    const value = theme.radius[rest];
    if (value === undefined) return null;
    return { "border-radius": value };
  },
  // outline-style / outline-<n> / outline-none
  ({ name, theme, arbitrary, arbUtility, arbValue }) => {
    if (name === "outline-none") {
      return { outline: "2px solid transparent", "outline-offset": "2px" };
    }
    if (name === "outline") return { "outline-style": "solid" };
    if (name === "outline-dashed") return { "outline-style": "dashed" };
    if (name === "outline-dotted") return { "outline-style": "dotted" };
    if (name === "outline-double") return { "outline-style": "double" };
    if (arbitrary && arbUtility === "outline") return { "outline-width": arbValue! };
    const rest = tryPrefix(name, "outline");
    if (rest === null) return null;
    if (/^\d+$/.test(rest)) return { "outline-width": `${rest}px` };
    return null;
  },
];
