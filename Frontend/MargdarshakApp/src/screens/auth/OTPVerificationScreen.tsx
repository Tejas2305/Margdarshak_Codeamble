import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Button, Input } from '../../components/ui';
import { colors, typography, spacing } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'OTPVerification'>;

export const OTPVerificationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { email, flow } = route.params;
  const [otp, setOtp] = useState('');

  const handleVerify = () => {
    if (flow === 'register') {
      navigation.navigate('Permissions');
    } else {
      navigation.navigate('ResetPassword', { email, otp });
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
