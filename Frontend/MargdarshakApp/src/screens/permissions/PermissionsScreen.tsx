import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, StatusBar, Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme';
import { Button } from '../../components/ui';
import { AuthStackParamList } from '../../navigation/types';

type Props = { navigation: NativeStackNavigationProp<AuthStackParamList, 'Permissions'> };
type Step = 'location' | 'notifications';

const STEPS = [
  {
    id: 'location' as Step, emoji: '📍', bg: Colors.primary + '12',
    badge: 'Required for safe routing',
    title: 'Allow Location\nAccess',
    desc: 'Margdarshak uses your location to provide safer routes and nearby incident alerts in real-time.',
    bullets: [
      { icon: '🗺️', text: 'Calculate the safest route to your destination' },
      { icon: '⚠️', text: 'Alert you about incidents within 500m' },
      { icon: '🌙', text: 'Adjust risk weights during night hours' },
      { icon: '🆘', text: 'Share your location during emergency mode' },
    ],
    allow: 'Allow Location Access', skip: 'Maybe Later',
  },
  {
    id: 'notifications' as Step, emoji: '🔔', bg: Colors.secondary + '12',
    badge: 'Get real-time safety alerts',
    title: 'Stay Updated',
    desc: 'Receive instant alerts for nearby incidents and emergency updates to stay ahead of potential dangers.',
    bullets: [
      { icon: '🚨', text: 'Real-time incident alerts on your route' },
      { icon: '📰', text: 'Breaking safety news in your area' },
      { icon: '🛣️', text: 'Route change suggestions for new hazards' },
      { icon: '🆘', text: 'Emergency broadcast notifications' },
    ],
    allow: 'Enable Notifications', skip: 'Skip',
  },
];

const PermissionsScreen: React.FC<Props> = ({ navigation }) => {
  const [step, setStep] = useState<Step>('location');
  const fade  = useRef(new Animated.Value(1)).current;
  const slide = useRef(new Animated.Value(0)).current;

  const current = STEPS.find(s => s.id === step)!;
  const idx = STEPS.findIndex(s => s.id === step);

  const next = (target: Step | null) => {
    Animated.parallel([
      Animated.timing(fade,  { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(slide, { toValue: -30, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      if (target) {
        setStep(target); slide.setValue(30);
        Animated.parallel([
          Animated.timing(fade,  { toValue: 1, duration: 280, useNativeDriver: true }),
          Animated.timing(slide, { toValue: 0, duration: 280, useNativeDriver: true }),
        ]).start();
      } else {
        navigation.navigate('Success');
      }
    });
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <View style={s.dots}>
        {STEPS.map((st, i) => (
          <View key={st.id} style={[s.dot, i === idx && s.dotActive, i < idx && s.dotDone]} />
        ))}
      </View>

      <Animated.View style={[s.content, { opacity: fade, transform: [{ translateY: slide }] }]}>
        <View style={[s.illusBox, { backgroundColor: current.bg }]}>
          <Text style={s.illusEmoji}>{current.emoji}</Text>
        </View>
        <View style={s.badgeRow}>
          <Text style={s.badge}>{current.badge}</Text>
        </View>
        <Text style={s.title}>{current.title}</Text>
        <Text style={s.desc}>{current.desc}</Text>

        <View style={s.card}>
          <Text style={s.cardTitle}>Why we need this</Text>
          {current.bullets.map((b, i) => (
            <View key={i} style={s.bullet}>
              <Text style={s.bulletIcon}>{b.icon}</Text>
              <Text style={s.bulletText}>{b.text}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      <View style={s.actions}>
        <Button title={current.allow} onPress={() => next(step === 'location' ? 'notifications' : null)} />
        <Button title={current.skip} onPress={() => next(step === 'location' ? 'notifications' : null)} variant="ghost" />
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: Platform.OS === 'ios' ? 56 : Spacing.xl },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.sm, paddingVertical: Spacing.lg },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.border },
  dotActive: { width: 24, backgroundColor: Colors.primary },
  dotDone: { backgroundColor: Colors.secondary },
  content: { flex: 1, paddingHorizontal: Spacing.xxl },
  illusBox: { width: 120, height: 120, borderRadius: 30, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: Spacing.xl, marginTop: Spacing.lg },
  illusEmoji: { fontSize: 56 },
  badgeRow: { marginBottom: Spacing.md },
  badge: { alignSelf: 'flex-start', fontSize: Typography.fontSizeXS, color: Colors.primary, fontWeight: Typography.fontWeightSemiBold, backgroundColor: Colors.primary + '12', paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs + 2, borderRadius: BorderRadius.full },
  title: { fontSize: Typography.fontSize2XL, fontWeight: Typography.fontWeightBold, color: Colors.text, lineHeight: 34, marginBottom: Spacing.md },
  desc: { fontSize: Typography.fontSizeMD, color: Colors.textSecondary, lineHeight: 22, marginBottom: Spacing.xl },
  card: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.xl, borderWidth: 1, borderColor: Colors.border },
  cardTitle: { fontSize: Typography.fontSizeXS, fontWeight: Typography.fontWeightSemiBold, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: Spacing.md },
  bullet: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: Spacing.md, gap: Spacing.md },
  bulletIcon: { fontSize: 16, marginTop: 1 },
  bulletText: { flex: 1, fontSize: Typography.fontSizeSM, color: Colors.textSecondary, lineHeight: 20 },
  actions: { paddingHorizontal: Spacing.xxl, paddingBottom: Platform.OS === 'ios' ? 44 : Spacing.xxl, paddingTop: Spacing.lg, gap: Spacing.sm },
});

export default PermissionsScreen;
