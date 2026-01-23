const { PurgeCSS } = require('purgecss');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

function angularExtractor(content) {
  const classes = new Set();

  const standardMatches = content.match(/[\w-/:@\\]+/g) || [];
  standardMatches.forEach(c => classes.add(c));

  const classBindings = content.match(/\[class\.([^\]]+)\]/g) || [];
  classBindings.forEach(b => {
    const match = b.match(/\[class\.([^\]]+)\]/);
    if (match) classes.add(match[1]);
  });

  const ngClassMatches = content.match(/\[ngClass\][^>]*['"]\{([^}]+)\}/g) || [];
  ngClassMatches.forEach(m => {
    const innerClasses = m.match(/['"]([^'"]+)['"]\s*:/g) || [];
    innerClasses.forEach(c => {
      const cleaned = c.replaceAll(/['":\s]/g, '');
      if (cleaned) classes.add(cleaned);
    });
  });

  const templateLiterals = content.match(/`[^`]*`/g) || [];
  templateLiterals.forEach(t => {
    const innerClasses = t.match(/[\w-/:@]+/g) || [];
    innerClasses.forEach(c => classes.add(c));
  });

  const classListOps = content.match(/classList\.(add|remove|toggle)\(['"]([\w-\s]+)['"]\)/g) || [];
  classListOps.forEach(op => {
    const match = op.match(/classList\.\w+\(['"]([^'"]+)['"]\)/);
    if (match) {
      match[1].split(/\s+/).forEach(c => classes.add(c));
    }
  });

  return Array.from(classes);
}

function assertContains(output, needle, label) {
  if (!output.includes(needle)) {
    throw new Error(`Expected selector to remain: ${label}`);
  }
}

function assertNotContains(output, needle, label) {
  if (output.includes(needle)) {
    throw new Error(`Expected selector to be removed: ${label}`);
  }
}

async function run() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ks-purge-'));
  const htmlPath = path.join(tmpDir, 'index.html');
  const jsPath = path.join(tmpDir, 'app.js');
  const cssPath = path.join(tmpDir, 'styles.css');

  const html = `
    <div class="btn hover:btn dark:btn group card">
      <span class="group-hover:visible">Hello</span>
    </div>
  `;

  const js = `
    const el = document.querySelector('.btn');
    el.classList.add('dynamic-class');
  `;

  const css = `
    .btn { color: red; }
    .card { padding: 1rem; }
    .hover\\:btn:hover { color: blue; }
    .dark\\:btn { color: white; }
    .group:hover .group-hover\\:visible { opacity: 1; }
    .dynamic-class { border: 1px solid black; }
    .unused { display: none; }
  `;

  fs.writeFileSync(htmlPath, html.trim());
  fs.writeFileSync(jsPath, js.trim());
  fs.writeFileSync(cssPath, css.trim());

  const results = await new PurgeCSS().purge({
    content: [htmlPath, jsPath],
    css: [cssPath],
    safelist: {
      standard: ['dynamic-class'],
      deep: [/^hover:/, /^dark:/, /^group/],
      greedy: [/^hover:/, /^dark:/, /^group/],
    },
    defaultExtractor: angularExtractor,
    extractors: [
      {
        extractor: angularExtractor,
        extensions: ['html', 'js'],
      },
    ],
    keyframes: false,
    fontFace: false,
    variables: false,
  });

  const output = results[0].css;

  assertContains(output, '.btn', '.btn');
  assertContains(output, '.hover\\:btn:hover', '.hover:btn:hover');
  assertContains(output, '.dark\\:btn', '.dark:btn');
  assertContains(output, '.group-hover\\:visible', '.group-hover:visible');
  assertContains(output, '.dynamic-class', '.dynamic-class');
  assertNotContains(output, '.unused', '.unused');

  fs.rmSync(tmpDir, { recursive: true, force: true });
  console.log('✅ PurgeCSS smoke test passed.');
}

run().catch((error) => {
  console.error('❌ PurgeCSS smoke test failed:', error.message);
  process.exitCode = 1;
});
