const fs = require("fs");
const path = require("path");

const workspaceRoot = path.resolve(__dirname, "..");
const sources = [
  {
    name: "theme",
    file: path.join(workspaceRoot, "styles", "abstracts", "_theme.scss"),
  },
  {
    name: "semantic",
    file: path.join(workspaceRoot, "styles", "tokens", "_semantic.scss"),
  },
  {
    name: "component",
    file: path.join(workspaceRoot, "styles", "tokens", "_component-vars.scss"),
  },
  {
    name: "legacy",
    file: path.join(workspaceRoot, "styles", "abstracts", "_variables.scss"),
  },
];

const mapEndPattern = /^\s*\)\s*;?\s*$/;

function stripComments(line, state) {
  let output = line;

  if (state.inBlockComment) {
    const endIndex = output.indexOf("*/");
    if (endIndex === -1) {
      return { line: "", inBlockComment: true };
    }
    output = output.slice(endIndex + 2);
    state.inBlockComment = false;
  }

  while (true) {
    const blockStart = output.indexOf("/*");
    if (blockStart === -1) {
      break;
    }
    const blockEnd = output.indexOf("*/", blockStart + 2);
    if (blockEnd === -1) {
      output = output.slice(0, blockStart);
      state.inBlockComment = true;
      break;
    }
    output = output.slice(0, blockStart) + output.slice(blockEnd + 2);
  }

  const lineComment = output.indexOf("//");
  if (lineComment !== -1) {
    output = output.slice(0, lineComment);
  }

  return { line: output, inBlockComment: state.inBlockComment };
}

function cleanValue(value) {
  let cleaned = value.trim();
  cleaned = cleaned.replace(/[;,]\s*$/, "");
  return cleaned.trim();
}

function extractTokens(text) {
  const tokens = {};
  const lines = text.split(/\r?\n/);
  const commentState = { inBlockComment: false };
  let current = null;

  for (const rawLine of lines) {
    const stripped = stripComments(rawLine, commentState);
    const line = stripped.line;
    const trimmed = line.trim();

    if (!trimmed) {
      continue;
    }

    if (current) {
      current.valueParts.push(trimmed);

      if (/;\s*$/.test(trimmed)) {
        const value = cleanValue(current.valueParts.join(" "));
        tokens[current.name] = value;
        current = null;
      }

      continue;
    }

    const match = trimmed.match(/--([a-zA-Z0-9-]+)\s*:\s*(.*)$/);
    if (!match) {
      continue;
    }

    const name = `--${match[1]}`;
    const rest = match[2].trim();

    if (rest) {
      if (/;\s*$/.test(rest)) {
        tokens[name] = cleanValue(rest);
      } else {
        current = { name, valueParts: [rest] };
      }
    } else {
      current = { name, valueParts: [] };
    }
  }

  if (current) {
    tokens[current.name] = cleanValue(current.valueParts.join(" "));
  }

  return tokens;
}

function extractThemeMaps(text) {
  const maps = {
    light: {},
    dark: {},
    highContrast: {},
  };
  const lines = text.split(/\r?\n/);
  const commentState = { inBlockComment: false };
  let currentMap = null;
  let current = null;

  for (const rawLine of lines) {
    const stripped = stripComments(rawLine, commentState);
    const line = stripped.line;
    const trimmed = line.trim();

    if (!trimmed) {
      continue;
    }

    if (!currentMap) {
      if (/^\s*\$light-theme\s*:\s*\(/.test(trimmed)) {
        currentMap = "light";
        continue;
      }
      if (/^\s*\$dark-theme\s*:\s*\(/.test(trimmed)) {
        currentMap = "dark";
        continue;
      }
      if (/^\s*\$high-contrast-theme\s*:\s*\(/.test(trimmed)) {
        currentMap = "highContrast";
        continue;
      }
    }

    if (currentMap && mapEndPattern.test(trimmed)) {
      if (current) {
        const value = cleanValue(current.valueParts.join(" "));
        maps[currentMap][current.name] = value;
        current = null;
      }
      currentMap = null;
      continue;
    }

    if (!currentMap) {
      continue;
    }

    if (current) {
      if (trimmed === ")" || trimmed === ");") {
        const value = cleanValue(current.valueParts.join(" "));
        maps[currentMap][current.name] = value;
        current = null;
        currentMap = null;
        continue;
      }

      current.valueParts.push(trimmed);

      if (/,$/.test(trimmed)) {
        const value = cleanValue(current.valueParts.join(" "));
        maps[currentMap][current.name] = value;
        current = null;
      }

      continue;
    }

    const match = trimmed.match(/--([a-zA-Z0-9-]+)\s*:\s*(.*)$/);
    if (!match) {
      continue;
    }

    const name = `--${match[1]}`;
    const rest = match[2].trim();

    if (rest) {
      if (/,$/.test(rest)) {
        maps[currentMap][name] = cleanValue(rest);
      } else {
        current = { name, valueParts: [rest] };
      }
    } else {
      current = { name, valueParts: [] };
    }
  }

  if (current && currentMap) {
    maps[currentMap][current.name] = cleanValue(current.valueParts.join(" "));
  }

  return maps;
}

const grouped = {};
const merged = {};
const missing = [];

for (const source of sources) {
  if (!fs.existsSync(source.file)) {
    missing.push(source.file);
    continue;
  }

  const text = fs.readFileSync(source.file, "utf8");

  if (source.name === "theme") {
    grouped.theme = extractThemeMaps(text);
    continue;
  }

  const tokens = extractTokens(text);
  grouped[source.name] = tokens;

  for (const [key, value] of Object.entries(tokens)) {
    merged[key] = value;
  }
}

const output = {
  generatedAt: new Date().toISOString(),
  sources: sources.map((source) => ({
    name: source.name,
    file: path.relative(workspaceRoot, source.file),
  })),
  missingSources: missing.map((file) => path.relative(workspaceRoot, file)),
  tokens: grouped,
  merged,
};

const outputPath = path.resolve(workspaceRoot, "..", "..", "docs", "tokens.json");
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2) + "\n", "utf8");

console.log(`Token export complete: ${outputPath}`);
console.log(`Tokens (merged): ${Object.keys(merged).length}`);
if (missing.length) {
  console.warn(
    "Missing sources:",
    missing.map((file) => path.relative(workspaceRoot, file))
  );
}
