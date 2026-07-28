import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { Colors, Typography, BorderRadius, Spacing } from '../../theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'lg',
  loading = false,
  disabled = false,
  fullWidth = true,
  style,
  textStyle,
  icon,
}) => {
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.base,
        styles[variant],
        styles[`size_${size}` as 'size_sm' | 'size_md' | 'size_lg'],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? Colors.primary : Colors.textInverse}
        />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text
            style={[
              styles.text,
              styles[`text_${variant}` as 'text_primary'],
              styles[`textSize_${size}` as 'textSize_lg'],
              textStyle,
            ]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: { width: '100%' },
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  iconContainer: { marginRight: Spacing.sm },
  primary: { backgroundColor: Colors.primary },
  secondary: { backgroundColor: Colors.secondary },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: Colors.primary },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: Colors.danger },
  size_sm: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, borderRadius: BorderRadius.md },
  size_md: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl },
  size_lg: { paddingVertical: Spacing.lg, paddingHorizontal: Spacing.xl },
  disabled: { opacity: 0.5 },
  text: { fontWeight: Typography.fontWeightSemiBold, letterSpacing: 0.2 },
  text_primary: { color: Colors.textInverse },
  text_secondary: { color: Colors.textInverse },
  text_outline: { color: Colors.primary },
  text_ghost: { color: Colors.primary },
  text_danger: { color: Colors.textInverse },
  textSize_sm: { fontSize: Typography.fontSizeSM },
  textSize_md: { fontSize: Typography.fontSizeMD },
  textSize_lg: { fontSize: Typography.fontSizeLG },
});

export default Button;
