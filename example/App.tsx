import { P3Module, P3Text, P3View } from 'react-native-p3';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function App() {
  const split = 0.5;
  const isWideGamutAvailable = Boolean(P3Module.isWideGamutAvailable);
  const isWideGamutActive = Boolean(P3Module.isWideGamutActive);

  const gamutStatus = isWideGamutActive
    ? 'Wide gamut: active'
    : isWideGamutAvailable
      ? 'Wide gamut: available but inactive'
      : 'Wide gamut: unavailable (sRGB fallback)';

  const gamutStatusStyle = isWideGamutActive
    ? styles.statusActive
    : isWideGamutAvailable
      ? styles.statusWarn
      : styles.statusOff;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <P3Text style={styles.screenTitle} p3Color={[0.08, 0.1, 0.18]}>
          sRGB vs Display-P3
        </P3Text>
        <Text style={[styles.statusText, gamutStatusStyle]}>{gamutStatus}</Text>

        <Group name="Color Blocks">
          <View style={styles.splitSwatchRow}>
            <View style={[styles.swatchPane, styles.swatchSrgb, { flex: split }]} />
            <P3View style={[styles.swatchPane, { flex: 1 - split }]} p3BackgroundColor={[0.9922, 0.3098, 0, 1]} />
          </View>

          <View style={styles.legendRow}>
            <Text style={styles.legendText}>sRGB {Math.round(split * 100)}%</Text>
            <P3Text style={styles.legendText} p3Color={[0.08, 0.1, 0.18]}>
              Display-P3 {Math.round((1 - split) * 100)}%
            </P3Text>
          </View>
        </Group>

        <Group name="Typography (H1/H2/Body)">
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.legendText}>sRGB</Text>
              <Text style={[styles.h1, styles.srgbText]}>Heading 1</Text>
              <Text style={[styles.h2, styles.srgbText]}>Heading 2</Text>
              <Text style={[styles.body, styles.srgbText]}>Body copy in regular React Native text color.</Text>
            </View>

            <View style={styles.column}>
              <P3Text style={styles.legendText} p3Color={[0.08, 0.1, 0.18]}>
                Display-P3
              </P3Text>
              <P3Text style={styles.h1} p3Color={[0.9922, 0.3098, 0, 1]}>
                Heading 1
              </P3Text>
              <P3Text style={styles.h2} p3Color={[0.9922, 0.3098, 0, 1]}>
                Heading 2
              </P3Text>
              <P3Text style={styles.body} p3Color={[0.9922, 0.3098, 0, 1]}>
                Body copy using p3 props.
              </P3Text>
            </View>
          </View>
        </Group>
      </ScrollView>
    </SafeAreaView>
  );
}

function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <P3Text style={styles.groupTitle} p3Color={[0.08, 0.1, 0.18]}>
        {props.name}
      </P3Text>
      {props.children}
    </View>
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
  swatchSrgb: {
    backgroundColor: 'rgba(253, 79, 0, 1)',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  legendText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  column: {
    flex: 1,
  },
  h1: {
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '800' as const,
    marginBottom: 6,
  },
  h2: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700' as const,
    marginBottom: 6,
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
  },
  srgbText: {
    color: 'rgba(253, 79, 0, 1)',
  },
});
