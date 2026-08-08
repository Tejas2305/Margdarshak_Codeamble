import React, { useState } from 'react';
import { Alert, View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Button, PasswordInput } from '../../components/ui';
import { colors, typography, spacing } from '../../theme';
import { authService } from '../../services/api';

type Props = NativeStackScreenProps<AuthStackParamList, 'ResetPassword'>;

export const ResetPasswordScreen: React.FC<Props> = ({ navigation, route }) => {
  const { email, otp } = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = async () => {
    if (password.length < 6) {
      Alert.alert('Invalid Password', 'Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Passwords Do Not Match', 'Please confirm the same password.');
      return;
    }

    try {
      setIsSubmitting(true);
      await authService.resetPassword(email, otp, password);
      navigation.navigate('Success', { type: 'reset-password' });
    } catch (error: any) {
      Alert.alert('Reset Failed', error?.response?.data?.detail || 'Unable to reset password right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>Enter your new password</Text>

      <View style={styles.form}>
        <PasswordInput
          label="New Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter new password"
        />
        <PasswordInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm new password"
        />

        <Button
          title="Reset Password"
          onPress={handleReset}
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
  },
  form: {
    marginTop: spacing.md,
  },
});
