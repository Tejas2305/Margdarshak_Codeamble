import React, { useState } from 'react';
import { Alert, View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Button, Input } from '../../components/ui';
import { colors, typography, spacing } from '../../theme';
import { authService } from '../../services/api';

type Props = NativeStackScreenProps<AuthStackParamList, 'OTPVerification'>;

export const OTPVerificationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { email, flow } = route.params;
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter the 6-digit verification code.');
      return;
    }

    if (flow === 'register') {
      navigation.navigate('Login');
      return;
    }

    try {
      setIsSubmitting(true);
      await authService.verifyForgotPasswordOTP(email, otp);
      navigation.navigate('ResetPassword', { email, otp });
    } catch (error: any) {
      Alert.alert('Verification Failed', error?.response?.data?.detail || 'Please check the code and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Verification Code</Text>
      <Text style={styles.subtitle}>
        We've sent a 6-digit code to{'\n'}{email}
      </Text>

      <View style={styles.form}>
        <Input
          label="Verification Code"
          value={otp}
          onChangeText={setOtp}
          placeholder="Enter 6-digit code"
          keyboardType="number-pad"
          maxLength={6}
        />

        <Button
          title="Verify"
          onPress={handleVerify}
          fullWidth
          loading={isSubmitting}
          disabled={isSubmitting}
          style={{ marginTop: spacing.lg }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    paddingTop: 60,
  },
  title: {
    fontSize: typography.h2,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: typography.body * 1.5,
  },
  form: {
    marginTop: spacing.md,
  },
});
