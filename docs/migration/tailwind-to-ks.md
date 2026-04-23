# Tailwind → Kyrolus Sous Materials

A migration guide for teams moving from Tailwind CSS to Kyrolus Sous Materials
(**ks**). ks ships a Tailwind-compatible JIT engine plus a full component
library and theme system — so most Tailwind class names keep working, and
you gain components + design tokens Tailwind doesn't ship.

## Why move

| | Tailwind | ks |
|---|---|---|
| Utility classes | ✅ huge surface | ✅ Tailwind-compatible JIT |
| Components | ❌ needs plugin or headless kit | ✅ 28 built-in (card, modal, stepper, tree, datepicker, …) |
| Design tokens | ⚠️ config file only | ✅ `--ks-*` CSS custom properties + `ks-define-theme()` facade |
| Multi-brand runtime | ❌ rebuild per tenant | ✅ `[data-brand="acme"]` swap at runtime |
| Density control | ❌ none | ✅ `[data-density="compact\|comfortable\|spacious"]` |
| Dark mode | ✅ class/media | ✅ `[data-theme="dark\|high-contrast\|auto"]` |
| Forced-colors / WCAG | ⚠️ manual | ✅ shipped in every component |
| RTL | ⚠️ plugin | ✅ logical properties throughout |
| Angular-native | ❌ | ✅ Angular builders, works with `ng build` / `ng serve` |

## JIT compatibility

The ks JIT understands the same class-name grammar Tailwind does. If your
template has Tailwind classes, they'll keep working.

| Pattern | Works as-is | Notes |
|---|---|---|
| `p-4`, `mt-2`, `gap-6` | ✅ | Full spacing scale |
| `bg-blue-500`, `text-gray-300` | ✅ | Full color scale |
| `hover:`, `focus:`, `focus-visible:` | ✅ | All state variants |
| `md:`, `lg:`, `max-md:` | ✅ | Responsive + inverse |
| `dark:` | ✅ | Maps to `[data-theme="dark"]` by default |
| `group-hover:`, `peer-checked:` | ✅ | Plus named forms `group/name` |
| `aria-[sort=ascending]:font-bold` | ✅ | Arbitrary aria / data |
| `data-[state=open]:bg-indigo-500` | ✅ |  |
| `supports-[display:grid]:grid` | ✅ |  |
| `has-[input:checked]:bg-green-50` | ✅ |  |
| `not-disabled:opacity-100` | ✅ | Negation of any state |
| `[&>li]:mt-2`, `[&:hover]:bg-red-500` | ✅ | Bare arbitrary selectors |
| `nth-[3n+1]:bg-gray-50` | ✅ | Arbitrary nth-child |
| `@[min-width:500px]:flex` | ✅ | Arbitrary container query |
| `@[style(--theme:dark)]:text-white` | ✅ | **Style container queries** (Tailwind doesn't ship this yet) |
| `bg-[color:var(--x)]`, `bg-[length:200px]` | ✅ | Typed arbitraries |
| `*:p-2`, `**:text-sm` | ✅ | Universal / descendant child |
| `bg-(--brand)` | ✅ | CSS-var shorthand |

## Configuration

Tailwind (`tailwind.config.js`):
```js
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: { extend: { colors: { brand: "#1e40af" } } },
  darkMode: "class",
};
```

ks (`ks.config.js`):
```js
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  output: "src/jit.css",
  theme: { colors: { brand: "#1e40af" } },
  darkMode: "dataAttribute", // or "class"
};
```

## Dark mode

| | Tailwind | ks |
|---|---|---|
| Class | `<html class="dark">` | `<html class="dark">` (set `darkMode: "class"`) |
| Media | `darkMode: "media"` | built in to `[data-theme="auto"]` |
| Attribute | community plugin | `<html data-theme="dark">` (default) |
| High-contrast | ❌ manual | ✅ `<html data-theme="high-contrast">` |

## Theme + tokens

Tailwind hides tokens inside a config file that compiles away. ks emits
runtime CSS custom properties so you can theme at runtime:

```html
<html data-theme="dark" data-brand="midnight" data-density="compact">
```

Single-call facade for design tokens:
```scss
@use "kyrolus-sous-materials/styles/abstracts/define-theme" as *;

:root {
  @include ks-define-theme((
    primary: #1e40af,
    accent:  #c026d3,
    radius:  0.625rem,
    density: comfortable,
    font:    ("Inter", sans-serif),
  ));
}
```

## Components

Tailwind ships **zero** components. You reach for Headless UI, Radix,
DaisyUI, shadcn/ui, etc. ks ships 28+ components built on the same token
system:

| Category | ks components |
|---|---|
| Layout | card, navbar, drawer, row/col grid |
| Feedback | alert, toast, tooltip, popover, progress, skeleton |
| Form | checkbox, radio, switch, select, slider, autocomplete, datepicker |
| Navigation | tabs, breadcrumb, stepper, tree |
| Data | badge, chip, avatar, list-group, rating, divider |
| Actions | modal, speed-dial |

All support: 8 semantic color variants, sm/md/lg sizes, dark/high-contrast,
RTL, forced-colors, reduced-motion, print, exposed `--ks-*` overrides.

## Migration recipes

### 1. Keep your existing Tailwind class names

```bash
npm install kyrolus-sous-materials
```

Replace Tailwind's CLI/Vite plugin with ks in your Angular project (`ks.config.js`
+ the ks Angular builder already registered). Your classes keep working.

### 2. Replace DIY components with ks

Before (Tailwind + Headless UI):
```html
<button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md focus:ring-2 focus:ring-blue-400">
  Save
</button>
```

After (ks):
```html
<button class="btn btn-primary">Save</button>
```

### 3. Replace config-time brand swaps with runtime attributes

Before: build two CSS bundles, one per tenant.

After:
```html
<html data-brand="acme">   <!-- primary=blue, radius=0.5rem -->
<html data-brand="globex"> <!-- primary=green, radius=0.25rem -->
```

## What you gain

- **28+ production components** you don't have to build.
- **Runtime theming** — brand, density, and dark mode switch without a rebuild.
- **Accessibility baked in** — forced-colors, RTL, reduced-motion, print.
- **Style container queries** — `@[style(--theme:dark)]:` — that Tailwind
  doesn't yet ship.
- **Angular-native** — ng build / ng serve drive ks transparently.

## What changes

- Config filename: `tailwind.config.js` → `ks.config.js`.
- Dark-mode default: class → attribute (configurable).
- Plugin ecosystem: Tailwind plugins don't port — but most are already
  built-in (container queries, forms, typography).

## Gradual migration

ks and Tailwind can co-exist during migration. Run both JITs into separate
output CSS files and cascade-order them; remove Tailwind once component
migration is complete.
