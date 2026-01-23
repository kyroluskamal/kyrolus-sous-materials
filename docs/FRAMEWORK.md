# Kyrolus Sous Materials - Framework Guide

This guide is the single reference for the SCSS framework: how it is structured,
how to customize it, and how to build it safely.

## Quick Start

Install and import the framework styles:

```scss
@use "kyrolus-sous-materials/styles/styles";
```

If you want only specific parts, use the modular entrypoints:

```scss
@use "kyrolus-sous-materials/styles/entrypoints/core";
@use "kyrolus-sous-materials/styles/entrypoints/utilities";
@use "kyrolus-sous-materials/styles/entrypoints/components";
```

Or use presets:

```scss
@use "kyrolus-sous-materials/styles/entrypoints/preset-minimal";
@use "kyrolus-sous-materials/styles/entrypoints/preset-modern";
@use "kyrolus-sous-materials/styles/entrypoints/preset-full";
```

## Architecture Overview

The framework is organized into layered CSS:

- reset: browser reset
- tokens: design tokens (colors, spacing, typography)
- theme: light/dark/high-contrast themes
- base: base element styles
- components: component styles
- utilities: utility classes
- states: state overrides
- overrides: user overrides

The layer order is fixed and shared by all entrypoints. This ensures predictable
cascade behavior regardless of import order.

## Theming and Configuration

Configuration lives in `styles/abstracts/_config.scss`. You can override any
`$ks-*` variable by using `@use` with `with` at the entrypoint.

Example:

```scss
@use "kyrolus-sous-materials/styles/styles" with (
  $ks-primary-color: #0f766e,
  $ks-secondary-color: #f97316,
  $ks-accent-color: #7c3aed,
  $ks-enable-dark-mode: true,
  $ks-enable-animations: true
);
```

### Theming Modes

You have two theming styles:

1) Compile-time (Sass) theming
   - Change `$ks-*` values at build time (fastest output, smallest CSS).

2) Runtime (CSS variables) theming
   - Override CSS variables at runtime (no rebuild needed).

Example (runtime):

```css
[data-theme="custom"] {
  --primary: #0f766e;
  --on-primary: #ffffff;
  --surface: #0b0f14;
  --text: #e2e8f0;
  --border: #1f2937;
}
```

Key theme controls (partial list):

- $ks-primary-color
- $ks-secondary-color
- $ks-accent-color
- $ks-success-color
- $ks-warning-color
- $ks-error-color
- $ks-info-color
- $ks-enable-dark-mode
- $ks-enable-animations

### Feature Flags

You can disable whole categories to reduce output size:

```scss
@use "kyrolus-sous-materials/styles/styles" with (
  $ks-enable-animations: false,
  $ks-enable-container-queries: false,
  $ks-generate-responsive-utilities: true
);
```

### Breakpoints and Containers

```scss
@use "kyrolus-sous-materials/styles/styles" with (
  $ks-breakpoints: (
    "xs": 0,
    "sm": 640px,
    "md": 768px,
    "lg": 1024px,
    "xl": 1280px,
    "2xl": 1536px,
    "3xl": 1920px
  )
);
```

Dark mode selectors are configurable:

```scss
@use "kyrolus-sous-materials/styles/styles" with (
  $ks-dark-mode-selector: "[data-theme='dark']",
  $ks-dark-mode-class: ".dark"
);
```

## Component Variables

Component-level CSS variables are defined in
`styles/tokens/_component-vars.scss` and are all prefixed with `--ks-`.
Override them at `:root` or inside `data-theme="custom"` for full runtime
control.

Example:

```css
[data-theme="custom"] {
  --ks-btn-primary-bg: #0ea5e9;
  --ks-btn-primary-hover: #0284c7;
  --ks-input-border: #334155;
  --ks-menu-offset: 8px;
}
```

Component theme modifiers (scoped):

- Table: `.advanced-table.light`, `.advanced-table.dark`
- Table layout: `.advanced-table.compact`, `.advanced-table.comfortable`, `.advanced-table.full-width`
- Paginator: `.paginator.light`, `.paginator.dark`

## Namespacing (Scope) and Prefixing (Class Names)

There are two different ways to avoid selector collisions:

1) Namespace (scope selector)
   - Wraps all framework selectors with a container selector.
   - Example: `.ks .btn { ... }`

2) Prefix (class names)
   - Renames all class selectors by adding a prefix.
   - Example: `.btn` becomes `.ks-btn`

Both are optional and controlled by environment variables at build time.

### Namespace (scope selector)

Set a namespace selector:

