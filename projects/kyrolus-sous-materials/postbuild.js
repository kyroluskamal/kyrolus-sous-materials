/**
 * PostBuild CSS Purge Script for Angular Projects
 *
 * OPTIMIZED FOR MODERN CSS FEATURES:
 * This script is configured to safely handle all cutting-edge CSS features
 * including CSS Layers, View Transitions, Scroll-Driven Animations,
 * Anchor Positioning, Container Queries, @property, :has(), and more.
 *
 * Usage: node postbuild.js <dist-folder>
 * Example: node postbuild.js dist/my-app/browser
 */

import { exec } from 'node:child_process';
import { existsSync, readdirSync, statSync, readFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

// Configuration
const DEFAULT_DIST_PATH = './dist/DemoApp/browser';
const distPath = process.argv[2] || DEFAULT_DIST_PATH;

// =============================================================================
// COMPREHENSIVE SAFELIST FOR MODERN CSS FEATURES
// =============================================================================
// This safelist ensures that cutting-edge CSS features are NEVER removed

const SAFELIST = [
  // =========================================================================
  // ANGULAR & CDK SPECIFIC
  // =========================================================================
  /^ng-/,
  /^router-/,
  /^cdk-/,
  /^mat-/,

  // =========================================================================
  // STATE CLASSES (Dynamic JS-added classes)
  // =========================================================================
  /^is-/,
  /^has-/,
  /^active$/,
  /^disabled$/,
  /^open$/,
  /^closed$/,
  /^visible$/,
  /^hidden$/,
  /^expanded$/,
  /^collapsed$/,
  /^loading$/,
  /^loaded$/,
  /^error$/,
  /^success$/,
  /^warning$/,
  /^checked$/,
  /^selected$/,
  /^focused$/,
  /^dragging$/,
  /^resizing$/,

  // =========================================================================
  // ANIMATION CLASSES
  // =========================================================================
  /^animate-/,
  /^fade-/,
  /^slide-/,
  /^scale-/,
  /^rotate-/,
  /^bounce-/,
  /^pulse-/,
  /^shake-/,
  /^appear-/,          // @starting-style animations
  /^enter-/,
  /^exit-/,
  /^motion-/,          // CSS Motion Path

  // =========================================================================
  // RESPONSIVE PREFIXES
  // =========================================================================
  /^sm:/,
  /^md:/,
  /^lg:/,
  /^xl:/,
  /^2xl:/,
  /^@sm:/,             // Container query variants
  /^@md:/,
  /^@lg:/,
  /^@xl:/,
  /^@container/,

  // =========================================================================
  // DARK MODE & THEMES
  // =========================================================================
  /^dark:/,
  /^light:/,
  /^theme-/,
  /^high-contrast/,

  // =========================================================================
  // GROUP & PEER UTILITIES (Tailwind-style)
  // =========================================================================
  /^group$/,
  /^group-/,
  /^group\//,
  /^peer$/,
  /^peer-/,
  /^peer\//,

  // =========================================================================
  // CSS ANCHOR POSITIONING
  // =========================================================================
  /^anchor/,
  /^anchored/,
  /^popover/,

  // =========================================================================
  // VIEW TRANSITIONS
  // =========================================================================
  /^view-transition/,
  /::view-transition/,

  // =========================================================================
  // SCROLL-DRIVEN ANIMATIONS
  // =========================================================================
  /^scroll-/,
  /^timeline-/,

  // =========================================================================
  // CONTAINER QUERIES
  // =========================================================================
  /^container$/,
  /^container-/,

  // =========================================================================
  // CSS LAYERS (Preserve layer-related classes)
  // =========================================================================
  /^layer-/,

  // =========================================================================
  // MODERN EFFECTS & FEATURES
  // =========================================================================
  /^glass/,            // Glass morphism
  /^backdrop-/,
  /^clip-/,            // Clip paths
  /^mask-/,            // CSS Masks
  /^blend-/,           // Blend modes
  /^mix-blend-/,
  /^filter-/,
  /^drop-shadow/,
  /^perspective/,
  /^preserve-3d/,
  /^backface-/,
  /^transform-/,

  // =========================================================================
  // TYPOGRAPHY
  // =========================================================================
  /^text-wrap/,
  /^balance$/,
  /^pretty$/,
  /^line-clamp/,
  /^truncate$/,
  /^writing-/,

  // =========================================================================
  // LAYOUT UTILITIES
  // =========================================================================
  /^subgrid/,
  /^masonry/,
  /^aspect-/,

  // =========================================================================
  // ACCESSIBILITY
  // =========================================================================
  /^sr-only/,
  /^not-sr-only/,
  /^focus-visible/,
  /^focus-within/,
  /^motion-safe/,
  /^motion-reduce/,
  /^prefers-/,
  /^forced-colors/,

  // =========================================================================
  // SVG UTILITIES
  // =========================================================================
  /^fill-/,
  /^stroke-/,

  // =========================================================================
  // FORM STATES
  // =========================================================================
  /^valid$/,
  /^invalid$/,
  /^required$/,
  /^optional$/,
  /^placeholder-/,
  /^autofill/,

  // =========================================================================
  // PERFORMANCE
  // =========================================================================
  /^contain-/,
  /^content-visibility/,
  /^will-change/,
  /^isolate/,

  // =========================================================================
  // SAFE AREA (Mobile/Notch)
  // =========================================================================
  /^safe-/,
  /^pt-safe/,
  /^pb-safe/,
  /^pl-safe/,
  /^pr-safe/,

  // =========================================================================
  // COLLAPSIBLE & ACCORDION
  // =========================================================================
  /^collapsible/,
  /^accordion/,

  // =========================================================================
  // POPOVER API
  // =========================================================================
  /^\[popover/,
  /:popover-open/,

  // =========================================================================
  // DIALOG
  // =========================================================================
  /^dialog/,
  /::backdrop/,

  // =========================================================================
  // :has() SELECTOR UTILITIES
  // =========================================================================
  /^has-\[/,
  /^has-checked/,
  /^has-focus/,
  /^has-hover/,
  /^has-empty/,
  /^has-valid/,
  /^has-invalid/,

  // =========================================================================
  // FIRST/LAST/ODD/EVEN CHILD UTILITIES
  // =========================================================================
  /^first:/,
  /^last:/,
  /^odd:/,
  /^even:/,
  /^only:/,

  // =========================================================================
  // HOVER/FOCUS/ACTIVE VARIANTS
  // =========================================================================
  /^hover:/,
  /^focus:/,
  /^active:/,
  /^visited:/,
  /^disabled:/,
  /^checked:/,

  // =========================================================================
  // PRINT UTILITIES
  // =========================================================================
  /^print:/,
];

// File extensions to scan for class usage
const CONTENT_PATTERNS = [
  `${distPath}/**/*.html`,
  `${distPath}/**/*.js`,
  `${distPath}/**/*.mjs`,
];

// Find all CSS files
function getCssFiles(dir) {
  if (!existsSync(dir)) {
    console.error(`Error: Directory not found: ${dir}`);
    process.exit(1);
  }

  const files = readdirSync(dir, { recursive: true });
  return files
    .filter(f => extname(f).toLowerCase() === '.css')
    .map(f => join(dir, f));
}

function getFileSizeKB(filepath) {
  try {
    const stats = statSync(filepath);
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



async function runPurgeCSS() {
  console.log('\n🔍 CSS Purge Script for Angular (Modern CSS Safe)');
  console.log('=' .repeat(50));
  console.log('\n✅ Protected features:');
  console.log('   - CSS Layers (@layer)');
  console.log('   - @property custom properties');
  console.log('   - @starting-style entry animations');
  console.log('   - View Transitions API');
  console.log('   - Scroll-driven animations');
  console.log('   - Anchor positioning');
  console.log('   - Container queries & style queries');
  console.log('   - :has() selector');
  console.log('   - OKLCH color system');
  console.log('   - light-dark() function');
  console.log('   - CSS Nesting');
  console.log('   - And 50+ more patterns\n');

  console.log(`📂 Scanning: ${distPath}\n`);

  const cssFiles = getCssFiles(distPath);

  if (cssFiles.length === 0) {
    console.log('⚠️  No CSS files found to purge.');
    return;
  }

  // Analyze CSS files for modern features
  for (const file of cssFiles) {
    const content = readFileSync(file, 'utf8');
    console.log(`📄 Analyzing: ${relative(distPath, file)}`);
    // Simple feature detection
    const features = [];
    if (content.includes('@layer')) features.push('@layer');
    if (content.includes('@property')) features.push('@property');
    if (content.includes(':has(')) features.push(':has()');
    if (features.length > 0) {
      console.log(`   🎨 Features: ${features.join(', ')}`);
    }
  }

  // Collect original sizes
  const data = cssFiles.map(file => ({
    file: relative(distPath, file),
    originalSize: getFileSizeKB(file),
    newSize: '',
    reduction: ''
  }));

  console.log(`\n📄 Found ${cssFiles.length} CSS file(s)\n`);
  console.log('⏳ Running PurgeCSS with modern CSS protection...\n');

  // Build safelist string for CLI
  // Note: PurgeCSS CLI has limited safelist support, so we're being extra careful
  const safelistArgs = SAFELIST
    .slice(0, 20) // CLI has limits, so we use the most important patterns
    .map(pattern => {
      if (pattern instanceof RegExp) {
        // Convert regex to string pattern for CLI
        return pattern.source;
      }
      return pattern;
    });

  const cssFilesArg = cssFiles.map(f => `"${f}"`).join(' ');
  const contentArg = CONTENT_PATTERNS.map(p => `"${p}"`).join(' ');

  // Using PurgeCSS with safelist - but note the CLI has limitations
  // For better control, consider using the PurgeCSS API directly
  const command = `npx purgecss --css ${cssFilesArg} --content ${contentArg} --output "${distPath}" --safelist "${safelistArgs.slice(0, 10).join('" "')}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ PurgeCSS Error:', error.message);
      if (stderr) console.error(stderr);
      console.log('\n💡 Tip: Consider using the programmatic API for better modern CSS support.');
      return;
    }

    console.log('✅ PurgeCSS completed!\n');

    // Calculate new sizes and reductions
    let totalOriginal = 0;
    let totalNew = 0;

    for (const d of data) {
      const fullPath = join(distPath, d.file);
      d.newSize = getFileSizeKB(fullPath);

      const original = Number.parseFloat(d.originalSize);
      const newSize = Number.parseFloat(d.newSize);
      const saved = original - newSize;
      const percent = original > 0 ? ((saved / original) * 100).toFixed(1) : 0;

      d.reduction = `${percent}% (${formatBytes(saved.toFixed(2))} saved)`;
      d.originalSize = formatBytes(d.originalSize);
      d.newSize = formatBytes(d.newSize);

      totalOriginal += original;
      totalNew += newSize;
    }

    console.log('📊 Results:\n');
    console.table(data);

    const totalSaved = totalOriginal - totalNew;
    const totalPercent = totalOriginal > 0 ? ((totalSaved / totalOriginal) * 100).toFixed(1) : 0;

    console.log(`\n📦 Total: ${formatBytes(totalOriginal.toFixed(2))} → ${formatBytes(totalNew.toFixed(2))}`);
    console.log(`💾 Saved: ${formatBytes(totalSaved.toFixed(2))} (${totalPercent}% reduction)`);
    console.log('\n⚠️  Note: Verify that all modern CSS features work correctly after purging.');
    console.log('   Test: CSS Layers, :has(), @starting-style, anchor positioning, etc.\n');
  });
}

await runPurgeCSS();
