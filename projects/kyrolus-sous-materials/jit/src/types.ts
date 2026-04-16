export type CssDecl = Record<string, string | number | undefined>;

export type UtilityResult = CssDecl | CssDecl[] | null;

export interface UtilityContext {
  theme: Theme;
  value?: string;
  negative: boolean;
  arbitrary: boolean;
}

export interface UtilityDef {
  name: string;
  match: (token: string, ctx: UtilityContext) => UtilityResult;
}

export interface Theme {
  prefix: string;
  spacing: Record<string, string>;
  colors: Record<string, string | Record<string, string>>;
  fontFamily: Record<string, string>;
  fontSize: Record<string, [string, { lineHeight?: string; letterSpacing?: string }] | string>;
  fontWeight: Record<string, string>;
  lineHeight: Record<string, string>;
  letterSpacing: Record<string, string>;
  radius: Record<string, string>;
  borderWidth: Record<string, string>;
  shadow: Record<string, string>;
  opacity: Record<string, string>;
  zIndex: Record<string, string>;
  breakpoints: Record<string, string>;
  containerBreakpoints: Record<string, string>;
  transitionDuration: Record<string, string>;
  transitionTiming: Record<string, string>;
  aspectRatio: Record<string, string>;
}

export interface Candidate {
  raw: string;
  variants: string[];
  base: string;
  utility?: string;
  value?: string;
  negative: boolean;
  arbitrary: boolean;
}

export interface VariantDef {
  name: string;
  match: (variant: string) => VariantMatch | null;
}

export interface VariantMatch {
  wrap: (selector: string, css: string) => string;
  kind: "selector" | "atRule" | "parent";
  order: number;
}

export interface CompileOptions {
  theme: Theme;
  layer: string;
}

export interface JitConfig {
  content: string[];
  output: string;
  theme?: Partial<Theme>;
  prefix?: string;
  darkMode?: "class" | "dataAttribute";
  layer?: string;
}
