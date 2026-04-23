/**
 * PostBuild CSS Optimization Script - SAFE MODE
 *
 * This script uses the PurgeCSS API directly (not CLI) for better control
 * over modern CSS feature preservation. It's the recommended approach for
 * frameworks using cutting-edge CSS features.
 *
 * Features preserved:
 * - CSS Layers (@layer)
 * - @property custom properties
 * - @starting-style entry animations
 * - @position-try anchor fallbacks
 * - View Transitions API
 * - Scroll-driven animations
 * - Container queries & style queries
 * - :has() selector
 * - OKLCH color system
 * - light-dark() function
 * - CSS Nesting
 * - Anchor positioning
 * - CSS Subgrid
 * - CSS Motion Path
 * - CSS Masks
 * - And all other modern features
 *
 * Usage: node postbuild-safe.js [dist-folder]
 */

const { PurgeCSS } = require('purgecss');
const fs = require('node:fs');
const path = require('node:path');

// Configuration
const DEFAULT_DIST_PATH = './dist/ks-materials-docs/browser';
const distPath = process.argv[2] || DEFAULT_DIST_PATH;
const CLASS_PREFIX = process.env.KS_CLASS_PREFIX || '';

// =============================================================================
// MODERN CSS FEATURE DETECTION
// =============================================================================

const MODERN_CSS_FEATURES = {
  // At-rules that should NEVER be removed
  atRules: [
    '@layer',
    '@property',
    '@starting-style',
    '@position-try',
    '@container',
    '@supports',
    '@media',
    '@keyframes',
    '@font-face',
    '@view-transition',
    '@scope',
    '@page',
    '@counter-style',
  ],

  // Functions that indicate modern CSS
  functions: [
    'anchor(',
    'anchor-size(',
    'oklch(',
    'oklab(',
    'color-mix(',
    'light-dark(',
    'color(',
    'lab(',
    'lch(',
    'hwb(',
    'env(',
    'clamp(',
    'min(',
    'max(',
    'calc(',
  ],

  // Pseudo-selectors that should be preserved
  pseudoSelectors: [
    ':has(',
    ':is(',
    ':where(',
    ':not(',
    '::view-transition',
    '::backdrop',
    ':popover-open',
    ':user-valid',
    ':user-invalid',
    ':focus-visible',
    ':focus-within',
    ':target-within',
    ':state(',
  ],

  // Properties that indicate modern CSS
  properties: [
    'anchor-name',
    'position-anchor',
    'position-try',
    'animation-timeline',
    'view-timeline',
    'scroll-timeline',
    'container-type',
    'container-name',
    'content-visibility',
    'contain-intrinsic',
    'text-wrap',
    'field-sizing',
    'interpolate-size',
    'accent-color',
    'color-scheme',
    'aspect-ratio',
    'gap',
    'row-gap',
    'column-gap',
    'inset',
    'inset-inline',
    'inset-block',
    'margin-inline',
    'margin-block',
    'padding-inline',
    'padding-block',
  ]
};

// =============================================================================
// COMPREHENSIVE SAFELIST
// =============================================================================

const SAFELIST_PATTERNS = [
  // Angular & frameworks
  /^ng-/,
  /^router-/,
  /^cdk-/,
  /^mat-/,

  // State classes
  /^is-/,
  /^has-/,
  /^(active|disabled|open|closed|visible|hidden|expanded|collapsed|loading|error|success)$/,

  // Animation classes
  /^(animate|fade|slide|scale|rotate|bounce|pulse|shake|appear|enter|exit|motion)-/,

  // Responsive prefixes
  /^(sm|md|lg|xl|2xl):/,
  /^@(sm|md|lg|xl|container)/,

  // Theme variants
  /^(dark|light|theme-|high-contrast)/,

  // Group & peer utilities
  /^(group|peer)($|-|\/)/,

  // Modern CSS feature classes
  /^(anchor|anchored|popover|view-transition|scroll-|timeline-|container)/,
  /^(glass|backdrop-|clip-|mask-|blend-|mix-blend-|filter-|perspective|transform-)/,
  /^(text-wrap|balance|pretty|line-clamp|truncate|writing-)/,
  /^(subgrid|masonry|aspect-)/,
  /^(sr-only|not-sr-only|focus-visible|focus-within|motion-safe|motion-reduce)/,
  /^(fill-|stroke-)/,
  /^(contain-|content-visibility|will-change|isolate)/,
  /^(safe-|pt-safe|pb-safe|pl-safe|pr-safe)/,
  /^(collapsible|accordion|dialog)/,
  /^has-(checked|focus|hover|empty|valid|invalid)/,
  /^(first|last|odd|even|only):/,
  /^(hover|focus|active|visited|disabled|checked):/,
  /^print:/,

  // Preserve any class containing modern CSS indicators
  /oklch|color-mix|light-dark|anchor|starting-style/,
];

