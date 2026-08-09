import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring 
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { getTheme } from '../theme/theme';

/**
 * IconButton Component
 * Circular or square button with icon and press animation
 */
const IconButton = ({ 
  children,
  onPress,
  variant = 'ghost', // 'ghost' | 'filled' | 'outlined'
  size = 'medium', // 'small' | 'medium' | 'large'
  color = null, // Custom color (overrides theme)
  shape = 'circle', // 'circle' | 'square'
  disabled = false,
  style,
  ...props 
}) => {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const handlePressIn = () => {
    scale.value = withSpring(0.92, {
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
  
  // Get size
  const getSize = () => {
    switch (size) {
      case 'small':
        return 36;
      case 'large':
        return 56;
      case 'medium':
      default:
        return 44;
    }
  };
  
  // Get variant styles
  const getVariantStyles = () => {
    const baseColor = color || theme.colors.primary;
    
    switch (variant) {
      case 'filled':
        return {
          backgroundColor: disabled ? theme.colors.borderLight : baseColor,
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: disabled ? theme.colors.border : baseColor,
        };
      case 'ghost':
      default:
        return {
          backgroundColor: disabled 
            ? theme.colors.borderLight 
            : `${baseColor}15`, // 15% opacity
        };
    }
  };
  
  const buttonSize = getSize();
  const borderRadius = shape === 'circle' ? buttonSize / 2 : theme.radius.button;
  
  return (
    <Animated.View style={[animatedStyle]}>
      <Pressable
        onPress={disabled ? null : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          styles.button,
          {
            width: buttonSize,
            height: buttonSize,
            borderRadius,
          },
          getVariantStyles(),
          style,
        ]}
        {...props}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});

export default IconButton;
