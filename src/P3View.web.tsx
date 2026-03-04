import * as React from 'react';
import type { ViewStyle } from 'react-native';
import { View } from 'react-native';

import type { P3ViewProps } from './P3.types';
import { toNativeColor } from './color/toNativeColor';

export default function P3View(props: P3ViewProps) {
  const { style, p3BackgroundColor, p3BorderColor, p3ShadowColor, ...restProps } = props;

  const colorStyle: ViewStyle = {};

  if (p3BackgroundColor !== undefined) {
    colorStyle.backgroundColor = toNativeColor(p3BackgroundColor);
  }
  if (p3BorderColor !== undefined) {
    colorStyle.borderColor = toNativeColor(p3BorderColor);
  }
  if (p3ShadowColor !== undefined) {
    colorStyle.shadowColor = toNativeColor(p3ShadowColor);
  }

  return <View {...restProps} style={[style, colorStyle]} />;
}
