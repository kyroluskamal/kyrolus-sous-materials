import { createBuilder, type BuilderContext, type BuilderOutput } from "@angular-devkit/architect";
import { buildApplication, type ApplicationBuilderOptions } from "@angular/build";
import { loadResolvedConfig, runOnce } from "../engine";

async function* run(
  options: ApplicationBuilderOptions,
  context: BuilderContext
): AsyncIterable<BuilderOutput> {
  try {
    const cfg = loadResolvedConfig(context.workspaceRoot);
    runOnce(cfg, (line) => context.logger.info(line));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    context.logger.error(`ks: JIT build failed — ${message}`);
    yield { success: false, error: message };
    return;
  }
  yield* buildApplication(options, context);
}

export default createBuilder<ApplicationBuilderOptions>(run);
