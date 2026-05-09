# react-native-p3

Display-P3 color primitives for React Native (iOS). See the [repository root](https://github.com/mickeypause/react-native-p3) for development and the example app.

## Platform support

The native implementation targets **iOS** only in this release.

## API

- **`P3View`** — native view with `p3BackgroundColor`, `p3BorderColor`, `p3ShadowColor` using **`UIColor(displayP3Red:...)`**.
- **`P3Module`** — `isWideGamutAvailable` / `isWideGamutActive` (screen gamut info).

Use React Native **`Text`** with normal `style.color` for labels; this package does not ship a text component.
