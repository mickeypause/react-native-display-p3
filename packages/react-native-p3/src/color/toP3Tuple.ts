import type { P3Color } from '../P3.types';

export type P3ColorTuple4 = [number, number, number, number];

export function toP3Tuple(color: P3Color | undefined): P3ColorTuple4 | undefined {
  if (color === undefined) {
    return undefined;
  }

  if (Array.isArray(color)) {
    const [r, g, b, a = 1] = color;
    return [r, g, b, a];
  }

  return [color.r, color.g, color.b, color.a ?? 1];
}
