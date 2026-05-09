import { requireNativeModule } from 'expo';

/**
 * Native `P3` module (`ios/P3Module.swift`). This file must call
 * `requireNativeModule` — it is the JS bridge and cannot be removed.
 */
export type P3NativeModule = {
  readonly isWideGamutAvailable: boolean;
  readonly isWideGamutActive: boolean;
};

export default requireNativeModule<P3NativeModule>('P3');
