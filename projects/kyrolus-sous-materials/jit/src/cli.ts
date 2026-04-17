import * as fs from "node:fs";
import * as path from "node:path";
import { compile } from "./compiler";
import { defaultTheme, mergeTheme } from "./config";
import { buildIntellisense } from "./enumerate";
import { scanFiles } from "./scanner";
import type { JitConfig } from "./types";

const CONFIG_FILENAMES = ["ks.config.js", "ks.config.cjs", "ks.config.json"];

function loadConfig(cwd: string): JitConfig {
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

function resolveConfig(cfg: JitConfig, cwd: string) {
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

function run(cfg: ReturnType<typeof resolveConfig>): void {
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

  // Sidecar manifest so downstream tools (e.g. PurgeCSS safelist in
  // postbuild-safe.js) can trust the JIT's tree-shaking without re-extracting.
  const manifestPath = path.join(path.dirname(cfg.output), ".jit-classes.json");
  const manifest = {
    generatedAt: new Date().toISOString(),
    count: result.matchedClasses.length,
    classes: result.matchedClasses,
  };
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");

  const ms = Date.now() - start;
  const sizeKB = (Buffer.byteLength(result.css) / 1024).toFixed(2);
  console.log(
    `ks: ${result.matched} utilities, ${scan.files.length} files scanned, ${sizeKB} KB, ${ms} ms`
  );
  if (result.unmatched.length && process.env.KS_VERBOSE) {
    const sample = result.unmatched.slice(0, 20).join(", ");
    console.log(`   (unmatched sample: ${sample}${result.unmatched.length > 20 ? ", ..." : ""})`);
  }
}

function watch(cfg: ReturnType<typeof resolveConfig>): void {
  run(cfg);
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
        run(cfg);
      } catch (err) {
        console.error("ks: error", err);
      }
    }, 100);
  };
  for (const dir of watchRoots) {
    try {
      fs.watch(dir, { recursive: true }, (_event, filename) => {
        if (!filename) return;
        const str = filename.toString();
        if (str.endsWith(".html") || str.endsWith(".ts")) trigger();
      });
      console.log(`ks: watching ${dir}`);
    } catch (err) {
      console.warn(`ks: cannot watch ${dir}:`, err);
    }
  }
}

function main(argv: string[]): void {
  const [, , cmd = "build"] = argv;
  const cwd = process.cwd();
  const rawCfg = loadConfig(cwd);
  const cfg = resolveConfig(rawCfg, cwd);
  if (cmd === "build") {
    run(cfg);
  } else if (cmd === "watch") {
    watch(cfg);
  } else if (cmd === "init") {
    init(cwd);
  } else if (cmd === "intellisense") {
    intellisense(cfg, argv.slice(3));
  } else {
    console.error(`ks: unknown command "${cmd}". Use "build", "watch", "init", or "intellisense".`);
    process.exit(1);
  }
}

function intellisense(cfg: ReturnType<typeof resolveConfig>, args: string[]): void {
  const start = Date.now();
  const outputArg = args.find((a) => a.startsWith("--output="))?.slice("--output=".length);
  const noVerify = args.includes("--no-verify");
  const target = outputArg
    ? path.resolve(cfg.cwd, outputArg)
    : path.resolve(
        cfg.cwd,
        "projects/kyrolus-sous-materials/styles/intellisense/ks-classes.json"
      );

  const data = buildIntellisense(cfg.theme, { verifyParity: !noVerify });

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, JSON.stringify(data, null, 2) + "\n", "utf8");

  const ms = Date.now() - start;
  console.log(
    `ks intellisense: ${data.meta.totalClasses} classes in ${data.meta.groups} groups, ${ms} ms -> ${path.relative(cfg.cwd, target)}`
  );
  if (data.meta.parityMismatches.length) {
    console.error(
      `ks: ${data.meta.parityMismatches.length} enumerated classes failed to compile via JIT matchers — catalog is out of sync.`
    );
    const sample = data.meta.parityMismatches.slice(0, 20).join(", ");
    console.error(
      `   sample: ${sample}${data.meta.parityMismatches.length > 20 ? ", ..." : ""}`
    );
    process.exit(2);
  }
}

function init(cwd: string): void {
  const target = path.join(cwd, "ks.config.js");
  if (fs.existsSync(target)) {
    console.error(`ks: ${target} already exists`);
    process.exit(1);
  }
  fs.writeFileSync(
    target,
    `module.exports = {
  content: [
    "projects/demo-app/src/**/*.html",
    "projects/demo-app/src/**/*.ts",
    "projects/kyrolus-sous-materials/src/**/*.html",
    "projects/kyrolus-sous-materials/src/**/*.ts",
  ],
  output: "projects/kyrolus-sous-materials/styles/generated/_jit.css",
  darkMode: "dataAttribute",
  layer: "utilities",
};
`,
    "utf8"
  );
  console.log(`ks: created ${target}`);
}

main(process.argv);
