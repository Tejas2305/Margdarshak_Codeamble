import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { Colors, Typography, BorderRadius, Spacing } from '../../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  required,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <View style={[styles.inputWrapper, focused && styles.focused, !!error && styles.errored]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[styles.input, leftIcon ? styles.inputWithLeft : null, rightIcon ? styles.inputWithRight : null]}
          placeholderTextColor={Colors.textMuted}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity style={styles.rightIcon} onPress={onRightIconPress} disabled={!onRightIconPress}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.lg },
  label: { fontSize: Typography.fontSizeSM, fontWeight: Typography.fontWeightMedium, color: Colors.text, marginBottom: Spacing.sm },
  required: { color: Colors.danger },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.inputBg, borderRadius: BorderRadius.md,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  focused: { borderColor: Colors.borderFocus, backgroundColor: Colors.surface },
  errored: { borderColor: Colors.danger, backgroundColor: '#FFF5F5' },
  input: { flex: 1, paddingVertical: Spacing.md + 2, paddingHorizontal: Spacing.lg, fontSize: Typography.fontSizeMD, color: Colors.text },
  inputWithLeft: { paddingLeft: Spacing.xs },
  inputWithRight: { paddingRight: Spacing.xs },
  leftIcon: { paddingLeft: Spacing.lg },
  rightIcon: { paddingRight: Spacing.lg, padding: Spacing.xs },
  error: { fontSize: Typography.fontSizeXS, color: Colors.danger, marginTop: Spacing.xs, marginLeft: Spacing.xs },
  hint: { fontSize: Typography.fontSizeXS, color: Colors.textMuted, marginTop: Spacing.xs, marginLeft: Spacing.xs },
});

export default Input;
