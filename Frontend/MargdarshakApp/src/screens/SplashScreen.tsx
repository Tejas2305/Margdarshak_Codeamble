import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, Dimensions, StatusBar,
} from 'react-native';
import { Colors, Typography, Spacing } from '../theme';

const { width, height } = Dimensions.get('window');

const SplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const logoScale  = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const tagOpacity  = useRef(new Animated.Value(0)).current;
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(logoScale,  { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
      Animated.timing(logoOpacity,{ toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start(() => {
      Animated.stagger(200, [
        Animated.timing(textOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(tagOpacity,  { toValue: 1, duration: 400, useNativeDriver: true }),
      ]).start();

      const pulse = (d: Animated.Value, delay: number) =>
        Animated.loop(Animated.sequence([
          Animated.delay(delay),
          Animated.timing(d, { toValue: 1,   duration: 400, useNativeDriver: true }),
          Animated.timing(d, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        ])).start();

      setTimeout(() => { pulse(dot1, 0); pulse(dot2, 200); pulse(dot3, 400); }, 600);
      setTimeout(onFinish, 2800);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <View style={s.circle1} />
      <View style={s.circle2} />

      <Animated.View style={[s.logo, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
        <Text style={s.logoEmoji}>🛡️</Text>
      </Animated.View>

      <Animated.Text style={[s.name, { opacity: textOpacity }]}>Margdarshak</Animated.Text>

      <Animated.View style={{ opacity: tagOpacity, alignItems: 'center' }}>
        <Text style={s.tagline}>Navigate Safely.</Text>
        <Text style={s.taglineSub}>Every Journey.</Text>
      </Animated.View>

      <View style={s.dots}>
        <Animated.View style={[s.dot, { opacity: dot1 }]} />
        <Animated.View style={[s.dot, { opacity: dot2 }]} />
        <Animated.View style={[s.dot, { opacity: dot3 }]} />
      </View>

      <Text style={s.footer}>Public Safety Navigation</Text>
    </View>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  circle1: { position: 'absolute', width: width * 1.2, height: width * 1.2, borderRadius: width * 0.6, backgroundColor: Colors.primaryDark, top: -width * 0.5, right: -width * 0.3, opacity: 0.4 },
  circle2: { position: 'absolute', width: width * 0.8, height: width * 0.8, borderRadius: width * 0.4, backgroundColor: Colors.primaryLight, bottom: -width * 0.2, left: -width * 0.2, opacity: 0.2 },
  logo: { width: 100, height: 100, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xxl },
  logoEmoji: { fontSize: 52 },
  name: { fontSize: Typography.fontSize3XL, fontWeight: Typography.fontWeightExtraBold, color: Colors.textInverse, letterSpacing: 1, marginBottom: Spacing.md },
  tagline: { fontSize: Typography.fontSizeXL, fontWeight: Typography.fontWeightMedium, color: 'rgba(255,255,255,0.85)', textAlign: 'center' },
  taglineSub: { fontSize: Typography.fontSizeXL, fontWeight: Typography.fontWeightMedium, color: 'rgba(255,255,255,0.65)', textAlign: 'center', marginTop: 2 },
  dots: { flexDirection: 'row', gap: 8, position: 'absolute', bottom: height * 0.12 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.7)' },
  footer: { position: 'absolute', bottom: Spacing.xxl, fontSize: Typography.fontSizeXS, color: 'rgba(255,255,255,0.4)', letterSpacing: 1.5, textTransform: 'uppercase' },
});

export default SplashScreen;
