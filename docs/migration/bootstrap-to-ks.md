# Bootstrap → Kyrolus Sous Materials

A migration guide for teams moving from Bootstrap 5 to Kyrolus Sous Materials
(**ks**). ks ships a Bootstrap-compatible grid, component names close to
Bootstrap's vocabulary, and a token/theme system that replaces Sass variable
overrides with runtime CSS custom properties.

## Why move

| | Bootstrap 5 | ks |
|---|---|---|
| Components | ✅ broad | ✅ broad + modern (tree, datepicker, stepper, speed-dial) |
| Grid | ✅ 12-col flex | ✅ `.row` / `.col-{1..12}` / responsive variants — API-compatible |
| Theming | ⚠️ Sass variable overrides (requires rebuild) | ✅ `--ks-*` custom properties at runtime |
| Multi-brand | ❌ rebuild per tenant | ✅ `[data-brand="acme"]` |
| Density | ❌ none | ✅ `[data-density="compact\|comfortable\|spacious"]` |
| Dark mode | ✅ `data-bs-theme="dark"` | ✅ `data-theme="dark\|high-contrast\|auto"` |
| RTL | ✅ separate build | ✅ same build, logical properties |
| Forced-colors / a11y | ⚠️ partial | ✅ every component |
| JS coupling | ⚠️ requires bootstrap.bundle.js | ✅ CSS-only (native `<dialog>`, `<details>`, `[popover]`) |
| Angular integration | ⚠️ needs ng-bootstrap | ✅ first-class Angular builders |

## Grid

ks ships a Bootstrap 5-compatible flex grid. Class names match:

```html
<div class="row g-3">
  <div class="col-12 col-md-8">main</div>
  <div class="col-12 col-md-4">aside</div>
</div>
```

| Bootstrap | ks |
|---|---|
| `.row` | `.row` |
| `.col-{n}`, `.col-auto` | same |
| `.col-{sm\|md\|lg\|xl\|xxl}-{n}` | same |
| `.row-cols-{n}`, `.row-cols-md-{n}` | same |
| `.offset-{n}`, `.offset-md-{n}` | same |
| `.order-first\|last\|{0..12}` | same |
| `.g-{0..5}`, `.gx-*`, `.gy-*` | same |
| `--bs-gutter-x` / `--bs-gutter-y` | `--ks-gutter-x` / `--ks-gutter-y` |

## Components

Most Bootstrap components map 1:1.

| Bootstrap | ks equivalent | Notes |
|---|---|---|
| `.card` | `.card` + `.card-header\|body\|footer` | `+ .card-elevated\|outlined\|filled` |
| `.navbar` | `.navbar` + `.navbar-brand\|nav\|link` | ARIA expanded states |
| `.modal` | `.modal` — native `<dialog>` by default | `@starting-style` for CSS-only enter/exit |
| `.alert` | `.alert` + `.alert-solid\|outline\|subtle\|banner` |  |
| `.badge` | `.badge` + `.badge-pill\|dot\|count` |  |
| `.nav-tabs` | `.tabs` + ARIA `role="tablist"` |  |
| `.breadcrumb` | `.breadcrumb-list` | CSS-generated separators, RTL mirror |
| `.toast` | `.toast` + `.toast-region` | `aria-live` container |
| `.tooltip` | `.tooltip` + `@supports (anchor-name)` |  |
| `.popover` | `.popover` — native `[popover]` | Falls back to `[role=dialog]` |
| `.progress` | `.progress` — native `<progress>` | + `.progress-circle` via `conic-gradient` |
| `.spinner-border` | `.progress-indeterminate` |  |
| `.form-check` | `.check-input`, `.radio-input`, `.switch-input` | Native inputs, custom paint |
| `.form-select` | `.select-input` |  |
| `.list-group` | `.list-group` + `.list-group-item`, `.list-group-numbered`, `.list-group-horizontal-{bp}` | API-compatible |
| `.dropdown` | use `.popover` or `.autocomplete-listbox` |  |
| `.offcanvas` | `.drawer` + sides `.drawer-start\|end\|top\|bottom` |  |
| `.carousel` | *not shipped — use scroll-snap utilities* |  |
| `.accordion` | use native `<details>` + `.tree` styling |  |
| — | `.chip`, `.stepper`, `.slider`, `.tree`, `.autocomplete`, `.datepicker`, `.rating`, `.speed-dial`, `.avatar`, `.divider`, `.skeleton` | **Not in Bootstrap** — PrimeNG/Material parity |

