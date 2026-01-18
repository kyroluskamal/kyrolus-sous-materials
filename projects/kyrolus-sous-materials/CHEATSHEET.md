# Kyrolus Sous Materials - Quick Reference Cheatsheet

> **40 Cutting-Edge CSS Feature Modules** | ~30,000+ Lines of SCSS

---

## CSS Layers (`_css-layers.scss`)

| Class | Purpose |
|-------|---------|
| `.layer-reset` | Reset layer (lowest priority) |
| `.layer-base` | Base/foundation layer |
| `.layer-components` | Component styles layer |
| `.layer-utilities` | Utility classes layer (highest) |
| `.layer-override` | Force highest priority |

---

## View Transitions (`_view-transitions.scss`)

| Class | Purpose |
|-------|---------|
| `.view-transition` | Enable view transition on element |
| `.vt-fade` | Fade transition |
| `.vt-slide-left/right/up/down` | Directional slides |
| `.vt-scale` | Scale in/out |
| `.vt-flip` | 3D flip effect |
| `.vt-duration-{fast\|normal\|slow}` | Timing control |

---

## Scroll Animations (`_scroll-animations.scss`)

| Class | Purpose |
|-------|---------|
| `.scroll-animate` | Enable scroll-driven animation |
| `.scroll-fade-in` | Fade on scroll |
| `.scroll-slide-up/down/left/right` | Slide on scroll |
| `.scroll-scale-in` | Scale on scroll |
| `.scroll-rotate` | Rotate on scroll |
| `.scroll-progress` | Progress indicator |
| `.scroll-parallax` | Parallax effect |

---

## Anchor Positioning (`_anchor-positioning.scss`)

| Class | Purpose |
|-------|---------|
| `.anchor` | Define anchor element |
| `.anchor-{name}` | Named anchor |
| `.anchored` | Positioned to anchor |
| `.anchored-top/bottom/left/right` | Position relative to anchor |
| `.anchored-center` | Center on anchor |
| `.anchor-tooltip` | Tooltip positioning |

---

## Logical Properties (`_logical-properties.scss`)

| Class | Purpose |
|-------|---------|
| `.m-inline-{size}` | Margin inline (left/right RTL-aware) |
| `.m-block-{size}` | Margin block (top/bottom) |
| `.p-inline-{size}` | Padding inline |
| `.p-block-{size}` | Padding block |
| `.border-inline-{start\|end}` | RTL-aware borders |
| `.text-start/end` | RTL-aware text alignment |
| `.float-inline-start/end` | RTL-aware floats |
| `.inset-inline/block-{size}` | Logical positioning |

**Sizes:** `0`, `1`, `2`, `3`, `4`, `5`, `6`, `8`, `10`, `12`, `16`, `auto`

---

## Container Units (`_container-units.scss`)

| Class | Purpose |
|-------|---------|
| `.container-query` | Enable container queries |
| `.cqi-{10-100}` | Container inline size |
| `.cqw-{10-100}` | Container width |
| `.cqh-{10-100}` | Container height |
| `.cq-text-{sm\|base\|lg\|xl}` | Responsive container text |
| `.cq-gap-{size}` | Container-responsive gap |

---

## Subgrid (`_subgrid.scss`)

| Class | Purpose |
|-------|---------|
| `.subgrid` | Enable subgrid on both axes |
| `.subgrid-rows` | Subgrid rows only |
| `.subgrid-cols` | Subgrid columns only |
| `.subgrid-card` | Pre-styled subgrid card |
| `.subgrid-form` | Form with aligned labels |

---

## Native Popover (`_popover-api.scss`)

| Class | Purpose |
|-------|---------|
| `.popover` | Base popover styling |
| `.popover-{sm\|md\|lg}` | Popover sizes |
| `.popover-top/bottom/left/right` | Positioning |
| `.popover-tooltip` | Tooltip variant |
| `.popover-menu` | Menu variant |
| `.popover-modal` | Modal variant |
| `.popover-animated` | Animated entry/exit |

**HTML:** `<div popover>` + `<button popovertarget="id">`

---

## Viewport Units (`_viewport-units.scss`)

