import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Button, PasswordInput } from '../../components/ui';
import { colors, typography, spacing } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'ResetPassword'>;

export const ResetPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleReset = () => {
    navigation.navigate('Success', { type: 'reset-password' });
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
