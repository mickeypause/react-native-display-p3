import { registerWebModule, NativeModule } from 'expo';

import { P3ModuleEvents } from './P3.types';

class P3Module extends NativeModule<P3ModuleEvents> {
  PI = Math.PI;
  isWideGamutAvailable = false;
  isWideGamutActive = false;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(P3Module, 'P3');
