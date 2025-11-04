import { DeviceBrowser } from "projects/kyrolus-sous-materials/src/models/models.exports";

export type Hints =
  | 'architecture'
  | 'bitness'
  | 'fullVersionList'
  | 'model'
  | 'platformVersion'
  | 'wow64'
  | 'uaFullVersion'
  | 'platform'
  | 'brands'
  | 'formFactors'
  | 'mobile';
export type BrowserHit = { browser: DeviceBrowser; browserVersion?: string };
export type SimpleRule = {
  re: RegExp;
  brand: DeviceBrowser | 'Torch' | 'Tor';
  verIdx?: number;
};
export const isBotUA = (ua: string) =>
  /(applebot|googlebot(?:-(?:image|video|news))?|bingbot|duckduckbot|baiduspider|yandex(?:bot|images|accessibilitybot)?)/i.test(
    ua
  ) ||
  /(petalbot|sogou|seznambot|qwantify|ia_archiver|mj12bot|ahrefsbot|semrushbot|crawler|spider)/i.test(
    ua
  );

export const isNonBrowserUA = (ua: string) =>
  /steam.+gameoverlay/i.test(ua) || /epicgameslauncher/i.test(ua);
