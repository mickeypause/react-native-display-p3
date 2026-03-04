import { P3Text, P3View } from 'react-native-p3';

const validView = (
  <P3View
    style={{ padding: 8, marginTop: 12, borderWidth: 1 }}
    p3BackgroundColor={{ r: 1, g: 0, b: 0 }}
    p3BorderColor={[0.2, 0.5, 0.8, 1]}
  />
);

const validText = (
  <P3Text style={{ fontSize: 16 }} p3Color={{ r: 0, g: 0, b: 0 }}>
    Valid text
  </P3Text>
);

const invalidView = (
  // @ts-expect-error P3View style cannot include color keys.
  <P3View style={{ backgroundColor: '#f00' }} />
);

const invalidText = (
  // @ts-expect-error P3Text style cannot include color keys.
  <P3Text style={{ color: '#000' }}>Invalid text</P3Text>
);

void validView;
void validText;
void invalidView;
void invalidText;
