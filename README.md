# react-native-p3

Display-P3 color primitives for React Native

## Android Wide Gamut (Optional)

`react-native-p3` is safe to use on Android, but true Display-P3 output is device-dependent.

To enable wide-gamut rendering where supported, set `android:colorMode="wideColorGamut"` on your app activity.

### Expo (managed / prebuild)

After prebuild, update `android/app/src/main/AndroidManifest.xml`:

```xml
<activity
  android:name=".MainActivity"
  android:colorMode="wideColorGamut"
  ... />
```

### Bare React Native

Set the same activity attribute in your app `AndroidManifest.xml`:

```xml
<activity
  android:name=".MainActivity"
  android:colorMode="wideColorGamut"
  ... />
```

### Fallback behavior

- Devices that support wide gamut may render broader color output.
- Devices that do not support it automatically fall back to standard rendering.
- Keep Android wide-gamut as an enhancement and always design for acceptable sRGB fallback.
