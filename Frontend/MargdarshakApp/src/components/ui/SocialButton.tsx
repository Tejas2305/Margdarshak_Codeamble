import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';

interface SocialButtonProps {
  provider: 'google' | 'apple';
  onPress: () => void;
}

export const SocialButton: React.FC<SocialButtonProps> = ({ provider, onPress }) => {
  const isGoogle = provider === 'google';

  return (
    <TouchableOpacity
      style={[styles.button, isGoogle ? styles.google : styles.apple]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.iconPlaceholder}>
        <Text style={styles.iconText}>{isGoogle ? 'G' : ''}</Text>
      </View>
      <Text style={[styles.text, isGoogle ? styles.googleText : styles.appleText]}>
        Continue with {isGoogle ? 'Google' : 'Apple'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  google: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  apple: {
    backgroundColor: colors.apple,
  },
  iconPlaceholder: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  iconText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.google,
  },
  text: {
    fontSize: typography.button,
    fontWeight: '600',
  },
  googleText: {
    color: colors.text,
  },
  appleText: {
    color: colors.background,
  },
});