| Class | Purpose |
|-------|---------|
| `.h-dvh` | Dynamic viewport height |
| `.h-svh` | Small viewport height |
| `.h-lvh` | Large viewport height |
| `.min-h-{dvh\|svh\|lvh}` | Min-height variants |
| `.dvh-{25\|50\|75\|100}` | Percentage of dynamic vh |
| `.w-dvw/svw/lvw` | Dynamic viewport widths |

---

## Motion Path (`_motion-path.scss`)

| Class | Purpose |
|-------|---------|
| `.motion-path` | Enable motion path |
| `.motion-circle` | Circular path |
| `.motion-oval` | Elliptical path |
| `.motion-wave` | Wave/sine path |
| `.motion-zigzag` | Zigzag path |
| `.motion-custom` | Custom SVG path |
| `.motion-{slow\|normal\|fast}` | Animation speed |
| `.motion-reverse` | Reverse direction |

---

## CSS Masks (`_masks.scss`)

| Class | Purpose |
|-------|---------|
| `.mask-fade-{top\|bottom\|left\|right}` | Gradient fade masks |
| `.mask-circle` | Circular mask |
| `.mask-ellipse` | Elliptical mask |
| `.mask-diagonal` | Diagonal mask |
| `.mask-radial` | Radial gradient mask |
| `.mask-text` | Text knockout effect |
| `.mask-image` | Image-based mask |
| `.mask-luminance` | Luminance masking |

---

## @property Custom Properties (`_css-properties.scss`)

| Class | Purpose |
|-------|---------|
| `.prop-color-*` | Animatable colors |
| `.prop-number-*` | Animatable numbers |
| `.prop-length-*` | Animatable lengths |
| `.prop-angle-*` | Animatable angles |
| `.prop-percentage-*` | Animatable percentages |
| `.animate-prop` | Trigger property animation |

---

## Text Decoration (`_text-decoration.scss`)

| Class | Purpose |
|-------|---------|
| `.underline-{solid\|double\|dotted\|dashed\|wavy}` | Underline styles |
| `.decoration-{color}` | Decoration color |
| `.decoration-{1-4}` | Thickness |
| `.underline-offset-{1-8}` | Underline offset |
| `.text-stroke` | Text outline effect |
| `.text-gradient` | Gradient text |
| `.overline` / `.line-through` | Other decorations |

---

## OKLCH Colors (`_oklch-colors.scss`)

| Class | Purpose |
|-------|---------|
| `.bg-oklch-{color}` | OKLCH background |
| `.text-oklch-{color}` | OKLCH text color |
| `.border-oklch-{color}` | OKLCH border |
| `.oklch-{primary\|secondary\|accent}` | Semantic colors |
| `.oklch-lightness-{10-90}` | Lightness control |
| `.oklch-chroma-{0-100}` | Saturation control |
| `.oklch-hue-{0-360}` | Hue rotation |

**Colors:** `red`, `orange`, `yellow`, `green`, `cyan`, `blue`, `purple`, `pink`

---

## Native Dialog (`_dialog-element.scss`)

| Class | Purpose |
|-------|---------|
| `.dialog` | Base dialog styling |
| `.dialog-{sm\|md\|lg\|xl\|full}` | Size variants |
| `.dialog-header` | Header section |
| `.dialog-body` | Body/content section |
| `.dialog-footer` | Footer with actions |
| `.dialog-close` | Close button |
| `.dialog-animated` | Entry/exit animations |
| `.dialog-drawer-{left\|right}` | Drawer variant |

**HTML:** `<dialog>` element

---

## Details/Summary Accordion (`_details-summary.scss`)

| Class | Purpose |
|-------|---------|
| `.details` | Base accordion |
| `.details-{bordered\|filled\|minimal}` | Style variants |
| `.details-animated` | Smooth open/close |
| `.details-icon-{arrow\|plus\|chevron}` | Marker icons |
| `.details-group` | Exclusive accordion group |

**HTML:** `<details><summary>Title</summary>Content</details>`

---

## Form Accent & Modern Forms (`_form-accent.scss`)

| Class | Purpose |
|-------|---------|
| `.accent-{color}` | Set accent-color |
| `.field-sizing-content` | Auto-sizing inputs |
| `.field-sizing-fixed` | Fixed size inputs |
| `.form-modern` | Modern form styling |
| `.input-{sm\|md\|lg}` | Input sizes |
| `.checkbox-*` / `.radio-*` | Custom controls |
| `.switch` | Toggle switch |
| `.range-*` | Range slider styling |

