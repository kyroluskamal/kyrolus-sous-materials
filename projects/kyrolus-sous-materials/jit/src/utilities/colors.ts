import type { Matcher } from "./helpers";
import { colorWithOpacity, resolveColor, tryPrefix } from "./helpers";

function colorRule(prefix: string, prop: string | string[]): Matcher {
  const props = Array.isArray(prop) ? prop : [prop];
  return ({ name, theme, arbitrary, arbUtility, arbValue }) => {
    if (arbitrary && arbUtility === prefix) {
      const out: Record<string, string> = {};
      for (const p of props) out[p] = arbValue!;
      return out;
    }
    const rest = tryPrefix(name, prefix);
    if (rest === null) return null;
    const color = resolveColor(rest, theme);
    if (!color) return null;
    const value = colorWithOpacity(color.value, color.opacity, theme);
    const out: Record<string, string> = {};
    for (const p of props) out[p] = value;
    return out;
  };
}

export const backgroundColorMatcher = colorRule("bg", "background-color");
export const borderColorMatcher = colorRule("border", "border-color");
export const outlineColorMatcher = colorRule("outline", "outline-color");
export const ringColorMatcher = colorRule("ring", "--ks-ring-color");
export const fillMatcher = colorRule("fill", "fill");
export const strokeMatcher = colorRule("stroke", "stroke");
export const accentColorMatcher = colorRule("accent", "accent-color");
export const caretColorMatcher = colorRule("caret", "caret-color");
export const decorationColorMatcher = colorRule("decoration", "text-decoration-color");
export const placeholderColorMatcher = colorRule("placeholder", "color");

export const opacityMatcher: Matcher = ({ name, theme, arbitrary, arbUtility, arbValue }) => {
  if (arbitrary && arbUtility === "opacity") return { opacity: arbValue! };
  const rest = tryPrefix(name, "opacity");
  if (rest === null) return null;
  if (rest in theme.opacity) return { opacity: theme.opacity[rest]! };
  return null;
};

export const colorMatchers: Matcher[] = [
  backgroundColorMatcher,
  borderColorMatcher,
  outlineColorMatcher,
  ringColorMatcher,
  fillMatcher,
  strokeMatcher,
  accentColorMatcher,
  caretColorMatcher,
  decorationColorMatcher,
  opacityMatcher,
];