## Theming

Bootstrap (Sass rebuild):
```scss
$primary: #1e40af;
$enable-dark-mode: true;
@import "bootstrap/scss/bootstrap";
```

ks (runtime tokens, no rebuild):
```scss
@use "kyrolus-sous-materials/styles/abstracts/define-theme" as *;
:root {
  @include ks-define-theme((
    primary: #1e40af,
    success: #059669,
    radius:  0.5rem,
    density: comfortable,
  ));
}
```

Or attribute-scoped at runtime:
```html
<section data-brand="acme">     <!-- whole subtree rebranded -->
<section data-density="compact"><!-- whole subtree densified -->
```

## Dark mode

| Bootstrap | ks |
|---|---|
| `<html data-bs-theme="dark">` | `<html data-theme="dark">` |
| — | `<html data-theme="high-contrast">` — WCAG AAA |
| — | `<html data-theme="auto">` — follows `prefers-color-scheme` |

## JavaScript

Bootstrap components require `bootstrap.bundle.js` (~80 KB min). Most ks
components are CSS-only:

- Modal → `<dialog>` with `.showModal()` (native)
- Drawer → `<dialog class="drawer">` (native)
- Popover → `[popover]` + `.showPopover()` (native)
- Tabs / accordion / toast → `[data-state]` / `[aria-*]` CSS selectors — no JS required for the visual side
- Dropdown → `.autocomplete` pattern uses native `:focus-visible` / `:has()`

Net: you can ship zero component JS if you use native APIs.

## Utility classes

Bootstrap 5 added a small utility API. ks ships the full Tailwind-compatible
JIT on top — significantly larger surface:

| Feature | Bootstrap 5 | ks |
|---|---|---|
| Margin / padding | `.m-{0..5}` / `.p-{0..5}` | `.m-{0..96}` full spacing scale + arbitrary `m-[17px]` |
| Color | `.text-primary`, `.bg-primary` | same + `text-blue-500` / `bg-(--var)` / `bg-[color:var(--x)]` |
| Flex / grid | `.d-flex`, `.flex-row`, `.gap-{n}` | same + Tailwind-full grid utilities |
| Responsive | `.d-md-flex` | `md:flex`, `lg:grid-cols-3`, `max-md:hidden` |
| States | `.hover-shadow` (v5.3+) | `hover:`, `focus-visible:`, `group-hover:`, `peer-checked:`, `aria-[...]:`, `data-[...]:`, `@[min-width:500px]:`, `@[style(--theme:dark)]:` |

## Migration path

1. **Install:** `npm install kyrolus-sous-materials`, replace your Sass
   `@import "bootstrap"` with `@use "kyrolus-sous-materials/styles"`.
2. **Grid keeps working** — class names match.
3. **Swap utilities** incrementally: `text-primary` still works; adopt the
   JIT's wider surface as you encounter needs Bootstrap doesn't cover.
4. **Retire JS** — replace Bootstrap modals/drawers with native `<dialog>`
   + ks styles.
5. **Add brand/density attributes** on `<html>` for runtime theming.

## What you gain

- Runtime brand + density + dark/high-contrast without rebuilding CSS.
- Modern components Bootstrap doesn't ship (tree, stepper, datepicker,
  slider, autocomplete, speed-dial, rating, skeleton).
- Full Tailwind-compatible JIT on top of the component layer.
- Zero-JS component primitives (`<dialog>`, `[popover]`, `<details>`).
- Angular builders — ng build / ng serve transparently pull in ks.
