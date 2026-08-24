# Kyrolus Sous Materials

An Angular-first SCSS framework built on modern CSS: cascade layers for predictable
specificity, container queries for component-level responsiveness, OKLCH colour, and a
JIT engine that emits only the utilities your templates actually use.

Apache-2.0 licensed.

## Approach

Utility frameworks typically ship a large stylesheet and rely on a build step to strip it
back down. This one inverts that: a JIT engine scans your templates and generates CSS on
demand, so the output is proportional to what you wrote rather than to the size of the
framework. Everything is organised with `@layer`, so overriding a framework rule is a
question of layer order rather than specificity.

## Getting started

The framework is developed here as an Angular workspace. From a clone:

```bash
npm install        # also builds the JIT engine via postinstall
npm run docs       # serve the documentation site on :4200
npm run build:lib  # build the library in watch mode
```

### The `ks` CLI

The JIT engine ships as a command-line tool:

```bash
npm run ks:init          # scaffold ks.config.js
npm run ks               # one-off build
npm run ks:watch         # rebuild on template changes
npm run ks:intellisense  # emit editor completion data
```

Configuration lives in `ks.config.js` at the repository root.

## What's inside

| Area | Coverage |
| --- | --- |
| Layering | `@layer` cascade control across reset, tokens, base, components and utilities |
| Colour | 22 palettes on a 50–950 scale, OKLCH manipulation, `color-mix()`, `light-dark()`, P3 wide gamut |
| Theming | Dark mode, high contrast, and forced-colors support |
| Layout | Container queries and container units, subgrid, masonry, aspect-ratio, multi-column |
| Typography | Fluid sizing with `clamp()`, `text-wrap: balance/pretty`, OpenType features, logical properties |
| Interaction | Scroll-driven animations, scroll snap, Popover API, `<dialog>`, `@starting-style` entry animations |
| Positioning | CSS anchor positioning with fallback strategies |
| Internationalisation | RTL/LTR through logical properties throughout |
| Accessibility | `prefers-reduced-motion`, `prefers-contrast`, `forced-colors`, focus-visible handling |
| Performance | `content-visibility`, CSS containment, PurgeCSS pipeline with a smoke test |

Full guide: [`docs/FRAMEWORK.md`](docs/FRAMEWORK.md).
Class inventory: [`docs/CLASS_REFERENCE.md`](docs/CLASS_REFERENCE.md).
Machine-readable exports: [`docs/tokens.json`](docs/tokens.json) and [`docs/classes.json`](docs/classes.json).

## Testing

```bash
npm test             # Vitest unit tests
npm run test:visual  # Cypress visual baselines
npm run test:purge   # verify the purge pipeline retains required classes
```

## Browser support

Chrome 115+, Edge 115+, Firefox 118+, Safari 16.4+. The framework targets recent CSS
features deliberately and does not polyfill them.

## Project layout

```
projects/
  kyrolus-sous-materials/   framework source and JIT engine
  ks-materials-docs/        documentation site (Angular SSR)
docs/                       generated reference and token exports
cypress/                    visual baseline specs
```

## License

Apache-2.0. See [LICENSE](LICENSE).