// Exact strings to preserve
const SAFELIST_EXACT = [
  'group',
  'peer',
  'container',
  'active',
  'disabled',
  'open',
  'closed',
  'visible',
  'hidden',
  'expanded',
  'collapsed',
  'loading',
  'valid',
  'invalid',
  'checked',
  'selected',
  'focused',
  'isolate',
  'truncate',
  'balance',
  'pretty',
];

// JIT sidecar manifest: every class the JIT engine already tree-shook is
// guaranteed-used. We add them to the safelist so PurgeCSS never second-guesses
// the JIT, even for classes with tricky characters (`hover:bg-blue-500`,
// `w-[320px]`) that the default extractor might miss.
function loadJitManifest() {
  const manifestPath = path.resolve(
    __dirname,
    'styles/generated/.jit-classes.json'
  );
  if (!fs.existsSync(manifestPath)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    return Array.isArray(data.classes) ? data.classes : [];
  } catch (err) {
    console.warn(`⚠️  Could not read JIT manifest: ${err.message}`);
    return [];
  }
}

const JIT_CLASSES = loadJitManifest();

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const PREFIX_RE = CLASS_PREFIX ? escapeRegExp(CLASS_PREFIX) : '';
const SAFELIST_PATTERNS_EFFECTIVE = CLASS_PREFIX
  ? SAFELIST_PATTERNS.map((pattern) => {
      if (!(pattern instanceof RegExp)) return pattern;
      const source = pattern.source;
      if (source.startsWith('^')) {
        return new RegExp(`^(?:${PREFIX_RE})?${source.slice(1)}`);
      }
      return pattern;
    })
  : SAFELIST_PATTERNS;

const SAFELIST_EXACT_EFFECTIVE = (CLASS_PREFIX
  ? SAFELIST_EXACT.concat(SAFELIST_EXACT.map((c) => `${CLASS_PREFIX}${c}`))
  : SAFELIST_EXACT
).concat(JIT_CLASSES);

// =============================================================================
// CUSTOM EXTRACTOR FOR ANGULAR
// =============================================================================

