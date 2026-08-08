import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../theme';
import { colors, typography, spacing } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'AuthLanding'>;

export const AuthLandingScreen: React.FC<Props> = ({ navigation }) => {
  const { isDark, toggleTheme } = useTheme();
  const colors = getThemeColors(isDark);
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Theme Toggle - Top Right */}
      <TouchableOpacity 
        style={[styles.themeToggle, { backgroundColor: colors.surfaceVariant }]}
        onPress={toggleTheme}
      >
        <MaterialCommunityIcons 
          name={isDark ? "weather-sunny" : "weather-night"} 
          size={24} 
          color={colors.text} 
        />
      </TouchableOpacity>
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Image 
            source={require('../../../assets/icon.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: colors.text }]}>Margdarshak</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Your safety companion on every journey</Text>
        </View>

        <View style={styles.authContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.primaryButtonText}>Sign Up with Email</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textSecondary }]}>or</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}>
              <MaterialCommunityIcons name="google" size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}>
              <MaterialCommunityIcons name="apple" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.loginPrompt}>
            <Text style={[styles.loginText, { color: colors.textSecondary }]}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.loginLink, { color: colors.primary }]}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  themeToggle: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingTop: 100,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 24,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 24,
  },
  authContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.lg,
  },
  primaryButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 14,
    fontWeight: '400',
    paddingHorizontal: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 15,
    fontWeight: '400',
  },
  loginLink: {
    fontSize: 15,
    fontWeight: '400',
  },
});
