import { compile } from "./compiler";
import type { Theme } from "./types";

export interface EnumerateResult {
  name: string;
  version: string;
  description: string;
  generatedAt: string;
  classGroups: Record<string, string[]>;
  meta: {
    totalClasses: number;
    groups: number;
    parityChecked: boolean;
    parityMismatches: string[];
  };
}

type Enumerator = (theme: Theme) => string[];

interface GroupSpec {
  group: string;
  enumerate: Enumerator;
}

const SPACING_SIDES_PADDING = ["p", "px", "py", "pt", "pr", "pb", "pl", "ps", "pe"];
const SPACING_SIDES_MARGIN = ["m", "mx", "my", "mt", "mr", "mb", "ml", "ms", "me"];
const INSET_PREFIXES = ["inset", "inset-x", "inset-y", "top", "right", "bottom", "left", "start", "end"];
// Matches the colorMatchers registered in utilities/colors.ts. `placeholder-*`
// is intentionally excluded — placeholder styling uses the `placeholder:` pseudo-element
// variant (e.g. `placeholder:text-red-500`), not a dedicated utility.
const COLOR_PREFIXES: Array<[string, string]> = [
  ["backgroundColor", "bg"],
  ["borderColor", "border"],
  ["outlineColor", "outline"],
  ["ringColor", "ring"],
  ["fill", "fill"],
  ["stroke", "stroke"],
  ["accentColor", "accent"],
  ["caretColor", "caret"],
  ["decorationColor", "decoration"],
];

function colorClasses(prefix: string, theme: Theme): string[] {
  const out: string[] = [];
  for (const [key, value] of Object.entries(theme.colors)) {
    if (typeof value === "string") {
      out.push(`${prefix}-${key}`);
    } else {
      for (const shade of Object.keys(value)) {
        out.push(`${prefix}-${key}-${shade}`);
      }
    }
  }
  return out;
}

function spacingKeys(theme: Theme): string[] {
  return Object.keys(theme.spacing);
}

