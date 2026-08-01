import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, borderRadius } from '../../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const buttonStyles = [
    styles.base,
    styles[size],
    fullWidth && styles.fullWidth,
    variant === 'secondary' && styles.secondary,
    variant === 'outline' && styles.outline,
    variant === 'text' && styles.text,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.baseText,
    styles[`${size}Text`],
    variant === 'secondary' && styles.secondaryText,
    variant === 'outline' && styles.outlineText,
    variant === 'text' && styles.textText,
    disabled && styles.disabledText,
    textStyle,
  ];

  if (variant === 'primary' && !disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={buttonStyles}
      >
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {loading ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={textStyles}>{title}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={buttonStyles}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? colors.primary : colors.background}
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  small: {
    height: 36,
    paddingHorizontal: spacing.md,
  },
  medium: {
    height: 48,
    paddingHorizontal: spacing.lg,
  },
  large: {
    height: 56,
    paddingHorizontal: spacing.xl,
  },
  fullWidth: {
    width: '100%',
  },
  secondary: {
    backgroundColor: colors.surface,
  },
  outline: {
    backgroundColor: colors.transparent,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  text: {
    backgroundColor: colors.transparent,
  },
  disabled: {
    opacity: 0.5,
  },
  gradient: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    fontSize: typography.button,
    fontWeight: '600',
    color: colors.background,
  },
  smallText: {
    fontSize: typography.bodySmall,
  },
  mediumText: {
    fontSize: typography.button,
  },
  largeText: {
    fontSize: typography.h6,
  },
  secondaryText: {
    color: colors.text,
  },
  outlineText: {
    color: colors.primary,
  },
  textText: {
    color: colors.primary,
  },
  disabledText: {
    opacity: 0.7,
  },
});
