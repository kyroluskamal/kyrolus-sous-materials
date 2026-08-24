# Feature inventory

A reference list of the CSS capabilities the framework implements, grouped by area. This
is an inventory, not a tutorial — see [`docs/FRAMEWORK.md`](docs/FRAMEWORK.md) for usage.

## Architecture

- Cascade control with `@layer` (reset, tokens, base, components, utilities)
- Modern CSS reset
- 22 colour palettes on a 50–950 scale
- Dark mode with runtime theme switching
- RTL/LTR support via logical properties
- High-contrast theme support
- Fluid typography with `clamp()`
- Spacing scale derived from tokens

## Modern CSS features

| Feature | Notes |
| --- | --- |
| CSS anchor positioning | Position elements relative to a named anchor, with `position-try-fallbacks` |
| `:has()` | Parent selection based on descendants |
| `@starting-style` | Entry animations without JavaScript |
| `light-dark()` | Native light/dark value selection |
| Container style queries | Query a container by custom property value |
| `text-wrap: balance` / `pretty` | Line-breaking control for headings and body copy |
| `field-sizing: content` | Inputs that size to their content |
| Masonry grid | Column-packed layouts |
| Relative colour syntax | `oklch(from …)` and `color-mix()` |
| View Transitions API | Styling hooks for page transitions |

## Interaction

- Scroll-driven animations using `animation-timeline: view()` and `scroll()`
- Custom scroll timelines with explicit `animation-range` control
- Scroll snap for carousels and sliders without JavaScript
- Overscroll and `touch-action` controls
- Safe-area insets for notched devices
- Popover API styling
- Native `<dialog>` modals
- `<details>` / `<summary>` accordions

## Layout and responsiveness

- Container queries for component-level responsiveness
- Container query units (`cqw`, `cqh`, `cqi`, `cqb`)
- Subgrid
- `aspect-ratio` utilities
- Modern viewport units (`dvh`, `svh`, `lvh`)
- CSS shapes for text wrapping
- Multi-column layout
- Line clamping
- Vertical writing modes

## Colour and visual effects

- OKLCH as the working colour space
- Colour harmony helpers (triadic, analogous, complementary)
- `color-mix()` utilities including alpha blending
- P3 wide-gamut output where supported
- Backdrop-filter based glass effects
- Linear, radial and conic gradients
- Blend modes and filter utilities
- Contrast calculation helpers for accessible pairings

## Accessibility and performance

- `prefers-reduced-motion`, `prefers-contrast` and `forced-colors` handling
- `:focus-visible` indicators
- Windows high-contrast mode support
- `content-visibility: auto` for deferred rendering
- CSS containment for isolation
- `will-change` hints applied sparingly

## Build pipeline

- PostCSS with autoprefixer and cssnano
- PurgeCSS with a maintained safelist, verified by `npm run test:purge`
- JIT generation via the `ks` CLI, so output tracks template usage
- Token and class inventories exported to JSON for editor tooling

## Browser targets

Chrome 115+, Edge 115+, Firefox 118+, Safari 16.4+. Several features above are recent
additions to the platform; where a feature is unsupported the framework falls back rather
than polyfilling.

## Planned

- CSS Houdini custom paint
- Further anchor-positioning coverage
- Additional scroll-timeline utilities
