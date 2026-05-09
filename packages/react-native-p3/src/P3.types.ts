import type { ViewProps } from 'react-native';

export type P3ColorObject = { r: number; g: number; b: number; a?: number };
export type P3ColorTuple = [number, number, number] | [number, number, number, number];
export type P3Color = P3ColorObject | P3ColorTuple;

export type P3ViewProps = ViewProps & {
  p3BackgroundColor?: P3Color;
  p3BorderColor?: P3Color;
  p3ShadowColor?: P3Color;
};
