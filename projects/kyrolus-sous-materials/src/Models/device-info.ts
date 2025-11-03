export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'bot' | 'unknown';
export type AgentType = 'human' | 'bot' | 'headless' | 'preview' | 'unknown';

export type DeviceOperatingSystem =
  | 'Android'
  | 'iOS'
  | 'Windows'
  | 'macOS'
  | 'Linux'
  | 'ChromeOS'
  | 'Unknown';

export type DeviceBrowser =
  | 'Chrome'
  | 'Firefox'
  | 'Safari'
  | 'Edge'
  | 'Opera'
  | 'Samsung Internet'
  | 'Brave'
  | 'Vivaldi'
  | 'Yandex'
  | 'Torch'
  | 'Tor'
  | 'Chromium'
  | 'Unknown';

export type DeviceScreenInfo = {
  width: number;
  height: number;
  pixelRatio: number;
  orientation?: ScreenOrientation | string;
};

export class DeviceInfo {
  userAgent: string = '';
  agentType?: AgentType = 'unknown';
  vendor?: string = '';
  platform?: DeviceOperatingSystem = 'Unknown';
  deviceType?: DeviceType = 'unknown';
  platformVersion?: string = '';
  browser?: DeviceBrowser = 'Unknown';
  browserVersion?: string = '';
  language?: string = '';
  languages?: readonly string[] = [];
  timeZone?: string = '';
  maxTouchPoints?: number = 0;
  screen?: DeviceScreenInfo = { width: 0, height: 0, pixelRatio: 0 };
  hardwareConcurrency?: number = 0;
  deviceMemory?: number = 0;
  bitness?: Bitness;
  architecture?: string;
  formFactors?: string[];
  model?: string;
  wow64?: boolean;
  brands?: NavigatorUABrandVersion[];
}
export type ClientInfo = {
  brands?: NavigatorUABrandVersion[];
  platform?: string;
  mobile?: boolean;
  uaString?: string;
};
export type UAData = {
  brands: NavigatorUABrandVersion[];
  mobile: boolean;
  platform: string;
  getHighEntropyValues?: (hints: string[]) => Promise<Record<string, any>>;
};
export type EnvLocaleOptions = {
  locale: string;
  calendar: string;
  hourCycle: string;
  numberingSystem: string;
  region: string;
  timeZone: string;
};
export type EffectiveConnectionType =
  | 'slow-2g'
  | '2g'
  | '3g'
  | '4g'
  | 'unknown';

export type NetInfo = {
  effectiveType?: EffectiveConnectionType;
  saveData?: boolean;
  downlink?: number;
  rtt?: number;
};
export type Bitness = 32 | 64 | string | undefined;

export interface UAParsed {
  platform: DeviceOperatingSystem;
  platformVersion?: string;
  arch?: 'x86' | 'x64' | 'arm' | 'arm64' | 'ppc' | 'mips';
  bitness: Bitness;
  wow64?: boolean;
  browser: DeviceBrowser;
  browserVersion?: string;
}
export type UACHDataValues = Omit<UADataValues, 'formFactor'> & {
  formFactors?: readonly string[];
};