---

## Touch Behavior (`_touch-behavior.scss`)

| Class | Purpose |
|-------|---------|
| `.touch-auto` | Default touch behavior |
| `.touch-none` | Disable touch |
| `.touch-pan-x/y` | Single-axis panning |
| `.touch-pinch-zoom` | Enable pinch zoom |
| `.touch-manipulation` | Fast tap (no delay) |
| `.overscroll-auto` | Default overscroll |
| `.overscroll-contain` | Prevent scroll chaining |
| `.overscroll-none` | Disable overscroll effects |
| `.overscroll-x-*` / `.overscroll-y-*` | Per-axis control |

---

## CSS Trigonometry (`_trigonometry.scss`)

| Class | Purpose |
|-------|---------|
| `.trig-orbit` | Orbital animation |
| `.trig-wave` | Sine wave motion |
| `.trig-pendulum` | Pendulum swing |
| `.trig-spiral` | Spiral animation |
| `.trig-rotate-{n}` | Positioned in circle |
| `.trig-amplitude-{sm\|md\|lg}` | Animation amplitude |
| `.trig-frequency-{slow\|normal\|fast}` | Animation speed |

---

## CSS Shapes (`_css-shapes.scss`)

| Class | Purpose |
|-------|---------|
| `.shape-circle` | Circular text wrap |
| `.shape-ellipse` | Elliptical wrap |
| `.shape-inset-{size}` | Inset rectangle wrap |
| `.shape-polygon-*` | Polygon shapes |
| `.shape-float-left/right` | Float direction |
| `.shape-margin-{size}` | Space around shape |
| `.clip-circle/ellipse/polygon` | Clip-path shapes |

---

## OpenType Font Features (`_font-features.scss`)

| Class | Purpose |
|-------|---------|
| `.font-ligatures` | Enable ligatures |
| `.font-no-ligatures` | Disable ligatures |
| `.font-tabular-nums` | Monospace numbers |
| `.font-oldstyle-nums` | Oldstyle figures |
| `.font-small-caps` | Small capitals |
| `.font-all-small-caps` | All small caps |
| `.font-swash` | Decorative swashes |
| `.font-stylistic-alt` | Stylistic alternates |
| `.font-fractions` | Proper fractions |
| `.font-ordinal` | Ordinal indicators |
| `.font-kerning` | Enable kerning |

---

## Interpolate Size (`_interpolate-size.scss`)

| Class | Purpose |
|-------|---------|
| `.interpolate-size` | Enable height: auto animation |
| `.collapse` | Collapsible container |
| `.collapse.open` | Expanded state |
| `.accordion-smooth` | Smooth accordion |
| `.expandable` | Expandable section |
| `.measure-content` | Content measurement |

**Usage:** Apply `.interpolate-size` to parent, toggle `.open` class

---

## Starting Style (`_starting-style.scss`)

| Class | Purpose |
|-------|---------|
| `.entry-fade` | Fade-in on entry |
| `.entry-slide-{up\|down\|left\|right}` | Slide-in on entry |
| `.entry-scale` | Scale-in on entry |
| `.entry-rotate` | Rotate-in on entry |
| `.entry-blur` | Blur-in on entry |
| `.entry-bounce` | Bounce-in on entry |
| `.entry-delay-{100-500}` | Entry delay |
| `.entry-stagger` | Staggered children |

**Note:** CSS-only, no JavaScript required!

---

## Advanced Features Summary

> **New Advanced Features Added** | Cutting-edge CSS capabilities

---

## Advanced Container Units (`_container-units.scss`)

| Class | Purpose |
|-------|---------|
| `.container-inline` | Enable inline-size container queries |
| `.container-block` | Enable full-size container queries |
| `.w-{10-100}cqw` | Width relative to container width |
| `.h-{10-100}cqh` | Height relative to container height |
| `.inline-{10-100}cqi` | Inline size relative to container |
| `.block-{10-100}cqb` | Block size relative to container |
| `.text-{xs-xl}-cqw` | Text scaling relative to container |
| `.gap-{2-8}cqi` | Gap spacing relative to container |
| `.grid-responsive` | Auto-responsive grid layout |
| `.card-adaptive` | Container-aware card sizing |

**Example:** `.w-50cqw` = 50% of container width

---

## Smart Anchor Positioning (`_anchor-advanced.scss`)

