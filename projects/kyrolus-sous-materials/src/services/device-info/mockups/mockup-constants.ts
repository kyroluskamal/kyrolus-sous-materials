export const PRESET_WINDOWS = {
  maxTouchPoints: 0,
  innerWidth: 1200,
  innerHeight: 800,
  dpr: 1,
  pluginsCount: 3,
  hardwareConcurrency: 8,
  deviceMemory: 8,
} as const;

export const PRESET_Android = {
  maxTouchPoints: 5,
  innerWidth: 412,
  innerHeight: 915,
  dpr: 3,
  pluginsCount: 0,
  hardwareConcurrency: 8,
  deviceMemory: 8,
} as const;

export const PRESET_ChromeOS_DESKTOP = {
  maxTouchPoints: 0,
  innerWidth: 1366,
  innerHeight: 768,
  dpr: 1,
  pluginsCount: 3,
  hardwareConcurrency: 8,
  deviceMemory: 8,
} as const;

export const PRESET_ChromeOS_TABLET = {
  maxTouchPoints: 10,
  innerWidth: 1280,
  innerHeight: 800,
  dpr: 2,
  pluginsCount: 0,
  hardwareConcurrency: 8,
  deviceMemory: 8,
} as const;
export const PRESET_iOS = {
  maxTouchPoints: 5,
  innerWidth: 390,
  innerHeight: 844,
  dpr: 3,
  pluginsCount: 0,
  hardwareConcurrency: 8,
  deviceMemory: 8,
} as const;

export const PRESET_Linux = {
  maxTouchPoints: 0,
  innerWidth: 1200,
  innerHeight: 800,
  dpr: 1,
  pluginsCount: 3,
  hardwareConcurrency: 8,
  deviceMemory: 8,
} as const;

export const PRESET_macOS = {
  maxTouchPoints: 0,
  innerWidth: 1440,
  innerHeight: 900,
  dpr: 2,
  pluginsCount: 3,
  hardwareConcurrency: 8,
  deviceMemory: 8,
} as const;

export const PLATFORM_DEFAULTS: Record<
  string,
  {
    width: number;
    height: number;
    pixelRatio: number;
    maxTouchPoints: number;
    hardwareConcurrency: number;
    deviceMemory: number;
  }
> = {
  windows: {
    width: 1200,
    height: 800,
    pixelRatio: 1,
    maxTouchPoints: 0,
    hardwareConcurrency: 8,
    deviceMemory: 8,
  },
  android: {
    width: 412,
    height: 915,
    pixelRatio: 3,
    maxTouchPoints: 5,
    hardwareConcurrency: 8,
    deviceMemory: 8,
  },
  ios: {
    width: 390,
    height: 844,
    pixelRatio: 3,
    maxTouchPoints: 5,
    hardwareConcurrency: 8,
    deviceMemory: 8,
  },
  macOS: {
    width: 1440,
    height: 900,
    pixelRatio: 2,
    maxTouchPoints: 0,
    hardwareConcurrency: 8,
    deviceMemory: 8,
  },
  linux: {
    width: 1200,
    height: 800,
    pixelRatio: 1,
    maxTouchPoints: 0,
    hardwareConcurrency: 8,
    deviceMemory: 8,
  },
  chromeOSDesktop: {
    width: 1366,
    height: 768,
    pixelRatio: 1,
    maxTouchPoints: 0,
    hardwareConcurrency: 8,
    deviceMemory: 8,
  },
  chromeOSTablet: {
    width: 1280,
    height: 800,
    pixelRatio: 2,
    maxTouchPoints: 10,
    hardwareConcurrency: 8,
    deviceMemory: 8,
  },
};

export const DEFAULT_LANG = 'en-US';
export const DEFAULT_LANGS = ['en-US', 'ar-EG'] as const;
export const DEFAULT_TZ = 'Europe/Madrid';
