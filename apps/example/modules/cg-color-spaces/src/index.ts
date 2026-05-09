import { requireNativeModule } from 'expo-modules-core';
import { Platform } from 'react-native';

export type ColorSpacesFromHexResult = {
  error: string | null;
  nativeColorSpaceName: string | null;
  nativeComponents: number[];
  /** Linear-ish 0–1 components in the sRGB color space (converted). */
  srgb: [number, number, number, number];
  /** 0–1 components in the Display P3 color space (converted). */
  displayP3: [number, number, number, number];
};

type Native = {
  colorSpacesFromHex: (hex: string) => Promise<Record<string, unknown>>;
};

let iosCg: Native | null | undefined;

function getCg(): Native | null {
  if (Platform.OS !== 'ios') {
    return null;
  }
  if (iosCg === undefined) {
    try {
      iosCg = requireNativeModule<Native>('CgColorSpaces');
    } catch {
      iosCg = null;
    }
  }
  return iosCg;
}

/** Example app helper — iOS uses native CGColor conversion; other platforms use a simple hex parse. */
export async function colorSpacesFromHex(hex: string): Promise<ColorSpacesFromHexResult> {
  const Cg = getCg();
  if (!Cg) {
    return fallbackFromHex(hex);
  }

  const r = await Cg.colorSpacesFromHex(hex);
  const err = r.error;
  return {
    error: typeof err === 'string' ? err : null,
    nativeColorSpaceName:
      r.nativeColorSpaceName == null || r.nativeColorSpaceName === undefined
        ? null
        : String(r.nativeColorSpaceName),
    nativeComponents: Array.isArray(r.nativeComponents) ? r.nativeComponents.map(Number) : [],
    srgb: normalizeTuple(r.srgb),
    displayP3: normalizeTuple(r.displayP3),
  };
}

function fallbackFromHex(hex: string): ColorSpacesFromHexResult {
  const t = parseHexToRgb01(hex);
  if (!t) {
    return {
      error: 'Invalid hex',
      nativeColorSpaceName: null,
      nativeComponents: [],
      srgb: [0, 0, 0, 1],
      displayP3: [0, 0, 0, 1],
    };
  }
  return {
    error: null,
    nativeColorSpaceName: null,
    nativeComponents: [],
    srgb: t,
    displayP3: t,
  };
}

/** Synchronous parse for UI until async `colorSpacesFromHex` returns — same module as example-only helper. */
export function rgb01FromHexSync(raw: string): [number, number, number, number] | null {
  return parseHexToRgb01(raw);
}

function parseHexToRgb01(raw: string): [number, number, number, number] | null {
  let h = raw.trim();
  if (h.startsWith('#')) {
    h = h.slice(1);
  }
  if (h.length === 3) {
    const r = Number.parseInt(h[0] + h[0], 16) / 255;
    const g = Number.parseInt(h[1] + h[1], 16) / 255;
    const b = Number.parseInt(h[2] + h[2], 16) / 255;
    return [r, g, b, 1];
  }
  if (h.length === 6 || h.length === 8) {
    const n = Number.parseInt(h.slice(0, 6), 16);
    if (Number.isNaN(n)) {
      return null;
    }
    const r = ((n >> 16) & 0xff) / 255;
    const g = ((n >> 8) & 0xff) / 255;
    const b = (n & 0xff) / 255;
    const a = h.length === 8 ? Number.parseInt(h.slice(6, 8), 16) / 255 : 1;
    return [r, g, b, Number.isFinite(a) ? a : 1];
  }
  return null;
}

function normalizeTuple(v: unknown): [number, number, number, number] {
  if (!Array.isArray(v) || v.length < 3) {
    return [0, 0, 0, 1];
  }
  const a = v.length > 3 ? Number(v[3]) : 1;
  return [Number(v[0]), Number(v[1]), Number(v[2]), Number.isFinite(a) ? a : 1];
}
