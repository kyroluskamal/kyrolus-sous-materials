import type { Matcher } from "./helpers";
import { borderMatchers } from "./borders";
import { colorMatchers } from "./colors";
import { effectsMatchers } from "./effects";
import { flexGridMatchers } from "./flexgrid";
import { interactiveMatchers } from "./interactive";
import { layoutMatchers } from "./layout";
import { transitionMatchers } from "./transitions";
import { typographyMatchers } from "./typography";

export const allMatchers: Matcher[] = [
  ...layoutMatchers,
  ...flexGridMatchers,
  ...typographyMatchers,
  ...colorMatchers,
  ...borderMatchers,
  ...effectsMatchers,
  ...transitionMatchers,
  ...interactiveMatchers,
];

export type { Matcher };
