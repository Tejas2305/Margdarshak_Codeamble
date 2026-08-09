import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { getTheme } from '../theme/theme';

/**
 * StatCard Component
 * Number + label with colored accent bar on top
 */
const StatCard = ({ 
  value,
  label,
  accentColor,
  icon = null,
  trend = null, // { value: '+12%', direction: 'up' | 'down' }
  style,
  ...props 
}) => {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  
  const defaultAccentColor = accentColor || theme.colors.primary;
  
  return (
    <View 
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.card,
        },
        theme.shadows.soft,
        style,
      ]}
      {...props}
    >
      {/* Colored Accent Bar */}
      <View 
        style={[
          styles.accentBar,
          { backgroundColor: defaultAccentColor }
        ]} 
      />
      
      {/* Content */}
      <View style={styles.content}>
        {/* Value Row */}
        <View style={styles.valueRow}>
          {icon && <View style={styles.icon}>{icon}</View>}
          
          <Text 
            style={[
              styles.value,
              theme.typography.heading1,
              { color: theme.colors.textPrimary }
            ]}
          >
            {value}
          </Text>
          
          {trend && (
            <View style={styles.trendContainer}>
              <Text 
                style={[
                  styles.trend,
                  theme.typography.captionSmall,
                  { 
                    color: trend.direction === 'up' 
                      ? theme.colors.success 
                      : theme.colors.danger 
                  }
                ]}
              >
                {trend.value}
              </Text>
            </View>
          )}
        </View>
        
        {/* Label */}
        <Text 
          style={[
            styles.label,
            theme.typography.body,
            { color: theme.colors.textSecondary }
          ]}
        >
          {label}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  accentBar: {
    height: 4,
    width: '100%',
  },
  content: {
    padding: 16,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    marginRight: 8,
  },
  value: {
    flex: 1,
  },
  trendContainer: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  trend: {
    fontWeight: '700',
  },
  label: {
    marginTop: 2,
  },
});

export default StatCard;
