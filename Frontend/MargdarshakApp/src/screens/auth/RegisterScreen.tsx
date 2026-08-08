import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthStackParamList } from '../../navigation/types';
import { Button, Input, PasswordInput } from '../../components/ui';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../theme';
import { colors, typography, spacing } from '../../theme';
import { authService } from '../../services/api';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'> & {
  onAuthSuccess?: () => void;
};

export const RegisterScreen: React.FC<Props> = ({ navigation, onAuthSuccess }) => {
  const { isDark, toggleTheme } = useTheme();
  const colors = getThemeColors(isDark);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);

  const handleSendOTP = async () => {
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail) {
      Alert.alert('Missing Email', 'Please enter your email address.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    try {
      setIsSendingOtp(true);
      await authService.sendEmailOTP(trimmedEmail);
      setShowOtpInput(true);
      Alert.alert('OTP Sent', 'Please check your email for the verification code.');
    } catch (error: any) {
      console.error('❌ Send OTP error:', error);
      
      let errorMessage = 'Unable to send OTP right now.';
      if (error?.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      Alert.alert('Send OTP Failed', errorMessage);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the 6-digit OTP.');
      return;
    }

    try {
      setIsVerifyingOtp(true);
      await authService.verifyEmailOTP(email.trim(), otp);
      setEmailVerified(true);
      Alert.alert('Email Verified', 'Your email has been verified successfully!');
    } catch (error: any) {
      console.error('❌ Verify OTP error:', error);
      
      let errorMessage = 'Invalid or expired OTP.';
      if (error?.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      Alert.alert('Verification Failed', errorMessage);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleRegister = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phoneNumber.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPhone || !password) {
      Alert.alert('Missing Details', 'Please enter your name, email, phone number, and password.');
      return;
    }

    if (!emailVerified) {
      Alert.alert('Email Not Verified', 'Please verify your email before registering.');
      return;
    }

    const [firstName, ...lastNameParts] = trimmedName.split(/\s+/);

    try {
      setIsSubmitting(true);
      
      const registerData = {
        first_name: firstName,
        last_name: lastNameParts.join(' ') || firstName,
        email: trimmedEmail,
        phone_number: trimmedPhone,
        password,
      };
      
      console.log('🔵 Attempting registration with:', { ...registerData, password: '***' });
      
      const response = await authService.register(registerData);
      
      console.log('✅ Registration successful:', response);

      Alert.alert('Account Created', 'Please log in with your new account.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      console.error('❌ Error response:', error?.response?.data);
      console.error('❌ Error message:', error?.message);
      
      let errorMessage = 'Unable to create your account right now.';
      
      if (error?.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.request) {
        errorMessage = 'Cannot connect to server. Please check your internet connection and make sure backend is running.';
      }
      
      Alert.alert('Registration Failed', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          size={22} 
          color={colors.text} 
        />
      </TouchableOpacity>
      
      {/* Back Button */}
      <TouchableOpacity 
        style={[styles.backButton, { backgroundColor: colors.surfaceVariant }]}
        onPress={() => navigation.goBack()}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Sign up to get started</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
            autoCapitalize="words"
          />
          
          {/* Email with inline Send OTP button */}
          <View style={styles.emailSection}>
            <Input
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setShowOtpInput(false);
                setEmailVerified(false);
                setOtp('');
              }}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!emailVerified}
            />
            {!emailVerified && (
              <TouchableOpacity
                style={[styles.sendOtpButton, { backgroundColor: colors.primary }]}
                onPress={handleSendOTP}
                disabled={isSendingOtp || !email.trim()}
              >
                <Text style={styles.sendOtpText}>
                  {isSendingOtp ? 'Sending...' : 'Send OTP'}
                </Text>
              </TouchableOpacity>
            )}
            {emailVerified && (
              <View style={[styles.verifiedBadge, { backgroundColor: '#4CAF50' }]}>
                <MaterialCommunityIcons name="check-circle" size={20} color="#FFFFFF" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>

          {/* OTP Input - shown after Send OTP */}
          {showOtpInput && !emailVerified && (
            <View style={styles.otpSection}>
              <Input
                label="Enter OTP"
                value={otp}
                onChangeText={setOtp}
                placeholder="Enter 6-digit code"
                keyboardType="number-pad"
                maxLength={6}
              />
              <TouchableOpacity
                style={[styles.verifyButton, { backgroundColor: colors.primary }, (otp.length !== 6) && styles.disabledButton]}
                onPress={handleVerifyOTP}
                disabled={isVerifyingOtp || otp.length !== 6}
              >
                <Text style={styles.verifyButtonText}>
                  {isVerifyingOtp ? 'Verifying...' : 'Verify OTP'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.resendButton}
                onPress={handleSendOTP}
                disabled={isSendingOtp}
              >
                <Text style={[styles.resendText, { color: colors.primary }]}>
                  Resend OTP
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <Input
            label="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="+1234567890"
            keyboardType="phone-pad"
            autoCapitalize="none"
          />
          <PasswordInput
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={[styles.signupButton, { backgroundColor: colors.primary }, (isSubmitting || !emailVerified) && styles.disabledButton]}
            onPress={handleRegister}
            disabled={isSubmitting || !emailVerified}
          >
            <Text style={styles.signupButtonText}>{isSubmitting ? 'Creating...' : 'Sign Up'}</Text>
          </TouchableOpacity>

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
    zIndex: 2,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: spacing.lg,
    paddingTop: 120,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '400',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  form: {
    marginTop: spacing.md,
  },
  emailSection: {
    position: 'relative',
  },
  sendOtpButton: {
    position: 'absolute',
    right: 12,
    top: 38,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  sendOtpText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  verifiedBadge: {
    position: 'absolute',
    right: 12,
    top: 38,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  verifiedText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  otpSection: {
    marginTop: 8,
    marginBottom: 8,
  },
  verifyButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  verifyButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  resendText: {
    fontSize: 14,
    fontWeight: '600',
  },
  signupButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  disabledButton: {
    opacity: 0.6,
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
  },
  loginPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
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