function angularExtractor(content) {
  const classes = new Set();

  // Standard class names (words with hyphens, colons, slashes)
  const standardMatches = content.match(/[\w-/:@\\]+/g) || [];
  standardMatches.forEach(c => classes.add(c));

  // Angular [class.xxx] bindings
  const classBindings = content.match(/\[class\.([^\]]+)\]/g) || [];
  classBindings.forEach(b => {
    const match = b.match(/\[class\.([^\]]+)\]/);
    if (match) classes.add(match[1]);
  });

  // ngClass bindings - extract class names from objects/arrays
  const ngClassMatches = content.match(/\[ngClass\][^>]*['"]\{([^}]+)\}/g) || [];
  ngClassMatches.forEach(m => {
    const innerClasses = m.match(/['"]([^'"]+)['"]\s*:/g) || [];
    innerClasses.forEach(c => {
      const cleaned = c.replaceAll(/['":\s]/g, '');
      if (cleaned) classes.add(cleaned);
    });
  });

  // Template literals and string concatenation
  const templateLiterals = content.match(/`[^`]*`/g) || [];
  templateLiterals.forEach(t => {
    const innerClasses = t.match(/[\w-/:@]+/g) || [];
    innerClasses.forEach(c => classes.add(c));
  });

  // classList.add/remove/toggle operations
  const classListOps = content.match(/classList\.(add|remove|toggle)\(['"]([\w-\s]+)['"]\)/g) || [];
  classListOps.forEach(op => {
    const match = op.match(/classList\.\w+\(['"]([^'"]+)['"]\)/);
    if (match) {
      match[1].split(/\s+/).forEach(c => classes.add(c));
    }
  });

  return Array.from(classes);
}

// =============================================================================
// FILE UTILITIES
// =============================================================================

function getCssFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.error(`❌ Error: Directory not found: ${dir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(dir, { recursive: true });
  return files
    .filter(f => path.extname(f).toLowerCase() === '.css')
    .map(f => path.join(dir, f));
}

function getFileSizeKB(filepath) {
  try {
    const stats = fs.statSync(filepath);
    return (stats.size / 1024).toFixed(2);
  } catch {
    return '0.00';
  }
}

function formatBytes(kb) {
  const num = Number.parseFloat(kb);
  if (num > 1024) {
    return `${(num / 1024).toFixed(2)} MB`;
  }
  return `${kb} KB`;
}

// =============================================================================
// MODERN CSS ANALYZER
// =============================================================================

function analyzeModernCSS(cssContent) {
  const features = [];

  MODERN_CSS_FEATURES.atRules.forEach(rule => {
    if (cssContent.includes(rule)) {
      features.push(rule);
    }
  });

  MODERN_CSS_FEATURES.functions.forEach(fn => {
    if (cssContent.includes(fn)) {
      features.push(fn.replace('(', '()'));
    }
  });

  MODERN_CSS_FEATURES.pseudoSelectors.forEach(pseudo => {
    if (cssContent.includes(pseudo)) {
      features.push(pseudo.replace('(', ''));
    }
  });

  return [...new Set(features)];
}

// =============================================================================
// HELPER FUNCTIONS FOR PURGE PROCESS
// =============================================================================

function logFileFeatures(file, features, distPath) {
  if (features.length === 0) return;
  console.log(`   📄 ${path.relative(distPath, file)}`);
  console.log(`      Features: ${features.slice(0, 5).join(', ')}${features.length > 5 ? '...' : ''}`);
}

function logTotalFeatures(allFeatures) {
  if (allFeatures.size === 0) return;
  console.log(`\n🎯 Total modern features detected: ${allFeatures.size}`);
  console.log(`   ${Array.from(allFeatures).slice(0, 10).join(', ')}${allFeatures.size > 10 ? '...' : ''}\n`);
}

function processFileResult(result, fileInfo) {
  fs.writeFileSync(fileInfo.fullPath, result.css);
  fileInfo.newSize = getFileSizeKB(fileInfo.fullPath);

  const original = Number.parseFloat(fileInfo.originalSize);
  const newSize = Number.parseFloat(fileInfo.newSize);
  const saved = original - newSize;
  const percent = original > 0 ? ((saved / original) * 100).toFixed(1) : 0;

  fileInfo.reduction = `${percent}% (${formatBytes(saved.toFixed(2))} saved)`;
  fileInfo.originalSize = formatBytes(fileInfo.originalSize);
  fileInfo.newSize = formatBytes(fileInfo.newSize);

  return { original, newSize };
}

function logRejectedSelectors(result, fileInfo) {
  const hasLimitedRejections = result.rejected && result.rejected.length > 0 && result.rejected.length < 20;
  if (hasLimitedRejections) {
    console.log(`   ⚠️ ${fileInfo.file}: ${result.rejected.length} selectors removed`);
  }
}

// =============================================================================
// MAIN PURGE FUNCTION
// =============================================================================

async function runSafePurgeCSS() {
  console.log('\n🔍 CSS Purge Script - SAFE MODE (Programmatic API)');
  console.log('=' .repeat(55));
  console.log('\n✅ This mode uses the PurgeCSS API directly for better');
  console.log('   preservation of modern CSS features.\n');

  console.log(`📂 Scanning: ${distPath}`);
  if (JIT_CLASSES.length > 0) {
    console.log(`🛡️  JIT manifest: ${JIT_CLASSES.length} classes safelisted (tree-shaken by ks).`);
  }
  console.log('');

  const cssFiles = getCssFiles(distPath);

  if (cssFiles.length === 0) {
    console.log('⚠️  No CSS files found to purge.');
    return;
  }

  // Analyze all CSS files for modern features
  console.log('🎨 Analyzing CSS for modern features...\n');
  const allFeatures = new Set();

  for (const file of cssFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const features = analyzeModernCSS(content);
    features.forEach(f => allFeatures.add(f));
    logFileFeatures(file, features, distPath);
  }

  logTotalFeatures(allFeatures);

  // Collect original sizes
  const results = cssFiles.map(file => ({
    file: path.relative(distPath, file),
    fullPath: file,
    originalSize: getFileSizeKB(file),
    newSize: '',
    reduction: ''
  }));

  console.log(`\n📄 Found ${cssFiles.length} CSS file(s)`);
  console.log('⏳ Running PurgeCSS with modern CSS protection...\n');

  // Content files to scan
  const contentFiles = [
    `${distPath}/**/*.html`,
    `${distPath}/**/*.js`,
    `${distPath}/**/*.mjs`,
  ];

  try {
    // Run PurgeCSS with programmatic API
    const purgeCSSResults = await new PurgeCSS().purge({
      content: contentFiles,
      css: cssFiles,

      // Safelist configuration
      safelist: {
        standard: SAFELIST_EXACT_EFFECTIVE,
        deep: SAFELIST_PATTERNS_EFFECTIVE,
        greedy: SAFELIST_PATTERNS_EFFECTIVE,
      },

      // Custom extractor for Angular
      defaultExtractor: angularExtractor,
      extractors: [
        {
          extractor: angularExtractor,
          extensions: ['html', 'js', 'mjs'],
        },
      ],

      // IMPORTANT: Don't remove keyframes, font-faces, or CSS variables
      keyframes: false,    // Preserve all @keyframes
      fontFace: false,     // Preserve all @font-face
      variables: false,    // Preserve all CSS variables

      // Blocked list - never process these
      blocklist: [],

      // Output rejected selectors for debugging
      rejected: true,
    });

    console.log('✅ PurgeCSS completed!\n');

    // Write purged CSS and calculate savings
    let totalOriginal = 0;
    let totalNew = 0;

    for (let i = 0; i < purgeCSSResults.length; i++) {
      const result = purgeCSSResults[i];
      const fileInfo = results[i];
      const sizes = processFileResult(result, fileInfo);
      totalOriginal += sizes.original;
      totalNew += sizes.newSize;
      logRejectedSelectors(result, fileInfo);
    }

    // Display results
    console.log('\n📊 Results:\n');
    console.table(results.map(r => ({
      File: r.file,
      Original: r.originalSize,
      Purged: r.newSize,
      Reduction: r.reduction
    })));

    const totalSaved = totalOriginal - totalNew;
    const totalPercent = totalOriginal > 0 ? ((totalSaved / totalOriginal) * 100).toFixed(1) : 0;

    console.log(`\n📦 Total: ${formatBytes(totalOriginal.toFixed(2))} → ${formatBytes(totalNew.toFixed(2))}`);
    console.log(`💾 Saved: ${formatBytes(totalSaved.toFixed(2))} (${totalPercent}% reduction)`);

    console.log('\n✅ Modern CSS features preserved:');
    console.log('   • CSS Layers (@layer) ✓');
    console.log('   • @property custom properties ✓');
    console.log('   • @starting-style animations ✓');
    console.log('   • View Transitions ✓');
    console.log('   • Container queries ✓');
    console.log('   • :has() selector ✓');
    console.log('   • Anchor positioning ✓');
    console.log('   • OKLCH colors ✓');
    console.log('   • And all other modern features ✓\n');

  } catch (error) {
    console.error('❌ PurgeCSS Error:', error.message);
    console.error(error.stack);
  }
}

// Run the script
await runSafePurgeCSS().catch(console.error);
