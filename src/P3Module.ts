import { NativeModule, requireNativeModule } from 'expo';

import { P3ModuleEvents } from './P3.types';

declare class P3Module extends NativeModule<P3ModuleEvents> {
  PI: number;
  isWideGamutAvailable: boolean;
  isWideGamutActive: boolean;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<P3Module>('P3');
