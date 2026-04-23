# PrimeNG → Kyrolus Sous Materials

A migration guide for Angular teams moving from PrimeNG to Kyrolus Sous
Materials (**ks**). PrimeNG ships an enormous component catalogue as Angular
directives; ks ships a close-to-parity catalogue as **CSS** — smaller bundle,
wider reuse, runtime theming.

## Why move

| | PrimeNG | ks |
|---|---|---|
| Component count | ~90 | ~28 core + full JIT utility layer |
| Component model | Angular modules/standalone | CSS class names + semantic HTML |
| Bundle impact | ⚠️ each `import { ButtonModule }` pulls in TS + CSS | ✅ CSS only — pay for what you render |
| Themes | ~10 prebuilt themes | `ks-define-theme()` facade + `--ks-*` runtime tokens |
| Multi-brand | ⚠️ swap CSS theme file | ✅ `[data-brand="acme"]` at runtime |
| Density | ⚠️ per-theme or manual | ✅ `[data-density="compact\|comfortable\|spacious"]` |
| RTL | ✅ with `p-rtl` class | ✅ same build (logical properties) |
| WCAG / forced-colors | ⚠️ theme-dependent | ✅ every component |
| Utility layer | PrimeFlex (separate pkg) | Tailwind-compatible JIT built in |
| JS framework lock-in | Angular only | any framework |

## Philosophy difference

PrimeNG (directive-first):
```html
<p-button label="Save" icon="pi pi-check" severity="primary"></p-button>
```

ks (CSS class-first):
```html
<button class="btn btn-primary">
  <span class="icon">✓</span>
  Save
</button>
```

## Component map

High-overlap components (shipped by ks):

| PrimeNG | ks |
|---|---|
| `<p-button>` | `.btn` + semantic variants `.btn-primary\|success\|warning\|danger\|info` + sizes |
| `<p-card>` | `.card` + `.card-header\|body\|footer\|actions` |
| `<p-panel>` | `.card.card-outlined` |
| `<p-menubar>` | `.navbar` |
| `<p-sidebar>` | `.drawer` with sides |
| `<p-dialog>` | `.modal` on native `<dialog>` |
| `<p-confirmDialog>` | `.modal.modal-sm` |
| `<p-toast>` | `.toast-region` + `.toast` (6 positions) |
| `<p-tooltip>` | `.tooltip` |
| `<p-overlayPanel>` | `.popover` (native `[popover]`) |
| `<p-progressBar>` | `.progress` (native `<progress>`) |
| `<p-progressSpinner>` | `.progress-circle.progress-indeterminate` |
| `<p-tabView>` | `.tabs` (ARIA tablist) |
| `<p-accordion>` | native `<details>` + `.tree` styling |
| `<p-breadcrumb>` | `.breadcrumb-list` |
| `<p-steps>`, `<p-stepper>` | `.stepper` + `[data-state]` |
| `<p-messages>` | `.alert.alert-banner` |
| `<p-inlineMessage>` | `.alert.alert-subtle` |
| `<p-badge>` | `.badge` |
| `<p-chip>` | `.chip` |
| `<p-avatar>`, `<p-avatarGroup>` | `.avatar` + `.avatar-group` |
| `<p-divider>` | `.divider` + `.divider-labelled\|vertical` |
| `<p-skeleton>` | `.skeleton` + `.skeleton-pulse\|shimmer\|wave` |
| `<p-rating>` | `.rating-stars` (CSS-only, interactive via radios) |
| `<p-speedDial>` | `.speed-dial` (radial / linear) |
| `<p-tree>`, `<p-treeSelect>` | `.tree` (role="tree"/"treeitem") |
| `<p-autoComplete>` | `.autocomplete` (ARIA combobox) |
| `<p-calendar>` | `.datepicker` (role="grid") |
| `<p-slider>` | `.slider-input[type="range"]` |
| `<p-inputSwitch>` | `.switch-input[role="switch"]` |
| `<p-checkbox>` | `.check-input[type="checkbox"]` |
| `<p-triStateCheckbox>` | `.check-input:indeterminate` |
| `<p-radioButton>` | `.radio-input[type="radio"]` |
| `<p-inputText>` | `.input` |
| `<p-dropdown>` | `.select-input` |
| `<p-multiSelect>` | `.autocomplete.autocomplete-chips` |
| `<p-listbox>` | `.list-group` + ARIA listbox roles |
| `<p-pickList>` | compose two `.list-group`s + `.btn` |

Not shipped (use custom compositions or keep PrimeNG for these):

