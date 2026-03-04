import type {
  StyleProp,
  TextProps,
  TextStyle,
  ViewProps,
  ViewStyle,
} from 'react-native';

export type P3ColorObject = { r: number; g: number; b: number; a?: number };
export type P3ColorTuple = [number, number, number] | [number, number, number, number];
export type P3Color = P3ColorObject | P3ColorTuple;

export type P3RGBA = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export type P3ModuleEvents = {
  onChange: (params: { value: string }) => void;
};

type ColorStyleKeys =
  | 'color'
  | 'backgroundColor'
  | 'borderColor'
  | 'borderTopColor'
  | 'borderRightColor'
  | 'borderBottomColor'
  | 'borderLeftColor'
  | 'borderStartColor'
  | 'borderEndColor'
  | 'borderBlockColor'
  | 'borderBlockEndColor'
  | 'borderBlockStartColor'
  | 'borderInlineColor'
  | 'borderInlineEndColor'
  | 'borderInlineStartColor'
  | 'outlineColor'
  | 'shadowColor'
  | 'textDecorationColor'
  | 'textShadowColor';

type RemoveColorStyleKeys<T> = Omit<T, Extract<keyof T, ColorStyleKeys>>;

export type P3SafeViewStyle = RemoveColorStyleKeys<ViewStyle>;
export type P3SafeTextStyle = RemoveColorStyleKeys<TextStyle>;

export type P3ViewProps = Omit<ViewProps, 'style'> & {
  style?: StyleProp<P3SafeViewStyle>;
  p3BackgroundColor?: P3Color;
  p3BorderColor?: P3Color;
  p3ShadowColor?: P3Color;
};

export type P3TextProps = Omit<TextProps, 'style'> & {
  style?: StyleProp<P3SafeTextStyle>;
  p3Color?: P3Color;
  p3BackgroundColor?: P3Color;
  p3BorderColor?: P3Color;
  p3TextDecorationColor?: P3Color;
  p3TextShadowColor?: P3Color;
};
