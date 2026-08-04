import React, { useState } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Input } from './Input';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../theme';

interface PasswordInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label = 'Password',
  value,
  onChangeText,
  placeholder = 'Enter your password',
  error,
}) => {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={!showPassword}
      error={error}
      autoCapitalize="none"
      rightIcon={
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '600' }}>
            {showPassword ? 'HIDE' : 'SHOW'}
          </Text>
        </TouchableOpacity>
      }
    />
  );
};
