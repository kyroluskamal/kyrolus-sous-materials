import * as fs from "node:fs";
import * as path from "node:path";
import { compile } from "./compiler";
import { defaultTheme, mergeTheme } from "./config";
import { scanFiles } from "./scanner";
import type { JitConfig, Theme } from "./types";

const CONFIG_FILENAMES = ["ks.config.js", "ks.config.cjs", "ks.config.json"];

export interface ResolvedConfig {
  content: string[];
  output: string;
  theme: Theme;
  darkMode: "class" | "dataAttribute";
  layer: string;
  cwd: string;
}

export function loadConfig(cwd: string): JitConfig {
  for (const name of CONFIG_FILENAMES) {
    const full = path.join(cwd, name);
    if (fs.existsSync(full)) {
      if (name.endsWith(".json")) {
        return JSON.parse(fs.readFileSync(full, "utf8")) as JitConfig;
      }
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const loaded = require(full);
      return (loaded.default ?? loaded) as JitConfig;
    }
  }
  return {
    content: ["**/*.html", "**/*.ts"],
    output: "src/jit.css",
  };
}

export function resolveConfig(cfg: JitConfig, cwd: string): ResolvedConfig {
  const theme = mergeTheme(defaultTheme, cfg.theme);
  return {
    content: cfg.content,
    output: path.resolve(cwd, cfg.output),
    theme,
    darkMode: cfg.darkMode ?? "dataAttribute",
    layer: cfg.layer ?? "utilities",
    cwd,
  };
}

export function loadResolvedConfig(cwd: string): ResolvedConfig {
  return resolveConfig(loadConfig(cwd), cwd);
}

export interface RunStats {
  matched: number;
  files: number;
  sizeKB: string;
  ms: number;
  unmatched: string[];
}

export function runOnce(
  cfg: ResolvedConfig,
  log: (line: string) => void = console.log
): RunStats {
  const start = Date.now();
  const scan = scanFiles(cfg.content, cfg.cwd);
  const result = compile({
    candidates: scan.candidates,
    theme: cfg.theme,
    darkMode: cfg.darkMode,
    layer: cfg.layer,
  });

  fs.mkdirSync(path.dirname(cfg.output), { recursive: true });
  fs.writeFileSync(cfg.output, result.css, "utf8");

  const manifestPath = path.join(path.dirname(cfg.output), ".jit-classes.json");
  const manifest = {
    generatedAt: new Date().toISOString(),
    count: result.matchedClasses.length,
    classes: result.matchedClasses,
  };
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");

  const ms = Date.now() - start;
  const sizeKB = (Buffer.byteLength(result.css) / 1024).toFixed(2);
  log(
    `ks: ${result.matched} utilities, ${scan.files.length} files scanned, ${sizeKB} KB, ${ms} ms`
  );
  if (result.unmatched.length && process.env.KS_VERBOSE) {
    const sample = result.unmatched.slice(0, 20).join(", ");
    log(`   (unmatched sample: ${sample}${result.unmatched.length > 20 ? ", ..." : ""})`);
  }

  return {
    matched: result.matched,
    files: scan.files.length,
    sizeKB,
    ms,
    unmatched: result.unmatched,
  };
}

export interface Watcher {
  close(): void;
}

export function startWatcher(
  cfg: ResolvedConfig,
  log: (line: string) => void = console.log,
  onError: (err: unknown) => void = (err) => console.error("ks: error", err)
): Watcher {
  runOnce(cfg, log);
  const watchers: fs.FSWatcher[] = [];
  const watchRoots = new Set<string>();
  for (const glob of cfg.content) {
    const base = glob.split("*")[0]!.replace(/\\/g, "/");
    const baseDir = base.endsWith("/") ? base.slice(0, -1) : base;
    const resolved = path.resolve(cfg.cwd, baseDir || ".");
    if (fs.existsSync(resolved)) watchRoots.add(resolved);
  }
  let pending: NodeJS.Timeout | null = null;
  const trigger = () => {
    if (pending) clearTimeout(pending);
    pending = setTimeout(() => {
      try {
        runOnce(cfg, log);
      } catch (err) {
        onError(err);
      }
    }, 100);
  };
  for (const dir of watchRoots) {
    try {
      const w = fs.watch(dir, { recursive: true }, (_event, filename) => {
        if (!filename) return;
        const str = filename.toString();
        if (str.endsWith(".html") || str.endsWith(".ts")) trigger();
      });
      watchers.push(w);
      log(`ks: watching ${dir}`);
    } catch (err) {
      console.warn(`ks: cannot watch ${dir}:`, err);
    }
  }
  return {
    close(): void {
      if (pending) clearTimeout(pending);
      for (const w of watchers) {
        try {
          w.close();
        } catch {
          /* ignore */
        }
      }
    },
  };
}
