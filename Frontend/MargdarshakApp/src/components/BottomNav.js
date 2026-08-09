import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withTiming 
} from 'react-native-reanimated';
import { MapPin, FileText, LayoutDashboard, AlertTriangle } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { getTheme } from '../theme/theme';

/**
 * BottomNav Component
 * Navigation bar with lucide icons, active tab with primary color and subtle background pill
 */
const BottomNavItem = ({ 
  icon: Icon, 
  label, 
  isActive, 
  onPress,
  theme 
}) => {
  const scale = useSharedValue(1);
  const pillScale = useSharedValue(isActive ? 1 : 0.8);
  const pillOpacity = useSharedValue(isActive ? 1 : 0);
  
  React.useEffect(() => {
    pillScale.value = withSpring(isActive ? 1 : 0.8, {
      damping: 15,
      stiffness: 120,
    });
    pillOpacity.value = withTiming(isActive ? 1 : 0, {
      duration: 200,
    });
  }, [isActive]);
  
  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const animatedPillStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pillScale.value }],
    opacity: pillOpacity.value,
  }));
  
  const handlePressIn = () => {
    scale.value = withSpring(0.95, {
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
  
  const iconColor = isActive ? theme.colors.primary : theme.colors.textMuted;
  const textColor = isActive ? theme.colors.primary : theme.colors.textMuted;
  
  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.navItem}
    >
      <Animated.View style={[animatedButtonStyle, styles.navItemContent]}>
        {/* Background Pill for Active State */}
        <Animated.View 
          style={[
            styles.activePill,
            { backgroundColor: `${theme.colors.primary}15` },
            animatedPillStyle,
          ]} 
        />
        
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Icon 
            size={24} 
            color={iconColor}
            strokeWidth={isActive ? 2.5 : 2}
          />
        </View>
        
        {/* Label */}
        <Text 
          style={[
            styles.label,
            theme.typography.captionSmall,
            { 
              color: textColor,
              fontWeight: isActive ? '600' : '400',
            }
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

const BottomNav = ({ 
  activeTab = 'Map',
  onTabChange,
  style,
  ...props 
}) => {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  
  const tabs = [
    { key: 'Map', icon: MapPin, label: 'Map' },
    { key: 'Reports', icon: FileText, label: 'Reports' },
    { key: 'Dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { key: 'SOS', icon: AlertTriangle, label: 'SOS' },
  ];
  
  return (
    <View 
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        theme.shadows.large,
        style,
      ]}
      {...props}
    >
      <View style={styles.navContent}>
        {tabs.map((tab) => (
          <BottomNavItem
            key={tab.key}
            icon={tab.icon}
            label={tab.label}
            isActive={activeTab === tab.key}
            onPress={() => onTabChange?.(tab.key)}
            theme={theme}
          />
        ))}
      </View>
      
      {/* Safe Area Spacer for devices with bottom notch */}
      {Platform.OS === 'ios' && <View style={styles.safeArea} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
  },
  navContent: {
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 4,
    paddingHorizontal: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navItemContent: {
    position: 'relative',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  activePill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
  },
  iconContainer: {
    marginBottom: 4,
  },
  label: {
    textAlign: 'center',
  },
  safeArea: {
    height: 20,
  },
});

export default BottomNav;
