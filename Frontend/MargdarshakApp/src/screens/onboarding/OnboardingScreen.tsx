import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, Dimensions,
  TouchableOpacity, Animated, StatusBar, Platform,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme';
import { Button } from '../../components/ui';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1', emoji: '🗺️', bg: '#EFF6FF', accent: Colors.primary,
    title: 'Travel with\nConfidence',
    desc: 'Choose routes that prioritize your safety instead of only speed. Margdarshak analyses real-time risk to guide you safely.',
  },
  {
    id: '2', emoji: '🔥', bg: '#FEF2F2', accent: '#DC2626',
    title: 'Live Safety\nHeatmap',
    desc: 'View real-time crime reports, accidents, hazards and community alerts overlaid directly on your map.',
  },
  {
    id: '3', emoji: '🛡️', bg: '#F0FDF4', accent: Colors.secondary,
    title: 'Stay Connected.\nStay Safe.',
    desc: 'Receive instant alerts, emergency assistance and safer navigation wherever you travel — day or night.',
  },
];

const OnboardingScreen: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [idx, setIdx] = useState(0);
  const listRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const goNext = () => {
    if (idx < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: idx + 1, animated: true });
      setIdx(idx + 1);
    } else {
      onDone();
    }
  };

  const goTo = (i: number) => {
    listRef.current?.scrollToIndex({ index: i, animated: true });
    setIdx(i);
  };

  const isLast = idx === SLIDES.length - 1;
  const accent = SLIDES[idx].accent;

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      {!isLast && (
        <TouchableOpacity style={s.skip} onPress={onDone} activeOpacity={0.7}>
          <Text style={s.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      <Animated.FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={item => item.id}
        horizontal pagingEnabled scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        renderItem={({ item }) => (
          <View style={s.slide}>
            <View style={[s.illusArea, { backgroundColor: item.bg }]}>
              <View style={[s.illusCircle, { borderColor: item.accent + '30' }]}>
                <View style={[s.illusInner, { backgroundColor: item.accent + '18' }]}>
                  <Text style={s.emoji}>{item.emoji}</Text>
                </View>
              </View>
              <View style={[s.dec1, { backgroundColor: item.accent + '25' }]} />
              <View style={[s.dec2, { backgroundColor: item.accent + '18' }]} />
            </View>
            <View style={s.textArea}>
              <Text style={s.title}>{item.title}</Text>
              <Text style={s.desc}>{item.desc}</Text>
            </View>
          </View>
        )}
      />

      <View style={s.bottom}>
        <View style={s.dots}>
          {SLIDES.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            return (
              <TouchableOpacity key={i} onPress={() => goTo(i)} activeOpacity={0.7}>
                <Animated.View style={[s.dot, {
                  width: scrollX.interpolate({ inputRange, outputRange: [8, 24, 8], extrapolate: 'clamp' }),
                  opacity: scrollX.interpolate({ inputRange, outputRange: [0.35, 1, 0.35], extrapolate: 'clamp' }),
                  backgroundColor: accent,
                }]} />
              </TouchableOpacity>
            );
          })}
        </View>
        <Button title={isLast ? 'Get Started' : 'Next'} onPress={goNext}
          style={isLast ? { backgroundColor: Colors.secondary } : undefined} />
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  skip: { position: 'absolute', top: Platform.OS === 'ios' ? 56 : 24, right: Spacing.xxl, zIndex: 10, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md },
  skipText: { fontSize: Typography.fontSizeMD, color: Colors.textSecondary, fontWeight: Typography.fontWeightMedium },
  slide: { width },
  illusArea: { height: height * 0.46, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  illusCircle: { width: 200, height: 200, borderRadius: 100, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  illusInner: { width: 160, height: 160, borderRadius: 80, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 80 },
  dec1: { position: 'absolute', width: 70, height: 70, borderRadius: 35, top: 30, left: 30 },
  dec2: { position: 'absolute', width: 40, height: 40, borderRadius: 20, bottom: 40, right: 40 },
  textArea: { flex: 1, paddingHorizontal: Spacing.xxxl, paddingTop: Spacing.xxxl },
  title: { fontSize: Typography.fontSize3XL, fontWeight: Typography.fontWeightBold, color: Colors.text, lineHeight: 40, marginBottom: Spacing.lg },
  desc: { fontSize: Typography.fontSizeMD, color: Colors.textSecondary, lineHeight: 24 },
  bottom: { paddingHorizontal: Spacing.xxl, paddingBottom: Platform.OS === 'ios' ? 44 : Spacing.xxxl, paddingTop: Spacing.lg },
  dots: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xxl, gap: Spacing.sm },
  dot: { height: 8, borderRadius: 4 },
});

export default OnboardingScreen;
