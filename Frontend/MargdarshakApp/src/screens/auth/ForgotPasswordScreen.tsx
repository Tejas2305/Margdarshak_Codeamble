import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Button, Input } from '../../components/ui';
import { colors, typography, spacing } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    navigation.navigate('OTPVerification', { email, flow: 'forgot-password' });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          Enter your email address and we'll send you a code to reset your password
        </Text>

        <View style={styles.form}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Button
            title="Send Code"
            onPress={handleSubmit}
            fullWidth
            style={{ marginTop: spacing.lg }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
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
