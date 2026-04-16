import type { CssDecl, Matcher } from "./helpers";
import { colorWithOpacity, resolveColor, tryPrefix } from "./helpers";

const TEXT_ALIGN: Record<string, string> = {
  "text-left": "left",
  "text-center": "center",
  "text-right": "right",
  "text-justify": "justify",
  "text-start": "start",
  "text-end": "end",
};

const TEXT_TRANSFORM: Record<string, string> = {
  uppercase: "uppercase",
  lowercase: "lowercase",
  capitalize: "capitalize",
  "normal-case": "none",
};

const TEXT_DECORATION: Record<string, string> = {
  underline: "underline",
  overline: "overline",
  "line-through": "line-through",
  "no-underline": "none",
};

const FONT_STYLE: Record<string, string> = {
  italic: "italic",
  "not-italic": "normal",
};

const WHITESPACE: Record<string, string> = {
  "whitespace-normal": "normal",
  "whitespace-nowrap": "nowrap",
  "whitespace-pre": "pre",
  "whitespace-pre-line": "pre-line",
  "whitespace-pre-wrap": "pre-wrap",
  "whitespace-break-spaces": "break-spaces",
};

const TEXT_WRAP: Record<string, string> = {
  "text-wrap": "wrap",
  "text-nowrap": "nowrap",
  "text-balance": "balance",
  "text-pretty": "pretty",
};

const WORD_BREAK: Record<string, string> = {
  "break-normal": "normal",
  "break-words": "normal",
  "break-all": "break-all",
  "break-keep": "keep-all",
};

const VERTICAL_ALIGN: Record<string, string> = {
  "align-baseline": "baseline",
  "align-top": "top",
  "align-middle": "middle",
  "align-bottom": "bottom",
  "align-text-top": "text-top",
  "align-text-bottom": "text-bottom",
  "align-sub": "sub",
  "align-super": "super",
};

export const typographyMatchers: Matcher[] = [
  // text-align
  ({ name }) => (name in TEXT_ALIGN ? { "text-align": TEXT_ALIGN[name]! } : null),
  // transform
  ({ name }) => (name in TEXT_TRANSFORM ? { "text-transform": TEXT_TRANSFORM[name]! } : null),
  // decoration
  ({ name }) => (name in TEXT_DECORATION ? { "text-decoration-line": TEXT_DECORATION[name]! } : null),
  // italic
  ({ name }) => (name in FONT_STYLE ? { "font-style": FONT_STYLE[name]! } : null),
  // truncate
  ({ name }) =>
    name === "truncate"
      ? { overflow: "hidden", "text-overflow": "ellipsis", "white-space": "nowrap" }
      : null,
  // whitespace
  ({ name }) => (name in WHITESPACE ? { "white-space": WHITESPACE[name]! } : null),
  // text-wrap (must come before font-size; text-wrap is also a size? no, text-wrap is exact)
  ({ name }) => (name in TEXT_WRAP ? { "text-wrap": TEXT_WRAP[name]! } : null),
  // word-break
  ({ name }) => {
    if (name === "break-words") return { "overflow-wrap": "break-word" };
    if (name in WORD_BREAK) return { "word-break": WORD_BREAK[name]! };
    return null;
  },
  // vertical-align
  ({ name }) => (name in VERTICAL_ALIGN ? { "vertical-align": VERTICAL_ALIGN[name]! } : null),
  // font-family
  ({ name, theme }) => {
    const rest = tryPrefix(name, "font");
    if (rest === null) return null;
    if (rest in theme.fontFamily) return { "font-family": theme.fontFamily[rest]! };
    if (rest in theme.fontWeight) return { "font-weight": theme.fontWeight[rest]! };
    return null;
  },
  // leading-*
  ({ name, theme, arbitrary, arbUtility, arbValue }) => {
    if (arbitrary && arbUtility === "leading") return { "line-height": arbValue! };
    const rest = tryPrefix(name, "leading");
    if (rest === null) return null;
    if (rest in theme.lineHeight) return { "line-height": theme.lineHeight[rest]! };
    return null;
  },
  // tracking-*
  ({ name, theme, arbitrary, arbUtility, arbValue }) => {
    if (arbitrary && arbUtility === "tracking") return { "letter-spacing": arbValue! };
    const rest = tryPrefix(name, "tracking");
    if (rest === null) return null;
    if (rest in theme.letterSpacing) return { "letter-spacing": theme.letterSpacing[rest]! };
    return null;
  },
  // text-size (text-sm, text-lg, etc.) AND text-color (text-blue-500)
  ({ name, theme, arbitrary, arbUtility, arbValue }) => {
    if (arbitrary && arbUtility === "text") {
      if (arbValue!.startsWith("#") || arbValue!.includes("rgb") || arbValue!.includes("hsl") || arbValue!.includes("oklch")) {
        return { color: arbValue! };
      }
      return { "font-size": arbValue! };
    }
    const rest = tryPrefix(name, "text");
    if (rest === null) return null;
    if (rest in theme.fontSize) {
      const entry = theme.fontSize[rest]!;
      if (typeof entry === "string") return { "font-size": entry };
      const [size, opts] = entry;
      const out: CssDecl = { "font-size": size };
      if (opts.lineHeight) out["line-height"] = opts.lineHeight;
      if (opts.letterSpacing) out["letter-spacing"] = opts.letterSpacing;
      return out;
    }
    const color = resolveColor(rest, theme);
    if (color) return { color: colorWithOpacity(color.value, color.opacity, theme) };
    return null;
  },
  // line-clamp-*
  ({ name }) => {
    const rest = tryPrefix(name, "line-clamp");
    if (rest === null) return null;
    if (rest === "none") return { "-webkit-line-clamp": "unset", display: "block", "-webkit-box-orient": "unset" };
    if (/^\d+$/.test(rest)) {
      return {
        overflow: "hidden",
        display: "-webkit-box",
        "-webkit-box-orient": "vertical",
        "-webkit-line-clamp": rest,
      };
    }
    return null;
  },
];
