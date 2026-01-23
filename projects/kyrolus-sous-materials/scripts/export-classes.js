const fs = require("fs");
const path = require("path");

const workspaceRoot = path.resolve(__dirname, "..");
const distRoot = path.resolve(workspaceRoot, "..", "..", "dist");
const explicitCssPath = process.env.KS_CSS_PATH;

function findLatestStyles(rootDir) {
  if (!fs.existsSync(rootDir)) {
    return null;
  }

  const candidates = [];

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name === "styles.css") {
        const stat = fs.statSync(fullPath);
        candidates.push({ path: fullPath, mtimeMs: stat.mtimeMs });
      }
    }
  }

  walk(rootDir);
  if (!candidates.length) {
    return null;
  }

  candidates.sort((a, b) => b.mtimeMs - a.mtimeMs);
  return candidates[0].path;
}

const cssPath = explicitCssPath || findLatestStyles(distRoot);

if (!cssPath) {
  console.error(
    "No styles.css found. Run a build first or set KS_CSS_PATH to a CSS file."
  );
  process.exit(1);
}

if (!fs.existsSync(cssPath)) {
  console.error(`CSS file not found: ${cssPath}`);
  process.exit(1);
}

const css = fs.readFileSync(cssPath, "utf8");
const classes = new Set();

const selectorRegex = /([^{}]+)\{/g;

function isClassStart(ch) {
  return /[a-zA-Z_-]/.test(ch) || ch === "\\";
}

function isTerminator(ch) {
  return (
    ch === " " ||
    ch === "\n" ||
    ch === "\t" ||
    ch === "," ||
    ch === ">" ||
    ch === "+" ||
    ch === "~" ||
    ch === "[" ||
    ch === "]" ||
    ch === "(" ||
    ch === ")" ||
    ch === "{" ||
    ch === "}" ||
    ch === "." ||
    ch === "#" ||
    ch === ":"
  );
}

function extractClasses(selector) {
  for (let i = 0; i < selector.length; i += 1) {
    if (selector[i] !== ".") {
      continue;
    }

    const next = selector[i + 1];
    if (!next || !isClassStart(next)) {
      continue;
    }

    let name = "";
    let j = i + 1;
    while (j < selector.length) {
      const ch = selector[j];
      if (ch === "\\") {
        const escaped = selector[j + 1];
        if (!escaped) {
          break;
        }
        name += escaped;
        j += 2;
        continue;
      }
      if (isTerminator(ch)) {
        break;
      }
      name += ch;
      j += 1;
    }

    if (name) {
      classes.add(name);
    }

    i = j - 1;
  }
}

let match;
while ((match = selectorRegex.exec(css))) {
  const selector = match[1].trim();
  if (!selector || selector.startsWith("@")) {
    continue;
  }
  extractClasses(selector);
}

const list = Array.from(classes).sort();
const output = {
  generatedAt: new Date().toISOString(),
  source: path.relative(workspaceRoot, cssPath),
  count: list.length,
  classes: list,
};

const outputDir = path.resolve(workspaceRoot, "..", "..", "docs");
fs.mkdirSync(outputDir, { recursive: true });

const jsonPath = path.join(outputDir, "classes.json");
const txtPath = path.join(outputDir, "classes.txt");

fs.writeFileSync(jsonPath, JSON.stringify(output, null, 2) + "\n", "utf8");
fs.writeFileSync(txtPath, list.join("\n") + "\n", "utf8");

console.log(`Class export complete: ${jsonPath}`);
console.log(`Class list: ${txtPath}`);
console.log(`Classes: ${list.length}`);
console.log(`Source CSS: ${cssPath}`);
