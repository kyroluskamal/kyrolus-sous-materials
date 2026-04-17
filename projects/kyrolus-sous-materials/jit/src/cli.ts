import * as fs from "node:fs";
import * as path from "node:path";
import { loadResolvedConfig, runOnce, startWatcher, type ResolvedConfig } from "./engine";
import { buildIntellisense } from "./enumerate";

function main(argv: string[]): void {
  const [, , cmd = "build"] = argv;
  const cwd = process.cwd();
  if (cmd === "init") {
    init(cwd);
    return;
  }
  const cfg = loadResolvedConfig(cwd);
  if (cmd === "build") {
    runOnce(cfg);
  } else if (cmd === "watch") {
    startWatcher(cfg);
  } else if (cmd === "intellisense") {
    intellisense(cfg, argv.slice(3));
  } else {
    console.error(
      `ks: unknown command "${cmd}". Use "build", "watch", "init", or "intellisense".`
    );
    process.exit(1);
  }
}

function intellisense(cfg: ResolvedConfig, args: string[]): void {
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
