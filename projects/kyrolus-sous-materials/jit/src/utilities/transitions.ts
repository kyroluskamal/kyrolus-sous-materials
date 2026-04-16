import type { Matcher } from "./helpers";
import { tryPrefix } from "./helpers";

const TRANSITION_PROPERTIES: Record<string, string> = {
  transition: "color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter",
  "transition-none": "none",
  "transition-all": "all",
  "transition-colors": "color, background-color, border-color, text-decoration-color, fill, stroke",
  "transition-opacity": "opacity",
  "transition-shadow": "box-shadow",
  "transition-transform": "transform",
};

const TRANSFORM_ORIGIN: Record<string, string> = {
  "origin-center": "center",
  "origin-top": "top",
  "origin-top-right": "top right",
  "origin-right": "right",
  "origin-bottom-right": "bottom right",
  "origin-bottom": "bottom",
  "origin-bottom-left": "bottom left",
  "origin-left": "left",
  "origin-top-left": "top left",
};

export const transitionMatchers: Matcher[] = [
  ({ name, theme }) => {
    if (name in TRANSITION_PROPERTIES) {
      const value = TRANSITION_PROPERTIES[name]!;
      if (value === "none") return { "transition-property": "none" };
      return {
        "transition-property": value,
        "transition-timing-function": theme.transitionTiming.DEFAULT ?? "cubic-bezier(0.4, 0, 0.2, 1)",
        "transition-duration": "150ms",
      };
    }
    return null;
  },
  // duration-*
  ({ name, theme, arbitrary, arbUtility, arbValue }) => {
    if (arbitrary && arbUtility === "duration") return { "transition-duration": arbValue! };
    const rest = tryPrefix(name, "duration");
    if (rest === null) return null;
    if (rest in theme.transitionDuration) return { "transition-duration": theme.transitionDuration[rest]! };
    return null;
  },
  // delay-*
  ({ name, theme, arbitrary, arbUtility, arbValue }) => {
    if (arbitrary && arbUtility === "delay") return { "transition-delay": arbValue! };
    const rest = tryPrefix(name, "delay");
    if (rest === null) return null;
    if (rest in theme.transitionDuration) return { "transition-delay": theme.transitionDuration[rest]! };
    return null;
  },
  // ease-*
  ({ name, theme }) => {
    const rest = tryPrefix(name, "ease");
    if (rest === null) return null;
    if (rest in theme.transitionTiming) return { "transition-timing-function": theme.transitionTiming[rest]! };
    return null;
  },
  // transform-none / transform-gpu
  ({ name }) => {
    if (name === "transform-none") return { transform: "none" };
    if (name === "transform-gpu") return { transform: "translateZ(0)" };
    if (name === "transform-cpu") return { transform: "none" };
    return null;
  },
  // rotate-*
  ({ name, negative, arbitrary, arbUtility, arbValue }) => {
    if (arbitrary && arbUtility === "rotate") return { transform: `rotate(${arbValue!})` };
    const rest = tryPrefix(name, "rotate");
    if (rest === null) return null;
    if (/^\d+$/.test(rest)) return { transform: `rotate(${negative ? "-" : ""}${rest}deg)` };
    return null;
  },
  // scale-*
  ({ name, negative, arbitrary, arbUtility, arbValue }) => {
    if (arbitrary && (arbUtility === "scale" || arbUtility === "scale-x" || arbUtility === "scale-y")) {
      const prop = arbUtility === "scale" ? "transform" : "transform";
      const fn = arbUtility === "scale" ? "scale" : arbUtility === "scale-x" ? "scaleX" : "scaleY";
      return { [prop]: `${fn}(${arbValue!})` };
    }
    for (const [p, fn] of [["scale", "scale"], ["scale-x", "scaleX"], ["scale-y", "scaleY"]] as const) {
      const rest = tryPrefix(name, p);
      if (rest === null) continue;
      if (/^\d+$/.test(rest)) {
        const v = Number(rest) / 100;
        return { transform: `${fn}(${negative ? -v : v})` };
      }
    }
    return null;
  },
  // translate-x-* / translate-y-*
  ({ name, theme, negative, arbitrary, arbUtility, arbValue }) => {
    for (const [p, fn] of [["translate-x", "translateX"], ["translate-y", "translateY"]] as const) {
      if (arbitrary && arbUtility === p) {
        const v = negative ? `-${arbValue!}` : arbValue!;
        return { transform: `${fn}(${v})` };
      }
      const rest = tryPrefix(name, p);
      if (rest === null) continue;
      if (rest in theme.spacing) {
        const v = theme.spacing[rest]!;
        const sign = negative && v !== "0px" ? "-" : "";
        return { transform: `${fn}(${sign}${v})` };
      }
      if (rest === "full") return { transform: `${fn}(${negative ? "-" : ""}100%)` };
      const frac = /^(\d+)\/(\d+)$/.exec(rest);
      if (frac) {
        const p2 = (Number(frac[1]) / Number(frac[2])) * 100;
        return { transform: `${fn}(${negative ? -p2 : p2}%)` };
      }
    }
    return null;
  },
  // skew-x-* / skew-y-*
  ({ name, negative, arbitrary, arbUtility, arbValue }) => {
    for (const [p, fn] of [["skew-x", "skewX"], ["skew-y", "skewY"]] as const) {
      if (arbitrary && arbUtility === p) {
        return { transform: `${fn}(${negative ? "-" : ""}${arbValue!})` };
      }
      const rest = tryPrefix(name, p);
      if (rest === null) continue;
      if (/^\d+$/.test(rest)) return { transform: `${fn}(${negative ? "-" : ""}${rest}deg)` };
    }
    return null;
  },
  // origin
  ({ name }) => (name in TRANSFORM_ORIGIN ? { "transform-origin": TRANSFORM_ORIGIN[name]! } : null),
];
