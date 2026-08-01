import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthStackParamList } from '../navigation/types';
import { colors, typography } from '../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Splash'>;

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryDark]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.logo}>🛡️</Text>
        <Text style={styles.title}>Margdarshak</Text>
        <Text style={styles.subtitle}>Safe Routes, Safe Journey</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: typography.h1,
    fontWeight: '700',
    color: colors.background,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.background,
    opacity: 0.9,
  },
});
