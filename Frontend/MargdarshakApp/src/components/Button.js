import React from 'react';
import { Text, StyleSheet, Pressable, ActivityIndicator, View } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring 
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { getTheme } from '../theme/theme';

/**
 * Button Component
 * Primary/Secondary/Danger variants, 12px radius, press-scale animation
 */
const Button = ({ 
  children,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'ghost'
  size = 'medium', // 'small' | 'medium' | 'large'
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
  ...props 
}) => {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const handlePressIn = () => {
    scale.value = withSpring(0.96, {
      damping: 15,
      stiffness: 150,
    });
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
  };
  
  // Get variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled ? theme.colors.textMuted : theme.colors.primary,
          borderWidth: 0,
        };
      case 'secondary':
        return {
          backgroundColor: disabled ? theme.colors.borderLight : theme.colors.surface,
          borderWidth: 1.5,
          borderColor: disabled ? theme.colors.border : theme.colors.primary,
        };
      case 'danger':
        return {
          backgroundColor: disabled ? theme.colors.textMuted : theme.colors.danger,
          borderWidth: 0,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      default:
        return {};
    }
  };
  
  // Get text color
  const getTextColor = () => {
    if (disabled) return theme.colors.textDisabled;
    
    switch (variant) {
      case 'primary':
      case 'danger':
        return '#FFFFFF';
      case 'secondary':
        return theme.colors.primary;
      case 'ghost':
        return theme.colors.textPrimary;
      default:
        return theme.colors.textPrimary;
    }
  };
  
  // Get size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          minHeight: 36,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 24,
          minHeight: 52,
        };
      case 'medium':
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 20,
          minHeight: 44,
        };
    }
  };
  
  const getTextSizeStyles = () => {
    switch (size) {
      case 'small':
        return theme.typography.buttonSmall;
      case 'large':
      case 'medium':
      default:
        return theme.typography.button;
    }
  };
  
  return (
    <Animated.View style={[animatedStyle, fullWidth && styles.fullWidth]}>
      <Pressable
        onPress={disabled || loading ? null : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          styles.button,
          getVariantStyles(),
          getSizeStyles(),
          fullWidth && styles.fullWidth,
          style,
        ]}
        {...props}
      >
        {loading ? (
          <ActivityIndicator 
            color={getTextColor()} 
            size={size === 'small' ? 'small' : 'small'} 
          />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <View style={styles.iconLeft}>{icon}</View>
            )}
            
            {typeof children === 'string' ? (
              <Text 
                style={[
                  styles.text,
                  getTextSizeStyles(),
                  { color: getTextColor() },
                  textStyle,
                ]}
              >
                {children}
              </Text>
            ) : (
              children
            )}
            
            {icon && iconPosition === 'right' && (
              <View style={styles.iconRight}>{icon}</View>
            )}
          </>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  text: {
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  fullWidth: {
    width: '100%',
  },
});

export default Button;
