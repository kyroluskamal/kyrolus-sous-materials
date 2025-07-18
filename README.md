# ToggleClassOnScrollDirective
A simple and efficient Angular directive that toggles a CSS class on an element based on the window's vertical scroll position.

This directive is built with modern Angular features, utilizing Signals for reactivity, and is designed to work efficiently in Zoneless applications.

## Features
* **Modern & Performant:** Built with Angular Signals for optimal performance in Zoneless applications.
* **Easy to Use:** Requires only a single mandatory input (`ksToggleClassOnScroll`) to be functional.
* **Customizable:** Allows specifying a scroll offset (`ksScrollOffset`) to control when the class is toggled.

## Usage & API
To use the directive, import ToggleClassOnScrollDirective into your component's or NgModule's imports array.

```typescript
import { ToggleClassOnScrollDirective } from './path/to/your/directive';

@Component({
  standalone: true,
  imports: [ToggleClassOnScrollDirective],
  // ...
})
export class MyComponent {}
```

### Inputs
| Property | Type | Default | Required | Description |
|---|---|---|---|---|
| `ksToggleClassOnScroll` | `string` | — | Yes | The name of the CSS class to be added or removed. |
| `ksScrollOffset` | `number` | `0` | No | The scroll distance in pixels from the top of the page. The class will be added if the scroll position is less than or equal to this value and removed if it's greater. |

## Examples
### 1. Basic Usage
This example adds the navbar-scrolled class to a navbar when the user scrolls more than 50px down the page.

```html
<nav 
  class="navbar" 
  ksToggleClassOnScroll="navbar-scrolled"
  [ksScrollOffset]="50">
  </nav>
```

### 2. Advanced Usage with Signals
This example uses component signals to dynamically control both the class name and the offset.

**Component TypeScript:**
```typescript
import { Component, signal } from '@angular/core';

@Component({
  // ...
})
export class MyAdvancedComponent {
  scrolledClass = signal('header-is-solid');
  offset = signal(200);
}
```

**Component HTML:**
```html
<header
  [ksToggleClassOnScroll]="scrolledClass()"
  [ksScrollOffset]="offset()">
  </header>
```

## ♿ Accessibility Considerations
This directive only changes the visual appearance of an element. The developer implementing this directive is responsible for ensuring the final result is accessible.

**Note:** Please consider the following when using this directive:

* **Color Contrast:** Ensure that the text and interactive elements maintain a sufficient color contrast ratio against the background in both states (with and without the toggled class), as per WCAG guidelines.
* **Reduced Motion:** If the CSS class triggers an animation or transition, it is a best practice to wrap it within a `@media (prefers-reduced-motion: no-preference)` query to respect user preferences.