| Class | Purpose |
|-------|---------|
| `.anchor` | Define anchor element |
| `.anchor-{name}` | Named anchor reference |
| `.anchor-top/bottom/left/right` | Position relative to anchor |
| `.anchor-smart-{position}` | Auto-flipping positioning |
| `.anchor-match-width/height` | Match anchor dimensions |
| `.anchor-try-most-space` | Optimize for available space |
| `.anchor-offset-{0-8}` | Position offset spacing |
| `.anchor-viewport-aware` | Stay within viewport bounds |

**Smart Features:** Automatic flipping, collision avoidance, viewport awareness

---

## Scroll Timeline Animations (`_scroll-animations.scss`)

| Class | Purpose |
|-------|---------|
| `.scroll-animate` | Enable scroll-driven animation |
| `.scroll-fade-{in|out}` | Opacity animations |
| `.scroll-slide-{up|down|left|right}` | Translation animations |
| `.scroll-scale-{in|out}` | Scale animations |
| `.scroll-rotate` | Rotation animations |
| `.scroll-progress` | Progress bar animations |
| `.scroll-parallax` | Parallax effects |
| `.scroll-range-{full|half|cover}` | Animation trigger ranges |
| `.scroll-{fast|normal|slow}` | Animation timing |
| `.scroll-delay-{100-500}` | Sequential delays |

**No JavaScript Required:** Pure CSS scroll animations

---

## OKLCH Color Manipulation (`_color-functions.scss`)

| Class | Purpose |
|-------|---------|
| `.oklch-{color}` | Base OKLCH colors (red, blue, green, etc.) |
| `.oklch-{color}-{50-95}` | Lightness variations (50% to 95%) |
| `.oklch-{color}-chroma-{0-200}` | Saturation control |
| `.oklch-lighten-{1-2}` | Increase lightness |
| `.oklch-darken-{1-2}` | Decrease lightness |
| `.oklch-saturate-{1}` | Increase saturation |
| `.oklch-desaturate-{1}` | Decrease saturation |
| `.oklch-hue-shift-{30-180}` | Hue rotation |
| `.oklch-{complementary|triadic|analogous}` | Color harmonies |
| `.oklch-a11y-check` | Accessibility validation |
| `.oklch-gradient-{linear|radial|conic}` | Gradient generators |

**Perceptually Uniform:** Consistent brightness perception across hues

---

## CSS Math Functions & Modular Scales (`_math-functions.scss`)

| Class | Purpose |
|-------|---------|
| `.fluid-{xs-xl}` | Mathematical fluid typography |
| `.aspect-ratio-{16-9|4-3|3-2|golden}` | Precise aspect ratios |
| `.grid-auto-fit/fill` | Mathematical grid layouts |
| `.proportional-{size}` | Proportional sizing |
| `.golden-width/height` | Golden ratio dimensions |
| `.space-golden/fibonacci` | Mathematical spacing |
| `.math-accelerated` | Performance optimization |

**Mathematical Precision:** Calc(), clamp(), and trigonometric functions

---

## Advanced Grid Features (`_grid-advanced.scss`)

| Class | Purpose |
|-------|---------|
| `.masonry-{grid|columns}` | Pinterest-style layouts |
| `.subgrid-{advanced|columns|rows}` | Improved subgrid |
| `.layout-{three-column|dashboard|holy-grail}` | Pre-built layouts |
| `.align-grid-{start|center|end|stretch}` | Grid alignment |
| `.grid-performance` | Layout optimization |
| `.grid-hardware-accelerated` | GPU acceleration |

**Enhanced Grid Capabilities:** Beyond basic CSS Grid

---

## CSS Layers Composition (`_layers-composition.scss`)

| Class | Purpose |
|-------|---------|
| `.layer-{reset|base|components|utilities|overrides}` | Cascade control |
| `.theme-{light|dark|high-contrast}` | Theme isolation |
| `.layer-critical/non-critical` | Performance loading |
| `.layer-debug` | Debugging utilities |

**Explicit Cascade Management:** No more specificity wars

---

## Advanced Accessibility Features (`_accessibility-advanced.scss`)

