import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, StatusBar, Platform, Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme';
import { Button, SocialButton, Divider } from '../../components/ui';
import { AuthStackParamList } from '../../navigation/types';

const { height } = Dimensions.get('window');
type Props = { navigation: NativeStackNavigationProp<AuthStackParamList, 'AuthLanding'> };

const AuthLandingScreen: React.FC<Props> = ({ navigation }) => {
  const fade  = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Hero */}
      <View style={s.hero}>
        <Animated.View style={[s.heroContent, { opacity: fade, transform: [{ translateY: slide }] }]}>
          <View style={s.logoBox}><Text style={s.logoEmoji}>🛡️</Text></View>
          <Text style={s.appName}>Margdarshak</Text>
          <View style={s.badge}>
            <View style={s.badgeDot} />
            <Text style={s.badgeText}>Public Safety Navigation</Text>
          </View>
        </Animated.View>
      </View>

      {/* Card */}
      <Animated.View style={[s.card, { opacity: fade, transform: [{ translateY: slide }] }]}>
        <Text style={s.welcomeTitle}>Welcome to{'\n'}Margdarshak</Text>
        <Text style={s.welcomeSub}>Your trusted companion for safer journeys.</Text>

        <Button title="Create Account" onPress={() => navigation.navigate('Register')} />
        <View style={{ height: Spacing.md }} />
        <Button title="Login" onPress={() => navigation.navigate('Login')} variant="outline" />

        <Divider label="OR" />

        <SocialButton title="Continue with Google" provider="google" onPress={() => {}} style={{ marginBottom: Spacing.md }} />
        {Platform.OS === 'ios' && (
          <SocialButton title="Continue with Apple" provider="apple" onPress={() => {}} />
        )}

        <Text style={s.terms}>
          By continuing you agree to our{' '}
          <Text style={s.termsLink}>Terms</Text> and{' '}
          <Text style={s.termsLink}>Privacy Policy</Text>
        </Text>
      </Animated.View>
    </View>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  hero: { height: height * 0.36, backgroundColor: Colors.primary, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, alignItems: 'center', justifyContent: 'center' },
  heroContent: { alignItems: 'center' },
  logoBox: { width: 80, height: 80, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg },
  logoEmoji: { fontSize: 42 },
  appName: { fontSize: Typography.fontSize2XL, fontWeight: Typography.fontWeightBold, color: Colors.textInverse, letterSpacing: 0.5, marginBottom: Spacing.md },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.full },
  badgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.secondary, marginRight: Spacing.sm },
  badgeText: { fontSize: Typography.fontSizeXS, color: 'rgba(255,255,255,0.85)', fontWeight: Typography.fontWeightMedium, letterSpacing: 0.5 },
  card: { flex: 1, paddingHorizontal: Spacing.xxl, paddingTop: Spacing.xxxl, paddingBottom: Platform.OS === 'ios' ? 44 : Spacing.xxl },
  welcomeTitle: { fontSize: Typography.fontSize2XL, fontWeight: Typography.fontWeightBold, color: Colors.text, lineHeight: 34, marginBottom: Spacing.sm },
  welcomeSub: { fontSize: Typography.fontSizeMD, color: Colors.textSecondary, marginBottom: Spacing.xxl, lineHeight: 22 },
  terms: { fontSize: Typography.fontSizeXS, color: Colors.textMuted, textAlign: 'center', lineHeight: 18, marginTop: Spacing.lg },
  termsLink: { color: Colors.primary, fontWeight: Typography.fontWeightMedium },
});

export default AuthLandingScreen;
