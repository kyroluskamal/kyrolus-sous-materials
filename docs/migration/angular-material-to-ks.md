# Angular Material → Kyrolus Sous Materials

A migration guide for Angular teams moving from `@angular/material` to
Kyrolus Sous Materials (**ks**). ks is Angular-first (ships its own
builders), but unlike Material it is **CSS-first**: components are styled
via class names and attribute states, not Angular directives/modules.

## Why move

| | Angular Material | ks |
|---|---|---|
| Theming | Sass `mat.define-theme()` at build | `ks-define-theme()` at build **or** `--ks-*` at runtime |
| Multi-brand | ⚠️ build separate bundles | ✅ `[data-brand="acme"]` at runtime |
| Density | ✅ `density: -1\|0\|1` at build | ✅ `[data-density="compact\|comfortable\|spacious"]` — runtime |
| Bundle per module | ⚠️ one `MatButtonModule` per component | ✅ CSS only — pay for what you render |
| Component API | directive + template projection | class name + semantic HTML |
| Overrides | `::ng-deep` / component style overrides | `--ks-*` custom properties — no shadow DOM piercing |
| Utility classes | ❌ | ✅ Tailwind-compatible JIT |
| WCAG / forced-colors | ✅ | ✅ |
| RTL | ✅ | ✅ (logical properties) |
| Framework lock-in | Angular only | works in **any** framework |

## Philosophy difference

Angular Material = components **as Angular directives**:
```html
<button mat-raised-button color="primary">Save</button>
```

ks = components **as CSS classes** on semantic HTML:
```html
<button class="btn btn-primary btn-elevated">Save</button>
```

Pros of the ks approach:
- Zero NgModule imports.
- Works in plain HTML, React, Vue, Astro — not just Angular.
- `::ng-deep` / view-encapsulation headaches disappear.
- Template diffs are easier to review (plain HTML).

Cons: no per-component TypeScript API. If you rely on `MatDialog.open()` or
`MatSnackBar`, you'll swap to native `<dialog>.showModal()` or your own
lightweight service.

## Component map

| Angular Material | ks equivalent | Notes |
|---|---|---|
| `<mat-card>` | `.card` + `.card-header\|body\|footer` |  |
| `<mat-toolbar>` | `.navbar` |  |
| `<button mat-button>` | `.btn` |  |
| `<button mat-raised-button>` | `.btn.btn-elevated` |  |
| `<button mat-icon-button>` | `.btn.btn-icon` |  |
| `<mat-icon>` | bring any icon font / inline SVG | ks is icon-agnostic |
| `<mat-dialog>` | `.modal` on native `<dialog>` |  |
| `<mat-bottom-sheet>` | `.drawer.drawer-bottom` |  |
| `<mat-sidenav>` | `.drawer.drawer-start` |  |
| `<mat-snack-bar>` | `.toast-region` + `.toast` |  |
| `<mat-tooltip>` | `.tooltip` |  |
| `<mat-menu>` | `.popover` |  |
| `<mat-tab-group>` | `.tabs` |  |
| `<mat-stepper>` | `.stepper` + `[data-state]` | Horizontal + vertical |
| `<mat-expansion-panel>` | native `<details>` + `.tree` styling |  |
| `<mat-accordion>` | siblings of `<details>` |  |
| `<mat-form-field>` | `.input-group` / per-input classes |  |
| `<mat-input>` | `.input` |  |
| `<mat-select>` | `.select-input` |  |
| `<mat-autocomplete>` | `.autocomplete` (ARIA 1.2 combobox) |  |
| `<mat-chip-listbox>` | `.chip` + `.chip-solid\|outline` |  |
| `<mat-slide-toggle>` | `.switch-input[role="switch"]` |  |
| `<mat-checkbox>` | `.check-input[type="checkbox"]` | Indeterminate supported |
| `<mat-radio-group>` | `.radio-group` |  |
| `<mat-slider>` | `.slider-input[type="range"]` |  |
| `<mat-datepicker>` | `.datepicker` with `role="grid"` |  |
| `<mat-progress-bar>` | `.progress` (native `<progress>`) |  |
| `<mat-progress-spinner>` | `.progress-circle` (conic-gradient) |  |
| `<mat-list>` | `.list-group` + `.list-group-numbered` |  |
| `<mat-tree>` | `.tree` + `role="tree"/"treeitem"` |  |
| `<mat-badge>` | `.badge` |  |
| `<mat-divider>` | `.divider` + `.divider-labelled\|vertical` |  |
| `<mat-paginator>` | *not shipped — compose with `.btn` + `.input`* |  |
| `<mat-table>` | *use standard `<table>` + ks utility classes* |  |