PowerShell:
```powershell
$env:KS_NAMESPACE_SELECTOR = ".ks"
npm run build:prod
```

Bash:
```bash
KS_NAMESPACE_SELECTOR=".ks" npm run build:prod
```

Then wrap your app:

```html
<div class="ks">
  <!-- app -->
</div>
```

### Prefix (class names)

Set a class prefix:

PowerShell:
```powershell
$env:KS_CLASS_PREFIX = "ks-"
npm run build:prod
```

Bash:
```bash
KS_CLASS_PREFIX="ks-" npm run build:prod
```

After prefixing, you must use the new class names in your HTML:

```html
<!-- before -->
<button class="btn">Save</button>

<!-- after -->
<button class="ks-btn">Save</button>
```

You can combine both:

```bash
KS_CLASS_PREFIX="ks-" KS_NAMESPACE_SELECTOR=".ks" npm run build:prod
```

## Understanding @layer

`@layer` defines cascade order independent of specificity. It guarantees that
utilities cannot unintentionally override components or base styles unless
explicitly placed in a higher layer.

Example:

```css
@layer reset, base, components, utilities, overrides;

@layer components {
  .btn { background: red; }
}

@layer overrides {
  .btn { background: green; }
}
```

Even if both selectors are equal, `overrides` always wins.

## Understanding @forward

`@forward` creates a public API for Sass modules. It is how we expose tokens
and configuration through a single entrypoint.

Example:

```scss
// tokens/_index.scss
@forward "colors";
@forward "spacing";
@forward "typography";
```

Usage:

```scss
@use "tokens" as t;
.card { padding: t.$space-4; }
```

## Build and PurgeCSS

The safe purge script is recommended:

```bash
npm run build:prod:purge
```

A smoke test for PurgeCSS is available:

```bash
npm run test:purge
```

## Class Inventory (All Generated Classes)

The full class list is generated from the compiled CSS and saved to:

- `docs/classes.txt`
- `docs/classes.json`

Generate it with:

```bash
npm run build:prod
npm run export:classes
```

If you want to point to a specific CSS file:

```bash
KS_CSS_PATH="path/to/styles.css" npm run export:classes
```

> Note: If you enable prefix/namespace, run the build with those env vars
> before exporting classes so the inventory reflects the final output.

## Utility Naming Conventions (Quick Index)

Use `docs/classes.txt` for the full list. Common patterns:

- Spacing: `p-*`, `px-*`, `py-*`, `m-*`, `gap-*`, `space-x-*`, `space-y-*`
- Sizing: `w-*`, `h-*`, `min-w-*`, `max-w-*`, `size-*`
- Layout: `flex-*`, `grid-*`, `items-*`, `justify-*`, `place-*`
- Typography: `text-*`, `font-*`, `leading-*`, `tracking-*`
- Colors: `bg-{palette}-{shade}`, `text-{palette}-{shade}`, `border-{palette}-{shade}`
- Effects: `shadow-*`, `opacity-*`, `blur-*`, `backdrop-blur-*`
- State variants: `hover:*`, `focus:*`, `active:*`, `disabled:*`, `dark:*`

Also see:

- `projects/kyrolus-sous-materials/CHEATSHEET.md`
- `projects/kyrolus-sous-materials/DOCUMENTATION.md`

## Token Export

Generate a full token dump for documentation or tooling:

```bash
npm run export:tokens
```

The output is written to `docs/tokens.json`.

## Visual Baseline

Baseline screenshots (no diff yet):

```bash
npm run demo
npm run test:visual
```

You can override the base URL:

```bash
CYPRESS_BASE_URL="http://localhost:4200" npm run test:visual
```

## Entry Points

- `styles/styles.scss` (full framework)
- `styles/entrypoints/core` (reset + tokens + theme + base)
- `styles/entrypoints/utilities` (utilities only)
- `styles/entrypoints/components` (components only)
- `styles/entrypoints/themes` (theme only)
- `styles/entrypoints/tokens` (tokens only)
- `styles/entrypoints/reset` (reset only)
- `styles/entrypoints/preset-minimal` (core + utilities core)
- `styles/entrypoints/preset-modern` (core + utilities core/advanced)
- `styles/entrypoints/preset-full` (core + utilities + components)

## Recommended Usage Patterns

- Start with `core + utilities` for app scaffolding.
- Add `components` only when needed.
- Use prefix/namespace for large apps or when mixing with other frameworks.

## Troubleshooting

- If CSS seems missing after purge, run `npm run test:purge`.
- If dark mode is not applied, check your selector or class:
  `data-theme="dark"` or `.dark`.
- If you use class prefixing, update HTML class names accordingly.
