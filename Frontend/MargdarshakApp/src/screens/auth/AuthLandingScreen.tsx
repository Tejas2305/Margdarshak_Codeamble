import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthStackParamList } from '../../navigation/types';
import { Button, SocialButton, Divider } from '../../components/ui';
import { colors, typography, spacing } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'AuthLanding'>;

export const AuthLandingScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryDark]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>🛡️</Text>
          <Text style={styles.title}>Welcome to{'\n'}Margdarshak</Text>
          <Text style={styles.subtitle}>Your safety companion on every journey</Text>
        </View>

        <View style={styles.authContainer}>
          <SocialButton provider="google" onPress={() => console.log('Google Sign In')} />
          <SocialButton provider="apple" onPress={() => console.log('Apple Sign In')} />

          <Divider text="or" />

          <Button
            title="Sign Up with Email"
            onPress={() => navigation.navigate('Register')}
            variant="secondary"
            fullWidth
          />

          <View style={styles.loginPrompt}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Button
              title="Log In"
              onPress={() => navigation.navigate('Login')}
              variant="text"
            />
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingTop: 80,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  logo: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.h1,
    fontWeight: '700',
    color: colors.background,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.background,
    textAlign: 'center',
    opacity: 0.9,
  },
  authContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    marginTop: spacing.xxl,
  },
  loginPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  loginText: {
    fontSize: typography.body,
    color: colors.textSecondary,
  },
});
