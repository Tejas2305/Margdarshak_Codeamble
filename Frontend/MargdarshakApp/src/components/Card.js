import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { getTheme } from '../theme/theme';

/**
 * Card Component
 * Surface background, 16px radius, soft shadow, 16px padding
 */
const Card = ({ 
  children, 
  style, 
  padding = 16,
  noPadding = false,
  noShadow = false,
  elevated = false,
  ...props 
}) => {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  
  return (
    <View 
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.card,
          padding: noPadding ? 0 : padding,
        },
        !noShadow && (elevated ? theme.shadows.medium : theme.shadows.soft),
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});

export default Card;
