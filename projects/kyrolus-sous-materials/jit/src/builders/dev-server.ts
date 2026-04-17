import { createBuilder, type BuilderContext, type BuilderOutput } from "@angular-devkit/architect";
import { executeDevServerBuilder, type DevServerBuilderOptions } from "@angular/build";
import { loadResolvedConfig, startWatcher, type Watcher } from "../engine";

async function* run(
  options: DevServerBuilderOptions,
  context: BuilderContext
): AsyncIterable<BuilderOutput> {
  let watcher: Watcher | null = null;
  try {
    const cfg = loadResolvedConfig(context.workspaceRoot);
    watcher = startWatcher(cfg, (line) => context.logger.info(line));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    context.logger.error(`ks: JIT watcher failed to start — ${message}`);
    yield { success: false, error: message };
    return;
  }
  try {
    yield* executeDevServerBuilder(options, context);
  } finally {
    watcher.close();
  }
}

export default createBuilder<DevServerBuilderOptions>(run);
