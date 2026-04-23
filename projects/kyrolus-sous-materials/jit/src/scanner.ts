import * as fs from "node:fs";
import * as path from "node:path";

const CLASS_TOKEN_REGEX = /[@\-\w/:[\]#%.,()&=+>~*]+/g;

export interface ScanResult {
  files: string[];
  candidates: Set<string>;
}

export function scanFiles(globs: string[], root: string): ScanResult {
  const files = collectFiles(globs, root);
  const candidates = new Set<string>();
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, "utf8");
      extractCandidates(content, candidates);
    } catch {
      // ignore unreadable file
    }
  }
  return { files, candidates };
}

export function extractCandidates(content: string, out: Set<string>): void {
  const matches = content.match(CLASS_TOKEN_REGEX);
  if (!matches) return;
  for (const raw of matches) {
    const cleaned = cleanToken(raw);
    if (cleaned && isPotentialClass(cleaned)) {
      out.add(cleaned);
    }
  }
}

function cleanToken(token: string): string {
  let t = token.trim();
  while (/[.,;:]$/.test(t)) t = t.slice(0, -1);
  while (t.startsWith(".")) t = t.slice(1);
  return t;
}

function isPotentialClass(token: string): boolean {
  if (!token) return false;
  if (!/[a-zA-Z]/.test(token[0]!)) {
    const lead = token[0];
    if (lead !== "-" && lead !== "@" && lead !== "[" && lead !== "*") return false;
  }
  if (/^(https?:|\/|#[\da-f]+$|\d+px$|\d+rem$|\d+em$|\d+%$)/i.test(token)) return false;
  if (token.length > 128) return false;
  if (!/^[@\-\w/:[\]#%.,()&=+>~*]+$/.test(token)) return false;
  return true;
}

function collectFiles(globs: string[], root: string): string[] {
  const acc = new Set<string>();
  for (const g of globs) {
    const normalized = g.replace(/\\/g, "/");
    const parts = normalized.split("/**/");
    if (parts.length === 2) {
      const base = path.resolve(root, parts[0]!);
      const filePattern = parts[1]!;
      walkMatch(base, filePattern, acc);
    } else if (normalized.includes("*")) {
      const [baseDir, filePattern] = splitGlob(normalized);
      walkMatch(path.resolve(root, baseDir), filePattern, acc);
    } else {
      const full = path.resolve(root, normalized);
      if (fs.existsSync(full)) acc.add(full);
    }
  }
  return [...acc];
}

function splitGlob(glob: string): [string, string] {
  const idx = glob.indexOf("*");
  if (idx === -1) return [glob, ""];
  const baseEnd = glob.lastIndexOf("/", idx);
  if (baseEnd === -1) return [".", glob];
  return [glob.slice(0, baseEnd), glob.slice(baseEnd + 1)];
}

function walkMatch(base: string, filePattern: string, out: Set<string>): void {
  if (!fs.existsSync(base)) return;
  const regex = globToRegex(filePattern);
  const stack: string[] = [base];
  while (stack.length) {
    const dir = stack.pop()!;
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name === "node_modules" || e.name === "dist" || e.name.startsWith(".")) continue;
        stack.push(full);
      } else if (e.isFile() && regex.test(e.name)) {
        out.add(full);
      }
    }
  }
}

function globToRegex(pattern: string): RegExp {
  const escaped = pattern
    .replace(/[.+^${}()|\\]/g, "\\$&")
    .replace(/\*/g, ".*")
    .replace(/\?/g, ".");
  return new RegExp(`^${escaped}$`);
}
