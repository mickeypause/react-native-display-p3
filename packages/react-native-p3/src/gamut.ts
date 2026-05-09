import { requireNativeModule } from 'expo-modules-core';

type P3NativeConstants = {
  isWideGamutAvailable: boolean;
  isWideGamutActive: boolean;
};

const Native = requireNativeModule<P3NativeConstants>('P3');

export function isWideGamutAvailable(): boolean {
  return Boolean(Native.isWideGamutAvailable);
}

export function isWideGamutActive(): boolean {
  return Boolean(Native.isWideGamutActive);
}
