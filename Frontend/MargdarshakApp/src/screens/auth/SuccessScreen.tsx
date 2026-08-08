import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Button } from '../../components/ui';
import { colors, typography, spacing } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Success'> & {
  onAuthSuccess?: () => void;
};

export const SuccessScreen: React.FC<Props> = ({ navigation, route, onAuthSuccess }) => {
  const { type } = route.params;

  const title = type === 'register' ? 'Account Created!' : 'Password Reset!';
  const message =
    type === 'register'
      ? 'Your account has been successfully created'
      : 'Your password has been successfully reset';

  useEffect(() => {
    const timer = setTimeout(() => {
      if (type === 'register' && onAuthSuccess) {
        // User just registered, go to main app
        onAuthSuccess();
      } else {
        // Password reset, go to login
        navigation.navigate('Login');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation, type, onAuthSuccess]);

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>✓</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      <Button
        title={type === 'register' ? 'Get Started' : 'Continue to Login'}
        onPress={() => {
          if (type === 'register' && onAuthSuccess) {
            onAuthSuccess();
          } else {
            navigation.navigate('Login');
          }
        }}
        fullWidth
        style={{ marginTop: spacing.xl }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  icon: {
    fontSize: 80,
    color: colors.success,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.h2,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
