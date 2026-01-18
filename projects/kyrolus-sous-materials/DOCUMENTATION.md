# Kyrolus Sous Materials - Complete Documentation

> A comprehensive SCSS utility framework featuring 40 cutting-edge CSS features for modern Angular applications.

---

## Table of Contents

1. [CSS Layers](#1-css-layers)
2. [View Transitions](#2-view-transitions)
3. [Scroll-Driven Animations](#3-scroll-driven-animations)
4. [Anchor Positioning](#4-anchor-positioning)
5. [Logical Properties](#5-logical-properties)
6. [Container Query Units](#6-container-query-units)
7. [CSS Subgrid](#7-css-subgrid)
8. [Native Popover API](#8-native-popover-api)
9. [Modern Viewport Units](#9-modern-viewport-units)
10. [CSS Motion Path](#10-css-motion-path)
11. [CSS Masks](#11-css-masks)
12. [@property Custom Properties](#12-property-custom-properties)
13. [Advanced Text Decoration](#13-advanced-text-decoration)
14. [OKLCH Color System](#14-oklch-color-system)
15. [Native Dialog Element](#15-native-dialog-element)
16. [Details/Summary Accordion](#16-detailssummary-accordion)
17. [Form Accent & Modern Forms](#17-form-accent--modern-forms)
18. [Touch & Overscroll Behavior](#18-touch--overscroll-behavior)
19. [CSS Trigonometry](#19-css-trigonometry)
20. [CSS Shapes](#20-css-shapes)
21. [OpenType Font Features](#21-opentype-font-features)
22. [Interpolate Size](#22-interpolate-size)
23. [Starting Style](#23-starting-style)
24. [CSS Highlight API](#24-css-highlight-api)
25. [CSS @scope](#25-css-scope)
26. [Custom Counter Styles](#26-custom-counter-styles)
27. [Font Palette](#27-font-palette)
28. [CSS Nesting](#28-css-nesting)
29. [Color Mix](#29-color-mix)
30. [Light-Dark Function](#30-light-dark-function)
31. [Relative Color Syntax](#31-relative-color-syntax)
32. [Text Wrap Balance/Pretty](#32-text-wrap-balancepretty)
33. [:has() Parent Selector](#33-has-parent-selector)
34. [Scroll Snap](#34-scroll-snap)
35. [Content Visibility](#35-content-visibility)
36. [Aspect Ratio](#36-aspect-ratio)
37. [Focus Visible](#37-focus-visible)
38. [Linear Easing Functions](#38-linear-easing-functions)
39. [Object View Box](#39-object-view-box)
40. [Wide Gamut Colors (Display-P3)](#40-wide-gamut-colors-display-p3)
41. [Advanced Container Units](#41-advanced-container-units)
42. [Smart Anchor Positioning](#42-smart-anchor-positioning)
43. [Scroll Timeline Animations](#43-scroll-timeline-animations)
44. [OKLCH Color Manipulation](#44-oklch-color-manipulation)
45. [CSS Math Functions & Modular Scales](#45-css-math-functions--modular-scales)
46. [Advanced Grid Features](#46-advanced-grid-features)
47. [CSS Layers Composition](#47-css-layers-composition)
48. [Advanced Accessibility Features](#48-advanced-accessibility-features)

---

## 1. CSS Layers

### What is it?

CSS Cascade Layers (`@layer`) is a feature that gives developers explicit control over the CSS cascade - the system that determines which styles "win" when multiple rules target the same element.

### The Problem it Solves

Traditionally, CSS specificity battles were a nightmare:
- Third-party library styles override your styles
- You resort to `!important` which creates more problems
- Specificity wars lead to overly complex selectors
- Style order in files becomes critical and fragile

### How it Works

Layers create explicit priority groups. Styles in later-defined layers always beat styles in earlier layers, regardless of specificity:

```css
/* Define layer order - LATER = HIGHER PRIORITY */
@layer reset, base, components, utilities;

/* reset layer - lowest priority */
@layer reset {
  * { margin: 0; padding: 0; }
}

/* utilities layer - highest priority */
@layer utilities {
  .hidden { display: none; }  /* This ALWAYS wins over components */
}
```

### Available Classes

| Class | Layer | Priority | Use Case |
|-------|-------|----------|----------|
| `.layer-reset` | reset | 1 (lowest) | CSS resets, normalizations |
| `.layer-base` | base | 2 | Base element styles (typography, forms) |
| `.layer-components` | components | 3 | Component styles (cards, buttons) |
| `.layer-utilities` | utilities | 4 (highest) | Utility overrides (.hidden, .flex) |
| `.layer-override` | (unlayered) | 5 (highest) | Emergency overrides |

### Usage Examples

**Basic Layer Assignment:**
```html
<!-- This button's styles come from the components layer -->
<button class="btn layer-components">Click Me</button>

<!-- This utility class will ALWAYS override component styles -->
<button class="btn hidden layer-utilities">Hidden Button</button>
```

**Organizing Your Own Styles:**
```scss
// Your application styles
@layer components {
  .my-card {
    padding: 1rem;
    background: white;
  }
}

@layer utilities {
  .p-0 { padding: 0 !important; } // Always wins
}
```

**Fighting Third-Party Library Conflicts:**
```scss
// Put third-party styles in a low-priority layer
@layer vendor {
  @import 'some-library/styles.css';
}

// Your styles automatically win
@layer components {
  .card { /* Your styles override vendor */ }
}
```

### Browser Support
- Chrome 99+, Firefox 97+, Safari 15.4+
- Fully supported in all modern browsers

---

## 2. View Transitions

### What is it?

The View Transitions API enables smooth animated transitions between different states of a page or between page navigations (in SPAs and MPAs). It creates a "snapshot" of the before state, then animates to the after state.

### The Problem it Solves

Before View Transitions:
- Page navigations felt jarring and instant
- Creating smooth transitions required complex JavaScript
- Animating between two unrelated elements was nearly impossible
- SPAs had to manually orchestrate enter/exit animations

### How it Works

1. Browser takes a screenshot of the "old" state
2. DOM updates happen instantly
3. Browser takes a screenshot of the "new" state
4. Browser cross-fades (or custom animates) between screenshots

```javascript
// JavaScript trigger
document.startViewTransition(() => {
  // Update the DOM here
  element.innerHTML = newContent;
});
```

The CSS controls HOW the animation looks:

```css
/* The element being transitioned */
.card {
  view-transition-name: card-transition;
}

/* Animation for the old state leaving */
::view-transition-old(card-transition) {
  animation: fade-out 0.3s ease-out;
}

/* Animation for the new state entering */
::view-transition-new(card-transition) {
  animation: fade-in 0.3s ease-in;
}
```

### Available Classes

| Class | Effect | Description |
|-------|--------|-------------|
| `.view-transition` | Enables transitions | Assigns a unique transition name |
| `.vt-fade` | Fade effect | Cross-fade between states |
| `.vt-slide-left` | Slide from right | New content slides in from right |
| `.vt-slide-right` | Slide from left | New content slides in from left |
| `.vt-slide-up` | Slide from bottom | New content slides up |
| `.vt-slide-down` | Slide from top | New content slides down |
| `.vt-scale` | Scale effect | Scales up from center |
| `.vt-flip` | 3D flip | Rotates like a card flip |
| `.vt-duration-fast` | 150ms | Quick transitions |
| `.vt-duration-normal` | 300ms | Standard timing |
| `.vt-duration-slow` | 500ms | Slower, dramatic transitions |

### Usage Examples

**Basic Page Transition (Angular):**
```typescript
// In your component
async navigateTo(route: string) {
  if (!document.startViewTransition) {
    this.router.navigate([route]);
    return;
  }
  
  document.startViewTransition(() => {
    this.router.navigate([route]);
  });
}
```

```html
<!-- Template -->
<main class="view-transition vt-fade">
  <router-outlet></router-outlet>
</main>
```

**Card to Detail Transition:**
```html
<!-- List view -->
<div class="card view-transition vt-scale" 
     style="view-transition-name: product-{{item.id}}">
  <img [src]="item.image">
  <h3>{{item.name}}</h3>
</div>

<!-- Detail view (same transition name = morphs between them) -->
<div class="detail view-transition" 
     style="view-transition-name: product-{{product.id}}">
  <img [src]="product.image">
  <h1>{{product.name}}</h1>
</div>
```

**Shared Element Transition:**
```html
<!-- The image will morph smoothly between pages -->
<img class="hero-image" style="view-transition-name: hero-image" src="...">
```

### Angular Integration

```typescript
// app.config.ts - Enable view transitions
import { provideRouter, withViewTransitions } from '@angular/router';

export const appConfig = {
  providers: [
    provideRouter(routes, withViewTransitions())
  ]
};
```

### Browser Support
- Chrome 111+, Safari 18+
- Firefox: Not yet supported
- Use feature detection: `if (document.startViewTransition)`

---

## 3. Scroll-Driven Animations

### What is it?

Scroll-Driven Animations allow you to link any CSS animation directly to scroll progress instead of time. As the user scrolls, the animation progresses - no JavaScript needed!

### The Problem it Solves

Traditional scroll animations required:
- JavaScript scroll event listeners (performance heavy)
- Libraries like GSAP ScrollTrigger or Intersection Observer
- Manual calculation of scroll percentages
- Debouncing/throttling for performance

Now it's pure CSS:

```css
.element {
  animation: fade-in linear;
  animation-timeline: scroll(); /* Animation tied to scroll! */
}
```

### How it Works

Two main concepts:

1. **Scroll Timeline**: Animation progress = scroll position
   - `scroll()` - tracks scrolling of nearest scrollable ancestor
   - `scroll(root)` - tracks document scroll

2. **View Timeline**: Animation triggers when element enters/exits viewport
   - `view()` - element's visibility in viewport drives animation

### Available Classes

| Class | Effect | When it Triggers |
|-------|--------|------------------|
| `.scroll-animate` | Enable scroll animation | Base class required |
| `.scroll-fade-in` | Fades from 0 to 1 | As element scrolls into view |
| `.scroll-fade-out` | Fades from 1 to 0 | As element scrolls out |
| `.scroll-slide-up` | Slides up from below | On scroll into view |
| `.scroll-slide-down` | Slides down from above | On scroll into view |
| `.scroll-slide-left` | Slides in from right | On scroll into view |
| `.scroll-slide-right` | Slides in from left | On scroll into view |
| `.scroll-scale-in` | Scales from 0 to 1 | On scroll into view |
| `.scroll-rotate` | Rotates as you scroll | Continuous rotation |
| `.scroll-progress` | Width 0% to 100% | Progress indicator |
| `.scroll-parallax` | Parallax movement | Moves slower than scroll |
| `.scroll-blur-in` | Blur to clear | On scroll into view |

### Usage Examples

**Fade In Sections:**
```html
<section class="scroll-animate scroll-fade-in">
  <h2>This fades in as you scroll to it</h2>
  <p>Content appears smoothly...</p>
</section>

<section class="scroll-animate scroll-slide-up">
  <h2>This slides up into view</h2>
</section>
```

**Reading Progress Indicator:**
```html
<!-- Fixed at top of page -->
<div class="scroll-progress" style="
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  background: var(--primary);
"></div>
```

The bar automatically grows from 0% to 100% width as user scrolls the page!

**Parallax Hero Image:**
```html
<div class="hero">
  <img class="scroll-parallax" src="hero-bg.jpg" alt="">
  <h1>Welcome</h1>
</div>
```

**Staggered List Animation:**
```html
<ul class="feature-list">
  <li class="scroll-animate scroll-fade-in" style="animation-delay: 0ms">Feature 1</li>
  <li class="scroll-animate scroll-fade-in" style="animation-delay: 100ms">Feature 2</li>
  <li class="scroll-animate scroll-fade-in" style="animation-delay: 200ms">Feature 3</li>
</ul>
```

**Custom Scroll Animation:**
```scss
.my-element {
  animation: custom-scroll-effect linear;
  animation-timeline: view();
  animation-range: entry 0% cover 50%; // Start when entering, complete at 50% visible
}

@keyframes custom-scroll-effect {
  from {
    opacity: 0;
    transform: translateY(100px) rotate(-10deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotate(0);
  }
}
```

### Browser Support
- Chrome 115+
- Firefox & Safari: Not yet supported
- Progressive enhancement recommended - elements just won't animate in unsupported browsers

---

## 4. Anchor Positioning

### What is it?

CSS Anchor Positioning allows you to position an element relative to another element anywhere in the DOM, without needing them to be parent-child. Perfect for tooltips, popovers, and dropdown menus.

### The Problem it Solves

Positioning a tooltip near a button traditionally required:
- JavaScript libraries (Popper.js, Floating UI)
- Complex calculations for positioning
- Handling viewport boundaries manually
- Event listeners for resize/scroll

Now it's pure CSS:

```css
.button {
  anchor-name: --my-button;
}

.tooltip {
  position: absolute;
  position-anchor: --my-button;
  top: anchor(bottom);      /* Position below the button */
  left: anchor(center);     /* Center horizontally */
}
```

### How it Works

1. **Define an Anchor**: Give an element a name with `anchor-name`
2. **Position to Anchor**: Use `position-anchor` and `anchor()` function
3. **Fallback Positioning**: Use `position-try` for viewport edge handling

### Available Classes

| Class | Purpose | Description |
|-------|---------|-------------|
| `.anchor` | Define anchor | Makes element an anchor point |
| `.anchor-{name}` | Named anchor | Specific anchor name |
| `.anchored` | Attach to anchor | Positions element to anchor |
| `.anchored-top` | Position above | Places above anchor |
| `.anchored-bottom` | Position below | Places below anchor |
| `.anchored-left` | Position left | Places to left of anchor |
| `.anchored-right` | Position right | Places to right of anchor |
| `.anchored-center` | Center align | Centers on anchor |
| `.anchor-tooltip` | Tooltip preset | Complete tooltip positioning |
| `.anchor-dropdown` | Dropdown preset | Complete dropdown positioning |
| `.anchor-fallback` | Auto-flip | Flips when near viewport edge |

### Usage Examples

**Basic Tooltip:**
```html
<button class="anchor" style="anchor-name: --btn-tooltip">
  Hover me
</button>

<div class="anchored anchored-top" style="position-anchor: --btn-tooltip">
  I appear above the button!
</div>
```

**Dropdown Menu:**
```html
<button class="anchor" style="anchor-name: --menu-trigger">
  Open Menu ▼
</button>

<ul class="dropdown-menu anchored anchored-bottom anchor-fallback">
  <li>Option 1</li>
  <li>Option 2</li>
  <li>Option 3</li>
</ul>
```

**Tooltip with Auto-Flip:**
```html
<!-- When tooltip would go off-screen, it flips to the other side -->
<span class="anchor" style="anchor-name: --info">ℹ️</span>

<div class="anchor-tooltip anchor-fallback" style="position-anchor: --info">
  This tooltip automatically flips if near edge of screen
</div>
```

**Dynamic Anchor Names in Angular:**
```html
<div *ngFor="let item of items; let i = index">
  <button [style.anchor-name]="'--item-' + i" class="anchor">
    {{item.name}}
  </button>
  
  <div class="anchored anchored-right" 
       [style.position-anchor]="'--item-' + i">
    Details for {{item.name}}
  </div>
</div>
```

### Browser Support
- Chrome 125+
- Firefox & Safari: Not yet supported
- Fallback: Use Floating UI library for unsupported browsers

---

## 5. Logical Properties

### What is it?

Logical Properties replace physical directions (left, right, top, bottom) with logical ones (inline-start, inline-end, block-start, block-end) that automatically adapt to different writing modes and text directions.

### The Problem it Solves

Traditional CSS is hardcoded for left-to-right (LTR) languages:

```css
/* This breaks in Arabic (RTL) */
.sidebar {
  margin-left: 20px;  /* Should be margin-right in RTL! */
  padding-right: 10px; /* Should be padding-left in RTL! */
  text-align: left;   /* Should be right in RTL! */
}
```

Supporting RTL meant duplicating styles:

```css
[dir="rtl"] .sidebar {
  margin-left: 0;
  margin-right: 20px;
  padding-right: 0;
  padding-left: 10px;
  text-align: right;
}
```

### How it Works

Logical properties use **flow-relative** directions:

| Physical | Logical | In LTR | In RTL |
|----------|---------|--------|--------|
| `left` | `inline-start` | left | right |
| `right` | `inline-end` | right | left |
| `top` | `block-start` | top | top |
| `bottom` | `block-end` | bottom | bottom |

```css
.sidebar {
  margin-inline-start: 20px;  /* Left in LTR, Right in RTL */
  padding-inline-end: 10px;   /* Right in LTR, Left in RTL */
  text-align: start;          /* Left in LTR, Right in RTL */
}
```

**One CSS rule works for ALL languages!**

### Available Classes

**Margin Classes:**
| Class | Property | Description |
|-------|----------|-------------|
| `.m-inline-{size}` | margin-inline | Left + Right (LTR) |
| `.m-inline-start-{size}` | margin-inline-start | Left (LTR) / Right (RTL) |
| `.m-inline-end-{size}` | margin-inline-end | Right (LTR) / Left (RTL) |
| `.m-block-{size}` | margin-block | Top + Bottom |
| `.m-block-start-{size}` | margin-block-start | Top |
| `.m-block-end-{size}` | margin-block-end | Bottom |

**Padding Classes:**
| Class | Property | Description |
|-------|----------|-------------|
| `.p-inline-{size}` | padding-inline | Left + Right |
| `.p-inline-start-{size}` | padding-inline-start | Left (LTR) / Right (RTL) |
| `.p-inline-end-{size}` | padding-inline-end | Right (LTR) / Left (RTL) |
| `.p-block-{size}` | padding-block | Top + Bottom |

**Sizes:** `0`, `1`, `2`, `3`, `4`, `5`, `6`, `8`, `10`, `12`, `16`, `auto`

**Border Classes:**
| Class | Property |
|-------|----------|
| `.border-inline-start` | border-inline-start |
| `.border-inline-end` | border-inline-end |
| `.border-block-start` | border-block-start |
| `.border-block-end` | border-block-end |

**Text & Float:**
| Class | CSS | LTR | RTL |
|-------|-----|-----|-----|
| `.text-start` | text-align: start | left | right |
| `.text-end` | text-align: end | right | left |
| `.float-inline-start` | float: inline-start | left | right |
| `.float-inline-end` | float: inline-end | right | left |

**Positioning:**
| Class | Property |
|-------|----------|
| `.inset-inline-{size}` | inset-inline (left + right) |
| `.inset-inline-start-{size}` | inset-inline-start |
| `.inset-block-{size}` | inset-block (top + bottom) |

**Sizing:**
| Class | Property |
|-------|----------|
| `.inline-size-{value}` | inline-size (width in LTR) |
| `.block-size-{value}` | block-size (height) |
| `.min-inline-size-{value}` | min-inline-size |
| `.max-inline-size-{value}` | max-inline-size |

### Usage Examples

**RTL-Ready Card:**
```html
<article class="card p-inline-4 p-block-3 m-block-end-4">
  <img class="float-inline-start m-inline-end-3" src="avatar.jpg">
  <h3 class="text-start">User Name</h3>
  <p class="border-inline-start p-inline-start-3">
    This content automatically mirrors in RTL languages!
  </p>
</article>
```

**Navigation:**
```html
<nav class="p-inline-4">
  <a href="/" class="m-inline-end-3">Home</a>
  <a href="/about" class="m-inline-end-3">About</a>
  <button class="m-inline-start-auto">Login</button>
</nav>
```

**Testing RTL:**
```html
<!-- Just add dir="rtl" to test -->
<body dir="rtl">
  <!-- All logical properties automatically flip! -->
</body>
```

### Browser Support
- Chrome 87+, Firefox 66+, Safari 14.1+
- Excellent browser support - safe to use in production

---

## 6. Container Query Units

### What is it?

Container Query Units (cqi, cqw, cqh, cqmin, cqmax) are like viewport units (vw, vh) but relative to a **container element** instead of the browser window.

### The Problem it Solves

Viewport units are great but limited:
- `10vw` is always 10% of browser width
- Doesn't help when a component is in a sidebar vs main content
- Components can't adapt to their container size

```css
/* This card is always 50% of VIEWPORT width */
.card {
  width: 50vw; /* Useless in a 300px sidebar! */
}
```

Container units solve this:

```css
.card-container {
  container-type: inline-size; /* Enable container queries */
}

.card {
  width: 50cqi; /* 50% of CONTAINER width! */
  font-size: 3cqi; /* Font scales with container! */
}
```

### How it Works

1. Define a **containment context** on parent
2. Child elements use `cqi`, `cqw`, etc. units

| Unit | Meaning |
|------|---------|
| `cqi` | 1% of container's inline size (width in LTR) |
| `cqw` | 1% of container's width |
| `cqh` | 1% of container's height |
| `cqmin` | Smaller of cqi or cqb |
| `cqmax` | Larger of cqi or cqb |
| `cqb` | 1% of container's block size (height) |

### Available Classes

**Container Setup:**
| Class | Purpose |
|-------|---------|
| `.container-query` | Enable container queries on element |
| `.container-inline` | Contain inline-size only |
| `.container-size` | Contain both dimensions |
| `.container-name-{name}` | Named container |

**Container-Relative Sizing:**
| Class | Value | Description |
|-------|-------|-------------|
| `.cqi-10` through `.cqi-100` | 10cqi - 100cqi | Width relative to container |
| `.cqw-{value}` | Container width % | Same as cqi |
| `.cqh-{value}` | Container height % | Height relative to container |

**Container-Responsive Typography:**
| Class | Size | Use Case |
|-------|------|----------|
| `.cq-text-xs` | 2.5cqi | Fine print |
| `.cq-text-sm` | 3cqi | Small text |
| `.cq-text-base` | 3.5cqi | Body text |
| `.cq-text-lg` | 4cqi | Subheadings |
| `.cq-text-xl` | 5cqi | Headings |
| `.cq-text-2xl` | 6cqi | Large headings |

**Container-Responsive Spacing:**
| Class | Value |
|-------|-------|
| `.cq-p-{size}` | Padding in cqi units |
| `.cq-m-{size}` | Margin in cqi units |
| `.cq-gap-{size}` | Gap in cqi units |

### Usage Examples

**Self-Scaling Card:**
```html
<div class="container-query">
  <article class="card cqi-90 cq-p-4">
    <h2 class="cq-text-xl">Responsive Heading</h2>
    <p class="cq-text-base">
      This text scales with the container, not the viewport!
    </p>
    <img class="cqi-100" src="image.jpg" alt="">
  </article>
</div>
```

**Sidebar vs Main Content:**
```html
<aside class="sidebar container-query" style="width: 300px">
  <div class="widget cqi-90 cq-text-sm">
    <!-- Smaller text and sizing for sidebar -->
  </div>
</aside>

<main class="container-query" style="flex: 1">
  <div class="widget cqi-50 cq-text-base">
    <!-- Larger text for main content area -->
  </div>
</main>
```

**Combining with Container Queries:**
```scss
.container-query {
  container-type: inline-size;
}

.card {
  padding: 4cqi;
  font-size: 3.5cqi;
  
  // Also use @container rules
  @container (min-width: 400px) {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}
```

### Browser Support
- Chrome 105+, Firefox 110+, Safari 16+
- Good modern browser support

---

## 7. CSS Subgrid

### What is it?

Subgrid allows a grid item's children to participate in the parent grid's track sizing. The nested element "inherits" the parent's grid lines instead of creating its own independent grid.

### The Problem it Solves

Before subgrid, nested grids were independent:

```html
<div class="parent-grid">
  <div class="card">
    <h2>Title varies</h2>        <!-- Different height per card -->
    <p>Description varies...</p>  <!-- Different height per card -->
    <button>Action</button>       <!-- Misaligned buttons! -->
  </div>
  <div class="card">
    <h2>Short</h2>
    <p>Long description that wraps to multiple lines...</p>
    <button>Action</button>       <!-- Not aligned with first card! -->
  </div>
</div>
```

Even with CSS Grid, the cards' internal elements don't align across cards.

**With Subgrid:**

```css
.parent-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto auto auto; /* 3 row tracks */
}

.card {
  display: grid;
  grid-template-rows: subgrid; /* Use parent's row tracks! */
  grid-row: span 3;            /* Span all 3 parent rows */
}
```

Now all cards' titles align, descriptions align, and buttons align!

### Available Classes

| Class | CSS | Description |
|-------|-----|-------------|
| `.subgrid` | `grid-template-columns: subgrid; grid-template-rows: subgrid` | Both axes |
| `.subgrid-rows` | `grid-template-rows: subgrid` | Rows only |
| `.subgrid-cols` | `grid-template-columns: subgrid` | Columns only |
| `.subgrid-span-2` | `grid-row: span 2` | Span 2 parent tracks |
| `.subgrid-span-3` | `grid-row: span 3` | Span 3 parent tracks |
| `.subgrid-span-4` | `grid-row: span 4` | Span 4 parent tracks |

**Pre-Built Components:**
| Class | Description |
|-------|-------------|
| `.subgrid-card` | Card with header/body/footer alignment |
| `.subgrid-form` | Form with aligned labels and inputs |
| `.subgrid-table` | Table-like layout with aligned columns |

### Usage Examples

**Aligned Cards:**
```html
<div class="grid grid-cols-3" style="grid-template-rows: auto auto auto">
  
  <article class="subgrid-rows subgrid-span-3">
    <h2>Product A</h2>
    <p>Short description</p>
    <button>Buy $19</button>
  </article>
  
  <article class="subgrid-rows subgrid-span-3">
    <h2>Product B with Longer Title</h2>
    <p>This product has a much longer description that spans multiple lines</p>
    <button>Buy $29</button>
  </article>
  
  <article class="subgrid-rows subgrid-span-3">
    <h2>Product C</h2>
    <p>Medium description here</p>
    <button>Buy $39</button>
  </article>
  
</div>
<!-- All buttons are perfectly aligned! -->
```

**Form with Aligned Labels:**
```html
<form class="grid" style="grid-template-columns: auto 1fr">
  
  <div class="subgrid-cols" style="grid-column: span 2">
    <label>Username</label>
    <input type="text">
  </div>
  
  <div class="subgrid-cols" style="grid-column: span 2">
    <label>Email Address</label>
    <input type="email">
  </div>
  
  <div class="subgrid-cols" style="grid-column: span 2">
    <label>Bio</label>
    <textarea></textarea>
  </div>
  
</form>
<!-- All labels have same width, all inputs align! -->
```

**Using Pre-Built Subgrid Card:**
```html
<div class="grid grid-cols-3 gap-4">
  <article class="subgrid-card">
    <header>Card Title</header>
    <main>Card content goes here with varying length...</main>
    <footer><button>Action</button></footer>
  </article>
  <!-- Repeat - all footers align! -->
</div>
```

### Browser Support
- Chrome 117+, Firefox 71+, Safari 16+
- Well supported in modern browsers

---

## 8. Native Popover API

### What is it?

The Popover API is a native browser feature for creating popover interfaces (tooltips, menus, pickers, dialogs) without any JavaScript for show/hide logic. The browser handles positioning, focus management, light-dismiss, and accessibility.

### The Problem it Solves

Building popovers traditionally required:
- JavaScript to toggle visibility
- Click-outside detection ("light dismiss")
- Focus trapping for accessibility
- Z-index management to appear above other content
- Positioning libraries (Popper.js, Floating UI)

Now it's built into HTML:

```html
<button popovertarget="my-popup">Open</button>
<div id="my-popup" popover>I'm a popover!</div>
```

That's it! No JavaScript needed for basic functionality.

### How it Works

1. Add `popover` attribute to any element
2. Add `popovertarget="id"` to the trigger button
3. Browser handles everything else:
   - Click button → popover appears
   - Click outside → popover closes ("light dismiss")
   - Press Escape → popover closes
   - Focus management is automatic
   - Appears in the **top layer** (above everything)

### Available Classes

**Base Styling:**
| Class | Purpose |
|-------|----------|
| `.popover` | Base popover styles (padding, shadow, border) |
| `.popover-sm` | Small popover (max-width: 200px) |
| `.popover-md` | Medium popover (max-width: 320px) |
| `.popover-lg` | Large popover (max-width: 480px) |
| `.popover-xl` | Extra large (max-width: 640px) |

**Variants:**
| Class | Style |
|-------|-------|
| `.popover-tooltip` | Small, dark tooltip style |
| `.popover-menu` | Dropdown menu style |
| `.popover-modal` | Modal-like centered popover |
| `.popover-card` | Card-style popover |

**Positioning (with Anchor Positioning):**
| Class | Position |
|-------|----------|
| `.popover-top` | Above trigger |
| `.popover-bottom` | Below trigger |
| `.popover-left` | Left of trigger |
| `.popover-right` | Right of trigger |

**Animation:**
| Class | Effect |
|-------|--------|
| `.popover-animated` | Fade + scale entrance |
| `.popover-slide` | Slide entrance |

### Usage Examples

**Basic Popover:**
```html
<button popovertarget="info-popup">ℹ️ More Info</button>

<div id="info-popup" popover class="popover popover-md">
  <h3>Information</h3>
  <p>This is additional information about the feature.</p>
  <button popovertarget="info-popup" popovertargetaction="hide">
    Close
  </button>
</div>
```

**Dropdown Menu:**
```html
<button popovertarget="user-menu">👤 Profile ▾</button>

<div id="user-menu" popover class="popover popover-menu popover-animated">
  <a href="/profile">My Profile</a>
  <a href="/settings">Settings</a>
  <hr>
  <a href="/logout">Log Out</a>
</div>
```

**Tooltip:**
```html
<button popovertarget="tooltip-1"
        onmouseenter="document.getElementById('tooltip-1').showPopover()"
        onmouseleave="document.getElementById('tooltip-1').hidePopover()">
  Hover me
</button>

<div id="tooltip-1" popover="manual" class="popover-tooltip">
  I'm a tooltip!
</div>
```

**Angular Component:**
```typescript
@Component({
  template: `
    <button [popovertarget]="'menu-' + id">Open Menu</button>
    <div [id]="'menu-' + id" popover class="popover">
      <ng-content></ng-content>
    </div>
  `
})
export class PopoverComponent {
  id = Math.random().toString(36).slice(2);
}
```

**Manual Control Modes:**
- `popover` or `popover="auto"` - Light dismiss enabled (click outside closes)
- `popover="manual"` - Must be closed programmatically

```javascript
const el = document.getElementById('my-popover');
el.showPopover();  // Open
el.hidePopover();  // Close
el.togglePopover(); // Toggle
```

### Browser Support
- Chrome 114+, Firefox 125+, Safari 17+
- Good support in modern browsers

---

## 9. Modern Viewport Units

### What is it?

Modern viewport units (dvh, svh, lvh, dvw, svw, lvw) address the problems with traditional `vh` and `vw` units on mobile devices where browser UI (address bar, toolbar) dynamically appears and disappears.

### The Problem it Solves

On mobile browsers:
```css
.hero {
  height: 100vh; /* PROBLEM: Includes space behind the address bar! */
}
```

When you scroll down:
- Address bar hides
- Available space increases
- But `100vh` doesn't change
- Content either gets cut off OR doesn't fill the screen

### How it Works

Three new viewport measurements:

| Unit | Name | Description |
|------|------|-------------|
| `svh/svw` | **Small** Viewport | Viewport with all browser UI visible (smallest possible) |
| `lvh/lvw` | **Large** Viewport | Viewport with all browser UI hidden (largest possible) |
| `dvh/dvw` | **Dynamic** Viewport | Actual current viewport (changes as UI shows/hides) |

```
┌─────────────────────┐
│ [Address Bar     ]  │ ← Browser UI visible
│                     │
│    svh = lvh - UI   │ ← Small Viewport Height
│                     │
│                     │
└─────────────────────┘

┌─────────────────────┐
│                     │ ← Address bar hidden
│                     │
│        lvh          │ ← Large Viewport Height
│                     │
│                     │
└─────────────────────┘
```

**`dvh` dynamically animates between these values!**

### Available Classes

**Height Classes:**
| Class | Value | Use Case |
|-------|-------|----------|
| `.h-dvh` | height: 100dvh | Full height that adapts |
| `.h-svh` | height: 100svh | Safe minimum height |
| `.h-lvh` | height: 100lvh | Maximum possible height |
| `.min-h-dvh` | min-height: 100dvh | Minimum dynamic height |
| `.min-h-svh` | min-height: 100svh | Minimum safe height |
| `.min-h-lvh` | min-height: 100lvh | Minimum large height |
| `.max-h-dvh` | max-height: 100dvh | Constrain to dynamic |
| `.dvh-25` | height: 25dvh | Quarter dynamic height |
| `.dvh-50` | height: 50dvh | Half dynamic height |
| `.dvh-75` | height: 75dvh | Three-quarter dynamic |

**Width Classes:**
| Class | Value |
|-------|-------|
| `.w-dvw` | width: 100dvw |
| `.w-svw` | width: 100svw |
| `.w-lvw` | width: 100lvw |

### Usage Examples

**Full-Screen Hero (Mobile-Friendly):**
```html
<section class="hero min-h-svh">
  <!-- Uses SMALL viewport - never gets cut off by address bar -->
  <h1>Welcome</h1>
  <p>Scroll down for more</p>
</section>
```

**Full-Screen App Layout:**
```html
<div class="app h-dvh">
  <!-- Dynamically adjusts as mobile UI appears/disappears -->
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
</div>
```

**Fixed Bottom Element:**
```html
<!-- Use svh to ensure it's always visible -->
<nav class="fixed-bottom" style="bottom: calc(100svh - 60px)">
  Tab Bar
</nav>
```

**When to Use Each:**
| Scenario | Best Unit |
|----------|----------|
| Hero sections | `svh` (safe, no cutoff) |
| App shells | `dvh` (dynamic, smooth) |
| Modals/dialogs | `dvh` (fill available space) |
| Sticky footers | `svh` (always accessible) |
| Background images | `lvh` (cover maximum area) |

### Browser Support
- Chrome 108+, Firefox 101+, Safari 15.4+
- Excellent support - safe to use!

---

## 10. CSS Motion Path

### What is it?

CSS Motion Path allows you to animate elements along any path - circles, ellipses, polygons, or custom SVG paths. The element follows the path like a train on tracks.

### The Problem it Solves

Traditionally, moving an element along a curved path required:
- JavaScript animation libraries (GSAP, anime.js)
- Complex keyframe calculations with transform: translate()
- SVG SMIL animations (deprecated in many browsers)
- Canvas/WebGL for complex paths

Now it's pure CSS:

```css
.element {
  offset-path: circle(100px);  /* Define the path */
  animation: move 3s linear infinite;
}

@keyframes move {
  to { offset-distance: 100%; }  /* Move along path */
}
```

### How it Works

Three key properties:

1. **`offset-path`**: The path to follow
   - `circle(radius)` - Circular path
   - `ellipse(rx ry)` - Elliptical path
   - `path('M0,0 C...')` - SVG path data
   - `polygon(points)` - Polygon path

2. **`offset-distance`**: Position along path (0% to 100%)

3. **`offset-rotate`**: How element rotates
   - `auto` - Element rotates to follow path direction
   - `auto 90deg` - Auto rotate + offset
   - `0deg` - No rotation

### Available Classes

**Path Shapes:**
| Class | Path Shape |
|-------|------------|
| `.motion-circle` | Circular orbit |
| `.motion-circle-sm` | Small circle (50px) |
| `.motion-circle-lg` | Large circle (200px) |
| `.motion-oval` | Horizontal ellipse |
| `.motion-oval-tall` | Vertical ellipse |
| `.motion-wave` | Sine wave path |
| `.motion-zigzag` | Angular zigzag |
| `.motion-figure-8` | Figure-8 path |
| `.motion-custom` | Use custom path via CSS variable |

**Animation Speed:**
| Class | Duration |
|-------|----------|
| `.motion-slow` | 5s |
| `.motion-normal` | 3s |
| `.motion-fast` | 1.5s |
| `.motion-very-fast` | 0.75s |

**Direction & Rotation:**
| Class | Behavior |
|-------|----------|
| `.motion-reverse` | Reverse direction |
| `.motion-alternate` | Back and forth |
| `.motion-auto-rotate` | Element faces movement direction |
| `.motion-no-rotate` | Element stays upright |

**Animation State:**
| Class | State |
|-------|-------|
| `.motion-paused` | Pause animation |
| `.motion-running` | Resume animation |

### Usage Examples

**Orbiting Icons:**
```html
<div class="solar-system" style="position: relative">
  <div class="sun">☀️</div>
  
  <div class="planet motion-circle motion-slow motion-auto-rotate">
    🌍
  </div>
  
  <div class="planet motion-circle-lg motion-normal motion-auto-rotate">
    🌑
  </div>
</div>
```

**Loading Animation:**
```html
<div class="loader">
  <span class="dot motion-circle-sm motion-fast">●</span>
  <span class="dot motion-circle-sm motion-fast" 
        style="animation-delay: -0.25s">●</span>
  <span class="dot motion-circle-sm motion-fast" 
        style="animation-delay: -0.5s">●</span>
</div>
```

**Car on Road (Custom SVG Path):**
```html
<style>
  .car {
    --custom-path: path('M0,50 Q25,0 50,50 T100,50');
  }
</style>

<div class="road">
  <span class="car motion-custom motion-normal motion-auto-rotate">🚗</span>
</div>
```

**Airplane Route:**
```html
<style>
  .flight-path {
    offset-path: path('M10,90 Q50,10 90,50 T170,30');
    offset-rotate: auto;
    animation: fly 4s ease-in-out infinite;
  }
</style>

<div class="map">
  <span class="flight-path">✈️</span>
</div>
```

**Wave Animation:**
```html
<div class="ocean">
  <span class="boat motion-wave motion-slow motion-no-rotate">🚢</span>
</div>
```

### Browser Support
- Chrome 55+, Firefox 72+, Safari 15.4+ (with prefix)
- Good support, use `-webkit-` prefix for Safari

---

## 11. CSS Masks

### What is it?

CSS Masks allow you to hide parts of an element using images, gradients, or SVG paths. Unlike `clip-path` which creates hard edges, masks support transparency and gradual fading.

### The Problem it Solves

- `clip-path`: Only hard geometric shapes, no transparency
- `opacity`: Affects entire element uniformly
- Images: Can't dynamically fade edges

Masks provide:
- Gradual fade effects (fade to transparent)
- Image-based masking (use any PNG/SVG as mask)
- Luminance masking (black=hidden, white=visible)
- Combining multiple masks

### How it Works

```css
.element {
  /* Image mask - white areas visible, black hidden */
  mask-image: url('mask.png');
  
  /* Gradient mask - gradual fade */
  mask-image: linear-gradient(to bottom, black 50%, transparent);
  
  /* Size and position like backgrounds */
  mask-size: cover;
  mask-position: center;
}
```

### Available Classes

**Gradient Fade Masks:**
| Class | Effect |
|-------|--------|
| `.mask-fade-top` | Fades to transparent at top |
| `.mask-fade-bottom` | Fades to transparent at bottom |
| `.mask-fade-left` | Fades to transparent at left |
| `.mask-fade-right` | Fades to transparent at right |
| `.mask-fade-edges` | Fades all edges |
| `.mask-fade-x` | Fades left and right |
| `.mask-fade-y` | Fades top and bottom |

**Shape Masks:**
| Class | Shape |
|-------|-------|
| `.mask-circle` | Circular reveal from center |
| `.mask-circle-sm` | Small circle mask |
| `.mask-circle-lg` | Large circle mask |
| `.mask-ellipse` | Horizontal ellipse |
| `.mask-ellipse-tall` | Vertical ellipse |

**Geometric Masks:**
| Class | Shape |
|-------|-------|
| `.mask-diagonal` | Diagonal cut |
| `.mask-diagonal-reverse` | Opposite diagonal |
| `.mask-triangle` | Triangle shape |
| `.mask-hexagon` | Hexagonal mask |

**Radial Masks:**
| Class | Effect |
|-------|--------|
| `.mask-radial` | Radial gradient (center visible) |
| `.mask-radial-reverse` | Radial gradient (edges visible) |
| `.mask-spotlight` | Spotlight effect |

**Special Effects:**
| Class | Effect |
|-------|--------|
| `.mask-text` | Mask to text shape |
| `.mask-luminance` | Use luminance mode |
| `.mask-alpha` | Use alpha channel mode |

### Usage Examples

**Fading Image Gallery:**
```html
<div class="gallery mask-fade-edges">
  <img src="photo1.jpg">
  <img src="photo2.jpg">
  <img src="photo3.jpg">
</div>
<!-- Edges fade out creating infinite scroll illusion -->
```

**Circular Profile Photo:**
```html
<div class="profile-photo mask-circle">
  <img src="avatar.jpg" alt="User photo">
</div>
```

**Spotlight Reveal:**
```html
<div class="secret-content mask-spotlight">
  <p>This content is revealed with a spotlight effect!</p>
</div>

<style>
  .mask-spotlight:hover {
    mask-size: 200%; /* Expand spotlight on hover */
  }
</style>
```

**Scrollable List with Faded Edges:**
```html
<ul class="scrollable-list mask-fade-y">
  <li>Item 1</li>
  <li>Item 2</li>
  <!-- Many items -->
  <li>Item 20</li>
</ul>
<!-- Top and bottom fade out hinting there's more content -->
```

**Diagonal Image Split:**
```html
<div class="image-comparison">
  <img src="before.jpg" class="mask-diagonal">
  <img src="after.jpg" class="mask-diagonal-reverse">
</div>
```

**Custom SVG Mask:**
```html
<style>
  .custom-mask {
    mask-image: url('star-mask.svg');
    mask-size: contain;
    mask-repeat: no-repeat;
    mask-position: center;
  }
</style>

<div class="custom-mask">
  <img src="photo.jpg">
</div>
```

### Browser Support
- Chrome 4+ (with `-webkit-`), Firefox 53+, Safari 4+ (with `-webkit-`)
- Excellent support, but use `-webkit-mask` prefix

---

## 12. @property Custom Properties

### What is it?

`@property` allows you to define typed CSS custom properties (CSS variables) with specific syntax, initial values, and inheritance rules. Most importantly, it enables **animating custom properties**.

### The Problem it Solves

Regular CSS variables can't be animated:

```css
:root {
  --my-color: red;
}

.element {
  background: var(--my-color);
  transition: --my-color 0.3s; /* DOESN'T WORK! */
}

.element:hover {
  --my-color: blue; /* Just snaps, no transition */
}
```

With `@property`:

```css
@property --my-color {
  syntax: '<color>';
  initial-value: red;
  inherits: false;
}

.element {
  background: var(--my-color);
  transition: --my-color 0.3s; /* NOW IT WORKS! */
}
```

### How it Works

```css
@property --property-name {
  syntax: '<type>';       /* What kind of value */
  initial-value: value;   /* Default value */
  inherits: true|false;   /* Does it inherit to children? */
}
```

**Supported Syntax Types:**
| Syntax | Values |
|--------|--------|
| `<color>` | Any color value |
| `<length>` | px, em, rem, etc. |
| `<percentage>` | % values |
| `<number>` | Plain numbers |
| `<angle>` | deg, rad, turn |
| `<integer>` | Whole numbers |
| `<length-percentage>` | Length or percentage |
| `<custom-ident>` | Identifier strings |
| `<image>` | Images and gradients |
| `<transform-function>` | Transform values |

### Available Classes

**Pre-Defined Animatable Properties:**
| Class | Property | Type |
|-------|----------|------|
| `.prop-color-primary` | `--prop-color` | Color |
| `.prop-color-animated` | Enables color animation | Color |
| `.prop-size` | `--prop-size` | Length |
| `.prop-angle` | `--prop-angle` | Angle |
| `.prop-number` | `--prop-number` | Number |
| `.prop-percentage` | `--prop-percentage` | Percentage |

**Animation Utilities:**
| Class | Effect |
|-------|--------|
| `.animate-color` | Animates color property |
| `.animate-size` | Animates size property |
| `.animate-rotation` | Animates angle property |
| `.animate-gradient` | Animates gradient position |

### Usage Examples

**Animated Gradient Background:**
```html
<style>
  @property --gradient-angle {
    syntax: '<angle>';
    initial-value: 0deg;
    inherits: false;
  }
  
  .animated-gradient {
    background: linear-gradient(var(--gradient-angle), red, blue);
    animation: rotate-gradient 3s linear infinite;
  }
  
  @keyframes rotate-gradient {
    to { --gradient-angle: 360deg; }
  }
</style>

<div class="animated-gradient">
  Spinning gradient background!
</div>
```

**Color Theme Transitions:**
```html
<style>
  @property --theme-primary {
    syntax: '<color>';
    initial-value: #3b82f6;
    inherits: true;
  }
  
  body {
    transition: --theme-primary 0.5s ease;
  }
  
  body.dark {
    --theme-primary: #60a5fa;
  }
  
  .button {
    background: var(--theme-primary);
    /* Button color smoothly transitions when theme changes! */
  }
</style>
```

**Animated Number Counter:**
```html
<style>
  @property --num {
    syntax: '<integer>';
    initial-value: 0;
    inherits: false;
  }
  
  .counter {
    animation: count 2s forwards;
    counter-reset: num var(--num);
  }
  
  .counter::after {
    content: counter(num);
  }
  
  @keyframes count {
    to { --num: 100; }
  }
</style>

<div class="counter"></div> <!-- Counts from 0 to 100 -->
```

**Pie Chart Animation:**
```html
<style>
  @property --progress {
    syntax: '<percentage>';
    initial-value: 0%;
    inherits: false;
  }
  
  .pie {
    background: conic-gradient(
      var(--primary) var(--progress),
      var(--muted) var(--progress)
    );
    animation: fill-pie 1.5s ease-out forwards;
    border-radius: 50%;
  }
  
  @keyframes fill-pie {
    to { --progress: 75%; }
  }
</style>

<div class="pie" style="width: 100px; height: 100px;"></div>
```

### Browser Support
- Chrome 85+, Firefox 128+, Safari 15.4+
- Good modern support

---

## 13. Advanced Text Decoration

### What is it?

Modern CSS text-decoration properties give fine-grained control over underlines, overlines, and line-throughs - including style, color, thickness, and offset.

### The Problem it Solves

Old text-decoration:
```css
a {
  text-decoration: underline; /* That's it! No control. */
}
```

Problems:
- Underline cuts through descenders (g, y, p)
- Can't change underline color independently
- No control over thickness
- Can't adjust distance from text

### How it Works

New longhand properties:

```css
a {
  text-decoration-line: underline;     /* What to draw */
  text-decoration-style: wavy;         /* Style of line */
  text-decoration-color: red;          /* Color of line */
  text-decoration-thickness: 2px;      /* Line thickness */
  text-underline-offset: 4px;          /* Distance from text */
  text-decoration-skip-ink: auto;      /* Skip descenders */
}
```

### Available Classes

**Line Types:**
| Class | Line Type |
|-------|----------|
| `.underline` | Underline |
| `.overline` | Line above |
| `.line-through` | Strikethrough |
| `.no-underline` | Remove decoration |

**Line Styles:**
| Class | Style |
|-------|-------|
| `.decoration-solid` | Solid line |
| `.decoration-double` | Double line |
| `.decoration-dotted` | Dotted line |
| `.decoration-dashed` | Dashed line |
| `.decoration-wavy` | Wavy line |

**Decoration Colors:**
| Class | Color |
|-------|-------|
| `.decoration-primary` | Primary color |
| `.decoration-secondary` | Secondary color |
| `.decoration-error` | Red/error color |
| `.decoration-warning` | Yellow/warning |
| `.decoration-success` | Green/success |
| `.decoration-current` | Same as text color |
| `.decoration-inherit` | Inherit from parent |

**Thickness:**
| Class | Thickness |
|-------|----------|
| `.decoration-1` | 1px |
| `.decoration-2` | 2px |
| `.decoration-4` | 4px |
| `.decoration-8` | 8px |
| `.decoration-from-font` | Font's suggestion |

**Underline Offset:**
| Class | Offset |
|-------|--------|
| `.underline-offset-1` | 1px |
| `.underline-offset-2` | 2px |
| `.underline-offset-4` | 4px |
| `.underline-offset-8` | 8px |
| `.underline-offset-auto` | Auto (best for text) |

**Skip Ink:**
| Class | Behavior |
|-------|----------|
| `.decoration-skip-ink` | Underline avoids descenders |
| `.decoration-skip-none` | Underline goes through letters |

**Special Effects:**
| Class | Effect |
|-------|--------|
| `.text-stroke` | Text outline effect |
| `.text-gradient` | Gradient text color |
| `.text-shadow-sm/md/lg` | Text shadows |

### Usage Examples

**Stylish Link:**
```html
<a href="#" class="underline decoration-wavy decoration-primary 
                   decoration-2 underline-offset-4">
  Fancy wavy underline!
</a>
```

**Error Text:**
```html
<span class="underline decoration-wavy decoration-error decoration-2">
  Spelling mistake
</span>
```

**Strikethrough Price:**
```html
<span class="line-through decoration-2 text-muted">$99</span>
<span class="text-success font-bold">$49</span>
```

**Hover Effect Link:**
```html
<style>
  .fancy-link {
    text-decoration: none;
    position: relative;
  }
  .fancy-link::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: currentColor;
    transition: width 0.3s;
  }
  .fancy-link:hover::after {
    width: 100%;
  }
</style>
```

**Gradient Text:**
```html
<h1 class="text-gradient" style="
  --gradient-from: #3b82f6;
  --gradient-to: #8b5cf6;
">
  Beautiful Gradient Heading
</h1>
```

### Browser Support
- Chrome 89+, Firefox 70+, Safari 15.4+
- Excellent support

---

## 14. OKLCH Color System

### What is it?

OKLCH is a perceptually uniform color space that makes color manipulation intuitive. Unlike RGB or HSL, colors with the same lightness value actually **look** equally bright to humans.

### The Problem it Solves

**HSL Lightness Lie:**
```css
/* These have the same HSL lightness (50%) */
.yellow { background: hsl(60, 100%, 50%); }  /* Looks bright */
.blue   { background: hsl(240, 100%, 50%); } /* Looks much darker! */
```

HSL's "lightness" is mathematically equal but perceptually different.

**OKLCH Fixes This:**
```css
/* These actually LOOK equally bright! */
.yellow { background: oklch(80% 0.15 90); }
.blue   { background: oklch(80% 0.15 260); }
```

### How it Works

OKLCH has three components:

| Component | Range | Description |
|-----------|-------|-------------|
| **L** (Lightness) | 0% - 100% | Perceptual brightness |
| **C** (Chroma) | 0 - ~0.4 | Color saturation/vividness |
| **H** (Hue) | 0 - 360 | Color wheel angle |

```css
.element {
  /* oklch(lightness chroma hue) */
  background: oklch(70% 0.15 200);  /* Light, moderately saturated cyan */
  
  /* With alpha */
  background: oklch(70% 0.15 200 / 50%);  /* 50% transparent */
}
```

**Hue Values:**
- 0-30: Red
- 30-90: Orange/Yellow
- 90-150: Yellow/Green
- 150-210: Green/Cyan
- 210-270: Cyan/Blue
- 270-330: Blue/Purple
- 330-360: Purple/Red

### Available Classes

**Semantic Colors:**
| Class | Use |
|-------|-----|
| `.bg-oklch-primary` | Primary brand color |
| `.bg-oklch-secondary` | Secondary color |
| `.bg-oklch-accent` | Accent/highlight |
| `.text-oklch-primary` | Primary text color |
| `.border-oklch-primary` | Primary border |

**Named Colors:**
| Class | Hue |
|-------|-----|
| `.bg-oklch-red` | Red (25°) |
| `.bg-oklch-orange` | Orange (50°) |
| `.bg-oklch-yellow` | Yellow (90°) |
| `.bg-oklch-green` | Green (145°) |
| `.bg-oklch-cyan` | Cyan (195°) |
| `.bg-oklch-blue` | Blue (260°) |
| `.bg-oklch-purple` | Purple (300°) |
| `.bg-oklch-pink` | Pink (350°) |

**Lightness Modifiers:**
| Class | Lightness |
|-------|----------|
| `.oklch-l-10` | 10% (very dark) |
| `.oklch-l-30` | 30% (dark) |
| `.oklch-l-50` | 50% (medium) |
| `.oklch-l-70` | 70% (light) |
| `.oklch-l-90` | 90% (very light) |

**Chroma Modifiers:**
| Class | Chroma |
|-------|--------|
| `.oklch-c-0` | 0 (grayscale) |
| `.oklch-c-5` | 0.05 (muted) |
| `.oklch-c-10` | 0.10 (subtle) |
| `.oklch-c-15` | 0.15 (normal) |
| `.oklch-c-20` | 0.20 (vivid) |
| `.oklch-c-25` | 0.25 (intense) |

**Hue Rotation:**
| Class | Rotation |
|-------|----------|
| `.oklch-hue-0` | 0° |
| `.oklch-hue-30` | 30° |
| `.oklch-hue-60` | 60° |
| ... | ... |
| `.oklch-hue-330` | 330° |

### Usage Examples

**Creating Color Palettes:**
```scss
:root {
  /* Define your brand hue */
  --brand-hue: 260; /* Blue-purple */
  
  /* Generate consistent palette */
  --primary-50:  oklch(95% 0.05 var(--brand-hue));
  --primary-100: oklch(90% 0.08 var(--brand-hue));
  --primary-200: oklch(80% 0.10 var(--brand-hue));
  --primary-300: oklch(70% 0.12 var(--brand-hue));
  --primary-400: oklch(60% 0.15 var(--brand-hue));
  --primary-500: oklch(50% 0.18 var(--brand-hue)); /* Base */
  --primary-600: oklch(40% 0.15 var(--brand-hue));
  --primary-700: oklch(30% 0.12 var(--brand-hue));
  --primary-800: oklch(20% 0.10 var(--brand-hue));
  --primary-900: oklch(10% 0.08 var(--brand-hue));
}
```

**Accessible Color Contrast:**
```scss
/* OKLCH makes contrast calculations predictable */
.light-bg {
  background: oklch(95% 0.05 var(--hue)); /* L: 95% */
  color: oklch(20% 0.05 var(--hue));      /* L: 20% = 75% difference! */
}
```

**Dark Mode Toggle:**
```scss
:root {
  --bg-l: 98%;  /* Light mode background lightness */
  --text-l: 15%; /* Light mode text lightness */
}

[data-theme="dark"] {
  --bg-l: 10%;
  --text-l: 90%;
}

body {
  background: oklch(var(--bg-l) 0.01 260);
  color: oklch(var(--text-l) 0.02 260);
}
```

**Vibrant Gradients:**
```css
.gradient {
  background: linear-gradient(
    90deg,
    oklch(65% 0.25 30),   /* Vibrant orange */
    oklch(65% 0.25 330)   /* Vibrant pink */
  );
  /* Both colors have same perceptual lightness! */
}
```

## 41. Advanced Container Units

### What is it?

Container Query Units (`cqw`, `cqh`, `cqi`, `cqb`) are relative length units that reference the dimensions of the nearest ancestor container with `container-type: size` or `container-type: inline-size`. Unlike viewport units, they enable truly component-scoped responsive design.

### The Problem it Solves

Traditional responsive design uses viewport units or media queries:
```css
.card {
  width: 90vw; /* 90% of viewport width */
}
```

Problems:
- Components break when placed in different containers
- Sidebar cards become too wide
- Nested layouts fight with viewport-based sizing
- No way to make components "container-aware"

**With Container Units:**
```css
.card {
  container-type: inline-size;
  width: 80cqi; /* 80% of container's inline size */
}
/* Same component adapts perfectly in sidebar or main content */
```

### How it Works

1. Mark a container element:
```css
.container {
  container-type: inline-size; /* or 'size' for both dimensions */
}
```

2. Use container-relative units:
```css
.child {
  width: 50cqw;   /* 50% of container width */
  height: 30cqh;  /* 30% of container height */
  font-size: 4cqi; /* 4% of container's inline size */
  padding: 2cqb;  /* 2% of container's block size */
}
```

### Available Classes

**Container Declaration:**
| Class | Container Type | Scope |
|-------|----------------|-------|
| `.container-inline` | `inline-size` | Width only |
| `.container-block` | `size` | Width + height |
| `.container-query` | Enables container queries | For `@container` rules |

**Width Units (cqw):**
| Class | Width | Use Case |
|-------|-------|----------|
| `.w-10cqw` | 10cqw | Tiny component |
| `.w-25cqw` | 25cqw | Quarter container |
| `.w-50cqw` | 50cqw | Half container |
| `.w-75cqw` | 75cqw | Three-quarters |
| `.w-100cqw` | 100cqw | Full container |
| `.w-auto-cqw` | auto with cqw fallback | Smart sizing |

**Height Units (cqh):**
| Class | Height | Use Case |
|-------|--------|----------|
| `.h-10cqh` | 10cqh | Small height |
| `.h-25cqh` | 25cqh | Quarter height |
| `.h-50cqh` | 50cqh | Half height |
| `.h-75cqh` | 75cqh | Large height |
| `.h-100cqh` | 100cqh | Full height |

**Inline Size Units (cqi):**
| Class | Inline Size | Use Case |
|-------|-------------|----------|
| `.inline-10cqi` | 10cqi | Small inline |
| `.inline-25cqi` | 25cqi | Quarter inline |
| `.inline-50cqi` | 50cqi | Half inline |
| `.inline-75cqi` | 75cqi | Large inline |
| `.inline-100cqi` | 100cqi | Full inline |

**Block Size Units (cqb):**
| Class | Block Size | Use Case |
|-------|------------|----------|
| `.block-10cqb` | 10cqb | Small block |
| `.block-25cqb` | 25cqb | Quarter block |
| `.block-50cqb` | 50cqb | Half block |
| `.block-75cqb` | 75cqb | Large block |
| `.block-100cqb` | 100cqb | Full block |

**Responsive Text Scaling:**
| Class | Font Size | Use Case |
|-------|-----------|----------|
| `.text-xs-cqw` | 1.5cqw | Extra small text |
| `.text-sm-cqw` | 2.5cqw | Small text |
| `.text-base-cqw` | 4cqw | Base text |
| `.text-lg-cqw` | 5cqw | Large text |
| `.text-xl-cqw` | 6cqw | Extra large |
| `.text-2xl-cqw` | 8cqw | 2x large |
| `.text-3xl-cqw` | 10cqw | 3x large |

**Spacing (Gap, Padding, Margin):**
| Class | Spacing | Use Case |
|-------|---------|----------|
| `.gap-2cqi` | 2cqi | Small gaps |
| `.gap-4cqi` | 4cqi | Medium gaps |
| `.gap-8cqi` | 8cqi | Large gaps |
| `.p-2cqi` | 2cqi padding | Small padding |
| `.p-4cqi` | 4cqi padding | Medium padding |
| `.m-2cqi` | 2cqi margin | Small margin |

**Advanced Container Patterns:**
| Class | Pattern | Description |
|-------|---------|-------------|
| `.grid-responsive` | Auto-fit grid | Columns adapt to container |
| `.flex-responsive` | Flexible flexbox | Items resize with container |
| `.card-adaptive` | Adaptive card | Perfect card sizing |
| `.hero-container` | Hero section | Full-width responsive |

### Usage Examples

**Responsive Card Grid:**
```html
<div class="container-inline grid-responsive">
  <div class="card w-100cqi">Card 1</div>
  <div class="card w-100cqi">Card 2</div>
  <div class="card w-100cqi">Card 3</div>
</div>

<style>
.grid-responsive {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(250px, 100cqi), 1fr));
  gap: clamp(1rem, 4cqi, 2rem);
}
</style>
```

**Adaptive Hero Section:**
```html
<section class="hero-container container-block">
  <h1 class="text-6xl-cqw">Responsive Heading</h1>
  <p class="text-xl-cqw">Subtitle that scales with container</p>
  <button class="btn w-25cqi">Call to Action</button>
</section>
```

**Sidebar-Adaptive Component:**
```html
<!-- Works perfectly in both sidebar and main content -->
<aside class="sidebar">
  <div class="widget container-inline">
    <h3 class="text-2xl-cqw">Widget Title</h3>
    <p class="text-base-cqw">Content that scales appropriately</p>
  </div>
</aside>

<main class="main-content">
  <div class="widget container-inline">
    <h3 class="text-2xl-cqw">Same Widget</h3>
    <p class="text-base-cqw">Looks great here too!</p>
  </div>
</main>
```

**Nested Container Queries:**
```html
<div class="container-inline" style="container-type: inline-size">
  <div class="card container-inline">
    <h2 class="text-3xl-cqw">Card Title</h2>
    <p class="text-base-cqw">This scales relative to the card</p>
    
    <div class="nested-content container-inline">
      <span class="text-sm-cqw">This scales relative to nested content</span>
    </div>
  </div>
</div>
```

**Dynamic Dashboard Layout:**
```html
<div class="dashboard container-block">
  <div class="chart w-50cqw h-40cqh">
    <!-- Chart that's always half width, 40% height -->
  </div>
  
  <div class="stats w-50cqw h-40cqh">
    <!-- Stats panel -->
  </div>
  
  <div class="timeline w-100cqw h-20cqh">
    <!-- Full-width timeline -->
  </div>
</div>
```

### Browser Support
- Chrome 109+, Firefox 110+, Safari 16+
- Excellent modern browser support
- Progressive enhancement: Falls back to fixed units

---

## 42. Smart Anchor Positioning

### What is it?

Advanced CSS Anchor Positioning allows elements to position themselves relative to anchor elements using custom properties and smart fallbacks. This goes beyond basic `position: absolute` to create robust, accessible dropdowns, tooltips, and overlays.

### The Problem it Solves

Traditional positioning struggles with:
- Dropdowns that go off-screen
- Tooltips that clip in containers
- Menus that don't adapt to available space
- Complex positioning logic in JavaScript

**Smart Anchor Positioning:**
```css
.tooltip {
  position: absolute;
  position-anchor: --anchor;
  position-area: bottom;
  position-try-order: most-width, most-height;
}
/* Automatically flips/moves if needed! */
```

### How it Works

1. Define anchor element:
```css
.anchor {
  anchor-name: --my-anchor;
}
```

2. Position anchored element:
```css
.dropdown {
  position: absolute;
  position-anchor: --my-anchor;
  position-area: bottom;
}
```

3. Add smart fallbacks:
```css
.dropdown {
  position-try-order: most-width, most-height;
  position-try-fallbacks: flip-block, flip-inline;
}
```

### Available Classes

**Anchor Definition:**
| Class | Property | Use Case |
|-------|----------|----------|
| `.anchor` | Sets `anchor-name` | Base anchor |
| `.anchor-{name}` | Named anchor | Specific anchors |
| `.anchor-scroll-container` | Scroll-aware anchor | For scrollable areas |

**Position Areas:**
| Class | Position | Description |
|-------|----------|-------------|
| `.anchor-top` | top | Above anchor |
| `.anchor-bottom` | bottom | Below anchor |
| `.anchor-left` | left | Left of anchor |
| `.anchor-right` | right | Right of anchor |
| `.anchor-center` | center | Centered on anchor |
| `.anchor-start` | start | Inline start |
| `.anchor-end` | end | Inline end |

**Smart Positioning:**
| Class | Behavior | Use Case |
|-------|----------|----------|
| `.anchor-smart-top` | Auto-flip top/bottom | Dropdown menus |
| `.anchor-smart-bottom` | Auto-flip bottom/top | Tooltips |
| `.anchor-smart-left` | Auto-flip left/right | Side panels |
| `.anchor-smart-right` | Auto-flip right/left | Context menus |

**Size Matching:**
| Class | Behavior | Use Case |
|-------|----------|----------|
| `.anchor-match-width` | Match anchor width | Dropdown lists |
| `.anchor-match-height` | Match anchor height | Sidebars |
| `.anchor-min-width` | Minimum anchor width | Flexible dropdowns |
| `.anchor-max-width` | Maximum anchor width | Constrained tooltips |

**Try Orders (Fallback Strategy):**
| Class | Try Order | Use Case |
|-------|-----------|----------|
| `.anchor-try-most-space` | most-width, most-height | Maximize available space |
| `.anchor-try-flip-block` | flip-block | Flip vertically |
| `.anchor-try-flip-inline` | flip-inline | Flip horizontally |
| `.anchor-try-all` | all | Exhaustive fallbacks |

**Offset Controls:**
| Class | Offset | Use Case |
|-------|--------|----------|
| `.anchor-offset-0` | 0px | Touching anchor |
| `.anchor-offset-1` | 4px | Small gap |
| `.anchor-offset-2` | 8px | Medium gap |
| `.anchor-offset-4` | 16px | Large gap |
| `.anchor-offset-8` | 32px | Huge gap |

**Viewport Awareness:**
| Class | Behavior | Use Case |
|-------|----------|----------|
| `.anchor-viewport-aware` | Stay in viewport | Mobile-friendly |
| `.anchor-boundary-parent` | Stay in parent | Contained dropdowns |
| `.anchor-boundary-window` | Stay in window | Global tooltips |

### Usage Examples

**Smart Dropdown Menu:**
```html
<button class="btn anchor" anchor-name="--menu-trigger">
  Menu ▼
</button>

<div class="dropdown anchor-smart-bottom anchor-try-most-space">
  <a href="#">Option 1</a>
  <a href="#">Option 2</a>
  <a href="#">Option 3</a>
</div>

<style>
.dropdown {
  position: absolute;
  position-anchor: --menu-trigger;
  position-area: bottom;
  position-try-order: most-width, most-height;
  position-try-fallbacks: flip-block;
  min-width: anchor-size(width);
}
</style>
```

**Tooltip with Smart Positioning:**
```html
<span class="help-icon anchor" anchor-name="--help">
  ⓘ
</span>

<div class="tooltip anchor-smart-top anchor-offset-2">
  This is helpful information!
</div>

<style>
.tooltip {
  position: absolute;
  position-anchor: --help;
  position-area: top;
  position-try-order: most-height;
  position-try-fallbacks: flip-block, flip-inline;
  max-width: 200px;
}
</style>
```

**Context Menu:**
```html
<div class="context-area" anchor-name="--context">
  Right-click me
</div>

<div class="context-menu anchor-smart-right">
  <button>Cut</button>
  <button>Copy</button>
  <button>Paste</button>
</div>

<script>
// Set anchor position dynamically
const area = document.querySelector('.context-area');
area.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  const menu = document.querySelector('.context-menu');
  menu.style.setProperty('--anchor-left', e.clientX + 'px');
  menu.style.setProperty('--anchor-top', e.clientY + 'px');
  menu.showPopover();
});
</script>
```

**Responsive Navigation:**
```html
<nav class="navbar">
  <div class="nav-item anchor" anchor-name="--products">
    Products ▼
  </div>
  
  <div class="mega-menu anchor-smart-bottom anchor-match-width">
    <div class="menu-section">
      <h3>Laptops</h3>
      <a href="#">Gaming</a>
      <a href="#">Business</a>
    </div>
    <div class="menu-section">
      <h3>Phones</h3>
      <a href="#">Android</a>
      <a href="#">iOS</a>
    </div>
  </div>
</nav>
```

**Floating Action Button:**
```html
<button class="fab anchor" anchor-name="--fab">
  +
</button>

<div class="fab-menu anchor-smart-left anchor-try-all">
  <button>★</button>
  <button>✉️</button>
  <button>⚙️</button>
</div>
```

### Browser Support
- Chrome 114+, Firefox (behind flag)
- Safari 17.4+
- Progressive enhancement: Falls back to manual positioning

---

## 43. Scroll Timeline Animations

### What is it?

Scroll-driven animations using `animation-timeline: scroll()` and `animation-range` properties. Elements animate based on scroll position rather than time, creating engaging scroll effects without JavaScript.

### The Problem it Solves

Traditional scroll animations require JavaScript:
```javascript
window.addEventListener('scroll', () => {
  element.style.opacity = calculateOpacity();
});
```

Problems:
- Janky performance
- Complex calculations
- Memory leaks
- Hard to maintain

**CSS Scroll Animations:**
```css
.element {
  animation: fadeIn linear;
  animation-timeline: scroll();
  animation-range: entry 0% entry 100%;
}
/* Smooth, performant, no JavaScript! */
```

### How it Works

1. Define scroll timeline:
```css
.animated-element {
  animation: slideIn linear;
  animation-timeline: scroll(); /* Uses document scroll */
  /* or */
  animation-timeline: scroll(root); /* Explicit root scroll */
  /* or */
  animation-timeline: scroll(nearest); /* Nearest scroll container */
}
```

2. Control animation range:
```css
.element {
  animation-range: entry 20% exit 80%;
  /* Animation runs from 20% entry to 80% exit */
}
```

3. Use view() timeline for viewport-based animations:
```css
.in-view-animation {
  animation: scaleUp linear;
  animation-timeline: view();
  animation-range: cover 25% cover 75%;
}
```

### Available Classes

**Timeline Types:**
| Class | Timeline | Scope |
|-------|----------|-------|
| `.scroll-animate` | `scroll()` | Document scroll |
| `.scroll-root` | `scroll(root)` | Root element scroll |
| `.scroll-nearest` | `scroll(nearest)` | Nearest scroll container |
| `.view-animate` | `view()` | Viewport-based |

**Entry/Exit Animations:**
| Class | Effect | Trigger |
|-------|--------|--------|
| `.scroll-fade-in` | Fade 0→1 | Enters viewport |
| `.scroll-fade-out` | Fade 1→0 | Exits viewport |
| `.scroll-slide-up` | Slide up | Enters from bottom |
| `.scroll-slide-down` | Slide down | Enters from top |
| `.scroll-slide-left` | Slide left | Enters from right |
| `.scroll-slide-right` | Slide right | Enters from left |
| `.scroll-scale-in` | Scale 0.8→1 | Enters viewport |
| `.scroll-scale-out` | Scale 1→0.8 | Exits viewport |
| `.scroll-rotate` | Rotate 0→360° | Scroll progress |
| `.scroll-blur` | Blur 4px→0px | Comes into focus |

**Progress Indicators:**
| Class | Effect | Use Case |
|-------|--------|----------|
| `.scroll-progress` | Width tracks scroll | Progress bars |
| `.scroll-counter` | Number counts up | Scrolling counters |
| `.scroll-parallax` | Slow movement | Parallax effects |
| `.scroll-sticky` | Sticky with animation | Enhanced sticky |

**Animation Range Controls:**
| Class | Range | Behavior |
|-------|-------|----------|
| `.scroll-range-full` | entry 0% exit 100% | Full viewport travel |
| `.scroll-range-half` | entry 25% exit 75% | Middle 50% |
| `.scroll-range-early` | entry 0% entry 100% | Early activation |
| `.scroll-range-late` | exit 0% exit 100% | Late activation |
| `.scroll-cover` | cover 0% cover 100% | While in view |

**Timing Variants:**
| Class | Duration | Use Case |
|-------|----------|----------|
| `.scroll-fast` | Fast animation | Snappy effects |
| `.scroll-normal` | Normal timing | Standard |
| `.scroll-slow` | Slow animation | Dramatic |
| `.scroll-delay-100` | 100ms delay | Staggered |
| `.scroll-delay-200` | 200ms delay | Sequential |

**Directional Controls:**
| Class | Direction | Effect |
|-------|-----------|--------|
| `.scroll-horizontal` | Horizontal scroll | X-axis animations |
| `.scroll-vertical` | Vertical scroll | Y-axis animations |
| `.scroll-both` | Both axes | Multi-directional |

### Usage Examples

**Fade-in on Scroll:**
```html
<div class="scroll-animate scroll-fade-in scroll-range-full">
  <h2>This fades in as you scroll</h2>
  <p>Content appears smoothly</p>
</div>
```

**Parallax Hero Section:**
```html
<section class="hero scroll-animate scroll-parallax">
  <div class="background"></div>
  <div class="content">
    <h1>Welcome</h1>
    <p>Scroll down to see the parallax effect</p>
  </div>
</section>

<style>
.hero {
  height: 100vh;
  animation-timeline: scroll();
  animation-range: cover 0% cover 100%;
}

.background {
  animation: parallax linear;
  animation-timeline: inherit;
  animation-range: inherit;
}

@keyframes parallax {
  from { transform: translateY(0); }
  to { transform: translateY(50%); }
}
</style>
```

**Progress Bar:**
```html
<div class="progress-container">
  <div class="progress-bar scroll-animate scroll-progress"></div>
</div>

<style>
.progress-bar {
  width: 0%;
  height: 4px;
  background: var(--primary);
  animation: fillProgress linear;
  animation-timeline: scroll();
  animation-range: entry 0% exit 100%;
}

@keyframes fillProgress {
  to { width: 100%; }
}
</style>
```

**Staggered Card Reveal:**
```html
<div class="card-grid">
  <div class="card scroll-animate scroll-fade-up scroll-delay-100">Card 1</div>
  <div class="card scroll-animate scroll-fade-up scroll-delay-200">Card 2</div>
  <div class="card scroll-animate scroll-fade-up scroll-delay-300">Card 3</div>
</div>
```

**Infinite Scrolling Gallery:**
```html
<div class="gallery scroll-animate scroll-horizontal">
  <div class="gallery-item">Image 1</div>
  <div class="gallery-item">Image 2</div>
  <div class="gallery-item">Image 3</div>
</div>

<style>
.gallery {
  display: flex;
  overflow-x: auto;
  animation-timeline: scroll(nearest);
  animation-range: entry 0% exit 100%;
}

.gallery-item {
  flex: 0 0 auto;
  width: 300px;
  margin-right: 20px;
  animation: slideIn linear;
  animation-timeline: inherit;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(50px); }
  to { opacity: 1; transform: translateX(0); }
}
</style>
```

**Scroll-triggered Counters:**
```html
<div class="stats scroll-animate scroll-counter">
  <div class="stat">
    <span class="number" data-target="1000">0</span>
    <span>Projects Completed</span>
  </div>
</div>

<script>
// Minimal JavaScript for counter
const counters = document.querySelectorAll('.number');
counters.forEach(counter => {
  const target = parseInt(counter.dataset.target);
  const duration = 2000; // 2 seconds
  
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      let start = 0;
      const increment = target / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(start);
        }
      }, 16);
    }
  });
  
  observer.observe(counter);
});
</script>
```

### Browser Support
- Chrome 115+, Firefox 118+
- Safari 17.4+
- Progressive enhancement: Elements appear without animation

---

## 44. OKLCH Color Manipulation

### What is it?

Advanced OKLCH (Oklab Lightness Chroma Hue) color manipulation system with dynamic color generation, harmonies, and accessibility features. Unlike HSL, OKLCH provides perceptually uniform color spaces.

### The Problem it Solves

Traditional HSL has perceptual inconsistencies:
```css
/* HSL - Looks different brightness */
hsl(0, 100%, 50%)   /* Red */
hsl(120, 100%, 50%) /* Green - appears brighter! */
hsl(240, 100%, 50%) /* Blue - appears darker! */
```

**OKLCH Solution:**
```css
/* OKLCH - Consistent perceptual lightness */
oklch(65% 0.25 0)    /* Red */
oklch(65% 0.25 120)  /* Green - same perceived brightness */
oklch(65% 0.25 240)  /* Blue - same perceived brightness */
```

### How it Works

**OKLCH Components:**
- **Lightness (L)**: 0-100% (perceptually uniform)
- **Chroma (C)**: 0-0.4 (saturation, 0 = gray)
- **Hue (H)**: 0-360° (color wheel position)

**Dynamic Color Generation:**
```css
:root {
  --oklch-primary: oklch(65% 0.25 240); /* Blue */
  --oklch-primary-lighter: oklch(from var(--oklch-primary) calc(l + 0.1) c h);
  --oklch-primary-darker: oklch(from var(--oklch-primary) calc(l - 0.1) c h);
}
```

### Available Classes

**Base Color Definitions:**
| Class | Color | OKLCH Value |
|-------|-------|-------------|
| `.oklch-red` | Red | oklch(65% 0.25 25) |
| `.oklch-orange` | Orange | oklch(70% 0.20 50) |
| `.oklch-yellow` | Yellow | oklch(85% 0.20 90) |
| `.oklch-green` | Green | oklch(60% 0.20 140) |
| `.oklch-cyan` | Cyan | oklch(65% 0.15 200) |
| `.oklch-blue` | Blue | oklch(55% 0.25 260) |
| `.oklch-purple` | Purple | oklch(60% 0.25 300) |
| `.oklch-pink` | Pink | oklch(70% 0.20 340) |

**Lightness Variations:**
| Class | Lightness | Use Case |
|-------|-----------|----------|
| `.oklch-{color}-50` | 50% L | Dark variant |
| `.oklch-{color}-60` | 60% L | Medium dark |
| `.oklch-{color}-70` | 70% L | Base color |
| `.oklch-{color}-80` | 80% L | Light variant |
| `.oklch-{color}-90` | 90% L | Very light |
| `.oklch-{color}-95` | 95% L | Almost white |

**Chroma (Saturation) Controls:**
| Class | Chroma | Effect |
|-------|--------|--------|
| `.oklch-{color}-chroma-0` | 0 | Grayscale |
| `.oklch-{color}-chroma-50` | 0.125 | Low saturation |
| `.oklch-{color}-chroma-100` | 0.25 | Full saturation |
| `.oklch-{color}-chroma-150` | 0.375 | High saturation |
| `.oklch-{color}-chroma-200` | 0.5 | Maximum saturation |

**Dynamic Color Manipulation:**
| Class | Function | Result |
|-------|----------|--------|
| `.oklch-lighten-1` | +10% L | Lighter shade |
| `.oklch-lighten-2` | +20% L | Much lighter |
| `.oklch-darken-1` | -10% L | Darker shade |
| `.oklch-darken-2` | -20% L | Much darker |
| `.oklch-desaturate-1` | -0.05 C | Less saturated |
| `.oklch-saturate-1` | +0.05 C | More saturated |
| `.oklch-hue-shift-30` | +30° H | Hue rotation |
| `.oklch-hue-shift-60` | +60° H | Complementary |
| `.oklch-hue-shift-120` | +120° H | Triadic |
| `.oklch-hue-shift-180` | +180° H | Split complementary |

**Color Harmonies:**
| Class | Harmony | Angles |
|-------|---------|--------|
| `.oklch-complementary` | Opposite | +180° |
| `.oklch-split-complement` | Split opposite | ±150° |
| `.oklch-triadic` | Triangle | +120°, +240° |
| `.oklch-tetradic` | Rectangle | +90°, +180°, +270° |
| `.oklch-analogous` | Adjacent | ±30° |
| `.oklch-monochromatic` | Same hue | Vary L/C |

**Accessibility Tools:**
| Class | Function | Purpose |
|-------|----------|---------|
| `.oklch-a11y-check` | Contrast checker | WCAG validation |
| `.oklch-high-contrast` | Forced contrast | Accessibility mode |
| `.oklch-low-vision` | Reduced contrast | Low vision support |
| `.oklch-color-blind` | Colorblind safe | Deuteranopia/Tritanopia |

**Gradient Generators:**
| Class | Gradient | Type |
|-------|----------|------|
| `.oklch-gradient-linear` | Linear | Straight |
| `.oklch-gradient-radial` | Radial | Circular |
| `.oklch-gradient-conic` | Conic | Hue wheel |
| `.oklch-gradient-smooth` | Smooth interpolation | Perceptually uniform |

### Usage Examples

**Dynamic Theme Generation:**
```html
<div class="theme-demo">
  <div class="swatch oklch-blue oklch-blue-70">Primary</div>
  <div class="swatch oklch-blue oklch-lighten-1">Lighter</div>
  <div class="swatch oklch-blue oklch-darken-1">Darker</div>
  <div class="swatch oklch-blue oklch-complementary">Complement</div>
</div>

<style>
.swatch {
  width: 100px;
  height: 100px;
  display: inline-block;
  margin: 10px;
  border-radius: 8px;
}
</style>
```

**Accessible Color Palette:**
```html
<div class="accessible-palette">
  <div class="bg-primary text-white oklch-a11y-check">Primary Text</div>
  <div class="bg-secondary text-black oklch-a11y-check">Secondary Text</div>
  <div class="bg-accent text-white oklch-a11y-check">Accent Text</div>
</div>

<style>
.accessible-palette div {
  padding: 20px;
  margin: 10px 0;
  border-radius: 4px;
}

.bg-primary { background-color: oklch(65% 0.25 260); }
.text-white { color: oklch(98% 0.01 260); }
.bg-secondary { background-color: oklch(90% 0.05 260); }
.text-black { color: oklch(20% 0.02 260); }
</style>
```

**Harmonious Gradient:**
```html
<div class="harmony-gradient oklch-gradient-conic oklch-triadic">
  Triadic Color Wheel
</div>

<style>
.harmony-gradient {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: conic-gradient(
    oklch(65% 0.25 0),
    oklch(65% 0.25 120),
    oklch(65% 0.25 240),
    oklch(65% 0.25 0)
  );
}
</style>
```

**Dynamic Button States:**
```html
<button class="btn oklch-blue oklch-hover-darken-1 oklch-active-darken-2">
  Click Me
</button>

<style>
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:hover {
  filter: brightness(1.1);
}

.btn:active {
  filter: brightness(0.9);
}
</style>
```

**Color Blind Safe Palette:**
```html
<div class="color-blind-safe">
  <div class="color-1 oklch-blue oklch-color-blind">Blue</div>
  <div class="color-2 oklch-orange oklch-color-blind">Orange</div>
  <div class="color-3 oklch-green oklch-color-blind">Green</div>
</div>

<style>
.color-blind-safe div {
  width: 80px;
  height: 80px;
  display: inline-block;
  margin: 10px;
  border-radius: 4px;
}

/* Ensure sufficient luminance difference for color blindness */
.color-1 { background-color: oklch(55% 0.25 260); } /* Blue */
.color-2 { background-color: oklch(70% 0.20 50); }  /* Orange */
.color-3 { background-color: oklch(60% 0.20 140); } /* Green */
</style>
```

### Browser Support
- Chrome 111+, Firefox 113+, Safari 15.4+
- Good modern browser support
- Fallback to RGB/HSL for older browsers

---

## 15. Native Dialog Element

### What is it?

The `<dialog>` element is a native HTML element for creating modal and non-modal dialogs. It handles focus trapping, keyboard navigation (Escape to close), backdrop styling, and accessibility out of the box.

### The Problem it Solves

Building accessible modals traditionally required:
- JavaScript to manage open/close state
- Focus trapping (keep Tab key inside modal)
- Restoring focus to trigger element on close
- Escape key handling
- Backdrop/overlay management
- ARIA attributes for screen readers
- Z-index battles

Native `<dialog>` provides all of this automatically!

### How it Works

```html
<dialog id="my-dialog">
  <h2>Dialog Title</h2>
  <p>Dialog content here...</p>
  <button onclick="this.closest('dialog').close()">Close</button>
</dialog>

<button onclick="document.getElementById('my-dialog').showModal()">
  Open Modal
</button>
```

**Key Methods:**
- `dialog.showModal()` - Opens as modal (with backdrop, focus trapped)
- `dialog.show()` - Opens as non-modal (no backdrop)
- `dialog.close()` - Closes the dialog
- `dialog.close('return-value')` - Close with return value

**Key Properties:**
- `dialog.open` - Boolean, is dialog open?
- `dialog.returnValue` - Value passed to close()

### Available Classes

**Base Styling:**
| Class | Purpose |
|-------|----------|
| `.dialog` | Base dialog styles |
| `.dialog-header` | Header section |
| `.dialog-body` | Body/content section |
| `.dialog-footer` | Footer with actions |
| `.dialog-close` | Close button |

**Size Variants:**
| Class | Max-Width |
|-------|----------|
| `.dialog-sm` | 320px |
| `.dialog-md` | 480px |
| `.dialog-lg` | 640px |
| `.dialog-xl` | 800px |
| `.dialog-full` | 100vw (fullscreen) |

**Position Variants:**
| Class | Position |
|-------|----------|
| `.dialog-center` | Centered (default) |
| `.dialog-top` | Top of screen |
| `.dialog-bottom` | Bottom of screen |
| `.dialog-drawer-left` | Slide-in from left |
| `.dialog-drawer-right` | Slide-in from right |

**Animation:**
| Class | Effect |
|-------|--------|
| `.dialog-animated` | Fade + scale entrance |
| `.dialog-slide` | Slide entrance |

**Backdrop:**
| Class | Backdrop Style |
|-------|---------------|
| `.dialog-backdrop-dark` | Dark backdrop |
| `.dialog-backdrop-blur` | Blurred backdrop |
| `.dialog-backdrop-light` | Light backdrop |

### Usage Examples

**Basic Modal:**
```html
<dialog id="confirm-dialog" class="dialog dialog-md dialog-animated">
  <header class="dialog-header">
    <h2>Confirm Action</h2>
    <button class="dialog-close" onclick="this.closest('dialog').close()">
      ✕
    </button>
  </header>
  
  <main class="dialog-body">
    <p>Are you sure you want to delete this item?</p>
  </main>
  
  <footer class="dialog-footer">
    <button onclick="this.closest('dialog').close('cancel')">
      Cancel
    </button>
    <button class="btn-danger" onclick="this.closest('dialog').close('confirm')">
      Delete
    </button>
  </footer>
</dialog>

<script>
  const dialog = document.getElementById('confirm-dialog');
  
  dialog.addEventListener('close', () => {
    if (dialog.returnValue === 'confirm') {
      // User confirmed deletion
      deleteItem();
    }
  });
</script>
```

**Drawer/Sidebar:**
```html
<dialog id="nav-drawer" class="dialog dialog-drawer-left dialog-animated">
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
  </nav>
</dialog>

<button onclick="document.getElementById('nav-drawer').showModal()">
  ☰ Menu
</button>
```

**Form Dialog:**
```html
<dialog id="login-dialog" class="dialog dialog-md">
  <form method="dialog"> <!-- method="dialog" auto-closes on submit -->
    <header class="dialog-header">
      <h2>Log In</h2>
    </header>
    
    <main class="dialog-body">
      <input type="email" placeholder="Email" required>
      <input type="password" placeholder="Password" required>
    </main>
    
    <footer class="dialog-footer">
      <button type="button" onclick="this.closest('dialog').close()">
        Cancel
      </button>
      <button type="submit" value="login">
        Log In
      </button>
    </footer>
  </form>
</dialog>
```

**Styling the Backdrop:**
```scss
dialog::backdrop {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

// Or use the utility classes:
dialog.dialog-backdrop-blur::backdrop {
  backdrop-filter: blur(8px);
}
```

**Angular Component:**
```typescript
@Component({
  selector: 'app-modal',
  template: `
    <dialog #dialog class="dialog dialog-md dialog-animated">
      <ng-content></ng-content>
    </dialog>
  `
})
export class ModalComponent {
  @ViewChild('dialog') dialogRef!: ElementRef<HTMLDialogElement>;
  
  open() {
    this.dialogRef.nativeElement.showModal();
  }
  
  close() {
    this.dialogRef.nativeElement.close();
  }
}
```

### Browser Support
- Chrome 37+, Firefox 98+, Safari 15.4+
- Excellent support - production ready!

---

## 16. Details/Summary Accordion

### What is it?

The `<details>` and `<summary>` elements create native, accessible accordion/disclosure widgets. They work without JavaScript and include built-in keyboard navigation and ARIA semantics.

### The Problem it Solves

Traditional accordions require:
- JavaScript click handlers to toggle visibility
- ARIA attributes (aria-expanded, aria-controls)
- Keyboard accessibility (Enter/Space to toggle)
- Managing open/closed state
- Animation for smooth open/close

Native `<details>` provides:
- Zero JavaScript needed for basic functionality
- Built-in accessibility
- Semantic HTML
- CSS-only animations (with some tricks)

### How it Works

```html
<details>
  <summary>Click to expand</summary>
  <p>This content is hidden until you click the summary!</p>
</details>
```

**Attributes:**
- `open` - Add to `<details>` to start expanded

**Events:**
- `toggle` - Fires when opened/closed

### Available Classes

**Base Styling:**
| Class | Purpose |
|-------|----------|
| `.details` | Base details styling |
| `.summary` | Summary styling |

**Style Variants:**
| Class | Style |
|-------|-------|
| `.details-bordered` | Border around entire component |
| `.details-filled` | Background fill |
| `.details-minimal` | Minimal, clean style |
| `.details-card` | Card-like appearance |

**Icon Variants:**
| Class | Icon Type |
|-------|----------|
| `.details-icon-arrow` | Rotating arrow (▶ → ▼) |
| `.details-icon-plus` | Plus/minus (+/-) |
| `.details-icon-chevron` | Chevron (› → ˇ) |
| `.details-icon-none` | No icon |

**Animation:**
| Class | Effect |
|-------|--------|
| `.details-animated` | Smooth height animation |
| `.details-fade` | Fade in content |

**Group Behavior:**
| Class | Behavior |
|-------|----------|
| `.details-group` | Only one open at a time (exclusive) |

### Usage Examples

**Basic FAQ:**
```html
<details class="details details-bordered">
  <summary>What is your return policy?</summary>
  <p>We offer 30-day returns on all items. Items must be unused
     and in original packaging.</p>
</details>

<details class="details details-bordered">
  <summary>How long does shipping take?</summary>
  <p>Standard shipping takes 5-7 business days. Express shipping
     is available for 2-3 day delivery.</p>
</details>
```

**Accordion Group (Exclusive):**
```html
<div class="details-group">
  <details class="details" name="faq-group"> <!-- Same 'name' = exclusive -->
    <summary>Section 1</summary>
    <p>Content for section 1...</p>
  </details>
  
  <details class="details" name="faq-group">
    <summary>Section 2</summary>
    <p>Content for section 2...</p>
  </details>
  
  <details class="details" name="faq-group">
    <summary>Section 3</summary>
    <p>Content for section 3...</p>
  </details>
</div>
<!-- Opening one closes the others! (Chrome 120+) -->
```

**Animated Accordion:**
```html
<details class="details details-animated details-icon-plus">
  <summary>Smooth Animation</summary>
  <div class="details-content">
    <p>This content animates smoothly when opening and closing!</p>
  </div>
</details>
```

**Navigation Menu:**
```html
<nav>
  <details class="details details-minimal">
    <summary>Products ▾</summary>
    <ul>
      <li><a href="/products/software">Software</a></li>
      <li><a href="/products/hardware">Hardware</a></li>
      <li><a href="/products/services">Services</a></li>
    </ul>
  </details>
</nav>
```

**Card with Expandable Details:**
```html
<article class="card">
  <h3>Product Name</h3>
  <p>Short description...</p>
  <p><strong>$99</strong></p>
  
  <details class="details details-minimal">
    <summary>View Specifications</summary>
    <table>
      <tr><td>Weight</td><td>2.5 kg</td></tr>
      <tr><td>Dimensions</td><td>10" x 8" x 3"</td></tr>
      <tr><td>Material</td><td>Aluminum</td></tr>
    </table>
  </details>
</article>
```

**Start Expanded:**
```html
<details class="details" open>
  <summary>This section starts open</summary>
  <p>Content is visible by default.</p>
</details>
```

### Browser Support
- Chrome 12+, Firefox 49+, Safari 6+
- Excellent support - one of the oldest modern HTML features!
- `name` attribute for exclusive groups: Chrome 120+, Safari 17.2+

---

## 17. Form Accent & Modern Forms

### What is it?

Modern CSS form features including `accent-color` for styling native form controls, `color-scheme` for dark mode forms, and `field-sizing` for auto-sizing inputs.

### The Problem it Solves

**Native form controls are hard to style:**
- Checkboxes, radios, range sliders have browser-specific styles
- Custom styling required JavaScript or hiding native elements
- Dark mode broke form inputs (dark background, dark text)

**Now with `accent-color`:**
```css
:root {
  accent-color: #3b82f6; /* All checkboxes, radios, ranges use this! */
}
```

### How it Works

**1. accent-color:**
Sets the accent color for form controls:
```css
input[type="checkbox"],
input[type="radio"],
input[type="range"],
progress {
  accent-color: hotpink;
}
```

**2. color-scheme:**
Tells browser your page supports light/dark:
```css
:root {
  color-scheme: light dark; /* Supports both! */
}

[data-theme="dark"] {
  color-scheme: dark; /* Force dark scheme */
}
```

This makes:
- Form inputs have appropriate background/text colors
- Scrollbars match the theme
- Browser UI adapts

**3. field-sizing:**
Makes inputs auto-size to their content:
```css
textarea {
  field-sizing: content; /* Grows with content! */
}
```

### Available Classes

**Accent Colors:**
| Class | Color |
|-------|-------|
| `.accent-primary` | Primary brand color |
| `.accent-secondary` | Secondary color |
| `.accent-success` | Green |
| `.accent-warning` | Yellow/Orange |
| `.accent-error` | Red |
| `.accent-info` | Blue |

**Color Scheme:**
| Class | Scheme |
|-------|--------|
| `.color-scheme-light` | Force light |
| `.color-scheme-dark` | Force dark |
| `.color-scheme-auto` | Light and dark |

**Field Sizing:**
| Class | Behavior |
|-------|----------|
| `.field-sizing-content` | Auto-size to content |
| `.field-sizing-fixed` | Fixed size (default) |

**Input Sizes:**
| Class | Size |
|-------|------|
| `.input-sm` | Small inputs |
| `.input-md` | Medium inputs |
| `.input-lg` | Large inputs |

**Form Control Styling:**
| Class | Style |
|-------|-------|
| `.checkbox-*` | Custom checkbox styles |
| `.radio-*` | Custom radio styles |
| `.switch` | Toggle switch |
| `.range-*` | Range slider styles |

### Usage Examples

**Brand-Colored Forms:**
```html
<form class="accent-primary">
  <label>
    <input type="checkbox"> Accept terms
  </label>
  
  <label>
    <input type="radio" name="choice"> Option A
  </label>
  <label>
    <input type="radio" name="choice"> Option B
  </label>
  
  <input type="range" min="0" max="100">
  
  <progress value="70" max="100"></progress>
</form>
<!-- All controls use your primary brand color! -->
```

**Auto-Sizing Textarea:**
```html
<textarea class="field-sizing-content" 
          placeholder="Start typing... I'll grow!">
</textarea>
```

**Dark Mode Ready Forms:**
```html
<html class="color-scheme-auto">
  <body>
    <input type="text" placeholder="I look good in dark mode!">
    <!-- Browser automatically adjusts colors -->
  </body>
</html>
```

**Toggle Switch:**
```html
<label class="switch">
  <input type="checkbox">
  <span class="switch-slider"></span>
  Enable notifications
</label>
```

**Styled Range Slider:**
```html
<input type="range" 
       class="range-lg accent-primary" 
       min="0" max="100" value="50">
```

**Form with All Features:**
```html
<form class="form-modern accent-primary">
  <div class="input-group">
    <label>Email</label>
    <input type="email" class="input-lg" placeholder="you@example.com">
  </div>
  
  <div class="input-group">
    <label>Message</label>
    <textarea class="field-sizing-content input-md" 
              placeholder="Type your message..."></textarea>
  </div>
  
  <div class="input-group">
    <label>Priority</label>
    <input type="range" class="range-md" min="1" max="5">
  </div>
  
  <label class="switch">
    <input type="checkbox">
    <span class="switch-slider"></span>
    Send me updates
  </label>
  
  <button type="submit">Submit</button>
</form>
```

### Browser Support
- `accent-color`: Chrome 93+, Firefox 92+, Safari 15.4+
- `color-scheme`: Chrome 81+, Firefox 96+, Safari 13+
- `field-sizing`: Chrome 123+, Firefox (flag), Safari 17+ (partial)

---

## 18. Touch & Overscroll Behavior

### What is it?

CSS properties for controlling touch interactions (`touch-action`) and scroll behavior at boundaries (`overscroll-behavior`).

### The Problem it Solves

**Touch problems:**
- 300ms tap delay on touch devices
- Unwanted browser gestures (pull-to-refresh, back navigation)
- Accidental pinch-zoom on interactive elements

**Scroll problems:**
- "Scroll chaining" - scrolling a modal scrolls the body behind it
- Accidental pull-to-refresh when scrolling up
- Bounce effects on iOS when overscrolling

### How it Works

**touch-action:**
```css
.element {
  /* Control what touch gestures are allowed */
  touch-action: none;           /* No touch interactions */
  touch-action: pan-x;          /* Only horizontal scroll */
  touch-action: pan-y;          /* Only vertical scroll */
  touch-action: pinch-zoom;     /* Only pinch zoom */
  touch-action: manipulation;   /* Pan + pinch, no double-tap zoom (removes 300ms delay!) */
}
```

**overscroll-behavior:**
```css
.scrollable {
  /* Prevent scroll chaining to parent */
  overscroll-behavior: contain; /* Stop at boundaries */
  overscroll-behavior: none;    /* No overscroll effects */
  overscroll-behavior: auto;    /* Default browser behavior */
}
```

### Available Classes

**Touch Action:**
| Class | Behavior |
|-------|----------|
| `.touch-auto` | Default browser handling |
| `.touch-none` | Disable all touch |
| `.touch-pan-x` | Only horizontal panning |
| `.touch-pan-y` | Only vertical panning |
| `.touch-pan-left` | Pan left only |
| `.touch-pan-right` | Pan right only |
| `.touch-pan-up` | Pan up only |
| `.touch-pan-down` | Pan down only |
| `.touch-pinch-zoom` | Only pinch zoom |
| `.touch-manipulation` | Pan + zoom, no tap delay |

**Overscroll Behavior:**
| Class | Behavior |
|-------|----------|
| `.overscroll-auto` | Default behavior |
| `.overscroll-contain` | Prevent scroll chaining |
| `.overscroll-none` | No overscroll effects |
| `.overscroll-x-auto` | Default X-axis |
| `.overscroll-x-contain` | Contain X-axis |
| `.overscroll-x-none` | No X overscroll |
| `.overscroll-y-auto` | Default Y-axis |
| `.overscroll-y-contain` | Contain Y-axis |
| `.overscroll-y-none` | No Y overscroll |

### Usage Examples

**Remove Tap Delay (Faster Buttons):**
```html
<button class="touch-manipulation">
  Fast tap response!
</button>

<!-- Or apply globally -->
<style>
  button, a, [role="button"] {
    touch-action: manipulation;
  }
</style>
```

**Prevent Pull-to-Refresh:**
```html
<body class="overscroll-none">
  <!-- No pull-to-refresh anywhere -->
</body>

<!-- Or just on a specific scrollable -->
<div class="scrollable overscroll-y-contain">
  Scrolling here won't trigger pull-to-refresh
</div>
```

**Modal Without Scroll Chaining:**
```html
<div class="modal-backdrop">
  <div class="modal overscroll-contain">
    <div class="modal-body" style="overflow-y: auto; max-height: 400px;">
      Long scrollable content...
      <!-- Scrolling here won't scroll the body behind! -->
    </div>
  </div>
</div>
```

**Horizontal Carousel:**
```html
<div class="carousel touch-pan-x overscroll-x-contain">
  <div class="carousel-item">1</div>
  <div class="carousel-item">2</div>
  <div class="carousel-item">3</div>
</div>
<!-- Only horizontal swipe, no vertical scroll interference -->
```

**Custom Drag-and-Drop:**
```html
<div class="draggable touch-none">
  <!-- Disable touch so custom drag logic works -->
  Drag me with mouse
</div>
```

**Drawing Canvas:**
```html
<canvas class="touch-none">
  <!-- Prevent all touch gestures so drawing works -->
</canvas>
```

**Map Component:**
```html
<div class="map-container touch-pinch-zoom touch-pan-x touch-pan-y">
  <!-- Allow pan and zoom, but no double-tap delay -->
</div>
```

### Browser Support
- `touch-action`: Chrome 36+, Firefox 52+, Safari 13+
- `overscroll-behavior`: Chrome 63+, Firefox 59+, Safari 16+
- Excellent support!

---

## 19. CSS Trigonometry

### What is it?

CSS now includes mathematical functions `sin()`, `cos()`, `tan()`, `asin()`, `acos()`, `atan()`, and `atan2()` for creating circular, orbital, and wave-based animations and layouts entirely in CSS.

### The Problem it Solves

Before: Positioning items in a circle required:
- JavaScript calculations
- Pre-calculated hardcoded values
- SVG for circular paths

Now:
```css
.item {
  --angle: 45deg;
  --radius: 100px;
  transform: 
    translateX(calc(cos(var(--angle)) * var(--radius)))
    translateY(calc(sin(var(--angle)) * var(--radius)));
}
```

### How it Works

Trig functions take angles (deg, rad, turn) and return values between -1 and 1:

| Function | Input | Output | Use |
|----------|-------|--------|-----|
| `sin(angle)` | Angle | -1 to 1 | Y position on circle |
| `cos(angle)` | Angle | -1 to 1 | X position on circle |
| `tan(angle)` | Angle | -∞ to +∞ | Slope |
| `asin(value)` | -1 to 1 | Angle | Inverse sine |
| `acos(value)` | -1 to 1 | Angle | Inverse cosine |
| `atan(value)` | Number | Angle | Inverse tangent |
| `atan2(y, x)` | Two numbers | Angle | Angle from origin to point |

### Available Classes

**Circular Positioning:**
| Class | Position |
|-------|----------|
| `.trig-pos-0` | 0° (right) |
| `.trig-pos-30` | 30° |
| `.trig-pos-45` | 45° |
| `.trig-pos-60` | 60° |
| `.trig-pos-90` | 90° (bottom) |
| `.trig-pos-120` | 120° |
| `.trig-pos-135` | 135° |
| `.trig-pos-150` | 150° |
| `.trig-pos-180` | 180° (left) |
| `.trig-pos-210` | 210° |
| `.trig-pos-225` | 225° |
| `.trig-pos-240` | 240° |
| `.trig-pos-270` | 270° (top) |
| `.trig-pos-300` | 300° |
| `.trig-pos-315` | 315° |
| `.trig-pos-330` | 330° |

**Animation Types:**
| Class | Animation |
|-------|----------|
| `.trig-orbit` | Orbital rotation |
| `.trig-wave` | Wave motion |
| `.trig-pendulum` | Pendulum swing |
| `.trig-spiral` | Spiral path |
| `.trig-bounce` | Bouncing motion |
| `.trig-pulse` | Pulsing scale |

**Amplitude:**
| Class | Size |
|-------|------|
| `.trig-radius-sm` | 50px radius |
| `.trig-radius-md` | 100px radius |
| `.trig-radius-lg` | 150px radius |
| `.trig-radius-xl` | 200px radius |

**Speed:**
| Class | Duration |
|-------|----------|
| `.trig-slow` | 4s |
| `.trig-normal` | 2s |
| `.trig-fast` | 1s |

### Usage Examples

**Circular Menu:**
```html
<div class="circular-menu" style="position: relative">
  <button class="center">+</button>
  
  <!-- 6 items evenly spaced (360°/6 = 60° apart) -->
  <button class="menu-item trig-pos-0 trig-radius-md">🏠</button>
  <button class="menu-item trig-pos-60 trig-radius-md">⚙️</button>
  <button class="menu-item trig-pos-120 trig-radius-md">📁</button>
  <button class="menu-item trig-pos-180 trig-radius-md">📝</button>
  <button class="menu-item trig-pos-240 trig-radius-md">🔍</button>
  <button class="menu-item trig-pos-300 trig-radius-md">❤️</button>
</div>

<style>
  .menu-item {
    position: absolute;
    top: 50%;
    left: 50%;
    /* Position is set by trig-pos-* classes */
  }
</style>
```

**Orbiting Animation:**
```html
<div class="solar-system">
  <div class="sun">☀️</div>
  <div class="planet trig-orbit trig-radius-lg trig-slow">🌍</div>
  <div class="moon trig-orbit trig-radius-sm trig-fast">🌙</div>
</div>
```

**Wave Text:**
```html
<div class="wave-text">
  <span class="trig-wave" style="--delay: 0">H</span>
  <span class="trig-wave" style="--delay: 0.1s">E</span>
  <span class="trig-wave" style="--delay: 0.2s">L</span>
  <span class="trig-wave" style="--delay: 0.3s">L</span>
  <span class="trig-wave" style="--delay: 0.4s">O</span>
</div>
```

**Pendulum Clock:**
```html
<div class="clock">
  <div class="pendulum trig-pendulum trig-slow">
    🔴
  </div>
</div>
```

**Custom Trig Calculation:**
```scss
// Position 8 items in a circle
@for $i from 0 through 7 {
  .circle-item:nth-child(#{$i + 1}) {
    $angle: $i * 45deg; // 360° / 8 = 45°
    transform: 
      translateX(calc(cos(#{$angle}) * 100px))
      translateY(calc(sin(#{$angle}) * 100px));
  }
}
```

### Browser Support
- Chrome 111+, Firefox 108+, Safari 15.4+
- Good modern support

---

## 20. CSS Shapes

### What is it?

CSS Shapes (`shape-outside`) allows text to wrap around custom shapes rather than just rectangular boxes. You can make text flow around circles, ellipses, polygons, or even the transparency of an image.

### The Problem it Solves

Traditional floats create rectangular text wraps:
```
+-------+  Text wraps around the
| Image |  rectangular box of the
+-------+  image, not its actual
           shape.
```

With `shape-outside`:
```
   /---\   Text wraps around the
  /     \  actual circular or
 /       \ custom shape of the
+----+----+element!
```

### How it Works

```css
.floated-image {
  float: left;
  width: 200px;
  height: 200px;
  shape-outside: circle(50%);  /* Text wraps around a circle! */
  shape-margin: 20px;          /* Space between shape and text */
}
```

**Shape Functions:**
- `circle(radius)` - Circular shape
- `ellipse(rx ry)` - Elliptical shape
- `inset(top right bottom left)` - Inset rectangle
- `polygon(x1 y1, x2 y2, ...)` - Custom polygon
- `url(image.png)` - Use image's alpha channel

### Available Classes

**Float Direction:**
| Class | Float |
|-------|-------|
| `.shape-float-left` | Float left |
| `.shape-float-right` | Float right |

**Shape Types:**
| Class | Shape |
|-------|-------|
| `.shape-circle` | Circle (50% radius) |
| `.shape-circle-sm` | Smaller circle (40%) |
| `.shape-circle-lg` | Larger circle (60%) |
| `.shape-ellipse` | Horizontal ellipse |
| `.shape-ellipse-tall` | Vertical ellipse |
| `.shape-inset-sm` | Small inset (5%) |
| `.shape-inset-md` | Medium inset (10%) |
| `.shape-inset-lg` | Large inset (20%) |

**Polygon Shapes:**
| Class | Shape |
|-------|-------|
| `.shape-triangle` | Triangle |
| `.shape-diamond` | Diamond/rhombus |
| `.shape-pentagon` | Pentagon |
| `.shape-hexagon` | Hexagon |
| `.shape-star` | Star shape |
| `.shape-arrow-right` | Right-pointing arrow |

**Shape Margin:**
| Class | Margin |
|-------|--------|
| `.shape-margin-sm` | 10px spacing |
| `.shape-margin-md` | 20px spacing |
| `.shape-margin-lg` | 40px spacing |

**Clip Path (Clips the Element Itself):**
| Class | Clips To |
|-------|----------|
| `.clip-circle` | Circle |
| `.clip-ellipse` | Ellipse |
| `.clip-triangle` | Triangle |
| `.clip-diamond` | Diamond |
| `.clip-hexagon` | Hexagon |

### Usage Examples

**Text Around Profile Photo:**
```html
<article>
  <img src="avatar.jpg" 
       class="shape-float-left shape-circle shape-margin-md"
       style="width: 150px; height: 150px; border-radius: 50%;">
  
  <p>This text flows beautifully around the circular profile 
     photo instead of creating an awkward rectangular gap. 
     The text hugs the round shape naturally, creating a much
     more elegant and magazine-like layout.</p>
</article>
```

**Pull Quote with Shape:**
```html
<article>
  <div class="shape-float-right shape-triangle shape-margin-lg"
       style="width: 200px;">
    <blockquote>
      "Design is not just what it looks like, design is how
      it works."
    </blockquote>
  </div>
  
  <p>Article text wraps around the triangular pull quote...</p>
</article>
```

**Magazine Layout:**
```html
<article class="magazine-article">
  <img src="irregular-image.png" 
       class="shape-float-left"
       style="shape-outside: url('irregular-image.png');
              shape-margin: 15px;">
  
  <p>Text will wrap around the actual shape of the image,
     following its transparent areas!</p>
</article>
```

**Decorative Shape:**
```html
<div class="shape-float-left shape-diamond shape-margin-md"
     style="width: 100px; height: 100px; background: var(--primary);">
</div>
<p>Text wraps around the diamond shape...</p>
```

**Using Clip-Path with Shape:**
```html
<img src="photo.jpg" 
     class="shape-float-left shape-hexagon clip-hexagon shape-margin-md"
     style="width: 200px; height: 200px;">
<!-- Image is clipped to hexagon AND text wraps around hexagon! -->
```

### Browser Support
- Chrome 37+, Firefox 62+, Safari 10.1+
- Excellent support!

---

## 21. OpenType Font Features

### What is it?

OpenType fonts contain many alternate characters and features that aren't used by default. CSS font-feature-settings and font-variant properties let you access ligatures, small caps, stylistic alternates, proper fractions, and more.

### The Problem it Solves

You're using a beautiful font, but:
- "fi" and "fl" don't combine into elegant ligatures
- Numbers don't align in tables
- "1st" doesn't show a proper superscript ordinal
- "1/2" looks ugly instead of using a proper fraction glyph
- You can't access the decorative alternate characters the font includes

### How it Works

**font-variant (High-level):**
```css
.text {
  font-variant-ligatures: common-ligatures;
  font-variant-numeric: tabular-nums;
  font-variant-caps: small-caps;
}
```

**font-feature-settings (Low-level):**
```css
.text {
  font-feature-settings: 
    "liga" 1,  /* Standard ligatures */
    "tnum" 1,  /* Tabular numbers */
    "smcp" 1;  /* Small caps */
}
```

### Available Classes

**Ligatures:**
| Class | Feature | Result |
|-------|---------|--------|
| `.font-ligatures` | Enable all ligatures | fi → ﬁ |
| `.font-common-ligatures` | Common only (fi, fl, ff) | Standard ligatures |
| `.font-discretionary-ligatures` | Decorative ligatures | Fancy combinations |
| `.font-no-ligatures` | Disable all | Keep separate |

**Numeric Features:**
| Class | Feature | Use Case |
|-------|---------|----------|
| `.font-tabular-nums` | Fixed-width numbers | Tables, alignment |
| `.font-proportional-nums` | Variable-width numbers | Body text |
| `.font-lining-nums` | Numbers align with caps | Headlines |
| `.font-oldstyle-nums` | Numbers with descenders | Body text, elegant |
| `.font-fractions` | Proper fractions | 1/2 → ½ |
| `.font-ordinal` | Ordinal indicators | 1st → 1ˢᵗ |
| `.font-slashed-zero` | Zero with slash | Distinguish 0 from O |

**Capitals:**
| Class | Feature | Result |
|-------|---------|--------|
| `.font-small-caps` | Small caps | lowercase → SMALL CAPS |
| `.font-all-small-caps` | Everything small caps | ALL → SMALL CAPS |
| `.font-petite-caps` | Even smaller | Smaller than small caps |
| `.font-titling-caps` | Titling capitals | Caps designed for headlines |

**Stylistic Alternates:**
| Class | Feature | Result |
|-------|---------|--------|
| `.font-stylistic-alt` | Alternate glyphs | Font-specific alternatives |
| `.font-swash` | Swash characters | Decorative flourishes |
| `.font-ornaments` | Ornamental characters | Decorative symbols |

**Other Features:**
| Class | Feature | Use |
|-------|---------|-----|
| `.font-kerning` | Enable kerning | Adjust letter spacing |
| `.font-no-kerning` | Disable kerning | Fixed spacing |
| `.font-contextual` | Contextual alternates | Based on surrounding letters |
| `.font-historical` | Historical forms | Old-style characters |

### Usage Examples

**Data Tables (Aligned Numbers):**
```html
<table class="font-tabular-nums font-lining-nums">
  <tr><td>$1,234.56</td></tr>
  <tr><td>  $987.65</td></tr>
  <tr><td>   $12.34</td></tr>
  <!-- All decimals align perfectly! -->
</table>
```

**Elegant Body Text:**
```html
<article class="font-ligatures font-oldstyle-nums font-kerning">
  <p>The finefficacy of beautiful typography in 2024...</p>
  <!-- "fi" and "ff" form ligatures, numbers blend with text -->
</article>
```

**Fractions in Recipes:**
```html
<p class="font-fractions">
  Add 1/2 cup flour, 3/4 teaspoon salt, and 1/4 cup sugar.
</p>
<!-- Displays as ½ ¾ ¼ -->
```

**Ordinals in Dates:**
```html
<time class="font-ordinal">January 1st, 2024</time>
<!-- "st" becomes proper superscript -->
```

**Small Caps for Acronyms:**
```html
<p>The <span class="font-small-caps">HTML</span> and 
   <span class="font-small-caps">CSS</span> specifications...</p>
<!-- Acronyms are less shouty -->
```

**Programming Font:**
```html
<code class="font-slashed-zero font-no-ligatures">
  if (value === 0) { return null; }
</code>
<!-- Zero is distinguishable from O, no unexpected ligatures -->
```

**Decorative Headings:**
```html
<h1 class="font-swash font-stylistic-alt">
  Elegant Wedding Invitation
</h1>
<!-- Uses font's decorative alternates -->
```

### Browser Support
- Chrome 48+, Firefox 34+, Safari 9.1+
- Excellent support! (Features depend on font)

---

## 22. Interpolate Size

### What is it?

`interpolate-size` is a CSS property that enables smooth animations/transitions to and from intrinsic sizing keywords like `auto`, `min-content`, `max-content`, and `fit-content`. This finally solves the "animate height to auto" problem!

### The Problem it Solves

The biggest CSS animation frustration:
```css
.panel {
  height: 0;
  overflow: hidden;
  transition: height 0.3s;
}

.panel.open {
  height: auto; /* DOESN'T ANIMATE! Just snaps. */
}
```

You couldn't animate to `height: auto` because browsers don't know how to interpolate between `0` and `auto`.

**Workarounds were painful:**
- JavaScript to measure height, then set explicit pixel value
- `max-height` hack (animate to very large value)
- CSS Grid tricks

**Now with interpolate-size:**
```css
:root {
  interpolate-size: allow-keywords; /* Enable globally! */
}

.panel {
  height: 0;
  transition: height 0.3s;
}

.panel.open {
  height: auto; /* NOW IT ANIMATES SMOOTHLY! */
}
```

### How it Works

```css
/* Enable on root for entire page */
:root {
  interpolate-size: allow-keywords;
}

/* Or enable on specific element */
.collapsible-container {
  interpolate-size: allow-keywords;
}
```

Once enabled, these transitions work:
- `height: 0` ↔ `height: auto`
- `width: 200px` ↔ `width: fit-content`
- `height: 100px` ↔ `height: min-content`

### Available Classes

**Enable Interpolation:**
| Class | Scope |
|-------|-------|
| `.interpolate-size` | Enable on element and children |
| `.interpolate-size-off` | Disable (numeric only) |

**Collapsible Components:**
| Class | State | Height |
|-------|-------|--------|
| `.collapse` | Collapsed | height: 0 |
| `.collapse.open` | Expanded | height: auto |
| `.collapse-content` | Content wrapper | Proper overflow handling |

**Pre-Built Animations:**
| Class | Animation |
|-------|----------|
| `.expand-enter` | Animate from 0 to auto |
| `.expand-leave` | Animate from auto to 0 |
| `.slide-height` | Smooth height changes |

**Timing:**
| Class | Duration |
|-------|----------|
| `.collapse-fast` | 150ms |
| `.collapse-normal` | 300ms |
| `.collapse-slow` | 500ms |

### Usage Examples

**Simple Collapsible Panel:**
```html
<div class="interpolate-size">
  <button onclick="this.nextElementSibling.classList.toggle('open')">
    Toggle Panel
  </button>
  
  <div class="collapse collapse-normal">
    <div class="collapse-content">
      <p>This content smoothly animates!</p>
      <p>No matter how tall it is.</p>
      <p>Even with dynamic content.</p>
    </div>
  </div>
</div>

<style>
  .collapse {
    height: 0;
    overflow: hidden;
    transition: height 0.3s ease;
  }
  .collapse.open {
    height: auto;
  }
</style>
```

**FAQ Accordion:**
```html
<div class="faq interpolate-size">
  <details>
    <summary>How does shipping work?</summary>
    <div class="collapse open">
      <p>We ship worldwide! Standard shipping takes 5-7 days...</p>
    </div>
  </details>
  
  <details>
    <summary>What's your return policy?</summary>
    <div class="collapse open">
      <p>30-day returns on all items...</p>
    </div>
  </details>
</div>
```

**Animated Cards:**
```html
<style>
  :root {
    interpolate-size: allow-keywords;
  }
  
  .expandable-card {
    height: 100px;
    transition: height 0.4s ease;
    overflow: hidden;
  }
  
  .expandable-card:hover,
  .expandable-card:focus-within {
    height: auto; /* Smoothly expands! */
  }
</style>

<article class="expandable-card">
  <h3>Product Title</h3>
  <p>Short preview...</p>
  
  <!-- Hidden until hover -->
  <div class="extra-details">
    <p>Full description appears smoothly on hover!</p>
    <button>Add to Cart</button>
  </div>
</article>
```

**Responsive Width Animation:**
```css
:root {
  interpolate-size: allow-keywords;
}

.sidebar {
  width: 60px;
  transition: width 0.3s;
}

.sidebar:hover,
.sidebar.expanded {
  width: max-content; /* Expands to fit content! */
}
```

**Angular Accordion:**
```typescript
@Component({
  selector: 'app-accordion',
  template: `
    <div class="interpolate-size">
      <button (click)="isOpen = !isOpen">
        {{ title }}
        <span>{{ isOpen ? '▲' : '▼' }}</span>
      </button>
      <div class="collapse" [class.open]="isOpen">
        <div class="collapse-content">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .collapse {
      height: 0;
      overflow: hidden;
      transition: height 0.3s ease-out;
    }
    .collapse.open {
      height: auto;
    }
  `]
})
export class AccordionComponent {
  @Input() title = 'Expand';
  isOpen = false;
}
```

### Browser Support
- Chrome 129+
- Firefox & Safari: Not yet supported
- Progressive enhancement: Falls back to instant toggle

---

## 23. Starting Style

### What is it?

`@starting-style` lets you define the initial styles for an element when it first appears, enabling CSS-only entry animations without JavaScript. The element transitions FROM the starting style TO its regular styles.

### The Problem it Solves

Before @starting-style, animating element entry required:
- JavaScript to add/remove animation classes
- `animation-fill-mode: forwards` hacks
- setTimeout delays to trigger transitions
- Complex frameworks for orchestrating entrances

Now it's pure CSS:
```css
.card {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.3s;
  
  @starting-style {
    opacity: 0;
    transform: translateY(20px);
  }
}
/* Card fades in and slides up automatically when it enters the DOM! */
```

### How it Works

1. Element is added to DOM (or becomes visible via `display: none` → `display: block`)
2. Browser first applies `@starting-style` rules
3. Then transitions to the element's regular styles
4. The `transition` property controls the animation

```css
dialog {
  opacity: 1;
  scale: 1;
  transition: opacity 0.3s, scale 0.3s;
  
  @starting-style {
    opacity: 0;
    scale: 0.9;
  }
}
/* Dialog fades and scales in when opened! */
```

### Available Classes

**Fade Animations:**
| Class | Entry Effect |
|-------|-------------|
| `.entry-fade` | Fade in (opacity 0→1) |
| `.entry-fade-up` | Fade + slide up |
| `.entry-fade-down` | Fade + slide down |
| `.entry-fade-left` | Fade + slide from left |
| `.entry-fade-right` | Fade + slide from right |

**Slide Animations:**
| Class | Entry Effect |
|-------|-------------|
| `.entry-slide-up` | Slide up from below |
| `.entry-slide-down` | Slide down from above |
| `.entry-slide-left` | Slide in from left |
| `.entry-slide-right` | Slide in from right |

**Scale Animations:**
| Class | Entry Effect |
|-------|-------------|
| `.entry-scale` | Scale from 0 to 1 |
| `.entry-scale-up` | Scale from smaller |
| `.entry-scale-down` | Scale from larger |

**Other Animations:**
| Class | Entry Effect |
|-------|-------------|
| `.entry-rotate` | Rotate in |
| `.entry-blur` | Blur to clear |
| `.entry-bounce` | Bounce effect |
| `.entry-flip` | 3D flip |

**Timing:**
| Class | Duration |
|-------|----------|
| `.entry-fast` | 150ms |
| `.entry-normal` | 300ms |
| `.entry-slow` | 500ms |
| `.entry-delay-100` | 100ms delay |
| `.entry-delay-200` | 200ms delay |
| `.entry-delay-300` | 300ms delay |
| `.entry-delay-500` | 500ms delay |

**Stagger Children:**
| Class | Effect |
|-------|--------|
| `.entry-stagger` | Children animate in sequence |
| `.entry-stagger-fast` | Faster stagger (50ms) |
| `.entry-stagger-slow` | Slower stagger (150ms) |

### Usage Examples

**Modal Entry Animation:**
```html
<dialog id="my-modal" class="entry-fade entry-scale entry-normal">
  <h2>Welcome!</h2>
  <p>This modal fades and scales in.</p>
  <button onclick="this.closest('dialog').close()">Close</button>
</dialog>

<button onclick="document.getElementById('my-modal').showModal()">
  Open Modal
</button>
```

**Toast Notifications:**
```html
<div class="toast-container">
  <div class="toast entry-slide-right entry-fast">
    Success! Your changes were saved.
  </div>
</div>
```

**Staggered List:**
```html
<ul class="entry-stagger">
  <li class="entry-fade-up">First item</li>
  <li class="entry-fade-up">Second item (slight delay)</li>
  <li class="entry-fade-up">Third item (more delay)</li>
  <li class="entry-fade-up">Fourth item (even more delay)</li>
</ul>

<style>
  .entry-stagger > * {
    --stagger-delay: calc(var(--child-index, 0) * 100ms);
    animation-delay: var(--stagger-delay);
  }
  .entry-stagger > :nth-child(1) { --child-index: 0; }
  .entry-stagger > :nth-child(2) { --child-index: 1; }
  .entry-stagger > :nth-child(3) { --child-index: 2; }
  .entry-stagger > :nth-child(4) { --child-index: 3; }
</style>
```

**Card Grid Entry:**
```html
<div class="card-grid">
  @for (card of cards; track card.id; let i = $index) {
    <article class="card entry-fade-up entry-normal"
             [style.animation-delay.ms]="i * 100">
      <h3>{{ card.title }}</h3>
      <p>{{ card.description }}</p>
    </article>
  }
</div>
```

**Popover Entry:**
```html
<div popover class="tooltip entry-scale entry-fade entry-fast">
  Helpful tooltip text!
</div>
```

**Custom Starting Style:**
```scss
.custom-entry {
  opacity: 1;
  transform: translateX(0) rotate(0deg);
  filter: blur(0);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  
  @starting-style {
    opacity: 0;
    transform: translateX(-50px) rotate(-10deg);
    filter: blur(4px);
  }
}
```

### Browser Support
- Chrome 117+, Safari 17.5+
- Firefox: Not yet supported
- Progressive enhancement: Element just appears without animation

---

## 24. CSS Highlight API

### What is it?

The CSS Custom Highlight API allows you to style arbitrary text ranges without modifying the DOM. You define ranges in JavaScript and style them with `::highlight()` pseudo-element in CSS.

### The Problem it Solves

Traditional text highlighting requires DOM manipulation:
```javascript
// Old way - modifies DOM
text = text.replace(searchTerm, `<mark>${searchTerm}</mark>`);
```

Problems:
- Changes DOM structure
- Breaks event listeners
- Performance issues with large text
- Can't overlap highlights

**Highlight API:**
```javascript
// New way - no DOM changes!
const range = new Range();
range.setStart(textNode, 0);
range.setEnd(textNode, 5);

const highlight = new Highlight(range);
CSS.highlights.set('my-highlight', highlight);
```
```css
::highlight(my-highlight) {
  background-color: yellow;
  color: black;
}
```

### How it Works

1. **JavaScript:** Create Range objects for text to highlight
2. **JavaScript:** Create Highlight from ranges, register with name
3. **CSS:** Style with `::highlight(name)` pseudo-element

```javascript
// 1. Create text range
const range = new Range();
range.setStart(node, startOffset);
range.setEnd(node, endOffset);

// 2. Create highlight and register
const highlight = new Highlight(range);
CSS.highlights.set('search-results', highlight);

// 3. Can add multiple ranges to same highlight
highlight.add(anotherRange);
highlight.add(yetAnotherRange);
```

### Available Classes (CSS Styling)

**Semantic Highlights:**
| Highlight Name | Use Case |
|----------------|----------|
| `search` | Search results |
| `selection` | Custom selection style |
| `error` | Error highlighting |
| `warning` | Warning highlighting |
| `success` | Success highlighting |
| `info` | Informational highlighting |

**Code Highlights:**
| Highlight Name | Use Case |
|----------------|----------|
| `code-keyword` | Keywords |
| `code-string` | Strings |
| `code-comment` | Comments |
| `code-number` | Numbers |
| `code-function` | Function names |

**Pre-Defined Styles:**
```scss
::highlight(search) {
  background-color: oklch(90% 0.15 90); // Yellow
  color: black;
}

::highlight(error) {
  background-color: oklch(30% 0.15 25); // Dark red
  color: white;
  text-decoration: wavy underline red;
}

::highlight(warning) {
  background-color: oklch(35% 0.12 70); // Dark orange
  color: white;
}

::highlight(success) {
  background-color: oklch(35% 0.12 145); // Dark green
  color: white;
}
```

### Usage Examples

**Search Highlighting:**
```typescript
// search.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SearchHighlightService {
  private searchHighlight = new Highlight();
  
  constructor() {
    CSS.highlights.set('search', this.searchHighlight);
  }
  
  highlightMatches(searchTerm: string, container: HTMLElement) {
    // Clear previous
    this.searchHighlight.clear();
    
    if (!searchTerm) return;
    
    // Walk through text nodes
    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT
    );
    
    const regex = new RegExp(searchTerm, 'gi');
    let node: Text | null;
    
    while (node = walker.nextNode() as Text) {
      const text = node.textContent || '';
      let match;
      
      while ((match = regex.exec(text)) !== null) {
        const range = new Range();
        range.setStart(node, match.index);
        range.setEnd(node, match.index + match[0].length);
        this.searchHighlight.add(range);
      }
    }
  }
}
```

```scss
// styles.scss
::highlight(search) {
  background-color: yellow;
  color: black;
}
```

```html
<!-- component.html -->
<input type="search" (input)="onSearch($event)" placeholder="Search...">
<article #content>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
</article>
```

**Spell Check Highlighting:**
```javascript
function highlightMisspellings(element, misspelledWords) {
  const errorHighlight = new Highlight();
  
  misspelledWords.forEach(word => {
    const ranges = findWordRanges(element, word);
    ranges.forEach(range => errorHighlight.add(range));
  });
  
  CSS.highlights.set('spelling-error', errorHighlight);
}
```

```css
::highlight(spelling-error) {
  text-decoration: wavy underline red;
  text-decoration-skip-ink: none;
}
```

**Syntax Highlighting (Code Editor):**
```javascript
function highlightCode(codeElement) {
  const keywords = new Highlight();
  const strings = new Highlight();
  const comments = new Highlight();
  
  // Parse and categorize code tokens...
  // Add ranges to appropriate highlights
  
  CSS.highlights.set('code-keyword', keywords);
  CSS.highlights.set('code-string', strings);
  CSS.highlights.set('code-comment', comments);
}
```

```css
::highlight(code-keyword) { color: #c678dd; }
::highlight(code-string) { color: #98c379; }
::highlight(code-comment) { color: #5c6370; font-style: italic; }
```

**Feature Detection:**
```javascript
if (CSS.highlights) {
  // Highlight API supported
  setupHighlighting();
} else {
  // Fallback to DOM manipulation
  setupLegacyHighlighting();
}
```

### Browser Support
- Chrome 105+
- Firefox & Safari: Not yet supported
- Always use feature detection!

---

## 25. CSS @scope

### What is it?

`@scope` is a CSS at-rule that limits style rules to a specific subtree of the DOM and can optionally stop at certain boundaries. It provides true style encapsulation without Shadow DOM.

### The Problem it Solves

CSS has always been global:
```css
/* This affects EVERY .title on the page! */
.card .title {
  font-size: 1.5rem;
}
```

Workarounds had drawbacks:
- BEM naming (`.card__title`) - verbose, error-prone
- CSS Modules - requires tooling
- Shadow DOM - full encapsulation but complex

**@scope provides:**
- Limit styles to a subtree (scoping)
- Define where styles stop (scope limits)
- Lower specificity than ID selectors
- No tooling required

### How it Works

**Basic Scoping:**
```css
@scope (.card) {
  /* :scope refers to .card itself */
  :scope {
    border: 1px solid gray;
  }
  
  /* This .title only matches inside .card */
  .title {
    font-size: 1.5rem;
  }
  
  .content {
    padding: 1rem;
  }
}
```

**Scoping with Limits:**
```css
@scope (.article) to (.comments) {
  /* Styles apply inside .article but STOP at .comments */
  p {
    font-size: 1.1rem;
    line-height: 1.8;
  }
}
/* Paragraphs in .comments keep their default styles! */
```

### Available Classes

**Scope Containers:**
| Class | Purpose |
|-------|----------|
| `.scope-card` | Scoped card component |
| `.scope-article` | Scoped article |
| `.scope-widget` | Scoped widget |
| `.scope-form` | Scoped form |
| `.scope-modal` | Scoped modal |
| `.scope-nav` | Scoped navigation |

**Scope Boundaries:**
| Class | Purpose |
|-------|----------|
| `.scope-boundary` | Stop scope propagation |
| `.scope-end` | Explicit scope terminator |

**Pre-Built Scoped Components:**
```scss
@scope (.scope-card) {
  :scope {
    display: flex;
    flex-direction: column;
    border-radius: 0.5rem;
    overflow: hidden;
  }
  
  .header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border);
  }
  
  .title {
    margin: 0;
    font-size: 1.25rem;
  }
  
  .body {
    padding: 1.5rem;
    flex: 1;
  }
  
  .footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--border);
  }
}
```

### Usage Examples

**Scoped Card Component:**
```html
<div class="scope-card">
  <div class="header">
    <h2 class="title">Card Title</h2>
    <p class="subtitle">Subtitle here</p>
  </div>
  <div class="body">
    <p>Card content goes here...</p>
  </div>
  <div class="footer">
    <button>Action</button>
  </div>
</div>

<!-- These same class names outside .scope-card are unaffected! -->
<h2 class="title">Page Title</h2> <!-- Different styles -->
```

**Article with Comment Boundary:**
```html
<article class="scope-article">
  <h1>Article Title</h1>
  <p>Article content with special styling...</p>
  <p>More article content...</p>
  
  <!-- Styles STOP here -->
  <section class="comments scope-boundary">
    <h2>Comments</h2>
    <p>Comments have default styles, not article styles.</p>
  </section>
</article>
```

```css
@scope (.scope-article) to (.scope-boundary) {
  p {
    font-size: 1.2rem;
    line-height: 1.8;
    color: var(--text-primary);
  }
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
}
```

**Multiple Nested Scopes:**
```html
<div class="scope-nav">
  <a class="link">Home</a>      <!-- Nav link styles -->
  <a class="link">About</a>
  
  <div class="scope-card">      <!-- Nested scope -->
    <a class="link">Card link</a> <!-- Card link styles -->
  </div>
</div>
```

**Form Isolation:**
```html
<form class="scope-form">
  <div class="field">
    <label class="label">Username</label>
    <input class="input" type="text">
    <span class="error">Required</span>
  </div>
</form>

<!-- .error outside form isn't styled as form error -->
<div class="error">This is a different error style</div>
```

**Using :scope Selector:**
```css
@scope (.card) {
  /* :scope refers to .card itself */
  :scope {
    display: grid;
    gap: 1rem;
  }
  
  /* Direct children only */
  :scope > .section {
    padding: 1rem;
  }
}
```

### Browser Support
- Chrome 118+, Safari 17.4+
- Firefox: Not yet supported
- Progressive enhancement: Use with existing specificity patterns as fallback

---

## 26. Custom Counter Styles

### What is it?

`@counter-style` lets you create custom list markers, numbering systems, and bullet styles. You can use emojis, images, or create entirely new numbering systems.

### The Problem it Solves

Built-in list styles are limited:
- `decimal` - 1, 2, 3
- `lower-alpha` - a, b, c
- `disc` - •
- A handful of others

What if you want:
- Emoji bullets: 👉 ✅ ⭐
- Custom symbols: ➜ ◆ ▸
- Different numbering: Ⅰ Ⅱ Ⅲ (Roman with parentheses)
- Cycling patterns: ● ○ ● ○

**@counter-style lets you define all of these!**

### How it Works

```css
@counter-style emoji-list {
  system: cyclic;                    /* Cycle through symbols */
  symbols: "👉" "✅" "⭐" "💡" "🔥";   /* The markers */
  suffix: " ";                       /* Space after marker */
}

ul.emoji {
  list-style-type: emoji-list;
}
```

**System Types:**
| System | Description | Example |
|--------|-------------|----------|
| `cyclic` | Repeat symbols in order | • ◦ • ◦ |
| `fixed` | Use each symbol once, then fallback | A B C 4 5 |
| `symbolic` | Repeat each symbol (1x, 2x, 3x...) | * ** *** |
| `alphabetic` | Like letters (a-z, aa-zz) | a b c ... aa |
| `numeric` | Positional numerals | 0 1 2 ... 10 |
| `additive` | Roman-numeral style | I II III IV |

### Available Counter Styles

**Emoji Styles:**
| Class | Markers |
|-------|----------|
| `.list-emoji` | 🔹 🔸 💠 ✨ |
| `.list-emoji-check` | ✅ ✅ ✅ |
| `.list-emoji-star` | ⭐ ⭐ ⭐ |
| `.list-emoji-arrow` | 👉 👉 👉 |
| `.list-emoji-fire` | 🔥 🔥 🔥 |

**Symbol Styles:**
| Class | Markers |
|-------|----------|
| `.list-arrows` | ➜ ➜ ➜ |
| `.list-checkmarks` | ✓ ✓ ✓ |
| `.list-diamonds` | ◆ ◆ ◆ |
| `.list-triangles` | ▸ ▸ ▸ |
| `.list-squares` | ■ ■ ■ |

**Numbering Variations:**
| Class | Markers |
|-------|----------|
| `.list-paren` | (1) (2) (3) |
| `.list-bracket` | [1] [2] [3] |
| `.list-dot` | 1. 2. 3. |
| `.list-roman-paren` | (i) (ii) (iii) |
| `.list-alpha-paren` | (a) (b) (c) |

### Usage Examples

**Feature List with Emojis:**
```html
<ul class="list-emoji-check">
  <li>Easy to use</li>
  <li>Fast performance</li>
  <li>Great documentation</li>
</ul>
<!-- ✅ Easy to use
     ✅ Fast performance
     ✅ Great documentation -->
```

**Custom Counter Style:**
```css
@counter-style steps {
  system: fixed;
  symbols: "➀" "➁" "➂" "➃" "➄" "➅" "➆" "➇" "➈" "➉";
}

.step-list {
  list-style-type: steps;
}
```

```html
<ol class="step-list">
  <li>First step</li>
  <li>Second step</li>
  <li>Third step</li>
</ol>
<!-- ➀ First step
     ➁ Second step
     ➂ Third step -->
```

**Cycling Symbols:**
```css
@counter-style alternating {
  system: cyclic;
  symbols: "●" "○";
  suffix: " ";
}
```

```html
<ul style="list-style-type: alternating">
  <li>Filled circle</li>
  <li>Empty circle</li>
  <li>Filled circle again</li>
</ul>
<!-- ● Filled circle
     ○ Empty circle
     ● Filled circle again -->
```

**Legal Document Numbering:**
```css
@counter-style legal {
  system: fixed;
  symbols: "I" "II" "III" "IV" "V" "VI" "VII" "VIII" "IX" "X";
  suffix: ". ";
}

.legal-list {
  list-style-type: legal;
  padding-left: 3rem;
}
```

**Nested Lists:**
```html
<ol class="list-roman-paren">
  <li>First section
    <ol class="list-alpha-paren">
      <li>Subsection a</li>
      <li>Subsection b</li>
    </ol>
  </li>
  <li>Second section</li>
</ol>
<!-- (i) First section
       (a) Subsection a
       (b) Subsection b
     (ii) Second section -->
```

### Browser Support
- Chrome 91+, Firefox 33+, Safari 17+
- Good support!

---

## 27. Font Palette

### What is it?

`font-palette` and `@font-palette-values` let you control the colors in color fonts (COLRv0/COLRv1 fonts like Noto Color Emoji or custom color fonts).

### The Problem it Solves

Color fonts have built-in palettes, but:
- Can't match your brand colors
- Dark/light mode needs different palettes
- No way to customize specific colors

**font-palette provides:**
- Select from font's built-in palettes
- Override specific colors in a palette
- Create custom palettes
- Animate between palettes

### How it Works

**Using Built-in Palettes:**
```css
.emoji {
  font-palette: light;  /* Use font's light palette */
}

.emoji-dark {
  font-palette: dark;   /* Use font's dark palette */
}
```

**Creating Custom Palettes:**
```css
@font-palette-values --brand-palette {
  font-family: "My Color Font";
  base-palette: 0;                /* Start with palette 0 */
  override-colors: 
    0 #3b82f6,    /* Override color index 0 with blue */
    1 #10b981,    /* Override color index 1 with green */
    2 #f59e0b;    /* Override color index 2 with yellow */
}

.branded-icon {
  font-family: "My Color Font";
  font-palette: --brand-palette;
}
```

### Available Classes

**Built-in Palettes:**
| Class | Palette |
|-------|----------|
| `.font-palette-normal` | Default palette |
| `.font-palette-light` | Light variant |
| `.font-palette-dark` | Dark variant |

**Numbered Palettes:**
| Class | Palette Index |
|-------|---------------|
| `.font-palette-0` | Palette 0 |
| `.font-palette-1` | Palette 1 |
| `.font-palette-2` | Palette 2 |
| `.font-palette-3` | Palette 3 |

**Semantic Palettes:**
| Class | Use |
|-------|-----|
| `.font-palette-primary` | Brand primary colors |
| `.font-palette-secondary` | Brand secondary |
| `.font-palette-muted` | Desaturated |
| `.font-palette-vibrant` | High saturation |

### Usage Examples

**Dark Mode Emoji:**
```html
<span class="emoji font-palette-light">😊</span> <!-- Day mode -->
<span class="emoji font-palette-dark">😊</span>  <!-- Night mode -->
```

```scss
// Auto-switch based on color scheme
.emoji {
  font-palette: light;
  
  @media (prefers-color-scheme: dark) {
    font-palette: dark;
  }
}
```

**Brand-Colored Icons:**
```css
@font-palette-values --my-brand {
  font-family: "Icon Font";
  base-palette: 0;
  override-colors:
    0 var(--primary),    /* Main color */
    1 var(--secondary),  /* Accent color */
    2 var(--background); /* Background */
}

.icon {
  font-family: "Icon Font";
  font-palette: --my-brand;
}
```

**Theme Toggle:**
```html
<button onclick="togglePalette()">
  <span class="icon" id="theme-icon">🌈</span>
</button>

<script>
  function togglePalette() {
    const icon = document.getElementById('theme-icon');
    icon.classList.toggle('font-palette-light');
    icon.classList.toggle('font-palette-dark');
  }
</script>
```

**Animated Palette (with @property):**
```css
/* Define animatable palettes using CSS Custom Properties */
@property --palette-blend {
  syntax: '<number>';
  initial-value: 0;
  inherits: false;
}

.animated-icon {
  --palette-blend: 0;
  transition: --palette-blend 0.3s;
}

.animated-icon:hover {
  --palette-blend: 1;
}
```

### Browser Support
- Chrome 101+, Firefox 107+, Safari 15.4+
- Good support, but font must be a color font (COLRv0/COLRv1)

---

## 28. CSS Nesting

### What is it?

Native CSS Nesting allows you to nest style rules inside other rules, just like in Sass/SCSS. This is now built into CSS - no preprocessor needed!

### The Problem it Solves

Flat CSS is repetitive:
```css
/* Repetitive selectors */
.card { border: 1px solid gray; }
.card .header { padding: 1rem; }
.card .header .title { font-size: 1.5rem; }
.card .header .title:hover { color: blue; }
.card .body { padding: 1rem; }
.card .footer { padding: 0.5rem; }
```

**With CSS Nesting:**
```css
.card {
  border: 1px solid gray;
  
  .header {
    padding: 1rem;
    
    .title {
      font-size: 1.5rem;
      
      &:hover {
        color: blue;
      }
    }
  }
  
  .body {
    padding: 1rem;
  }
  
  .footer {
    padding: 0.5rem;
  }
}
```

### How it Works

**Basic Nesting:**
```css
.parent {
  color: black;
  
  .child {
    color: blue;  /* .parent .child */
  }
}
```

**Using & (Parent Reference):**
```css
.button {
  background: blue;
  
  &:hover {
    background: darkblue;  /* .button:hover */
  }
  
  &:active {
    background: navy;      /* .button:active */
  }
  
  &.large {
    font-size: 1.5rem;     /* .button.large */
  }
}
```

**Nesting Media Queries:**
```css
.sidebar {
  width: 300px;
  
  @media (max-width: 768px) {
    width: 100%;           /* Applies to .sidebar at this breakpoint */
  }
}
```

### Available Classes (Pre-Built Patterns)

**Nested Component Classes:**
| Class | Description |
|-------|-------------|
| `.nest-card` | Card with nested styles |
| `.nest-button` | Button with states |
| `.nest-input` | Input with states |
| `.nest-nav` | Navigation component |
| `.nest-list` | Styled list |
| `.nest-article` | Article layout |
| `.nest-form` | Form with fields |
| `.nest-modal` | Modal structure |

### Usage Examples

**Complete Button Component:**
```css
.button {
  /* Base styles */
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
  
  /* States */
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
  
  /* Variants */
  &.primary {
    background: var(--primary);
    color: white;
    
    &:hover {
      background: var(--primary-dark);
    }
  }
  
  &.secondary {
    background: transparent;
    border: 1px solid var(--primary);
    color: var(--primary);
    
    &:hover {
      background: var(--primary-light);
    }
  }
  
  /* Sizes */
  &.sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }
  
  &.lg {
    padding: 0.75rem 1.5rem;
    font-size: 1.125rem;
  }
}
```

**Card Component:**
```css
.card {
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  
  .header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border);
    
    .title {
      margin: 0;
      font-size: 1.25rem;
    }
    
    .subtitle {
      margin: 0.25rem 0 0;
      color: var(--text-muted);
      font-size: 0.875rem;
    }
  }
  
  .body {
    padding: 1.5rem;
    
    > p:first-child {
      margin-top: 0;
    }
    
    > p:last-child {
      margin-bottom: 0;
    }
  }
  
  .footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }
  
  /* Card Variants */
  &.elevated {
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  }
  
  &.bordered {
    border: 1px solid var(--border);
    box-shadow: none;
  }
  
  /* Responsive */
  @media (max-width: 640px) {
    .header,
    .body,
    .footer {
      padding: 1rem;
    }
  }
}
```

**Form with Nesting:**
```css
.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  .field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    
    .label {
      font-weight: 500;
      font-size: 0.875rem;
    }
    
    .input {
      padding: 0.5rem;
      border: 1px solid var(--border);
      border-radius: 0.25rem;
      
      &:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 3px var(--primary-light);
      }
      
      &:invalid {
        border-color: var(--error);
      }
    }
    
    .error {
      color: var(--error);
      font-size: 0.75rem;
    }
    
    .hint {
      color: var(--text-muted);
      font-size: 0.75rem;
    }
  }
  
  .actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
    margin-top: 0.5rem;
  }
}
```

**Navigation Menu:**
```css
.nav {
  display: flex;
  gap: 0.5rem;
  
  .link {
    padding: 0.5rem 1rem;
    text-decoration: none;
    color: var(--text);
    border-radius: 0.25rem;
    transition: all 0.2s;
    
    &:hover {
      background: var(--bg-hover);
    }
    
    &.active {
      background: var(--primary);
      color: white;
    }
    
    /* Nested dropdown */
    &:has(.dropdown) {
      position: relative;
      
      .dropdown {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        min-width: 200px;
        background: white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        border-radius: 0.25rem;
        
        .item {
          padding: 0.5rem 1rem;
          
          &:hover {
            background: var(--bg-hover);
          }
        }
      }
      
      &:hover .dropdown {
        display: block;
      }
    }
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
}
```

### Browser Support
- Chrome 120+, Firefox 117+, Safari 17.2+
- Good modern support!
- The `&` syntax works in all supporting browsers

---

## 29. Color Mix

### What is it?

The CSS `color-mix()` function allows you to mix two colors together in any color space, creating smooth transitions, tints, shades, and alpha variations without needing preprocessor functions.

### The Problem it Solves

Before `color-mix()`:
- Creating tints/shades required Sass/Less functions
- Alpha variations needed separate color definitions
- Mixing brand colors dynamically was impossible in pure CSS
- Responsive color adjustments required JavaScript

### How it Works

```css
/* Mix two colors 50/50 in sRGB */
color-mix(in srgb, blue, red) /* = purple */

/* Mix with different percentages */
color-mix(in srgb, blue 70%, red 30%) /* more blue */

/* Mix in perceptually uniform OKLCH */
color-mix(in oklch, var(--primary), white 30%) /* tint */
```

### Available Classes

| Class | Effect | Description |
|-------|--------|-------------|
| `.tint-primary-10` to `.tint-primary-50` | Tint | Mix primary with white |
| `.shade-primary-10` to `.shade-primary-50` | Shade | Mix primary with black |
| `.bg-alpha-10` to `.bg-alpha-90` | Alpha | Transparent variations |
| `.mix-oklch` | Color space | Use OKLCH for mixing |
| `.mix-srgb` | Color space | Use sRGB for mixing |
| `.bg-mixed` | Custom mix | Mix two custom colors |
| `.gradient-mixed` | Gradients | Gradients with mixed colors |
| `.overlay-primary` | Overlay | Semi-transparent primary overlay |
| `.scrim-dark` | Scrim | Dark overlay for text readability |

### Usage Examples

**Creating Tints and Shades:**
```html
<button class="bg-primary">Primary</button>
<button class="tint-primary-20">Light Primary</button>
<button class="shade-primary-20">Dark Primary</button>
```

**Transparent Overlays:**
```html
<div class="image-card">
  <img src="hero.jpg" />
  <div class="overlay-dark scrim-dark">
    <h2>Readable Text on Image</h2>
  </div>
</div>
```

**Perceptually Uniform Mixing (OKLCH):**
```html
<!-- OKLCH produces smoother, more natural color transitions -->
<div class="mix-oklch gradient-mixed">
  Smooth gradient using OKLCH color space
</div>
```

### Browser Support
- Chrome 111+, Firefox 113+, Safari 16.2+
- Production ready with fallbacks

---

## 30. Light-Dark Function

### What is it?

The CSS `light-dark()` function automatically chooses between two color values based on the user's color scheme preference, without requiring media queries or JavaScript.

### The Problem it Solves

Before `light-dark()`:
- Dark mode required duplicate CSS with media queries
- Color variables needed separate light/dark definitions
- JavaScript was often needed for theme switching
- Code duplication was significant for theme support

### How it Works

```css
/* Container needs color-scheme */
:root {
  color-scheme: light dark;
}

/* Automatic light/dark values */
.element {
  color: light-dark(#333, #eee);         /* text */
  background: light-dark(white, #1a1a1a); /* bg */
}
```

### Available Classes

| Class | Effect | Description |
|-------|--------|-------------|
| `.text-ld` | Text color | Auto light/dark text |
| `.bg-ld` | Background | Auto light/dark background |
| `.border-ld` | Border | Auto light/dark border |
| `.card-ld` | Card | Complete card styling |
| `.surface-ld-1` to `.surface-ld-3` | Surface | Elevation surfaces |
| `.divider-ld` | Divider | Auto divider color |
| `.input-ld` | Input | Form input styling |
| `.shadow-ld` | Shadow | Appropriate shadows |
| `.scrollbar-ld` | Scrollbar | Themed scrollbar |

### Usage Examples

**Automatic Dark Mode Card:**
```html
<div class="card-ld">
  <h2 class="text-ld">Title</h2>
  <p class="text-ld">Content that automatically adapts to dark mode</p>
  <hr class="divider-ld">
  <input class="input-ld" placeholder="Auto-themed input">
</div>
```

**Surface Elevation:**
```html
<div class="surface-ld-1">Base surface</div>
<div class="surface-ld-2">Elevated surface</div>
<div class="surface-ld-3">Highest elevation</div>
```

### Browser Support
- Chrome 123+, Firefox 120+, Safari 17.5+
- Use with fallbacks for older browsers

---

## 31. Relative Color Syntax

### What is it?

Relative Color Syntax allows you to create new colors by modifying components of an existing color using the `from` keyword. You can adjust lightness, saturation, hue, and alpha dynamically.

### The Problem it Solves

Before Relative Colors:
- Creating color variations required preprocessors
- Dynamic color adjustment was impossible in CSS
- Hover states needed hardcoded color values
- Color palettes couldn't derive from a single base

### How it Works

```css
/* Start from a color and modify it */
--lighter: oklch(from var(--base) calc(l + 0.1) c h);
--darker: oklch(from var(--base) calc(l - 0.1) c h);
--complement: oklch(from var(--base) l c calc(h + 180));
--desaturated: oklch(from var(--base) l calc(c * 0.5) h);
```

### Available Classes

| Class | Effect | Description |
|-------|--------|-------------|
| `.lighten-5` to `.lighten-30` | Lighten | Increase lightness |
| `.darken-5` to `.darken-30` | Darken | Decrease lightness |
| `.saturate-10/20` | Saturate | Increase saturation |
| `.desaturate-10/20` | Desaturate | Decrease saturation |
| `.hue-shift-30/60/90/180` | Hue shift | Rotate hue |
| `.complement` | Complement | Opposite on color wheel |
| `.color-pop` | Pop | More vivid color |
| `.color-muted` | Muted | Subtle color |
| `.color-pastel` | Pastel | Soft pastel version |
| `.hover-brighten` | Hover | Brighten on hover |
| `.hover-darken` | Hover | Darken on hover |
| `.disabled-desaturate` | State | Gray out when disabled |

### Usage Examples

**Dynamic Button States:**
```html
<button class="bg-primary hover-brighten active-darken">
  Dynamic hover/active states
</button>
```

**Color Variations from Single Base:**
```html
<div class="bg-primary">Base</div>
<div class="bg-primary lighten-20">Lighter</div>
<div class="bg-primary darken-20">Darker</div>
<div class="bg-primary complement">Complement</div>
```

### Browser Support
- Chrome 119+, Firefox 128+, Safari 16.4+
- Progressive enhancement recommended

---

## 32. Text Wrap Balance/Pretty

### What is it?

The `text-wrap: balance` and `text-wrap: pretty` properties create more visually pleasing text layouts by balancing line lengths and avoiding orphans/widows without manual intervention.

### The Problem it Solves

Before `text-wrap`:
- Headlines had uneven line lengths
- Orphans (single words on last line) looked awkward
- Manual `<br>` tags were needed for good typography
- Responsive text was particularly problematic

### How it Works

```css
/* Balance: Even line lengths (for headings) */
h1 {
  text-wrap: balance;
}

/* Pretty: Prevent orphans (for paragraphs) */
p {
  text-wrap: pretty;
}
```

### Available Classes

| Class | Effect | Description |
|-------|--------|-------------|
| `.text-balance` | Balance | Even line lengths |
| `.text-pretty` | Pretty | Avoid orphans |
| `.text-wrap-auto` | Auto | Browser default |
| `.text-nowrap` | No wrap | Single line |
| `.text-stable` | Stable | Prevent layout shift |
| `.headline-balanced` | Headlines | Balanced h1-h6 |
| `.card-title-balanced` | Cards | Balanced card titles |
| `.paragraph-pretty` | Paragraphs | Pretty body text |
| `.pullquote-balanced` | Quotes | Balanced blockquotes |
| `.prose` | Prose | Optimal reading experience |

### Usage Examples

**Balanced Headlines:**
```html
<h1 class="text-balance">
  This Long Headline Will Have
  Evenly Balanced Line Lengths
</h1>
```

**Pretty Paragraphs (No Orphans):**
```html
<article class="prose">
  <h1 class="headline-balanced">Article Title</h1>
  <p class="paragraph-pretty">
    This paragraph will avoid having a single word
    orphaned on the last line.
  </p>
</article>
```

### Browser Support
- Chrome 114+, Firefox 121+, Safari 17.4+
- Safe progressive enhancement (text just wraps normally)

---

## 33. :has() Parent Selector

### What is it?

The `:has()` selector (the "parent selector") allows you to style an element based on what it contains. This was the most requested CSS feature for over a decade!

### The Problem it Solves

Before `:has()`:
- Couldn't style parent based on children
- Required JavaScript for "if contains" styling
- Form validation styling was limited
- Complex component states needed JS classes

### How it Works

```css
/* Style card if it contains an image */
.card:has(img) {
  padding: 0;
}

/* Style form if it has invalid inputs */
form:has(:invalid) {
  border-color: red;
}

/* Style label when checkbox is checked */
label:has(input:checked) {
  font-weight: bold;
}
```

### Available Classes

| Class | Effect | Description |
|-------|--------|-------------|
| `.has-checked` | State | Style when contains :checked |
| `.has-focus` | State | Style when contains :focus |
| `.has-focus-within` | State | Style when focus inside |
| `.has-hover` | State | Style when contains :hover |
| `.has-invalid` | Validation | Contains invalid input |
| `.has-valid` | Validation | Contains valid input |
| `.has-empty` | Content | Contains :empty element |
| `.has-disabled` | State | Contains :disabled |
| `.card-has-image` | Component | Card with image |
| `.card-has-footer` | Component | Card with footer |
| `.nav-has-active` | Component | Nav with active item |
| `.form-has-error` | Component | Form with errors |

### Usage Examples

**Card Layout Based on Content:**
```html
<div class="card card-has-image">
  <img src="photo.jpg">
  <h3>Title</h3>
  <p>Description</p>
</div>
```

**Form Validation Styling:**
```html
<form class="form-has-error">
  <input type="email" required>
  <span class="error">Invalid email</span>
</form>
```

**Checkbox Label Styling:**
```html
<label class="has-checked">
  <input type="checkbox">
  <span>Check me to make this bold</span>
</label>
```

### Browser Support
- Chrome 105+, Firefox 121+, Safari 15.4+
- Production ready!

---

## 34. Scroll Snap

### What is it?

CSS Scroll Snap provides native, smooth snapping behavior for scrollable containers - perfect for carousels, galleries, and full-page sections without JavaScript.

### The Problem it Solves

Before Scroll Snap:
- Carousels required JavaScript libraries
- Snap points needed complex calculations
- Touch scrolling behavior was inconsistent
- Performance was often poor on mobile

### How it Works

```css
/* Container: enable snapping */
.carousel {
  scroll-snap-type: x mandatory;
  overflow-x: auto;
}

/* Children: define snap points */
.slide {
  scroll-snap-align: center;
}
```

### Available Classes

| Class | Effect | Description |
|-------|--------|-------------|
| `.snap-x-mandatory` | Container | Horizontal mandatory snap |
| `.snap-y-mandatory` | Container | Vertical mandatory snap |
| `.snap-x-proximity` | Container | Horizontal optional snap |
| `.snap-y-proximity` | Container | Vertical optional snap |
| `.snap-none` | Container | Disable snapping |
| `.snap-start` | Item | Snap to start |
| `.snap-center` | Item | Snap to center |
| `.snap-end` | Item | Snap to end |
| `.snap-always` | Item | Always stop at snap point |
| `.carousel` | Component | Pre-built horizontal carousel |
| `.carousel-center` | Component | Center-aligned carousel |
| `.scroll-sections` | Component | Full-page vertical sections |
| `.gallery-snap` | Component | Photo gallery with snap |
| `.card-slider` | Component | Card slider component |

### Usage Examples

**Horizontal Carousel:**
```html
<div class="carousel snap-x-mandatory">
  <div class="slide snap-center">Slide 1</div>
  <div class="slide snap-center">Slide 2</div>
  <div class="slide snap-center">Slide 3</div>
</div>
```

**Full-Page Sections:**
```html
<main class="scroll-sections snap-y-mandatory">
  <section class="snap-start">Hero</section>
  <section class="snap-start">Features</section>
  <section class="snap-start">Contact</section>
</main>
```

**Card Slider:**
```html
<div class="card-slider">
  <article class="card snap-start">Card 1</article>
  <article class="card snap-start">Card 2</article>
  <article class="card snap-start">Card 3</article>
</div>
```

### Browser Support
- Chrome 69+, Firefox 68+, Safari 11+
- Production ready with excellent support!

---

## 35. Content Visibility

### What is it?

`content-visibility: auto` tells the browser to skip rendering off-screen content, dramatically improving initial page load and scroll performance for long pages.

### The Problem it Solves

Before `content-visibility`:
- Browser rendered all content immediately
- Long pages had slow initial loads
- Virtual scrolling required complex JavaScript
- Mobile performance suffered on content-heavy pages

### How it Works

```css
.section {
  content-visibility: auto;
  contain-intrinsic-size: auto 500px; /* Estimated height */
}
```

### Available Classes

| Class | Effect | Description |
|-------|--------|-------------|
| `.content-visibility-auto` | Auto | Skip off-screen rendering |
| `.content-visibility-hidden` | Hidden | Never render |
| `.content-visibility-visible` | Visible | Always render |
| `.contain-intrinsic-auto` | Size | Auto-calculate size |
| `.contain-intrinsic-100` | Size | 100px placeholder |
| `.contain-intrinsic-200` | Size | 200px placeholder |
| `.contain-intrinsic-400` | Size | 400px placeholder |
| `.contain-intrinsic-600` | Size | 600px placeholder |
| `.virtual-scroll-item` | Component | Virtual list item |
| `.lazy-section` | Component | Lazy-loaded section |
| `.heavy-content` | Component | Heavy content block |
| `.offscreen-content` | Component | Off-screen optimization |

### Usage Examples

**Long Article with Many Sections:**
```html
<article>
  <section class="content-visibility-auto contain-intrinsic-400">
    <h2>Section 1</h2>
    <p>Heavy content...</p>
  </section>
  <section class="content-visibility-auto contain-intrinsic-400">
    <h2>Section 2</h2>
    <p>More heavy content...</p>
  </section>
</article>
```

**Virtual Scroll List:**
```html
<ul class="virtual-list">
  <li class="virtual-scroll-item content-visibility-auto">Item 1</li>
  <li class="virtual-scroll-item content-visibility-auto">Item 2</li>
  <!-- Hundreds of items... -->
</ul>
```

### Browser Support
- Chrome 85+, Firefox 125+, Safari 18+
- Use with estimated intrinsic size for best results

---

## 36. Aspect Ratio

### What is it?

The native `aspect-ratio` property maintains an element's proportions without the old padding-top hack, making responsive images and videos much simpler.

### The Problem it Solves

Before native `aspect-ratio`:
- Required the `padding-top` percentage hack
- Needed wrapper elements for aspect boxes
- Complex calculations for custom ratios
- Couldn't smoothly transition aspect ratios

### How it Works

```css
.video-container {
  aspect-ratio: 16 / 9;
  width: 100%;
  /* Height auto-calculated! */
}
```

### Available Classes

| Class | Effect | Description |
|-------|--------|-------------|
| `.aspect-auto` | Auto | Natural aspect ratio |
| `.aspect-square` / `.aspect-1-1` | 1:1 | Square |
| `.aspect-video` / `.aspect-16-9` | 16:9 | Widescreen video |
| `.aspect-4-3` | 4:3 | Classic TV/photo |
| `.aspect-3-2` | 3:2 | Common photo ratio |
| `.aspect-2-1` | 2:1 | Panoramic |
| `.aspect-21-9` | 21:9 | Ultrawide |
| `.aspect-9-16` | 9:16 | Vertical video |
| `.aspect-golden` | 1.618:1 | Golden ratio |
| `.aspect-portrait` | 3:4 | Portrait mode |
| `.video-container` | Component | Video wrapper |
| `.thumbnail` | Component | Thumbnail image |
| `.hero-banner` | Component | Hero banner |
| `.card-media` | Component | Card image area |
| `.product-image` | Component | E-commerce product |

### Usage Examples

**Responsive Video:**
```html
<div class="video-container aspect-16-9">
  <iframe src="https://youtube.com/embed/xxx"></iframe>
</div>
```

**Image Grid with Consistent Ratios:**
```html
<div class="grid grid-cols-3 gap-4">
  <img class="aspect-square object-cover" src="1.jpg">
  <img class="aspect-square object-cover" src="2.jpg">
  <img class="aspect-square object-cover" src="3.jpg">
</div>
```

**Product Cards:**
```html
<div class="product-card">
  <div class="product-image aspect-4-3">
    <img src="product.jpg" class="object-cover">
  </div>
  <h3>Product Name</h3>
  <p>$99.99</p>
</div>
```

### Browser Support
- Chrome 88+, Firefox 89+, Safari 15+
- Production ready!

---

## 37. Focus Visible

### What is it?

The `:focus-visible` pseudo-class shows focus indicators only for keyboard navigation, not mouse clicks - improving both accessibility and aesthetics.

### The Problem it Solves

Before `:focus-visible`:
- Focus rings appeared on mouse clicks (ugly)
- Removing focus styles hurt accessibility
- JavaScript was needed to detect keyboard vs mouse
- Designers hated focus outlines

### How it Works

```css
/* Only show focus ring for keyboard users */
button:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* Remove default focus for mouse users */
button:focus:not(:focus-visible) {
  outline: none;
}
```

### Available Classes

| Class | Effect | Description |
|-------|--------|-------------|
| `.focus-ring` | Ring | Standard focus ring |
| `.focus-ring-primary` | Ring | Primary color ring |
| `.focus-ring-inset` | Ring | Inset focus ring |
| `.focus-ring-thick` | Ring | Thick focus ring |
| `.focus-ring-offset` | Ring | Offset from element |
| `.focus-visible-only` | Visibility | Only show for keyboard |
| `.focus-within-ring` | Container | Ring when child focused |
| `.outline-none-mouse` | Mouse | No outline for mouse |
| `.keyboard-focus` | Keyboard | Enhanced keyboard focus |
| `.focus-glow` | Effect | Glowing focus effect |
| `.focus-underline` | Effect | Underline on focus |
| `.focus-scale` | Effect | Scale on focus |
| `.btn-focus` | Component | Button focus style |
| `.input-focus` | Component | Input focus style |
| `.link-focus` | Component | Link focus style |
| `.skip-link` | A11y | Skip to content link |

### Usage Examples

**Accessible Buttons:**
```html
<button class="btn focus-ring-primary focus-visible-only">
  Click or Tab to me
</button>
```

**Skip Link for Accessibility:**
```html
<a href="#main" class="skip-link">
  Skip to main content
</a>
<main id="main">...</main>
```

**Form with Nice Focus:**
```html
<form>
  <input type="text" class="input-focus focus-ring" placeholder="Name">
  <input type="email" class="input-focus focus-ring" placeholder="Email">
  <button class="btn-focus focus-ring-primary">Submit</button>
</form>
```

### Browser Support
- Chrome 86+, Firefox 85+, Safari 15.4+
- Production ready!

---

## 38. Linear Easing Functions

### What is it?

The `linear()` easing function allows you to define custom easing curves with multiple control points, enabling bounce, elastic, and spring animations in pure CSS.

### The Problem it Solves

Before `linear()`:
- Limited to cubic-bezier() (4 control points max)
- Bounce/elastic effects required JavaScript
- Spring animations needed libraries like GSAP
- Complex easing curves were impossible

### How it Works

```css
/* Bounce effect with multiple points */
.bounce {
  animation-timing-function: linear(
    0, 0.5, 0.8, 0.95, 1, 0.97, 1, 0.99, 1
  );
}

/* Spring overshoot */
.spring {
  animation-timing-function: linear(
    0, 0.25, 0.5, 0.75, 1.1, 0.95, 1.02, 0.99, 1
  );
}
```

### Available Classes

| Class | Effect | Description |
|-------|--------|-------------|
| `.ease-linear` | Linear | Constant speed |
| `.ease-bounce` | Bounce | Bouncing ball effect |
| `.ease-elastic` | Elastic | Rubber band effect |
| `.ease-spring` | Spring | Spring physics |
| `.ease-smooth` | Smooth | Extra smooth easing |
| `.ease-snappy` | Snappy | Quick, responsive feel |
| `.ease-emphasized` | Emphasized | Material Design 3 |
| `.ease-decelerate` | Decelerate | Slow ending |
| `.ease-accelerate` | Accelerate | Slow starting |
| `.ease-overshoot` | Overshoot | Goes past target |
| `.ease-anticipate` | Anticipate | Wind-up before motion |
| `.ease-steps-4/8` | Steps | Stepped animation |
| `.motion-bounce` | Animation | Bounce animation |
| `.motion-elastic` | Animation | Elastic animation |
| `.motion-spring` | Animation | Spring animation |

### Usage Examples

**Bouncing Notification:**
```html
<div class="notification ease-bounce animate-bounce-in">
  New message!
</div>
```

**Spring Modal:**
```html
<dialog class="modal ease-spring">
  Content with spring animation
</dialog>
```

**Button Hover Effect:**
```html
<button class="btn ease-overshoot hover:scale-105">
  Hover me for overshoot
</button>
```

### Browser Support
- Chrome 113+, Firefox 112+, Safari 17.2+
- Falls back gracefully to ease/ease-in-out

---

## 39. Object View Box

### What is it?

`object-view-box` allows you to crop and zoom images directly in CSS without affecting layout, like having a built-in viewport for your images.

### The Problem it Solves

Before `object-view-box`:
- Image cropping required image editing
- Dynamic crops needed canvas or server-side
- Zoom effects caused layout shifts
- Focus points required complex positioning

### How it Works

```css
img {
  /* Crop to show only center 50% of image */
  object-view-box: inset(25%);
  
  /* Crop specific area */
  object-view-box: inset(10% 20% 15% 5%);
}
```

### Available Classes

| Class | Effect | Description |
|-------|--------|-------------|
| `.view-box-center` | Crop | Center crop |
| `.view-box-top` | Crop | Top focus |
| `.view-box-bottom` | Crop | Bottom focus |
| `.view-box-left` | Crop | Left focus |
| `.view-box-right` | Crop | Right focus |
| `.view-box-face` | Crop | Face detection area |
| `.zoom-in-center` | Zoom | Zoom into center |
| `.zoom-in-top` | Zoom | Zoom into top |
| `.zoom-150` | Zoom | 1.5x zoom |
| `.zoom-200` | Zoom | 2x zoom |
| `.crop-portrait` | Crop | Portrait orientation |
| `.crop-landscape` | Crop | Landscape orientation |
| `.crop-square` | Crop | Square crop |
| `.pan-on-hover` | Effect | Pan image on hover |
| `.ken-burns` | Effect | Ken Burns zoom effect |
| `.product-zoom` | Component | E-commerce zoom |
| `.avatar-crop` | Component | Avatar cropping |

### Usage Examples

**Avatar Cropping:**
```html
<img src="photo.jpg" class="avatar-crop view-box-face">
```

**Product Image Zoom on Hover:**
```html
<div class="product-image">
  <img src="product.jpg" class="pan-on-hover">
</div>
```

**Ken Burns Hero Image:**
```html
<section class="hero">
  <img src="landscape.jpg" class="ken-burns">
  <h1>Welcome</h1>
</section>
```

### Browser Support
- Chrome 104+, Firefox 🚫, Safari 16+
- Use feature detection with fallback to object-fit

---

## 40. Wide Gamut Colors (Display-P3)

### What is it?

Display-P3 is a wide color gamut that can display approximately 50% more colors than sRGB, enabling more vivid, vibrant colors on modern displays.

### The Problem it Solves

Before wide gamut CSS:
- Limited to sRGB color space
- Couldn't match print color vibrancy
- Modern displays couldn't show their full capability
- Brand colors were often muted on screen

### How it Works

```css
/* Display-P3 color (more vibrant red) */
color: color(display-p3 1 0 0);

/* With sRGB fallback */
color: red;
color: color(display-p3 1 0.2 0.1);
```

### Available Classes

| Class | Effect | Description |
|-------|--------|-------------|
| `.p3-red` | Color | Vibrant P3 red |
| `.p3-orange` | Color | Vibrant P3 orange |
| `.p3-yellow` | Color | Vibrant P3 yellow |
| `.p3-green` | Color | Vibrant P3 green |
| `.p3-cyan` | Color | Vibrant P3 cyan |
| `.p3-blue` | Color | Vibrant P3 blue |
| `.p3-purple` | Color | Vibrant P3 purple |
| `.p3-pink` | Color | Vibrant P3 pink |
| `.p3-primary` | Semantic | Primary in P3 |
| `.p3-success` | Semantic | Success in P3 |
| `.p3-warning` | Semantic | Warning in P3 |
| `.p3-danger` | Semantic | Danger in P3 |
| `.bg-p3-vibrant` | Background | Vibrant P3 background |
| `.text-p3-vibrant` | Text | Vibrant P3 text |
| `.gradient-p3-sunset` | Gradient | P3 sunset gradient |
| `.gradient-p3-ocean` | Gradient | P3 ocean gradient |
| `.gradient-p3-aurora` | Gradient | P3 aurora gradient |
| `.gamut-fallback` | Utility | sRGB fallback |

### Usage Examples

**Vibrant Call-to-Action:**
```html
<button class="p3-primary bg-p3-vibrant">
  Buy Now
</button>
```

**Vivid Gradient Hero:**
```html
<section class="hero gradient-p3-sunset">
  <h1>More vivid than ever</h1>
</section>
```

**With Safe Fallback:**
```html
<div class="p3-green gamut-fallback">
  Shows P3 green on supported displays, falls back to sRGB
</div>
```

**Check Gamut Support:**
```css
@media (color-gamut: p3) {
  .vibrant {
    background: color(display-p3 0 1 0);
  }
}
```

### Browser Support
- Chrome 111+, Firefox 113+, Safari 15+
- Requires compatible display hardware
- Always provide sRGB fallbacks

---

## Installation & Setup

### Import Full Framework

```scss
// In your styles.scss or main stylesheet
@use 'kyrolus-sous-materials/styles/styles';
```

### Import Individual Modules

```scss
// Only import what you need
@use 'kyrolus-sous-materials/styles/tokens/css-layers';
@use 'kyrolus-sous-materials/styles/tokens/view-transitions';
@use 'kyrolus-sous-materials/styles/tokens/scroll-animations';
// ... etc
```

### VS Code IntelliSense

Add to your VS Code settings for class autocomplete:

```json
{
  "css.customData": [
    "./projects/kyrolus-sous-materials/styles/intellisense/ks-classes.json"
  ]
}
```

---

## Browser Support Summary

| Feature | Chrome | Firefox | Safari | Notes |
|---------|--------|---------|--------|--------|
| CSS Layers | 99+ | 97+ | 15.4+ | Production Ready |
| View Transitions | 111+ | Not Supported | 18+ | Progressive Enhancement |
| Scroll Animations | 115+ | Not Supported | Not Supported | Progressive Enhancement |
| Anchor Positioning | 125+ | Not Supported | Not Supported | Progressive Enhancement |
| Logical Properties | 87+ | 66+ | 14.1+ | Production Ready |
| Container Queries | 105+ | 110+ | 16+ | Production Ready |
| Subgrid | 117+ | 71+ | 16+ | Production Ready |
| Popover API | 114+ | 125+ | 17+ | Production Ready |
| Modern Viewport Units | 108+ | 101+ | 15.4+ | Production Ready |
| Motion Path | 55+ | 72+ | 15.4+ | Production Ready |
| CSS Masks | 4+ | 53+ | 4+ | Production Ready |
| @property | 85+ | 128+ | 15.4+ | Production Ready |
| Text Decoration | 89+ | 70+ | 15.4+ | Production Ready |
| OKLCH Colors | 111+ | 113+ | 15.4+ | Production Ready |
| Dialog Element | 37+ | 98+ | 15.4+ | Production Ready |
| Details/Summary | 12+ | 49+ | 6+ | Production Ready |
| Form Accent | 93+ | 92+ | 15.4+ | Production Ready |
| Touch/Overscroll | 63+ | 59+ | 16+ | Production Ready |
| Trigonometry | 111+ | 108+ | 15.4+ | Production Ready |
| CSS Shapes | 37+ | 62+ | 10.1+ | Production Ready |
| Font Features | 48+ | 34+ | 9.1+ | Production Ready |
| Interpolate Size | 129+ | Not Supported | Not Supported | Progressive Enhancement |
| @starting-style | 117+ | Not Supported | 17.5+ | Progressive Enhancement |
| Highlight API | 105+ | Not Supported | Not Supported | Progressive Enhancement |
| @scope | 118+ | Not Supported | 17.4+ | Progressive Enhancement |
| Counter Styles | 91+ | 33+ | 17+ | Production Ready |
| Font Palette | 101+ | 107+ | 15.4+ | Production Ready |
| CSS Nesting | 120+ | 117+ | 17.2+ | Production Ready |
| Color Mix | 111+ | 113+ | 16.2+ | Production Ready |
| Light-Dark | 123+ | 120+ | 17.5+ | Progressive Enhancement |
| Relative Color | 119+ | 128+ | 16.4+ | Production Ready |
| Text Wrap Balance | 114+ | 121+ | 17.4+ | Production Ready |
| :has() Selector | 105+ | 121+ | 15.4+ | Production Ready |
| Scroll Snap | 69+ | 68+ | 11+ | Production Ready |
| Content Visibility | 85+ | 125+ | 18+ | Production Ready |
| Aspect Ratio | 88+ | 89+ | 15+ | Production Ready |
| Focus Visible | 86+ | 85+ | 15.4+ | Production Ready |
| Linear Easing | 113+ | 112+ | 17.2+ | Production Ready |
| Object View Box | 104+ | Not Supported | 16+ | Progressive Enhancement |
| Wide Gamut (P3) | 111+ | 113+ | 15+ | Production Ready |

## 45. CSS Math Functions & Modular Scales

### What is it?

Advanced mathematical functions for precise design systems including fluid typography, modular scales, trigonometric calculations, and mathematical grid layouts.

### The Problem it Solves

Traditional CSS lacks precise mathematical control:
- Typography sizing is inconsistent across viewports
- Grid layouts don't adapt mathematically
- Spacing systems lack mathematical harmony
- Complex calculations require preprocessors

**With CSS Math Functions:**
```css
.font-fluid {
  font-size: clamp(1rem, 3vi, 1.5rem); /* Mathematical fluid sizing */
}

.grid-mathematical {
  grid-template-columns: repeat(auto-fit, minmax(calc(250px - 2rem), 1fr));
}
```

### How it Works

**Modular Scales:**
```css
:root {
  --scale-ratio: 1.618; /* Golden ratio */
  --base-size: 1rem;
}

.text-scale-1 { font-size: calc(var(--base-size) * var(--scale-ratio)); }
.text-scale-2 { font-size: calc(var(--base-size) * var(--scale-ratio) * var(--scale-ratio)); }
```

**Trigonometric Calculations:**
```css
.circle-layout {
  --items: 8;
  --radius: 150px;
  
  > *:nth-child(1) {
    transform: translate(
      calc(cos(0deg) * var(--radius)),
      calc(sin(0deg) * var(--radius))
    );
  }
}
```

### Available Classes

**Fluid Typography:**
| Class | Size Range | Scale |
|-------|------------|-------|
| `.fluid-xs` | 0.75rem - 1rem | Minor scale |
| `.fluid-sm` | 0.875rem - 1.125rem | Major second |
| `.fluid-base` | 1rem - 1.25rem | Minor third |
| `.fluid-lg` | 1.125rem - 1.5rem | Major third |
| `.fluid-xl` | 1.25rem - 1.875rem | Perfect fourth |
| `.fluid-2xl` | 1.5rem - 2.25rem | Perfect fifth |
| `.fluid-3xl` | 1.875rem - 3rem | Golden ratio |

**Mathematical Aspect Ratios:**
| Class | Ratio | Use Case |
|-------|-------|----------|
| `.aspect-ratio-16-9` | 16:9 | Video content |
| `.aspect-ratio-4-3` | 4:3 | Traditional media |
| `.aspect-ratio-3-2` | 3:2 | Photography |
| `.aspect-ratio-21-9` | 21:9 | Cinematic |
| `.aspect-ratio-golden` | 1.618:1 | Aesthetic layouts |

**Grid Mathematical Patterns:**
| Class | Pattern | Description |
|-------|---------|-------------|
| `.grid-auto-fit` | Auto-fit | Mathematically optimal columns |
| `.grid-auto-fill` | Auto-fill | Fill available space |
| `.grid-responsive` | Responsive | Container-aware grids |
| `.grid-container-aware` | Container queries | True responsive grids |
| `.grid-mathematical` | Calculated | Precise mathematical layouts |

**Proportional Sizing:**
| Class | Proportion | Base |
|-------|------------|------|
| `.proportional-xs` | 0.75× | Root font size |
| `.proportional-sm` | 0.875× | Root font size |
| `.proportional-base` | 1× | Root font size |
| `.proportional-lg` | 1.125× | Root font size |
| `.proportional-xl` | 1.25× | Root font size |
| `.proportional-2xl` | 1.5× | Root font size |

**Advanced Calculations:**
| Class | Function | Purpose |
|-------|----------|---------|
| `.golden-width` | Golden ratio | Harmonious widths |
| `.golden-height` | Golden ratio | Harmonious heights |
| `.space-golden` | Fibonacci spacing | Natural spacing |
| `.space-fibonacci` | Fibonacci sequence | Mathematical spacing |
| `.math-accelerated` | Transform optimization | Performance boost |

### Usage Examples

**Golden Ratio Layout:**
```html
<div class="layout-golden">
  <main class="golden-width">Main Content</main>
  <aside class="golden-height">Sidebar</aside>
</div>

<style>
.layout-golden {
  display: flex;
  gap: var(--spacing-6);
}

div.main {
  flex: 1.618; /* Golden ratio */
}

aside {
  flex: 1;
  width: calc(100% * (1 / 1.618));
}
</style>
```

**Mathematical Grid:**
```html
<div class="grid-mathematical">
  <div class="grid-item">Item 1</div>
  <div class="grid-item">Item 2</div>
  <div class="grid-item">Item 3</div>
</div>

<style>
.grid-mathematical {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(calc(250px - 2rem), 1fr));
  gap: clamp(1rem, 3vi, 2rem);
}
</style>
```

**Circle Layout Generator:**
```html
<div class="circle-layout" style="--items: 8; --radius: 150px;">
  <div>1</div><div>2</div><div>3</div><div>4</div>
  <div>5</div><div>6</div><div>7</div><div>8</div>
</div>

<style>
.circle-layout {
  position: relative;
  width: calc(var(--radius) * 2);
  height: calc(var(--radius) * 2);
}

div.circle-layout > * {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
```

### Browser Support
- Chrome 115+, Firefox 118+, Safari 16+
- Calc() and clamp() have excellent support
- Trigonometric functions: Chrome 111+, Firefox 108+

---

## 46. Advanced Grid Features

### What is it?

Enhanced CSS Grid capabilities including improved subgrid patterns, masonry layouts, grid template area generators, and dynamic grid sizing.

### The Problem it Solves

Basic CSS Grid has limitations:
- Subgrid support is incomplete
- Masonry layouts require JavaScript
- Complex grid areas are hard to manage
- Grid sizing lacks flexibility

**Advanced Grid Features:**
```css
.grid-masonry {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-flow: dense; /* Masonry-like behavior */
}

.subgrid-improved {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1; /* Span all parent columns */
}
```

### How it Works

**Masonry Grid:**
```css
.masonry-grid {
  column-count: 3;
  column-gap: var(--spacing-4);
  
  > * {
    break-inside: avoid;
    margin-bottom: var(--spacing-4);
  }
}
```

**Subgrid Enhancement:**
```css
.parent-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
}

.child-subgrid {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
  /* Inherits parent's grid lines */
}
```

### Available Classes

**Masonry Layouts:**
| Class | Columns | Responsive Breakpoints |
|-------|---------|----------------------|
| `.masonry-grid` | Auto | Responsive |
| `.masonry-columns-2` | 2 → 3 → 4 | Mobile → Tablet → Desktop |
| `.masonry-columns-3` | 1 → 2 → 3 | Mobile → Tablet → Desktop |
| `.pinterest-grid` | 2 → 3 → 4 → 5 | Mobile → Tablet → Desktop → Large |

**Subgrid Patterns:**
| Class | Behavior | Use Case |
|-------|----------|----------|
| `.subgrid-advanced` | Full inheritance | Complex nested layouts |
| `.subgrid-columns-only` | Column inheritance | Vertical alignment |
| `.subgrid-rows-only` | Row inheritance | Horizontal alignment |
| `.nested-subgrid` | Multi-level | Deep nesting |

**Grid Template Areas:**
| Class | Layout | Areas |
|-------|--------|-------|
| `.layout-three-column` | Header/Main/Sidebar/Footer | header, main, sidebar, footer |
| `.layout-dashboard` | Nav/Sidebar/Main/Widgets/Footer | nav, sidebar, main, widgets, footer |
| `.layout-responsive` | Mobile-first responsive | Responsive reflow |
| `.holy-grail` | Classic 3-column | header, nav, main, aside, footer |

**Alignment Utilities:**
| Class | Alignment | Axes |
|-------|-----------|------|
| `.align-grid-start` | Start | Both axes |
| `.align-grid-center` | Center | Both axes |
| `.align-grid-end` | End | Both axes |
| `.align-grid-stretch` | Stretch | Both axes |
| `.item-self-start` | Individual start | Self alignment |
| `.item-self-center` | Individual center | Self alignment |
| `.item-self-end` | Individual end | Self alignment |

**Performance Optimizations:**
| Class | Optimization | Benefit |
|-------|-------------|---------|
| `.grid-performance` | Containment | Layout isolation |
| `.grid-hardware-accelerated` | Transform | GPU acceleration |
| `.grid-accessible` | Focus management | Accessibility |

### Usage Examples

**Pinterest-Style Masonry:**
```html
<div class="pinterest-grid">
  <article>Card 1<br>Tall content</article>
  <article>Card 2</article>
  <article>Card 3<br>Medium content<br>More lines</article>
  <article>Card 4</article>
</div>
```

**Dashboard Layout:**
```html
<div class="layout-dashboard">
  <header class="navigation">Navigation</header>
  <nav class="sidebar">Sidebar Menu</nav>
  <main class="main-content">Main Content Area</main>
  <aside class="widgets">Widgets Panel</aside>
  <footer class="footer">Footer Content</footer>
</div>
```

**Holy Grail Layout:**
```html
<div class="holy-grail">
  <header>Header</header>
  <nav>Navigation</nav>
  <main>Main Content</main>
  <aside>Sidebar</aside>
  <footer>Footer</footer>
</div>
```

**Responsive Grid Areas:**
```html
<div class="layout-responsive">
  <header>Header</header>
  <main>Main Content</main>
  <aside>Sidebar</aside>
  <footer>Footer</footer>
</div>

<style>
.layout-responsive {
  display: grid;
  grid-template-areas: 
    "header"
    "main"
    "sidebar"
    "footer";
  
  @media (min-width: 1024px) {
    grid-template-areas: 
      "header header header"
      "sidebar main main"
      "footer footer footer";
  }
}
</style>
```

### Browser Support
- Chrome 117+, Firefox 71+, Safari 16+ (Subgrid)
- Masonry grid: Experimental (Chrome behind flag)
- Grid template areas: Universal support
- Fallbacks provided for older browsers

---

## 47. CSS Layers Composition

### What is it?

Advanced CSS Cascade Layers for managing complex application stylesheets with explicit control over specificity and cascade order.

### The Problem it Solves

CSS specificity wars and cascade conflicts:
- Third-party library styles override your styles
- !important creates more problems
- Complex selectors become unmaintainable
- Style order becomes critical and fragile

**CSS Layers Solution:**
```css
@layer reset, base, components, utilities, overrides;

@layer components {
  .card { /* Your component styles */ }
}

@layer utilities {
  .hidden { display: none; } /* Always wins over components */
}
```

### How it Works

**Layer Priority:**
```css
/* Later layers ALWAYS win over earlier layers */
@layer reset, base, components, utilities;

/* reset layer - lowest priority */
@layer reset {
  * { margin: 0; padding: 0; }
}

/* utilities layer - highest priority */
@layer utilities {
  .hidden { display: none !important; } /* Wins over everything */
}
```

**Component Isolation:**
```css
.my-component {
  @layer component-base, component-theme, component-utilities;
  
  @layer component-base {
    padding: 1rem;
    border: 1px solid;
  }
}
```

### Available Classes

**Layer Assignment:**
| Class | Layer | Priority | Use Case |
|-------|-------|----------|----------|
| `.layer-reset` | reset | 1 (lowest) | CSS resets |
| `.layer-base` | base | 2 | Base styles |
| `.layer-components` | components | 3 | Component styles |
| `.layer-utilities` | utilities | 4 | Utility overrides |
| `.layer-overrides` | overrides | 5 (highest) | Emergency overrides |
| `.layer-vendor` | vendor | Configurable | Third-party styles |

**Theme Layers:**
| Class | Scope | Purpose |
|-------|-------|---------|
| `.theme-light` | Light mode | Light theme styles |
| `.theme-dark` | Dark mode | Dark theme styles |
| `.theme-high-contrast` | Accessibility | High contrast mode |
| `.theme-conditional` | Conditional | Environment-based |

**Performance Layers:**
| Class | Optimization | Use Case |
|-------|-------------|----------|
| `.layer-critical` | Above fold | Critical rendering |
| `.layer-non-critical` | Below fold | Non-essential styles |
| `.layer-contained` | Isolated | Layout containment |

**Debugging Layers:**
| Class | Purpose | Visual Aid |
|-------|---------|------------|
| `.layer-debug` | Debug mode | Visual layer indicators |
| `.priority-visualization` | Priority display | Layer priority numbers |

### Usage Examples

**Managing Third-Party Conflicts:**
```scss
// Isolate vendor styles
@layer vendor {
  @import 'bootstrap/dist/css/bootstrap.css';
  @import 'some-library/styles.css';
}

// Your styles automatically win
@layer components {
  .btn { /* Overrides vendor styles */ }
}
```

**Component with Isolated Layers:**
```html
<div class="isolated-component layer-components">
  <div class="special-state">Special styling</div>
</div>

<style>
.isolated-component {
  @layer component-base {
    padding: 1rem;
    border: 1px solid;
  }
  
  @layer component-theme {
    background: var(--surface);
  }
}
</style>
```

**Conditional Theme Loading:**
```scss
// Load different layers based on environment
@if $environment == 'production' {
  @layer production-optimizations {
    /* Production-specific optimizations */
  }
} @else {
  @layer development-tools {
    /* Development debugging tools */
  }
}
```

**Performance-Critical Layering:**
```html
<head>
  <!-- Critical CSS in head -->
  <style>
    @layer critical {
      /* Above-the-fold critical styles */
    }
  </style>
</head>
<body>
  <!-- Non-critical CSS loaded async -->
  <link rel="stylesheet" href="non-critical.css" media="print" onload="this.media='all'">
</body>
```

### Browser Support
- Chrome 99+, Firefox 97+, Safari 15.4+
- Full support in all modern browsers
- Graceful degradation for older browsers

---

## 48. Advanced Accessibility Features

### What is it?

Comprehensive accessibility utilities including prefers-* media queries, enhanced focus management, screen reader optimizations, keyboard navigation enhancements, and cognitive accessibility features.

### The Problem it Solves

Accessibility is often an afterthought:
- Reduced motion preferences ignored
- Focus indicators inadequate
- Screen reader content poorly structured
- Keyboard navigation difficult
- Cognitive accessibility overlooked

**Advanced Accessibility:**
```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
}

.focus-enhanced:focus {
  outline: 2px solid var(--focus-color);
  outline-offset: 2px;
}
```

### How it Works

**Preferences Media Queries:**
```css
/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  * { transition: none; }
}

@media (prefers-contrast: more) {
  * { border-width: 2px !important; }
}

@media (prefers-reduced-transparency: reduce) {
  .glass-effect { background: solid-white !important; }
}
```

**Enhanced Focus Management:**
```css
.focus-keyboard-only:focus {
  outline: none;
}

.focus-keyboard-only:focus-visible {
  outline: 2px solid var(--focus-color);
}
```

### Available Classes

**Preferences Support:**
| Class | Preference | Behavior |
|-------|------------|----------|
| `.reduced-motion` | prefers-reduced-motion | Disable animations |
| `.high-contrast` | prefers-contrast: more | Enhanced borders |
| `.low-contrast` | prefers-contrast: less | Softer contrasts |
| `.reduced-transparency` | prefers-reduced-transparency | Solid backgrounds |
| `.reduced-data` | prefers-reduced-data | Simplified graphics |

**Focus Management:**
| Class | Focus Type | Use Case |
|-------|------------|----------|
| `.focus-enhanced` | Enhanced | Better focus rings |
| `.focus-keyboard-only` | Keyboard only | Visible only for keyboard |
| `.skip-link` | Skip navigation | Screen reader navigation |
| `.focus-trap` | Trap focus | Modal dialogs |

**Screen Reader Optimization:**
| Class | Purpose | Implementation |
|-------|---------|---------------|
| `.sr-only` | Screen reader only | Visually hidden |
| `.sr-only-focusable` | Focusable SR content | Visible when focused |
| `[role="banner"]` | Header region | Landmark navigation |
| `[role="navigation"]` | Nav region | Landmark navigation |
| `[role="main"]` | Main content | Landmark navigation |
| `[role="complementary"]` | Sidebar region | Landmark navigation |
| `[role="contentinfo"]` | Footer region | Landmark navigation |

**Keyboard Navigation:**
| Class | Component | Accessibility Features |
|-------|-----------|----------------------|
| `.keyboard-dropdown` | Dropdown menu | Keyboard accessible |
| `.tab-list` | Tab interface | Keyboard navigation |
| `.accessible-form` | Form controls | Enhanced accessibility |
| `.focus-group` | Focus grouping | Logical focus order |

**Cognitive Accessibility:**
| Class | Feature | Benefit |
|-------|--------|---------|
| `.reading-mode` | Optimized reading | Better comprehension |
| `.enhanced-spacing` | Text spacing | Improved readability |
| `.simplified-interface` | Reduced complexity | Less cognitive load |
| `.large-hit-targets` | Touch targets | Easier interaction |

**Motion Sensitivity:**
| Class | Control | Purpose |
|-------|---------|---------|
| `.parallax-sensitive` | Parallax reduction | Motion sickness prevention |
| `.auto-play-control` | Media autoplay | User control |
| `.scroll-smooth` | Smooth scrolling | Reduced motion option |

### Usage Examples

**Respecting User Preferences:**
```html
<div class="reduced-motion">
  <div class="animated-element">This won't animate if user prefers reduced motion</div>
</div>

<style>
@media (prefers-reduced-motion: reduce) {
  .reduced-motion .animated-element {
    animation: none;
    transition: none;
  }
}
</style>
```

**Enhanced Focus Management:**
```html
<a href="#main" class="skip-link">Skip to main content</a>

<button class="focus-enhanced">Accessible Button</button>

<input type="text" class="focus-keyboard-only" placeholder="Keyboard-focused input">
```

**Screen Reader Optimized Content:**
```html
<header role="banner">
  <h1>Website Title</h1>
  <nav role="navigation" aria-label="Main navigation">
    <!-- Navigation items -->
  </nav>
</header>

<main role="main">
  <h2>Main Content</h2>
  <p class="sr-only">This content is only visible to screen readers</p>
</main>

<aside role="complementary">
  <h3>Related Content</h3>
</aside>

<footer role="contentinfo">
  <p>Footer content</p>
</footer>
```

**Keyboard Accessible Components:**
```html
<div class="keyboard-dropdown">
  <button class="dropdown-toggle" aria-haspopup="true" aria-expanded="false">
    Menu ▼
  </button>
  <div class="dropdown-menu" role="menu">
    <a href="#" class="dropdown-item" role="menuitem">Option 1</a>
    <a href="#" class="dropdown-item" role="menuitem">Option 2</a>
  </div>
</div>
```

**Accessible Form:**
```html
<form class="accessible-form">
  <div class="form-field">
    <label for="email">Email Address <span class="required">*</span></label>
    <input 
      type="email" 
      id="email" 
      required 
      aria-describedby="email-help"
    >
    <span id="email-help" class="help-text">
      Please enter a valid email address
    </span>
  </div>
</form>
```

### Browser Support
- Chrome 76+, Firefox 63+, Safari 12.1+
- Excellent support for prefers-* media queries
- Universal support for focus-visible
- Progressive enhancement for all features

---

MIT License - see LICENSE file for details.

---

**Kyrolus Sous Materials** - 40 Cutting-Edge CSS Features | Full IntelliSense | Angular Ready