| Class | Purpose |
|-------|---------|
| `.reduced-motion` | Respect motion preferences |
| `.high-contrast` | Enhanced contrast mode |
| `.focus-{enhanced|keyboard-only}` | Better focus management |
| `.sr-only` | Screen reader content |
| `.keyboard-dropdown` | Keyboard accessible components |
| `.accessible-form` | Enhanced form accessibility |
| `.reading-mode` | Cognitive accessibility |

**Comprehensive A11Y:** WCAG 2.1 AA compliance built-in

---

## Framework Statistics

| Category | Count | Description |
|----------|-------|-------------|
| **Cutting-Edge Features** | 48 | Modern CSS capabilities |
| **Utility Classes** | 18,000+ | Ready-to-use classes |
| **SCSS Files** | 55+ | Modular organization |
| **Lines of Code** | 60,000+ | Comprehensive framework |
| **Browser Support** | 95%+ | Modern browser coverage |

## Key Advantages

✅ **No JavaScript Dependencies** - Pure CSS solutions
✅ **Progressive Enhancement** - Graceful fallbacks
✅ **Performance Optimized** - Hardware-accelerated
✅ **Accessibility First** - WCAG compliant
✅ **Developer Experience** - Intuitive class names
✅ **Future-Proof** - Latest CSS standards

## Browser Support Legend

🟢 **Excellent** - Chrome 109+, Firefox 110+, Safari 16+
🟡 **Good** - Chrome 99+, Firefox 97+, Safari 15.4+
🔴 **Limited** - Requires polyfills or fallbacks
⚪ **Experimental** - Behind feature flags

---

*Last Updated: January 2026*
*Total Features Implemented: 48*
| `.highlight-warning` | Warning highlight |
| `.highlight-success` | Success highlight |
| `.highlight-info` | Info highlight |
| `.highlight-code` | Code highlight |

**JS Required:** `CSS.highlights.set('name', new Highlight(range))`

---

## CSS @scope (`_css-scope.scss`)

| Class | Purpose |
|-------|---------|
| `.scope-card` | Scoped card component |
| `.scope-article` | Scoped article |
| `.scope-widget` | Scoped widget |
| `.scope-form` | Scoped form |
| `.scope-isolated` | Fully isolated scope |
| `.scope-boundary` | Stop scope propagation |

**CSS:** `@scope (.component) to (.boundary) { ... }`

---

## Counter Styles (`_counter-style.scss`)

| Class | Purpose |
|-------|---------|
| `.list-emoji` | Emoji bullet points |
| `.list-checkmarks` | Checkmark markers |
| `.list-arrows` | Arrow markers |
| `.list-stars` | Star markers |
| `.list-roman-parentheses` | Roman numerals (i) |
| `.list-alpha-dot` | Alphabetic a. b. c. |
| `.list-custom-{name}` | Custom counter style |
| `.counter-{name}` | Apply counter |

---

## Font Palette (`_font-palette.scss`)

| Class | Purpose |
|-------|---------|
| `.font-palette-normal` | Default palette |
| `.font-palette-light` | Light palette |
| `.font-palette-dark` | Dark palette |
| `.font-palette-colorful` | Colorful palette |
| `.font-palette-{1-5}` | Numbered palettes |
| `.palette-override-*` | Override specific colors |

**For:** Color fonts (COLRv0/COLRv1)

---

## CSS Nesting (`_css-nesting.scss`)

| Class | Purpose |
|-------|---------|
| `.nest-card` | Pre-built card component |
| `.nest-button` | Button with states |
| `.nest-input` | Input with states |
| `.nest-nav` | Navigation component |
| `.nest-list` | List component |
| `.nest-article` | Article layout |

**Note:** Templates for native CSS nesting patterns

---

## Color Mix (`_color-mix.scss`)

| Class | Purpose |
|-------|---------|
| `.tint-primary-{10-50}` | Mix primary with white |
| `.shade-primary-{10-50}` | Mix primary with black |
| `.bg-alpha-{10-90}` | Transparent background |
| `.mix-oklch` | Use OKLCH color space |
| `.mix-srgb` | Use sRGB color space |
| `.bg-mixed` | Custom color mixture |
| `.gradient-mixed` | Gradient with mixed colors |
| `.overlay-primary` | Primary overlay |
| `.scrim-dark` | Dark scrim for text |

---

## Light-Dark (`_light-dark.scss`)

