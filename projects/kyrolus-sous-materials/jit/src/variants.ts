import type { Theme } from "./types";

export interface ResolvedVariant {
  kind: "pseudo" | "media" | "container" | "dark" | "parent" | "attribute";
  order: number;
  apply: (selector: string) => { selector: string; atRule?: string };
}

type DarkMode = "class" | "dataAttribute";

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
  "user-valid": ":user-valid",
  "user-invalid": ":user-invalid",
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
  "details-content": "::details-content",
};

const MEDIA_VARIANTS: Record<string, string> = {
  "motion-safe": "@media (prefers-reduced-motion: no-preference)",
  "motion-reduce": "@media (prefers-reduced-motion: reduce)",
  "contrast-more": "@media (prefers-contrast: more)",
  "contrast-less": "@media (prefers-contrast: less)",
  portrait: "@media (orientation: portrait)",
  landscape: "@media (orientation: landscape)",
  print: "@media print",
  "forced-colors": "@media (forced-colors: active)",
  "inverted-colors": "@media (inverted-colors: inverted)",
  "scripting-enabled": "@media (scripting: enabled)",
  "scripting-none": "@media (scripting: none)",
  "scripting-initial-only": "@media (scripting: initial-only)",
  "update-fast": "@media (update: fast)",
  "update-slow": "@media (update: slow)",
  "update-none": "@media (update: none)",
  "overflow-block-scroll": "@media (overflow-block: scroll)",
  "overflow-block-paged": "@media (overflow-block: paged)",
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

// =============================================================================
// Arbitrary variants — dispatch table. Each entry matches a bracketed form
// like `X-[...]` or the bare `[...]` selector. Ordered most-specific first so
// patterns like `aria-[...]` win over the named-aria fallback.
// =============================================================================

interface ArbitraryHandler {
  pattern: RegExp;
  build: (match: RegExpExecArray) => ResolvedVariant | null;
}

const ARBITRARY_HANDLERS: ArbitraryHandler[] = [
  {
    pattern: /^supports-\[(.+)\]$/,
    build: (m) => {
      const inner = unescapeUnderscore(m[1]!);
      return {
        kind: "media",
        order: ORDER.media,
        apply: (sel) => ({ selector: sel, atRule: `@supports (${inner})` }),
      };
    },
  },
  {
    pattern: /^has-\[(.+)\]$/,
    build: (m) => {
      const inner = unescapeUnderscore(m[1]!);
      return {
        kind: "pseudo",
        order: ORDER.pseudo,
        apply: (sel) => ({ selector: `${sel}:has(${inner})` }),
      };
    },
  },
  {
    pattern: /^aria-\[(.+)\]$/,
    build: (m) => {
      const inner = unescapeUnderscore(m[1]!);
      return {
        kind: "pseudo",
        order: ORDER.pseudo,
        apply: (sel) => ({ selector: `${sel}[aria-${inner}]` }),
      };
    },
  },
  {
    pattern: /^data-\[(.+)\]$/,
    build: (m) => {
      const inner = unescapeUnderscore(m[1]!);
      return {
        kind: "pseudo",
        order: ORDER.pseudo,
        apply: (sel) => ({ selector: `${sel}[data-${inner}]` }),
      };
    },
  },
  {
    pattern: /^group-\[(.+?)\](?:\/([\w-]+))?$/,
    build: (m) => buildRelativeArbitrary(m, "group", " "),
  },
  {
    pattern: /^peer-\[(.+?)\](?:\/([\w-]+))?$/,
    build: (m) => buildRelativeArbitrary(m, "peer", " ~ "),
  },
  {
    pattern: /^nth-\[(.+)\]$/,
    build: (m) => buildNthPseudo(m[1]!, "nth-child"),
  },
  {
    pattern: /^nth-last-\[(.+)\]$/,
    build: (m) => buildNthPseudo(m[1]!, "nth-last-child"),
  },
  {
    pattern: /^nth-of-type-\[(.+)\]$/,
    build: (m) => buildNthPseudo(m[1]!, "nth-of-type"),
  },
  {
    pattern: /^@\[(.+)\]$/,
    build: (m) => {
      const inner = unescapeUnderscore(m[1]!);
      // Style container queries — `style(--theme: dark)` — are already
      // self-wrapped; emit as-is. Size queries — `min-width: 500px` — need
      // the outer parens.
      const atRule = /^(style|scroll-state)\(/.test(inner)
        ? `@container ${inner}`
        : `@container (${inner})`;
      return {
        kind: "container",
        order: ORDER.containerQuery,
        apply: (sel) => ({ selector: sel, atRule }),
      };
    },
  },
  {
    pattern: /^\[(.+)\]$/,
    build: (m) => buildBareArbitrarySelector(unescapeUnderscore(m[1]!)),
  },
];

function buildRelativeArbitrary(
  match: RegExpExecArray,
  base: "group" | "peer",
  combinator: string,
): ResolvedVariant {
  const innerSel = unescapeUnderscore(match[1]!);
  const name = match[2];
  const baseClass = name ? String.raw`.${base}\/${name}` : `.${base}`;
  return {
    kind: "parent",
    order: base === "group" ? ORDER.group : ORDER.peer,
    apply: (sel) => {
      const expanded = innerSel.includes("&")
        ? innerSel.replaceAll("&", baseClass)
        : `${baseClass}${innerSel}`;
      return { selector: `${expanded}${combinator}${sel}` };
    },
  };
}

function buildNthPseudo(arg: string, pseudoName: string): ResolvedVariant {
  return {
    kind: "pseudo",
    order: ORDER.pseudo,
    apply: (sel) => ({ selector: `${sel}:${pseudoName}(${arg})` }),
  };
}

function buildBareArbitrarySelector(inner: string): ResolvedVariant | null {
  if (!isValidBareSelectorInner(inner)) return null;
  return {
    kind: "pseudo",
    order: ORDER.pseudo,
    apply: (sel) => {
      if (inner.includes("&")) {
        return { selector: inner.replaceAll("&", sel) };
      }
      // Attribute selector like [dir=rtl] → narrow the element itself.
      if (/^[a-zA-Z-][\w-]*(?:[~|^$*]?=.+)?$/.test(inner)) {
        return { selector: `${sel}[${inner}]` };
      }
      // Otherwise treat as raw suffix (e.g. pseudo-class ":is(...)").
      return { selector: `${sel}${inner}` };
    },
  };
}

// Reject patterns that aren't recognisable as CSS selector fragments —
// specifically, Tailwind's bare arbitrary form must be a selector, not a
// declaration like `min-width:500px` (which belongs in `@[...]` / `supports-[]`
// at-rules). Documentation that mentions these patterns inside <code> shouldn't
// silently generate malformed CSS.
function isValidBareSelectorInner(inner: string): boolean {
  if (!inner) return false;
  if (inner.includes("&")) return true;
  if (/^[:>+~]/.test(inner)) return true;
  if (/^[a-zA-Z-][\w-]*(?:[~|^$*]?=.+)?$/.test(inner)) return true;
  return false;
}

function resolveArbitrary(variant: string): ResolvedVariant | null {
  for (const handler of ARBITRARY_HANDLERS) {
    const match = handler.pattern.exec(variant);
    if (match) return handler.build(match);
  }
  return null;
}

// =============================================================================
// `not-<X>` — recursive negation. Only pseudo-class / attribute forms apply;
// negating a media query is not expressible in CSS.
// =============================================================================

function resolveNotVariant(variant: string): ResolvedVariant | null {
  const match = /^not-(.+)$/.exec(variant);
  if (!match) return null;
  const inner = match[1]!;

  const namedPseudo = STATE_PSEUDOS[inner] ?? DIRECTION_VARIANTS[inner];
  if (namedPseudo) {
    return {
      kind: "pseudo",
      order: ORDER.pseudo,
      apply: (sel) => ({ selector: `${sel}:not(${namedPseudo})` }),
    };
  }

  const arb = /^\[(.+)\]$/.exec(inner);
  if (arb) {
    const innerSel = unescapeUnderscore(arb[1]!);
    return {
      kind: "pseudo",
      order: ORDER.pseudo,
      apply: (sel) => ({ selector: `${sel}:not(${innerSel})` }),
    };
  }

  return null;
}

// =============================================================================
// Universal/descendant children: `*:` and `**:`
// =============================================================================

function resolveUniversalChild(variant: string): ResolvedVariant | null {
  if (variant !== "*" && variant !== "**") return null;
  const combinator = variant === "*" ? " > *" : " *";
  return {
    kind: "pseudo",
    order: ORDER.pseudo,
    apply: (sel) => ({ selector: `${sel}${combinator}` }),
  };
}

// =============================================================================
// Named simple lookups (pseudo / pseudo-element / media / direction)
// =============================================================================

function resolveNamedLookup(variant: string): ResolvedVariant | null {
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
  return null;
}

// =============================================================================
// Dark mode
// =============================================================================

function resolveDark(variant: string, darkMode: DarkMode): ResolvedVariant | null {
  if (variant !== "dark") return null;
  return {
    kind: "dark",
    order: ORDER.darkParent,
    apply: (sel) =>
      darkMode === "class"
        ? { selector: `.dark ${sel}` }
        : { selector: `[data-theme="dark"] ${sel}` },
  };
}

// =============================================================================
// Breakpoints: `md:`, `max-md:`, and `@lg:` container variants from theme.
// =============================================================================

function resolveBreakpoint(variant: string, theme: Theme): ResolvedVariant | null {
  if (variant in theme.breakpoints) {
    const bp = theme.breakpoints[variant]!;
    return {
      kind: "media",
      order: ORDER.breakpoint,
      apply: (sel) => ({ selector: sel, atRule: `@media (min-width: ${bp})` }),
    };
  }

  const maxBp = /^max-(.+)$/.exec(variant);
  if (maxBp && (maxBp[1]!) in theme.breakpoints) {
    const bp = theme.breakpoints[maxBp[1]!]!;
    return {
      kind: "media",
      order: ORDER.breakpoint,
      apply: (sel) => ({ selector: sel, atRule: `@media (max-width: ${subtractPx(bp)})` }),
    };
  }

  const containerBp = /^@(.+)$/.exec(variant);
  if (containerBp && (containerBp[1]!) in theme.containerBreakpoints) {
    const bp = theme.containerBreakpoints[containerBp[1]!]!;
    return {
      kind: "container",
      order: ORDER.containerQuery,
      apply: (sel) => ({ selector: sel, atRule: `@container (min-width: ${bp})` }),
    };
  }

  return null;
}

// =============================================================================
// Named group/peer state variants: `group-hover`, `peer-checked/name`, etc.
// =============================================================================

function resolveNamedRelative(variant: string): ResolvedVariant | null {
  const group = /^group-([^/[]+)(?:\/([\w-]+))?$/.exec(variant);
  if (group && (group[1]!) in STATE_PSEUDOS) {
    return buildNamedRelative(group, "group", " ", ORDER.group);
  }

  const peer = /^peer-([^/[]+)(?:\/([\w-]+))?$/.exec(variant);
  if (peer && (peer[1]!) in STATE_PSEUDOS) {
    return buildNamedRelative(peer, "peer", " ~ ", ORDER.peer);
  }

  return null;
}

function buildNamedRelative(
  match: RegExpExecArray,
  base: "group" | "peer",
  combinator: string,
  order: number,
): ResolvedVariant {
  const pseudo = STATE_PSEUDOS[match[1]!]!;
  const name = match[2];
  const baseClass = name ? String.raw`.${base}\/${name}` : `.${base}`;
  return {
    kind: "parent",
    order,
    apply: (sel) => ({ selector: `${baseClass}${pseudo}${combinator}${sel}` }),
  };
}

// =============================================================================
// Named aria shorthand: `aria-expanded:` → `[aria-expanded="true"]`
// =============================================================================

function resolveAriaShorthand(variant: string): ResolvedVariant | null {
  const match = /^aria-([a-z][a-z-]*)$/.exec(variant);
  if (!match) return null;
  return {
    kind: "pseudo",
    order: ORDER.pseudo,
    apply: (sel) => ({ selector: `${sel}[aria-${match[1]}="true"]` }),
  };
}

// =============================================================================
// Main entry: walk the handlers in priority order.
// =============================================================================

export function resolveVariant(
  variant: string,
  theme: Theme,
  darkMode: DarkMode,
): ResolvedVariant | null {
  return (
    resolveArbitrary(variant) ??
    resolveNotVariant(variant) ??
    resolveUniversalChild(variant) ??
    resolveNamedLookup(variant) ??
    resolveDark(variant, darkMode) ??
    resolveBreakpoint(variant, theme) ??
    resolveNamedRelative(variant) ??
    resolveAriaShorthand(variant)
  );
}

function subtractPx(value: string): string {
  const m = /^(\d+(?:\.\d+)?)px$/.exec(value);
  if (!m) return value;
  const n = Number(m[1]) - 0.02;
  return `${n}px`;
}

// Tailwind-style: underscores inside arbitrary values represent spaces in the
// final CSS. A literal underscore is escaped as `\_`.
function unescapeUnderscore(input: string): string {
  const SENTINEL = "\0UNDERSCORE\0";
  return input.replaceAll(String.raw`\_`, SENTINEL).replaceAll("_", " ").replaceAll(SENTINEL, "_");
}
