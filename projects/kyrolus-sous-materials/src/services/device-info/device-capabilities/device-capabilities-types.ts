export type ColorScheme = 'light' | 'dark' | 'no-preference';
export type ReducedMotion = 'reduce' | 'no-preference';
export type ContrastPreference = 'more' | 'less' | 'no-preference';
export type ColorGamut = 'srgb' | 'p3' | 'rec2020' | null;
export type DynamicRange = 'high' | 'standard';
export type Pointer = 'none' | 'coarse' | 'fine';
export type Hover = 'none' | 'hover';

export interface DeviceCapabilities {
  colorScheme: ColorScheme;
  reducedMotion: ReducedMotion;
  contrast: ContrastPreference;
  forcedColors: boolean;
  colorGamut: ColorGamut;
  dynamicRange: DynamicRange;
  pointer: Pointer;
  anyPointer: Pointer[];
  hover: Hover;
  anyHover: Hover[];
  reducedData: boolean | null;
}

export type MQLEvent = { matches: boolean; media: string };
export type MQLike = {
  media: string;
  matches: boolean;
  addEventListener?: (type: 'change', cb: (e: MQLEvent) => void) => void;
  removeEventListener?: (type: 'change', cb: (e: MQLEvent) => void) => void;
  addListener?: (cb: (e: MQLEvent) => void) => void;
  removeListener?: (cb: (e: MQLEvent) => void) => void;
};
