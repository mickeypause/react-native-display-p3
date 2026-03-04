import type { ColorValue } from 'react-native';

import type { P3Color } from '../P3.types';

function toChannel(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.round(Math.min(Math.max(value, 0), 1) * 255);
}

function toAlpha(value: number | undefined): number {
  if (value === undefined || !Number.isFinite(value)) {
    return 1;
  }
  return Math.min(Math.max(value, 0), 1);
}

export function toNativeColor(color: P3Color): ColorValue {
  const r = Array.isArray(color) ? color[0] : color.r;
  const g = Array.isArray(color) ? color[1] : color.g;
  const b = Array.isArray(color) ? color[2] : color.b;
  const a = Array.isArray(color) ? color[3] : color.a;

  return `rgba(${toChannel(r)}, ${toChannel(g)}, ${toChannel(b)}, ${toAlpha(a)})`;
}