| Class | Purpose |
|-------|---------|
| `.text-ld` | Auto light/dark text |
| `.bg-ld` | Auto light/dark background |
| `.border-ld` | Auto light/dark border |
| `.card-ld` | Auto-themed card |
| `.surface-ld-{1-3}` | Elevation surfaces |
| `.divider-ld` | Auto-themed divider |
| `.input-ld` | Auto-themed input |
| `.shadow-ld` | Appropriate shadows |
| `.scrollbar-ld` | Themed scrollbar |

**No media queries needed!**

---

## Relative Color (`_relative-color.scss`)

| Class | Purpose |
|-------|---------|
| `.lighten-{5-30}` | Increase lightness |
| `.darken-{5-30}` | Decrease lightness |
| `.saturate-{10\|20}` | Increase saturation |
| `.desaturate-{10\|20}` | Decrease saturation |
| `.hue-shift-{30\|60\|90\|180}` | Rotate hue |
| `.complement` | Complementary color |
| `.color-pop` | More vivid |
| `.color-muted` | Subtle color |
| `.hover-brighten` | Brighten on hover |
| `.hover-darken` | Darken on hover |

---

## Text Wrap (`_text-wrap.scss`)

| Class | Purpose |
|-------|---------|
| `.text-balance` | Even line lengths |
| `.text-pretty` | Avoid orphans |
| `.text-wrap-auto` | Browser default |
| `.text-nowrap` | Single line |
| `.headline-balanced` | Balanced headings |
| `.paragraph-pretty` | Pretty paragraphs |
| `.prose` | Optimal reading |

**Great for headings and body text!**

---

## :has() Selector (`_has-selector.scss`)

| Class | Purpose |
|-------|---------|
| `.has-checked` | Contains :checked |
| `.has-focus` | Contains :focus |
| `.has-focus-within` | Focus inside |
| `.has-hover` | Contains :hover |
| `.has-invalid` | Contains invalid input |
| `.has-valid` | Contains valid input |
| `.has-empty` | Contains empty element |
| `.card-has-image` | Card with image |
| `.form-has-error` | Form with errors |

---

## Scroll Snap (`_scroll-snap.scss`)

| Class | Purpose |
|-------|---------|
| `.snap-x-mandatory` | Horizontal snap |
| `.snap-y-mandatory` | Vertical snap |
| `.snap-x-proximity` | Optional horizontal snap |
| `.snap-none` | Disable snapping |
| `.snap-start` | Snap to start |
| `.snap-center` | Snap to center |
| `.snap-end` | Snap to end |
| `.snap-always` | Always stop |
| `.carousel` | Pre-built carousel |
| `.scroll-sections` | Full-page sections |
| `.gallery-snap` | Photo gallery |

---

## Content Visibility (`_content-visibility.scss`)

| Class | Purpose |
|-------|---------|
| `.content-visibility-auto` | Skip off-screen rendering |
| `.content-visibility-hidden` | Never render |
| `.contain-intrinsic-auto` | Auto-calc size |
| `.contain-intrinsic-{100-600}` | Placeholder height |
| `.virtual-scroll-item` | Virtual list item |
| `.lazy-section` | Lazy-loaded section |
| `.heavy-content` | Performance optimization |

**Big performance gains for long pages!**

---

## Aspect Ratio (`_aspect-ratio.scss`)

| Class | Purpose |
|-------|---------|
| `.aspect-auto` | Natural aspect ratio |
| `.aspect-square` | 1:1 |
| `.aspect-video` / `.aspect-16-9` | 16:9 |
| `.aspect-4-3` | 4:3 |
| `.aspect-3-2` | 3:2 |
| `.aspect-21-9` | Ultrawide |
| `.aspect-golden` | Golden ratio |
| `.video-container` | Video wrapper |
| `.thumbnail` | Image thumbnail |
| `.hero-banner` | Hero section |

---

## Focus Visible (`_focus-visible.scss`)

| Class | Purpose |
|-------|---------|
| `.focus-ring` | Standard focus ring |
| `.focus-ring-primary` | Primary color ring |
| `.focus-ring-inset` | Inset ring |
| `.focus-ring-offset` | Offset ring |
| `.focus-visible-only` | Keyboard only |
| `.focus-glow` | Glowing effect |
| `.focus-underline` | Underline focus |
| `.btn-focus` | Button focus |
| `.input-focus` | Input focus |
| `.skip-link` | Skip to content |

---

