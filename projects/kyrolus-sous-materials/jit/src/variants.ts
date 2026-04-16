import type { Theme, VariantMatch } from "./types";

export interface ResolvedVariant {
  kind: "pseudo" | "media" | "container" | "dark" | "parent" | "attribute";
  order: number;
  apply: (selector: string) => { selector: string; atRule?: string };
}

const STATE_PSEUDOS: Record<string, string> = {
  hover: ":hover",
  focus: ":focus",
  "focus-visible": ":focus-visible",
  "focus-within": ":focus-within",
  active: ":active",
  visited: ":visited",
  target: ":target",
  disabled: ":disabled",
  enabled: ":enabled",
  checked: ":checked",
  indeterminate: ":indeterminate",
  default: ":default",
  required: ":required",
  valid: ":valid",
  invalid: ":invalid",
  "in-range": ":in-range",
  "out-of-range": ":out-of-range",
  "placeholder-shown": ":placeholder-shown",
  autofill: ":autofill",
  "read-only": ":read-only",
  empty: ":empty",
  first: ":first-child",
  last: ":last-child",
  only: ":only-child",
  odd: ":nth-child(odd)",
  even: ":nth-child(even)",
  "first-of-type": ":first-of-type",
  "last-of-type": ":last-of-type",
  "only-of-type": ":only-of-type",
  open: "[open]",
};

const PSEUDO_ELEMENTS: Record<string, string> = {
  before: "::before",
  after: "::after",
  placeholder: "::placeholder",
  marker: "::marker",
  selection: "::selection",
  backdrop: "::backdrop",
  file: "::file-selector-button",
  "first-letter": "::first-letter",
  "first-line": "::first-line",
};

const MEDIA_VARIANTS: Record<string, string> = {
  "motion-safe": "@media (prefers-reduced-motion: no-preference)",
  "motion-reduce": "@media (prefers-reduced-motion: reduce)",
  "contrast-more": "@media (prefers-contrast: more)",
  "contrast-less": "@media (prefers-contrast: less)",
  portrait: "@media (orientation: portrait)",
  landscape: "@media (orientation: landscape)",
  print: "@media print",
};

const DIRECTION_VARIANTS: Record<string, string> = {
  rtl: '[dir="rtl"]',
  ltr: '[dir="ltr"]',
};

const ORDER = {
  directionParent: 10,
  darkParent: 20,
  pseudo: 30,
  pseudoElement: 31,
  group: 40,
  peer: 41,
  containerQuery: 50,
  media: 60,
  breakpoint: 61,
};

export function resolveVariant(
  variant: string,
  theme: Theme,
  darkMode: "class" | "dataAttribute"
): ResolvedVariant | null {
  if (variant in STATE_PSEUDOS) {
    return {
      kind: "pseudo",
      order: ORDER.pseudo,
      apply: (sel) => ({ selector: `${sel}${STATE_PSEUDOS[variant]}` }),
    };
  }

  if (variant in PSEUDO_ELEMENTS) {
    return {
      kind: "pseudo",
      order: ORDER.pseudoElement,
      apply: (sel) => ({ selector: `${sel}${PSEUDO_ELEMENTS[variant]}` }),
    };
  }

  if (variant in MEDIA_VARIANTS) {
    return {
      kind: "media",
      order: ORDER.media,
      apply: (sel) => ({ selector: sel, atRule: MEDIA_VARIANTS[variant] }),
    };
  }

  if (variant in DIRECTION_VARIANTS) {
    return {
      kind: "attribute",
      order: ORDER.directionParent,
      apply: (sel) => ({ selector: `${DIRECTION_VARIANTS[variant]} ${sel}` }),
    };
  }

  if (variant === "dark") {
    return {
      kind: "dark",
      order: ORDER.darkParent,
      apply: (sel) =>
        darkMode === "class"
          ? { selector: `.dark ${sel}` }
          : { selector: `[data-theme="dark"] ${sel}` },
    };
  }

  if (variant in theme.breakpoints) {
    const bp = theme.breakpoints[variant]!;
    return {
      kind: "media",
      order: ORDER.breakpoint,
      apply: (sel) => ({ selector: sel, atRule: `@media (min-width: ${bp})` }),
    };
  }

  const maxBp = /^max-(.+)$/.exec(variant);
  if (maxBp && maxBp[1]! in theme.breakpoints) {
    const bp = theme.breakpoints[maxBp[1]!]!;
    return {
      kind: "media",
      order: ORDER.breakpoint,
      apply: (sel) => ({ selector: sel, atRule: `@media (max-width: ${subtractPx(bp)})` }),
    };
  }

  const containerBp = /^@(.+)$/.exec(variant);
  if (containerBp && containerBp[1]! in theme.containerBreakpoints) {
    const bp = theme.containerBreakpoints[containerBp[1]!]!;
    return {
      kind: "container",
      order: ORDER.containerQuery,
      apply: (sel) => ({ selector: sel, atRule: `@container (min-width: ${bp})` }),
    };
  }

  const groupVariant = /^group-(.+)$/.exec(variant);
  if (groupVariant && groupVariant[1]! in STATE_PSEUDOS) {
    const pseudo = STATE_PSEUDOS[groupVariant[1]!]!;
    return {
      kind: "parent",
      order: ORDER.group,
      apply: (sel) => ({ selector: `.group${pseudo} ${sel}` }),
    };
  }

  const peerVariant = /^peer-(.+)$/.exec(variant);
  if (peerVariant && peerVariant[1]! in STATE_PSEUDOS) {
    const pseudo = STATE_PSEUDOS[peerVariant[1]!]!;
    return {
      kind: "parent",
      order: ORDER.peer,
      apply: (sel) => ({ selector: `.peer${pseudo} ~ ${sel}` }),
    };
  }

  const has = /^has-\[(.+)\]$/.exec(variant);
  if (has) {
    return {
      kind: "pseudo",
      order: ORDER.pseudo,
      apply: (sel) => ({ selector: `${sel}:has(${has[1]})` }),
    };
  }

  const aria = /^aria-(.+)$/.exec(variant);
  if (aria) {
    return {
      kind: "pseudo",
      order: ORDER.pseudo,
      apply: (sel) => ({ selector: `${sel}[aria-${aria[1]}="true"]` }),
    };
  }

  const data = /^data-\[(.+)\]$/.exec(variant);
  if (data) {
    return {
      kind: "pseudo",
      order: ORDER.pseudo,
      apply: (sel) => ({ selector: `${sel}[data-${data[1]}]` }),
    };
  }

  return null;
}

function subtractPx(value: string): string {
  const m = /^(\d+(?:\.\d+)?)px$/.exec(value);
  if (!m) return value;
  const n = Number(m[1]) - 0.02;
  return `${n}px`;
}
