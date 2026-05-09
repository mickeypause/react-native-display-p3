import { requireNativeView } from 'expo';
import type { ComponentType } from 'react';
import { useCallback } from 'react';
import type { NativeSyntheticEvent, StyleProp, ViewStyle } from 'react-native';

export type InlineWheelColorPickerProps = {
  /** `#RRGGBB` or `#RRGGBBAA`, same contract as `@expo/ui` ColorPicker. */
  selection: string | null;
  label?: string;
  supportsOpacity?: boolean;
  onSelectionChange?: (value: string) => void;
  style?: StyleProp<ViewStyle>;
};

type SelectionNativeEvent = NativeSyntheticEvent<{ value: string }>;

const NativeInlineWheelColorPickerView: ComponentType<
  Omit<InlineWheelColorPickerProps, 'onSelectionChange'> & {
    onSelectionChange?: (event: SelectionNativeEvent) => void;
  }
> = requireNativeView('InlineColorPicker');

export function InlineWheelColorPicker({
  selection,
  label,
  supportsOpacity,
  onSelectionChange,
  style,
}: InlineWheelColorPickerProps) {
  const onNativeValueChanged = useCallback(
    (event: SelectionNativeEvent) => {
      onSelectionChange?.(event.nativeEvent.value);
    },
    [onSelectionChange]
  );

  return (
    <NativeInlineWheelColorPickerView
      style={style}
      selection={selection ?? ''}
      label={label}
      supportsOpacity={supportsOpacity ?? true}
      onSelectionChange={onNativeValueChanged}
    />
  );
}
