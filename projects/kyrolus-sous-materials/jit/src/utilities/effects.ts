import type { CssDecl, Matcher } from "./helpers";
import { tryPrefix } from "./helpers";

const ANIMATIONS: Record<string, string> = {
  "animate-none": "none",
  "animate-spin": "ks-spin 1s linear infinite",
  "animate-ping": "ks-ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
  "animate-pulse": "ks-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
  "animate-bounce": "ks-bounce 1s infinite",
};

const MIX_BLEND: Record<string, string> = {
  "mix-blend-normal": "normal",
  "mix-blend-multiply": "multiply",
  "mix-blend-screen": "screen",
  "mix-blend-overlay": "overlay",
  "mix-blend-darken": "darken",
  "mix-blend-lighten": "lighten",
  "mix-blend-color-dodge": "color-dodge",
  "mix-blend-color-burn": "color-burn",
  "mix-blend-hard-light": "hard-light",
  "mix-blend-soft-light": "soft-light",
  "mix-blend-difference": "difference",
  "mix-blend-exclusion": "exclusion",
  "mix-blend-hue": "hue",
  "mix-blend-saturation": "saturation",
  "mix-blend-color": "color",
  "mix-blend-luminosity": "luminosity",
};

export const effectsMatchers: Matcher[] = [
  // shadow / shadow-<size>
  ({ name, theme, arbitrary, arbUtility, arbValue }) => {
    if (arbitrary && arbUtility === "shadow") return { "box-shadow": arbValue! };
    if (name === "shadow") return { "box-shadow": theme.shadow.DEFAULT ?? "none" };
    const rest = tryPrefix(name, "shadow");
    if (rest === null) return null;
    if (rest in theme.shadow) return { "box-shadow": theme.shadow[rest]! };
    return null;
  },
  // ring-<n>
  ({ name, arbitrary, arbUtility, arbValue }) => {
    if (arbitrary && arbUtility === "ring") {
      return {
        "box-shadow": `0 0 0 ${arbValue!} var(--ks-ring-color, rgb(59 130 246 / 0.5))`,
      };
    }
    if (name === "ring") {
      return {
        "box-shadow": "0 0 0 3px var(--ks-ring-color, rgb(59 130 246 / 0.5))",
      };
    }
    const rest = tryPrefix(name, "ring");
    if (rest === null) return null;
    if (/^\d+$/.test(rest)) {
      return { "box-shadow": `0 0 0 ${rest}px var(--ks-ring-color, rgb(59 130 246 / 0.5))` };
    }
    return null;
  },
  // blur / blur-<size>
  ({ name, arbitrary, arbUtility, arbValue }) => {
    if (arbitrary && arbUtility === "blur") return { filter: `blur(${arbValue!})` };
    if (name === "blur") return { filter: "blur(8px)" };
    if (name === "blur-none") return { filter: "blur(0)" };
    const rest = tryPrefix(name, "blur");
    if (rest === null) return null;
    const sizes: Record<string, string> = {
      sm: "4px", md: "12px", lg: "16px", xl: "24px", "2xl": "40px", "3xl": "64px",
    };
    if (rest in sizes) return { filter: `blur(${sizes[rest]})` };
    return null;
  },
  // brightness / contrast / grayscale / saturate / invert / sepia / hue-rotate
  ({ name, arbitrary, arbUtility, arbValue }) => {
    const simple: Record<string, (v: string) => CssDecl> = {
      brightness: (v) => ({ filter: `brightness(${Number(v) / 100})` }),
      contrast: (v) => ({ filter: `contrast(${Number(v) / 100})` }),
      saturate: (v) => ({ filter: `saturate(${Number(v) / 100})` }),
      "hue-rotate": (v) => ({ filter: `hue-rotate(${v}deg)` }),
    };
    for (const [p, fn] of Object.entries(simple)) {
      if (arbitrary && arbUtility === p) return { filter: `${p}(${arbValue!})` };
      const rest = tryPrefix(name, p);
      if (rest !== null && /^-?\d+$/.test(rest)) return fn(rest);
    }
    if (name === "grayscale") return { filter: "grayscale(100%)" };
    if (name === "grayscale-0") return { filter: "grayscale(0)" };
    if (name === "invert") return { filter: "invert(100%)" };
    if (name === "invert-0") return { filter: "invert(0)" };
    if (name === "sepia") return { filter: "sepia(100%)" };
    if (name === "sepia-0") return { filter: "sepia(0)" };
    return null;
  },
  // animate-*
  ({ name }) => (name in ANIMATIONS ? { animation: ANIMATIONS[name]! } : null),
  // mix-blend-*
  ({ name }) => (name in MIX_BLEND ? { "mix-blend-mode": MIX_BLEND[name]! } : null),
  // backdrop-blur-*
  ({ name, arbitrary, arbUtility, arbValue }) => {
    if (arbitrary && arbUtility === "backdrop-blur")
      return { "backdrop-filter": `blur(${arbValue!})`, "-webkit-backdrop-filter": `blur(${arbValue!})` };
    if (name === "backdrop-blur") return { "backdrop-filter": "blur(8px)", "-webkit-backdrop-filter": "blur(8px)" };
    const rest = tryPrefix(name, "backdrop-blur");
    if (rest === null) return null;
    const sizes: Record<string, string> = {
      none: "0", sm: "4px", md: "12px", lg: "16px", xl: "24px", "2xl": "40px", "3xl": "64px",
    };
    if (rest in sizes) return {
      "backdrop-filter": `blur(${sizes[rest]})`,
      "-webkit-backdrop-filter": `blur(${sizes[rest]})`,
    };
    return null;
  },
];
