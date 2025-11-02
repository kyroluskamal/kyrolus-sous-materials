import {
  AgentType,
  Bitness,
  DeviceBrowser,
  DeviceInfo,
  DeviceOperatingSystem,
  DeviceType,
} from 'projects/kyrolus-sous-materials/src/models/device-info';

export type deviceInfoTests = {
  sectionNo: string;
  sectonName: string;
  test: {
    testName: string;
    navMock: string;
    expect: DeviceInfo;
  }[];
};
export type UAMockInput = {
  ua: string;
  vendor?: string;
  lang?: string;
  langs?: string[];
  timeZone?: string;
  maxTouchPoints?: number;
  hardwareConcurrency?: number;
  deviceMemory?: number;
  innerWidth?: number;
  innerHeight?: number;
  dpr?: number;
  pluginsCount?: number;
  platform?: string;
  orientation?: ScreenOrientation | string;
};
export type MockupCases = {
  testName: string;
  ua: string;
  platformVersion?: string;
  browser: DeviceBrowser;
  browserVersion?: string;
  deviceType: DeviceType;
  vendor?: string;
  maxTouchPoints?: number;
  hardwareConcurrency?: number;
  deviceMemory?: number;
  width?: number;
  height?: number;
  uaChUndefinedArchitecture?: boolean;
  uaChUndefinedPlatform?: boolean;
  uaChUndefinedPlatformVersion?: boolean;
  pixelRatio?: number;
  orientation?: string;
  platform?: string;
  agentType?: AgentType;
  architecture?: string;
  bitness?: Bitness;
  wow64?: boolean;
  uaLowCHUndefinedBrands?: boolean;
  language?: string;
  usChBrowserversion?: string;
  languages?: string[];
  uaChUndefinedBrands?: boolean;
  uaChUndefinedBitness?: boolean;
  uaChUndefinedWow64?: boolean;
  fullVersionList?: NavigatorUABrandVersion[];
};

export type Preset =
  | 'windows'
  | 'android'
  | 'chromeOSDesktop'
  | 'chromeOSTablet'
  | 'ios'
  | 'linux'
  | 'macos';
export type ExpectedArgs = {
  ua: string;
  platform: DeviceOperatingSystem;
  platformVersion?: string;
  browser: DeviceBrowser;
  deviceType: DeviceType;
  browserVersion?: string;
  agentType?: AgentType;
  vendor?: string;
  language?: string;
  languages?: readonly string[];
  timeZone?: string;
  maxTouchPoints?: number;
  width?: number;
  height?: number;
  pixelRatio?: number;
  architecture?: string;
  bitness?: Bitness;
  wow64?: boolean;
  hardwareConcurrency?: number;
  deviceMemory?: number;
  orientation?: OrientationType;
  formFactors?: string[];
  model?: string;
  brands?: readonly any[];
};
type UAChHighHints = Partial<{
  architecture?: string;
  bitness?: Bitness;
  wow64?: boolean;
  platformVersion?: string;
  fullVersion?: string;
  formFactors?: string[];
  model?: string;
}>;

export type UAChArgs = UAMockInput & {
  // UA-CH low bits
  brands: readonly { brand: string; version: string }[];
  uaChPlatform?: string;
  uaChUndefinedPlatform: boolean;
  uaLowCHUndefinedBrands: boolean;
  uaChUndefinedPlatformVersion: boolean;
  mobile?: boolean;
  navPlatform?: string;
  brave?: boolean;
  uaChUndefinedBrands: boolean;
  high?: UAChHighHints;
};