## Theming

Material:
```scss
@use "@angular/material" as mat;
$theme: mat.define-theme((
  color: (primary: mat.$blue-palette),
  density: 0,
));
html { @include mat.all-component-themes($theme); }
```

ks (equivalent, build-time):
```scss
@use "kyrolus-sous-materials/styles/abstracts/define-theme" as *;
:root {
  @include ks-define-theme((
    primary: #1e40af,
    density: comfortable, // or compact / spacious
  ));
}
```

ks (runtime, no rebuild):
```html
<html data-brand="acme" data-density="compact" data-theme="dark">
```

## Density

Material density is a build-time knob `-1 | 0 | 1 | 2`. ks density is a
runtime CSS variable `--ks-density` with three scales:

| Material | ks |
|---|---|
| `density: -1` | `data-density="comfortable"` (default, 1.0) |
| `density: 0`  | `data-density="comfortable"` |
| `density: 1`  | `data-density="spacious"` (1.25) |
| *(build only)* | `data-density="compact"` (0.75) |
| *(build only)* | `[data-density="responsive"]` auto-compacts on mobile, auto-spacious on 1600px+ |
| *(build only)* | `.density-touch-aware` force ≥1.1 on coarse pointers |

## Overriding component styles

Material: `::ng-deep`, view encapsulation workarounds, or global mixins.

ks: set the exposed custom property:
```scss
.my-fancy-card {
  --ks-card-padding: 1.25rem;
  --ks-card-radius: 1rem;
  --ks-primary: #7c3aed;
}
```

No shadow DOM, no `::ng-deep`.

## Accessibility

Both libraries ship ARIA patterns. ks additionally provides:
- `@media (forced-colors: active)` paths on every component (Canvas,
  CanvasText, Highlight, HighlightText, ButtonFace, ButtonText).
- `@media (prefers-reduced-motion: reduce)` paths.
- `[data-theme="high-contrast"]` dedicated high-contrast theme.
- RTL via logical properties (`inline-size`, `block-size`,
  `inset-inline-start`, `border-inline-start`) — no separate build.

## Dynamic imports

Material uses standalone APIs like `MatDialog.open()`. ks uses the platform:

```ts
// MatDialog.open() equivalent:
const dlg = document.querySelector<HTMLDialogElement>("#my-modal");
dlg?.showModal();
```

The `<dialog>` element gives you `::backdrop`, focus trapping, and ESC-to-close
for free. For toasts, create a container with `aria-live="polite"` and append
`.toast` nodes.

## Migration path

1. Install `kyrolus-sous-materials`. Keep Material installed for now.
2. Replace `<mat-toolbar>`, `<mat-card>`, `<mat-button>` first — they're
   pure-presentational.
3. Swap overlays (`MatDialog`, `MatBottomSheet`, `MatSnackBar`) to native
   `<dialog>` / `[popover]` + ks classes.
4. Retire form-field controls (`<mat-checkbox>`, `<mat-select>`, etc.) in
   favour of native inputs + ks classes. Your `[(ngModel)]` bindings keep
   working.
5. Remove `@angular/material` + `@angular/cdk` from `package.json`.

## What you gain

- **Runtime theming** — brand + density + dark-mode without rebuilds.
- **~90% bundle-size reduction** — you ship CSS for what you use, no
  per-component Angular modules.
- **No `::ng-deep`** — override via `--ks-*` custom properties.
- **Cross-framework reuse** — same CSS works in Astro, Next, plain HTML.
- **Modern CSS** — `:has()`, `@starting-style`, `[popover]`, `@container
  style(…)`, `::details-content`.
