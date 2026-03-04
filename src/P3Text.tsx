import * as React from 'react';
import type { TextStyle } from 'react-native';
import { Text } from 'react-native';

import type { P3TextProps } from './P3.types';
import { toNativeColor } from './color/toNativeColor';

export default function P3Text(props: P3TextProps) {
  const {
    style,
    p3Color,
    p3BackgroundColor,
    p3BorderColor,
    p3TextDecorationColor,
    p3TextShadowColor,
    ...restProps
  } = props;

  const colorStyle: TextStyle = {};

  if (p3Color !== undefined) {
    colorStyle.color = toNativeColor(p3Color);
  }
  if (p3BackgroundColor !== undefined) {
    colorStyle.backgroundColor = toNativeColor(p3BackgroundColor);
  }
  if (p3BorderColor !== undefined) {
    colorStyle.borderColor = toNativeColor(p3BorderColor);
  }
  if (p3TextDecorationColor !== undefined) {
    colorStyle.textDecorationColor = toNativeColor(p3TextDecorationColor);
  }
  if (p3TextShadowColor !== undefined) {
    colorStyle.textShadowColor = toNativeColor(p3TextShadowColor);
  }

  return <Text {...restProps} style={[style, colorStyle]} />;
}