## Linear Easing (`_linear-easing.scss`)

| Class | Purpose |
|-------|---------|
| `.ease-linear` | Constant speed |
| `.ease-bounce` | Bounce effect |
| `.ease-elastic` | Elastic effect |
| `.ease-spring` | Spring physics |
| `.ease-smooth` | Extra smooth |
| `.ease-snappy` | Quick, responsive |
| `.ease-overshoot` | Goes past target |
| `.ease-anticipate` | Wind-up motion |
| `.ease-steps-{4\|8}` | Stepped animation |
| `.motion-bounce` | Bounce animation |

---

## Object View Box (`_object-view-box.scss`)

| Class | Purpose |
|-------|---------|
| `.view-box-center` | Center crop |
| `.view-box-top` | Top focus |
| `.view-box-bottom` | Bottom focus |
| `.view-box-face` | Face area |
| `.zoom-in-center` | Zoom center |
| `.zoom-150` / `.zoom-200` | Zoom levels |
| `.crop-portrait` | Portrait crop |
| `.crop-landscape` | Landscape crop |
| `.pan-on-hover` | Pan on hover |
| `.ken-burns` | Ken Burns effect |

---

## Wide Gamut Colors (`_wide-gamut.scss`)

| Class | Purpose |
|-------|---------|
| `.p3-red` | Vibrant P3 red |
| `.p3-green` | Vibrant P3 green |
| `.p3-blue` | Vibrant P3 blue |
| `.p3-primary` | P3 primary |
| `.p3-success` | P3 success |
| `.p3-warning` | P3 warning |
| `.p3-danger` | P3 danger |
| `.bg-p3-vibrant` | Vibrant background |
| `.gradient-p3-sunset` | P3 sunset gradient |
| `.gradient-p3-aurora` | P3 aurora gradient |
| `.gamut-fallback` | sRGB fallback |

---

## Quick Reference: Dark Mode

All features support dark mode via:

```html
<body data-theme="dark">  <!-- or -->
<body class="dark">
```

---

## Quick Reference: Browser Support

| Feature | Chrome | Firefox | Safari |
|---------|--------|---------|--------|
| CSS Layers | 99+ | 97+ | 15.4+ |
| View Transitions | 111+ | - | 18+ |
| Scroll Animations | 115+ | - | - |
| Anchor Positioning | 125+ | - | - |
| Container Queries | 105+ | 110+ | 16+ |
| Subgrid | 117+ | 71+ | 16+ |
| Popover API | 114+ | 125+ | 17+ |
| @property | 85+ | 128+ | 15.4+ |
| OKLCH | 111+ | 113+ | 15.4+ |
| Dialog | 37+ | 98+ | 15.4+ |
| @scope | 118+ | - | 17.4+ |
| @starting-style | 117+ | - | 17.5+ |
| Highlight API | 105+ | - | - |
| interpolate-size | 129+ | - | - |
| Native Nesting | 120+ | 117+ | 17.2+ |
| Color Mix | 111+ | 113+ | 16.2+ |
| Light-Dark | 123+ | 120+ | 17.5+ |
| Relative Color | 119+ | 128+ | 16.4+ |
| Text Wrap | 114+ | 121+ | 17.4+ |
| :has() | 105+ | 121+ | 15.4+ |
| Scroll Snap | 69+ | 68+ | 11+ |
| Content Visibility | 85+ | 125+ | 18+ |
| Aspect Ratio | 88+ | 89+ | 15+ |
| Focus Visible | 86+ | 85+ | 15.4+ |
| Linear Easing | 113+ | 112+ | 17.2+ |
| Object View Box | 104+ | - | 16+ |
| Wide Gamut (P3) | 111+ | 113+ | 15+ |

---

## Import in Angular

```scss
// Full framework
@use 'kyrolus-sous-materials/styles/styles';

// Individual modules
@use 'kyrolus-sous-materials/styles/tokens/css-layers';
@use 'kyrolus-sous-materials/styles/tokens/view-transitions';
// ... add as needed
```

---

## IntelliSense Support

The framework includes VS Code IntelliSense via:
- `styles/intellisense/ks-classes.json`
- `styles/intellisense/ks-style-intellisense.json`

Add to VS Code settings for class autocomplete.

---

**Kyrolus Sous Materials** - 40 Feature Modules | Full IntelliSense | Angular Ready