const FRACTION_SPACING = ["1/2", "1/3", "2/3", "1/4", "2/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "2/6", "3/6", "4/6", "5/6", "1/12", "2/12", "3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12", "10/12", "11/12"];

function sizingValues(theme: Theme, extras: string[]): string[] {
  return [...spacingKeys(theme), ...FRACTION_SPACING, ...extras];
}

const groups: GroupSpec[] = [
  // --- DISPLAY / VISIBILITY / ISOLATION -------------------------
  {
    group: "display",
    enumerate: () => [
      "block", "inline-block", "inline", "flex", "inline-flex", "grid",
      "inline-grid", "hidden", "contents", "flow-root", "table",
      "inline-table", "list-item",
    ],
  },
  {
    group: "visibility",
    enumerate: () => ["visible", "invisible", "collapse"],
  },
  {
    group: "isolation",
    enumerate: () => ["isolate", "isolation-auto"],
  },
  {
    group: "position",
    enumerate: () => ["static", "relative", "absolute", "fixed", "sticky"],
  },

  // --- OVERFLOW -------------------------------------------------
  {
    group: "overflow",
    enumerate: () => {
      const values = ["auto", "hidden", "clip", "visible", "scroll"];
      const out: string[] = [];
      for (const v of values) out.push(`overflow-${v}`);
      for (const v of values) out.push(`overflow-x-${v}`);
      for (const v of values) out.push(`overflow-y-${v}`);
      return out;
    },
  },

  // --- Z-INDEX --------------------------------------------------
  {
    group: "zIndex",
    enumerate: (theme) =>
      Object.keys(theme.zIndex).map((k) => (k === "auto" ? "z-auto" : `z-${k}`)),
  },

  // --- SPACING (padding / margin / gap / space) -----------------
  {
    group: "padding",
    enumerate: (theme) => {
      const keys = spacingKeys(theme);
      const out: string[] = [];
      for (const side of SPACING_SIDES_PADDING) {
        for (const k of keys) out.push(`${side}-${k}`);
      }
      return out;
    },
  },
  {
    group: "margin",
    enumerate: (theme) => {
      const keys = [...spacingKeys(theme), "auto"];
      const out: string[] = [];
      for (const side of SPACING_SIDES_MARGIN) {
        for (const k of keys) out.push(`${side}-${k}`);
      }
      // negative margin
      for (const side of SPACING_SIDES_MARGIN) {
        for (const k of spacingKeys(theme)) {
          if (k === "0" || k === "px") continue;
          out.push(`-${side}-${k}`);
        }
      }
      return out;
    },
  },
  {
    group: "gap",
    enumerate: (theme) => {
      const out: string[] = [];
      for (const p of ["gap", "gap-x", "gap-y"]) {
        for (const k of spacingKeys(theme)) out.push(`${p}-${k}`);
      }
      return out;
    },
  },
  {
    group: "space",
    enumerate: (theme) => {
      const out: string[] = [];
      for (const p of ["space-x", "space-y"]) {
        for (const k of spacingKeys(theme)) out.push(`${p}-${k}`);
      }
      return out;
    },
  },

  // --- SIZING (w/h/min/max/size) --------------------------------
  {
    group: "width",
    enumerate: (theme) =>
      sizingValues(theme, ["auto", "full", "screen", "min", "max", "fit"]).map((k) => `w-${k}`),
  },
  {
    group: "height",
    enumerate: (theme) =>
      sizingValues(theme, ["auto", "full", "screen", "min", "max", "fit"]).map((k) => `h-${k}`),
  },
  {
    group: "minWidth",
    enumerate: (theme) =>
      sizingValues(theme, ["auto", "full", "screen", "min", "max", "fit"]).map((k) => `min-w-${k}`),
  },
  {
    group: "minHeight",
    enumerate: (theme) =>
      sizingValues(theme, ["auto", "full", "screen", "min", "max", "fit"]).map((k) => `min-h-${k}`),
  },
  {
    group: "maxWidth",
    enumerate: (theme) =>
      sizingValues(theme, ["auto", "full", "screen", "min", "max", "fit"]).map((k) => `max-w-${k}`),
  },
  {
    group: "maxHeight",
    enumerate: (theme) =>
      sizingValues(theme, ["auto", "full", "screen", "min", "max", "fit"]).map((k) => `max-h-${k}`),
  },
  {
    group: "size",
    enumerate: (theme) =>
      sizingValues(theme, ["auto", "full", "min", "max", "fit"]).map((k) => `size-${k}`),
  },

  // --- INSET ----------------------------------------------------
  {
    group: "inset",
    enumerate: (theme) => {
      const keys = [...spacingKeys(theme), "auto", "full", ...FRACTION_SPACING];
      const out: string[] = [];
      for (const p of INSET_PREFIXES) {
        for (const k of keys) out.push(`${p}-${k}`);
      }
      return out;
    },
  },

  // --- ASPECT RATIO --------------------------------------------
  {
    group: "aspectRatio",
    enumerate: (theme) => Object.keys(theme.aspectRatio).map((k) => `aspect-${k}`),
  },

  // --- FLEX / GRID (static buckets) -----------------------------
  {
    group: "flexDirection",
    enumerate: () => ["flex-row", "flex-row-reverse", "flex-col", "flex-col-reverse"],
  },
  {
    group: "flexWrap",
    enumerate: () => ["flex-wrap", "flex-wrap-reverse", "flex-nowrap"],
  },
  {
    group: "flex",
    enumerate: () => ["flex-1", "flex-auto", "flex-initial", "flex-none"],
  },
  {
    group: "flexGrow",
    enumerate: () => ["grow", "grow-0"],
  },
  {
    group: "flexShrink",
    enumerate: () => ["shrink", "shrink-0"],
  },
  {
    group: "alignItems",
    enumerate: () => ["items-start", "items-end", "items-center", "items-baseline", "items-stretch"],
  },
  {
    group: "justifyContent",
    enumerate: () => [
      "justify-start", "justify-end", "justify-center", "justify-between",
      "justify-around", "justify-evenly", "justify-normal", "justify-stretch",
    ],
  },
  {
    group: "justifyItems",
    enumerate: () => ["justify-items-start", "justify-items-center", "justify-items-end", "justify-items-stretch"],
  },
  {
    group: "justifySelf",
    enumerate: () => ["justify-self-auto", "justify-self-start", "justify-self-center", "justify-self-end", "justify-self-stretch"],
  },
  {
    group: "alignContent",
    enumerate: () => [
      "content-start", "content-center", "content-end", "content-between",
      "content-around", "content-evenly", "content-stretch", "content-baseline", "content-normal",
    ],
  },
  {
    group: "alignSelf",
    enumerate: () => ["self-auto", "self-start", "self-end", "self-center", "self-stretch", "self-baseline"],
  },
  {
    group: "placeItems",
    enumerate: () => ["place-items-start", "place-items-center", "place-items-end", "place-items-stretch", "place-items-baseline"],
  },
  {
    group: "order",
    enumerate: () => {
      const out = ["order-first", "order-last", "order-none"];
      for (let i = 1; i <= 12; i++) out.push(`order-${i}`);
      return out;
    },
  },
  {
    group: "flexBasis",
    enumerate: (theme) => spacingKeys(theme).map((k) => `basis-${k}`),
  },
  {
    group: "gridTemplateColumns",
    enumerate: () => {
      const out = ["grid-cols-none", "grid-cols-subgrid"];
      for (let i = 1; i <= 12; i++) out.push(`grid-cols-${i}`);
      return out;
    },
  },
  {
    group: "gridTemplateRows",
    enumerate: () => {
      const out = ["grid-rows-none", "grid-rows-subgrid"];
      for (let i = 1; i <= 12; i++) out.push(`grid-rows-${i}`);
      return out;
    },
  },
  {
    group: "gridColumn",
    enumerate: () => {
      const out = ["col-span-full"];
      for (let i = 1; i <= 12; i++) out.push(`col-span-${i}`);
      return out;
    },
  },
  {
    group: "gridRow",
    enumerate: () => {
      const out = ["row-span-full"];
      for (let i = 1; i <= 6; i++) out.push(`row-span-${i}`);
      return out;
    },
  },
  {
    group: "gridColumnStart",
    enumerate: () => {
      const out = ["col-start-auto"];
      for (let i = 1; i <= 13; i++) out.push(`col-start-${i}`);
      return out;
    },
  },
  {
    group: "gridColumnEnd",
    enumerate: () => {
      const out = ["col-end-auto"];
      for (let i = 1; i <= 13; i++) out.push(`col-end-${i}`);
      return out;
    },
  },
  {
    group: "gridRowStart",
    enumerate: () => {
      const out = ["row-start-auto"];
      for (let i = 1; i <= 7; i++) out.push(`row-start-${i}`);
      return out;
    },
  },
  {
    group: "gridRowEnd",
    enumerate: () => {
      const out = ["row-end-auto"];
      for (let i = 1; i <= 7; i++) out.push(`row-end-${i}`);
      return out;
    },
  },

  // --- TYPOGRAPHY -----------------------------------------------
  {
    group: "textAlign",
    enumerate: () => ["text-left", "text-center", "text-right", "text-justify", "text-start", "text-end"],
  },
  {
    group: "textTransform",
    enumerate: () => ["uppercase", "lowercase", "capitalize", "normal-case"],
  },
  {
    group: "textDecoration",
    enumerate: () => ["underline", "overline", "line-through", "no-underline"],
  },
  {
    group: "fontStyle",
    enumerate: () => ["italic", "not-italic"],
  },
  {
    group: "whitespace",
    enumerate: () => [
      "whitespace-normal", "whitespace-nowrap", "whitespace-pre",
      "whitespace-pre-line", "whitespace-pre-wrap", "whitespace-break-spaces",
    ],
  },
  {
    group: "textWrap",
    enumerate: () => ["text-wrap", "text-nowrap", "text-balance", "text-pretty"],
  },
  {
    group: "wordBreak",
    enumerate: () => ["break-normal", "break-words", "break-all", "break-keep"],
  },
  {
    group: "verticalAlign",
    enumerate: () => [
      "align-baseline", "align-top", "align-middle", "align-bottom",
      "align-text-top", "align-text-bottom", "align-sub", "align-super",
    ],
  },
  {
    group: "truncate",
    enumerate: () => ["truncate"],
  },
  {
    group: "fontFamily",
    enumerate: (theme) => Object.keys(theme.fontFamily).map((k) => `font-${k}`),
  },
  {
    group: "fontWeight",
    enumerate: (theme) => Object.keys(theme.fontWeight).map((k) => `font-${k}`),
  },
  {
    group: "fontSize",
    enumerate: (theme) => Object.keys(theme.fontSize).map((k) => `text-${k}`),
  },
  {
    group: "lineHeight",
    enumerate: (theme) => Object.keys(theme.lineHeight).map((k) => `leading-${k}`),
  },
  {
    group: "letterSpacing",
    enumerate: (theme) => Object.keys(theme.letterSpacing).map((k) => `tracking-${k}`),
  },
  {
    group: "lineClamp",
    enumerate: () => {
      const out = ["line-clamp-none"];
      for (let i = 1; i <= 6; i++) out.push(`line-clamp-${i}`);
      return out;
    },
  },

  // --- COLORS (bg/border/outline/ring/fill/stroke/accent/caret/decoration/placeholder) ---
  ...COLOR_PREFIXES.map<GroupSpec>(([group, prefix]) => ({
    group,
    enumerate: (theme) => colorClasses(prefix, theme),
  })),

  // --- OPACITY --------------------------------------------------
  {
    group: "opacity",
    enumerate: (theme) => Object.keys(theme.opacity).map((k) => `opacity-${k}`),
  },

  // --- TEXT COLOR (uses "text-" prefix, collides with font-size; matcher handles both) ---
  {
    group: "textColor",
    enumerate: (theme) => colorClasses("text", theme),
  },

  // --- BORDERS --------------------------------------------------
  {
    group: "borderStyle",
    enumerate: () => ["border-solid", "border-dashed", "border-dotted", "border-double", "border-hidden", "border-none"],
  },
  {
    group: "borderWidth",
    enumerate: (theme) => {
      const widths = Object.keys(theme.borderWidth).filter((k) => k !== "DEFAULT");
      const sides = ["", "t", "r", "b", "l", "s", "e", "x", "y"];
      const out: string[] = ["border"];
      // border-<side> (uses DEFAULT width)
      for (const s of sides) {
        if (s === "") continue;
        out.push(`border-${s}`);
      }
      // border-<n> and border-<side>-<n>
      for (const w of widths) {
        out.push(`border-${w}`);
        for (const s of sides) {
          if (s === "") continue;
          out.push(`border-${s}-${w}`);
        }
      }
      return out;
    },
  },
  {
    group: "borderRadius",
    enumerate: (theme) => {
      const sizes = Object.keys(theme.radius);
      const sides = ["", "t", "r", "b", "l", "tl", "tr", "bl", "br", "ss", "se", "es", "ee"];
      const out: string[] = ["rounded"];
      for (const s of sides) {
        if (s === "") continue;
        out.push(`rounded-${s}`);
      }
      for (const size of sizes) {
        if (size === "DEFAULT") continue;
        out.push(`rounded-${size}`);
        for (const s of sides) {
          if (s === "") continue;
          out.push(`rounded-${s}-${size}`);
        }
      }
      return out;
    },
  },
  {
    group: "outline",
    enumerate: () => {
      const out = ["outline-none", "outline", "outline-dashed", "outline-dotted", "outline-double"];
      for (let i = 0; i <= 8; i++) out.push(`outline-${i}`);
      return out;
    },
  },

  // --- EFFECTS --------------------------------------------------
  {
    group: "boxShadow",
    enumerate: (theme) => {
      const out = ["shadow"];
      for (const k of Object.keys(theme.shadow)) {
        if (k === "DEFAULT") continue;
        out.push(`shadow-${k}`);
      }
      return out;
    },
  },
  {
    group: "ring",
    enumerate: () => {
      const out = ["ring"];
      for (const w of [0, 1, 2, 4, 8]) out.push(`ring-${w}`);
      return out;
    },
  },
  {
    group: "blur",
    enumerate: () => ["blur", "blur-none", "blur-sm", "blur-md", "blur-lg", "blur-xl", "blur-2xl", "blur-3xl"],
  },
  {
    group: "brightness",
    enumerate: () => {
      const out: string[] = [];
      for (const v of [0, 50, 75, 90, 95, 100, 105, 110, 125, 150, 200]) out.push(`brightness-${v}`);
      return out;
    },
  },
  {
    group: "contrast",
    enumerate: () => {
      const out: string[] = [];
      for (const v of [0, 50, 75, 100, 125, 150, 200]) out.push(`contrast-${v}`);
      return out;
    },
  },
  {
    group: "saturate",
    enumerate: () => {
      const out: string[] = [];
      for (const v of [0, 50, 100, 150, 200]) out.push(`saturate-${v}`);
      return out;
    },
  },
  {
    group: "hueRotate",
    enumerate: () => {
      const out: string[] = [];
      for (const v of [0, 15, 30, 60, 90, 180]) out.push(`hue-rotate-${v}`);
      return out;
    },
  },
  {
    group: "filter",
    enumerate: () => ["grayscale", "grayscale-0", "invert", "invert-0", "sepia", "sepia-0"],
  },
  {
    group: "animation",
    enumerate: () => ["animate-none", "animate-spin", "animate-ping", "animate-pulse", "animate-bounce"],
  },
  {
    group: "mixBlendMode",
    enumerate: () => [
      "mix-blend-normal", "mix-blend-multiply", "mix-blend-screen", "mix-blend-overlay",
      "mix-blend-darken", "mix-blend-lighten", "mix-blend-color-dodge", "mix-blend-color-burn",
      "mix-blend-hard-light", "mix-blend-soft-light", "mix-blend-difference", "mix-blend-exclusion",
      "mix-blend-hue", "mix-blend-saturation", "mix-blend-color", "mix-blend-luminosity",
    ],
  },
  {
    group: "backdropBlur",
    enumerate: () => [
      "backdrop-blur", "backdrop-blur-none", "backdrop-blur-sm", "backdrop-blur-md",
      "backdrop-blur-lg", "backdrop-blur-xl", "backdrop-blur-2xl", "backdrop-blur-3xl",
    ],
  },

  // --- TRANSITIONS & TRANSFORMS --------------------------------
  {
    group: "transition",
    enumerate: () => [
      "transition", "transition-none", "transition-all", "transition-colors",
      "transition-opacity", "transition-shadow", "transition-transform",
    ],
  },
  {
    group: "transitionDuration",
    enumerate: (theme) => Object.keys(theme.transitionDuration).map((k) => `duration-${k}`),
  },
  {
    group: "transitionDelay",
    enumerate: (theme) => Object.keys(theme.transitionDuration).map((k) => `delay-${k}`),
  },
  {
    group: "transitionTimingFunction",
    enumerate: (theme) =>
      Object.keys(theme.transitionTiming)
        .filter((k) => k !== "DEFAULT")
        .map((k) => `ease-${k}`),
  },
  {
    group: "transform",
    enumerate: () => ["transform-none", "transform-gpu", "transform-cpu"],
  },
  {
    group: "rotate",
    enumerate: () => {
      const out: string[] = [];
      for (const v of [0, 1, 2, 3, 6, 12, 45, 90, 180]) out.push(`rotate-${v}`);
      for (const v of [1, 2, 3, 6, 12, 45, 90, 180]) out.push(`-rotate-${v}`);
      return out;
    },
  },
  {
    group: "scale",
    enumerate: () => {
      const vals = [0, 50, 75, 90, 95, 100, 105, 110, 125, 150];
      const out: string[] = [];
      for (const v of vals) out.push(`scale-${v}`);
      for (const v of vals) out.push(`scale-x-${v}`);
      for (const v of vals) out.push(`scale-y-${v}`);
      return out;
    },
  },
  {
    group: "translate",
    enumerate: (theme) => {
      const keys = [...spacingKeys(theme), "full", "1/2", "1/3", "2/3", "1/4", "3/4"];
      const out: string[] = [];
      for (const k of keys) out.push(`translate-x-${k}`);
      for (const k of keys) out.push(`translate-y-${k}`);
      for (const k of keys) {
        if (k === "0" || k === "px") continue;
        out.push(`-translate-x-${k}`);
        out.push(`-translate-y-${k}`);
      }
      return out;
    },
  },
  {
    group: "skew",
    enumerate: () => {
      const vals = [0, 1, 2, 3, 6, 12];
      const out: string[] = [];
      for (const v of vals) out.push(`skew-x-${v}`);
      for (const v of vals) out.push(`skew-y-${v}`);
      for (const v of vals) {
        if (v === 0) continue;
        out.push(`-skew-x-${v}`);
        out.push(`-skew-y-${v}`);
      }
      return out;
    },
  },
  {
    group: "transformOrigin",
    enumerate: () => [
      "origin-center", "origin-top", "origin-top-right", "origin-right",
      "origin-bottom-right", "origin-bottom", "origin-bottom-left",
      "origin-left", "origin-top-left",
    ],
  },

  // --- INTERACTIVE ---------------------------------------------
  {
    group: "cursor",
    enumerate: () => {
      const cursors = [
        "auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed",
        "none", "context-menu", "progress", "cell", "crosshair", "vertical-text",
        "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize",
        "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize",
        "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize",
        "nwse-resize", "zoom-in", "zoom-out",
      ];
      return cursors.map((c) => `cursor-${c}`);
    },
  },
  {
    group: "userSelect",
    enumerate: () => ["select-none", "select-text", "select-all", "select-auto"],
  },
  {
    group: "pointerEvents",
    enumerate: () => ["pointer-events-none", "pointer-events-auto"],
  },
  {
    group: "resize",
    enumerate: () => ["resize-none", "resize", "resize-x", "resize-y"],
  },
  {
    group: "objectFit",
    enumerate: () => ["object-contain", "object-cover", "object-fill", "object-none", "object-scale-down"],
  },
  {
    group: "objectPosition",
    enumerate: () => [
      "object-bottom", "object-center", "object-left", "object-left-bottom",
      "object-left-top", "object-right", "object-right-bottom", "object-right-top", "object-top",
    ],
  },
  {
    group: "scrollBehavior",
    enumerate: () => ["scroll-auto", "scroll-smooth"],
  },
  {
    group: "touchAction",
    enumerate: () => [
      "touch-auto", "touch-none", "touch-pan-x", "touch-pan-left", "touch-pan-right",
      "touch-pan-y", "touch-pan-up", "touch-pan-down", "touch-pinch-zoom", "touch-manipulation",
    ],
  },
  {
    group: "appearance",
    enumerate: () => ["appearance-none", "appearance-auto"],
  },
  {
    group: "willChange",
    enumerate: () => ["will-change-auto", "will-change-scroll", "will-change-contents", "will-change-transform"],
  },
  {
    group: "screenReader",
    enumerate: () => ["sr-only", "not-sr-only"],
  },
];

export function enumerateClasses(theme: Theme): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const g of groups) {
    const list = g.enumerate(theme);
    // dedupe within a group (some groups may legitimately overlap after theme expansion)
    result[g.group] = Array.from(new Set(list));
  }
  return result;
}

function verifyParity(
  classGroups: Record<string, string[]>,
  theme: Theme
): string[] {
  const all = new Set<string>();
  for (const list of Object.values(classGroups)) {
    for (const c of list) all.add(c);
  }
  const result = compile({
    candidates: all,
    theme,
    darkMode: "dataAttribute",
    layer: "utilities",
  });
  return result.unmatched;
}

export function buildIntellisense(
  theme: Theme,
  opts: { verifyParity?: boolean } = {}
): EnumerateResult {
  const classGroups = enumerateClasses(theme);
  const parityMismatches = opts.verifyParity ? verifyParity(classGroups, theme) : [];

  let total = 0;
  for (const list of Object.values(classGroups)) total += list.length;

  return {
    name: "Kyrolus Sous Materials",
    version: "2.0.0",
    description: "IntelliSense support for Kyrolus Sous Materials (auto-generated from JIT utility registry)",
    generatedAt: new Date().toISOString(),
    classGroups,
    meta: {
      totalClasses: total,
      groups: Object.keys(classGroups).length,
      parityChecked: !!opts.verifyParity,
      parityMismatches,
    },
  };
}
