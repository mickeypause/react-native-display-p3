import { requireNativeView } from 'expo';
import * as React from 'react';

import type { P3ViewProps } from './P3.types';
import { toP3Tuple } from './color/toP3Tuple';

type NativeP3ViewProps = Omit<P3ViewProps, 'p3BackgroundColor' | 'p3BorderColor' | 'p3ShadowColor'> & {
  p3BackgroundColor?: [number, number, number, number];
  p3BorderColor?: [number, number, number, number];
  p3ShadowColor?: [number, number, number, number];
};

const NativeView: React.ComponentType<NativeP3ViewProps> = requireNativeView('P3');

export default function P3View(props: P3ViewProps) {
  const { style, p3BackgroundColor, p3BorderColor, p3ShadowColor, ...restProps } = props;

  return (
    <NativeView
      {...restProps}
      style={style}
      p3BackgroundColor={toP3Tuple(p3BackgroundColor)}
      p3BorderColor={toP3Tuple(p3BorderColor)}
      p3ShadowColor={toP3Tuple(p3ShadowColor)}
    />
  );
}