| PrimeNG | Reason |
|---|---|
| `<p-table>` (full DataTable) | Use `<table>` + ks utilities; complex enterprise data-tables are out of scope |
| `<p-dataView>` | Compose manually |
| `<p-timeline>` | Use `.stepper.stepper-vertical` |
| `<p-galleria>`, `<p-carousel>` | Use CSS `scroll-snap` |
| `<p-fileUpload>` | Use native `<input type="file">` |
| `<p-editor>`, `<p-colorPicker>` | Integrate a dedicated package |
| `<p-tree>` with drag-drop | CSS covers rendering; drag-drop is consumer code |

## Theming

PrimeNG:
```ts
// angular.json
"styles": ["node_modules/primeng/resources/themes/lara-light-blue/theme.css"]
```

Switching themes = swap file + rebuild.

ks (build-time):
```scss
@use "kyrolus-sous-materials/styles/abstracts/define-theme" as *;
:root {
  @include ks-define-theme((
    primary: #1e40af,
    radius:  0.5rem,
    density: comfortable,
  ));
}
```

ks (runtime, no rebuild):
```html
<html data-brand="midnight" data-theme="dark" data-density="compact">
```

## Utility classes

PrimeFlex ships a separate package (`primeflex`). ks ships the full
Tailwind-compatible JIT built-in:

| PrimeFlex | ks |
|---|---|
| `.p-d-flex` | `.flex` |
| `.p-ai-center` | `.items-center` |
| `.p-jc-between` | `.justify-between` |
| `.p-p-3` | `.p-3` |
| `.p-text-primary` | `.text-primary` |
| `.p-grid` / `.p-col-{n}` | `.row` / `.col-{n}` (Bootstrap-compatible) |
| — | `hover:`, `focus-visible:`, `group-hover:`, `peer-checked:`, `aria-[...]:`, `data-[...]:`, `has-[...]:`, `@[min-width:...]:`, `@[style(--x:y)]:`, `bg-[color:var(--x)]`, `text-(--var)` |

## Overlay primitives

PrimeNG overlays are Angular components. ks overlays use platform APIs:

```ts
// Dialog
document.querySelector<HTMLDialogElement>("#saveDlg")?.showModal();

// Popover / Toast / Tooltip — native [popover] or CSS-only.
document.querySelector<HTMLElement>("#userMenu")?.showPopover();
```

You keep Angular's two-way binding / forms / router / HTTP — you just no
longer need PrimeNG's overlay service layer.

## Forms

PrimeNG's form controls wrap native inputs. ks styles native inputs directly:

```html
<!-- PrimeNG -->
<p-inputText [(ngModel)]="name" />
<p-dropdown [options]="roles" [(ngModel)]="role" />

<!-- ks — Angular bindings keep working -->
<input class="input" [(ngModel)]="name" />
<select class="select-input" [(ngModel)]="role">
  <option *ngFor="let r of roles" [value]="r.value">{{ r.label }}</option>
</select>
```

Everything that used PrimeNG's `formControl` / `ngModel` integration still
works because the underlying element is native.

## Migration path

1. Install `kyrolus-sous-materials`; keep PrimeNG while migrating.
2. Remove `primeflex` — the JIT covers it.
3. Swap presentational components (`<p-card>`, `<p-button>`, `<p-badge>`,
   `<p-tag>`, `<p-divider>`) first.
4. Convert overlay components (`<p-dialog>`, `<p-sidebar>`, `<p-overlayPanel>`,
   `<p-toast>`, `<p-tooltip>`) to native `<dialog>` / `[popover]` +
   `aria-live` containers + ks classes.
5. Replace form controls with native inputs + ks classes; Angular bindings
   keep working.
6. For components ks doesn't ship (`<p-table>`, `<p-editor>`, etc.) keep
   PrimeNG imports — the two libraries co-exist.
7. Drop PrimeNG theme CSS once component migration covers your surface.

## What you gain

- **~80% smaller bundle** for apps that used PrimeFlex + a theme + a handful
  of components.
- **Runtime theming** without reload: brand, density, dark/high-contrast.
- **Cross-framework reuse** — the CSS works outside Angular.
- **Better accessibility defaults** — forced-colors, reduced-motion, RTL,
  and high-contrast theme shipped by default.
- **Modern CSS** — `@starting-style`, `[popover]`, `:has()`,
  `@container style(…)`, `::details-content`, CSS trig functions.

## What you keep

- `[(ngModel)]`, `formControl`, `formGroup` — all still work on native inputs.
- Reactive / template-driven forms — untouched.
- Router, HTTP client, dependency injection — not part of the migration.
