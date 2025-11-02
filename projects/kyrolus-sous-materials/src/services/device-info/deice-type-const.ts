import { BrowserHit, Hints, SimpleRule } from './device-service-types';

export const HINTS: readonly Hints[] = [
  'brands',
  'mobile',
  'platform',
  'architecture',
  'bitness',
  'formFactors',
  'model',
  'platformVersion',
  'fullVersionList',
  'uaFullVersion',
  'wow64',
] as const;
export const SIMPLE_RULES: SimpleRule[] = [
  { re: /\b(edg|edgios|edga)\/([\d.]+)/i, brand: 'Edge', verIdx: 2 }, // Chromium Edge
  { re: /\b(?:OPR|OPT|OPiOS)\/([\d.]+)/i, brand: 'Opera', verIdx: 1 },
  { re: /\bHeadlessChrome\/([\d.]+)/i, brand: 'Chrome', verIdx: 1 }, // Headless Chrome
  { re: /\bSamsungBrowser\/([\d.]+)/i, brand: 'Samsung Internet', verIdx: 1 },
  { re: /\b(YaBrowser|YandexBrowser)\/([\d.]+)/i, brand: 'Yandex', verIdx: 2 },
  { re: /\bVivaldi\/([\d.]+)/i, brand: 'Vivaldi', verIdx: 1 },
  { re: /\bBrave\/([\d.]+)/i, brand: 'Brave', verIdx: 1 },
  { re: /\bTorch\/([\d.]+)/i, brand: 'Torch', verIdx: 1 }, // Torch
];

export const classifyBySimpleRules = (ua: string): BrowserHit | undefined => {
  for (const r of SIMPLE_RULES) {
    const m = r.re.exec(ua);
    /* v8 ignore next */
    if (m) return { browser: r.brand as any, browserVersion: m[r.verIdx ?? 1] };
  }
  return undefined;
};
/* v8 ignore start */

export const parseOperaPresto = (ua: string): BrowserHit | undefined => {
  if (!/Opera/i.test(ua)) return undefined;
  const v =
    /\bVersion\/([\d.]+)/i.exec(ua)?.[1] ?? /\bOpera\/([\d.]+)/i.exec(ua)?.[1];
  return { browser: 'Opera', browserVersion: v || undefined };
};

export const parseEdgeHTML = (ua: string): BrowserHit | undefined => {
  const m = /\bEdge\/([\d.]+)/i.exec(ua);
  if (!m) return undefined;
  const isWinPhone = /(windows phone|iemobile)/i.test(ua);
  return isWinPhone
    ? { browser: 'Edge', browserVersion: m[1] }
    : { browser: 'Unknown' };
};

export const parseTor = (ua: string): BrowserHit | undefined => {
  const m = /\bTor(?:Browser)?\/([\d.]+)/i.exec(ua);
  if (!m) return undefined;
  const fx = /\b(firefox|fxios)\/([\d.]+)/i.exec(ua);
  return { browser: 'Tor' as any, browserVersion: fx ? fx[2] : m[1] };
};

export const parseChromeToken = (ua: string): BrowserHit | undefined => {
  const m = /\b(chrome|crios)\/([\d.]+)/i.exec(ua);
  if (!m) return undefined;
  if (/(edg|edge|opr|opera|chromium)/i.test(ua)) return undefined;
  return { browser: 'Chrome', browserVersion: m[2] };
};

export const parseFirefoxToken = (ua: string): BrowserHit | undefined => {
  const m = /\b(firefox|fxios)\/([\d.]+)/i.exec(ua);
  return m ? { browser: 'Firefox', browserVersion: m[2] } : undefined;
};

export const parseSafariToken = (ua: string): BrowserHit | undefined => {
  if (!/safari\//i.test(ua)) return undefined;
  if (/(chrome|crios|chromium|edg|edge|opr|opera|opt|opios)/i.test(ua))
    return undefined;
  const v = /version\/([\d.]+)/i.exec(ua)?.[1];
  return v ? { browser: 'Safari', browserVersion: v } : undefined;
};
export const parseIEToken = (ua: string): BrowserHit | undefined => {
  if (/\bMSIE\s[\d.]+/i.test(ua) || /Trident\/\d+.*;\s*rv:[\d.]+/i.test(ua)) {
    return { browser: 'Unknown', browserVersion: undefined };
  }
  return undefined;
};
/* v8 ignore end */
