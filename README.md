# Kyrolus Sous Materials

Kyrolus Sous Materials is an Angular-first SCSS framework focused on modern CSS,
extensive utilities, and predictable layering.

## Documentation

Start here:

- Framework Guide: `docs/FRAMEWORK.md`

## Quick Start

```scss
@use "kyrolus-sous-materials/styles/styles";
```

## Theming

```scss
@use "kyrolus-sous-materials/styles/styles" with (
  $ks-primary-color: #0f766e,
  $ks-secondary-color: #f97316
);
```

## Namespacing (optional)

```bash
KS_NAMESPACE_SELECTOR=".ks" KS_CLASS_PREFIX="ks-" npm run build:prod
```
