// Browser-safe entry point for the JIT engine.
// Excludes `scanner` + `engine` + `cli` which depend on `node:fs` / `node:path`.
// Suitable for bundling into a browser app (playground, online docs).

export { compile } from "./compiler";
export type { CompileInput, CompileResult } from "./compiler";
export { defaultTheme, mergeTheme } from "./config";
export { parseCandidate } from "./parser";
export { resolveVariant } from "./variants";
export type { Candidate, Theme } from "./types";
