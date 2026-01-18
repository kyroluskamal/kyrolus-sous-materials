/**
 * PostCSS Configuration for Kyrolus Sous Materials
 *
 * IMPORTANT: This config is optimized to preserve modern CSS features:
 * - CSS Layers (@layer)
 * - @property custom properties
 * - @starting-style entry animations
 * - View Transitions API
 * - Scroll-driven animations
 * - Anchor positioning
 * - Container queries & style queries
 * - :has() selector
 * - OKLCH color system
 * - light-dark() function
 * - CSS Nesting
 * - And all other cutting-edge features
 */

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  plugins: [
    // Autoprefixer - safe for modern CSS
    require('autoprefixer')({
      // Don't add prefixes for features that have good browser support
      overrideBrowserslist: [
        '>0.5%',
        'last 2 versions',
        'not dead',
        'not op_mini all'
      ],
      // Preserve modern syntax
      grid: 'autoplace'
    }),

    // Minification in production with SAFE settings for modern CSS
    isProd && require('cssnano')({
      preset: ['default', {
        // Remove comments
        discardComments: { removeAll: true },

        // SAFE: Normalize whitespace
        normalizeWhitespace: true,

        // DISABLE: These can break modern CSS features
        cssDeclarationSorter: false,      // Can break cascade in @layer
        discardUnused: false,             // Can remove @property, @keyframes
        mergeRules: false,                // Can break @layer ordering
        mergeLonghand: false,             // Can break logical properties
        reduceIdents: false,              // Can break animation references
        reduceInitial: false,             // Can break CSS custom properties
        normalizeUrl: true,               // Safe - just normalizes URLs

        // These are SAFE to enable
        colormin: false,                  // DISABLE: Can break oklch(), color-mix()
        convertValues: false,             // DISABLE: Can break modern units
        normalizeCharset: true,           // Safe
        normalizeDisplayValues: true,     // Safe
        normalizePositions: true,         // Safe - but watch for anchor()
        normalizeRepeatStyle: true,       // Safe
        normalizeString: true,            // Safe
        normalizeTimingFunctions: true,   // Safe
        normalizeUnicode: true,           // Safe
        orderedValues: true,              // Safe
        uniqueSelectors: true,            // Safe

        // SAFE: Minify gradients but preserve modern syntax
        minifyGradients: true,

        // SAFE: Minify params
        minifyParams: true,

        // SAFE: Minify selectors (preserves :has(), :is(), :where())
        minifySelectors: true,

        // SAFE: Minify font values
        minifyFontValues: true,

        // SAFE: Discard duplicates
        discardDuplicates: true,

        // SAFE: Discard empty
        discardEmpty: true,

        // SAFE: Merge idents only if same keyframes
        mergeIdents: false,               // DISABLE: Can break @starting-style

        // SAFE: SVG optimization
        svgo: true,

        // SAFE: Calc minification (but be careful with modern calc)
        calc: {
          preserve: true                  // Preserve complex calc expressions
        },
      }],
    }),
  ].filter(Boolean)
};
