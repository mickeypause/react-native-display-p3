import { ColorPicker, Host } from '@expo/ui/swift-ui';
import {
  colorSpacesFromHex,
  rgb01FromHexSync,
  type ColorSpacesFromHexResult,
} from 'cg-color-spaces';
import { isWideGamutActive, isWideGamutAvailable, P3View } from 'react-native-p3';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const INITIAL_HEX = '#FD4F00';

function rgbaCss(t: [number, number, number, number]): string {
  return `rgba(${Math.round(t[0] * 255)}, ${Math.round(t[1] * 255)}, ${Math.round(t[2] * 255)}, ${t[3]})`;
}

export default function App() {
  const split = 0.5;
  const wideGamutAvailable = isWideGamutAvailable();
  const wideGamutActive = isWideGamutActive();
  const [selectionHex, setSelectionHex] = useState(INITIAL_HEX);
  const [resolved, setResolved] = useState<ColorSpacesFromHexResult | null>(null);
  /** When this equals `selectionHex`, `resolved` is safe to use (no stale async). */
  const [resolvedForHex, setResolvedForHex] = useState<string | null>(null);
  const selectionRef = useRef(selectionHex);
  selectionRef.current = selectionHex;

  const onPickerColorChange = useCallback((hex: string) => {
    setResolved(null);
    setResolvedForHex(null);
    setSelectionHex(hex);
  }, []);

  const gamutStatus = wideGamutActive
    ? 'Wide gamut: active'
    : wideGamutAvailable
      ? 'Wide gamut: available but inactive'
      : 'Wide gamut: unavailable (sRGB fallback)';

  const gamutStatusStyle = wideGamutActive
    ? styles.statusActive
    : wideGamutAvailable
      ? styles.statusWarn
      : styles.statusOff;

  const refresh = useCallback(async (hex: string) => {
    const r = await colorSpacesFromHex(hex);
    if (selectionRef.current !== hex) {
      return;
    }
    setResolved(r);
    setResolvedForHex(hex);
  }, []);

  useEffect(() => {
    void refresh(selectionHex);
  }, [selectionHex, refresh]);

  const syncRgb01 = useMemo((): [number, number, number, number] => {
    return rgb01FromHexSync(selectionHex) ?? [0, 0, 0, 1];
  }, [selectionHex]);

  const useNativeResolved = Boolean(
    resolved && resolvedForHex !== null && resolvedForHex === selectionHex
  );

  const srgbTuple: [number, number, number, number] =
    useNativeResolved && resolved ? resolved.srgb : syncRgb01;

  const displayP3Tuple: [number, number, number, number] =
    useNativeResolved && resolved
      ? [
          resolved.displayP3[0],
          resolved.displayP3[1],
          resolved.displayP3[2],
          resolved.displayP3[3] ?? 1,
        ]
      : syncRgb01;

  const srgbCss = rgbaCss(srgbTuple);

  const srgb = useNativeResolved && resolved ? resolved.srgb : null;
  const displayP3 = useNativeResolved && resolved ? resolved.displayP3 : null;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          <Text style={[styles.screenTitle, styles.inkText]}>react-native-p3</Text>
          <Text style={[styles.statusText, gamutStatusStyle]}>{gamutStatus}</Text>

          {Platform.OS === 'ios' ? (
            <>
              <Text style={styles.note}>
                @expo/ui ColorPicker sends an sRGB-ish hex. sRGB components use CGColor conversion
                to the sRGB space; the P3 swatch uses UIColor.getDisplayP3Red so the tuple matches
                P3View’s display‑referred P3 channels (raw CGColor P3 components differ).
              </Text>
              <Host matchContents style={styles.pickerHost}>
                <ColorPicker
                  label="Pick a color"
                  selection={selectionHex}
                  onSelectionChange={onPickerColorChange}
                  supportsOpacity
                />
              </Host>
            </>
          ) : (
            <Text style={styles.note}>
              SwiftUI ColorPicker is iOS-only. Using the initial hex; run on iOS for the full demo.
            </Text>
          )}

          <View style={styles.group}>
            <Text style={[styles.groupTitle, styles.inkText]}>Color blocks</Text>
            <View style={styles.splitSwatchRow}>
              <View
                style={[
                  styles.swatchPane,
                  { backgroundColor: srgbCss },
                  { flex: split },
                ]}
              />
              <P3View
                key={selectionHex}
                style={[styles.swatchPane, { flex: 1 - split }]}
                p3BackgroundColor={displayP3Tuple}
              />
            </View>

            <View style={styles.legendRow}>
              <Text style={styles.legendText}>RN View (sRGB)</Text>
              <Text style={[styles.legendText, styles.inkText]}>P3View (Display P3)</Text>
            </View>
            {resolved?.error ? (
              <Text style={styles.warnText}>{resolved.error}</Text>
            ) : null}
            {resolved?.nativeColorSpaceName && Platform.OS === 'ios' ? (
              <Text style={styles.monoSmall} numberOfLines={3}>
                CG color space: {resolved.nativeColorSpaceName}
                {'\n'}
                native components: [{resolved.nativeComponents.map((n) => n.toFixed(4)).join(', ')}]
              </Text>
            ) : null}
            {srgb && displayP3 ? (
              <Text style={styles.monoSmall} numberOfLines={4}>
                sRGB tuple: [{srgb.map((n) => n.toFixed(4)).join(', ')}]
                {'\n'}
                P3 tuple: [{displayP3.map((n) => n.toFixed(4)).join(', ')}]
                {!useNativeResolved ? '\n(interim: hex parse until native resolves)' : ''}
              </Text>
            ) : (
              <Text style={styles.monoSmall} numberOfLines={2}>
                interim sRGB (hex): [{syncRgb01.map((n) => n.toFixed(4)).join(', ')}]
              </Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingBottom: 28,
  },
  inkText: {
    color: '#141a2e',
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: '800' as const,
    marginBottom: 6,
  },
  statusText: {
    fontSize: 14,
    marginBottom: 14,
    fontWeight: '600' as const,
  },
  statusActive: {
    color: '#0f7a36',
  },
  statusWarn: {
    color: '#9a6400',
  },
  statusOff: {
    color: '#4b5563',
  },
  note: {
    fontSize: 13,
    lineHeight: 18,
    color: '#374151',
    marginBottom: 12,
  },
  pickerHost: {
    marginBottom: 16,
    minHeight: 44,
  },
  group: {
    paddingVertical: 8,
    marginBottom: 14,
  },
  groupTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    marginBottom: 12,
  },
  splitSwatchRow: {
    flexDirection: 'row',
    height: 220,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  swatchPane: {
    height: '100%',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  legendText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  warnText: {
    fontSize: 13,
    color: '#b91c1c',
    marginBottom: 8,
  },
  monoSmall: {
    fontSize: 11,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    color: '#4b5563',
    marginTop: 4,
  },
});
