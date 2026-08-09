/**
 * Design System Theme
 * Professional color palette with deep violet primary and clean hierarchy
 */

export const lightColors = {
  // Primary - Deep Violet
  primary: '#6C4EF5',
  primaryLight: '#8B6EF7',
  primaryDark: '#5639D6',
  
  // Danger - ONLY for SOS/Emergency
  danger: '#F5484A',
  dangerLight: '#F76B6C',
  dangerDark: '#D63839',
  
  // Status Colors
  success: '#4CAF50',
  successLight: '#66BB6A',
  successDark: '#388E3C',
  
  warning: '#FF9800',
  warningLight: '#FFB74D',
  warningDark: '#F57C00',
  
  info: '#2196F3',
  infoLight: '#64B5F6',
  infoDark: '#1976D2',
  
  // Backgrounds
  background: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  
  // Text Hierarchy
  textPrimary: '#1A1A1A',
  textSecondary: '#666666',
  textMuted: '#999999',
  textDisabled: '#CCCCCC',
  textInverse: '#FFFFFF',
  
  // UI Elements
  border: '#E8E8E8',
  borderLight: '#F0F0F0',
  divider: '#EEEEEE',
  
  // Overlays
  overlay: 'rgba(0, 0, 0, 0.4)',
  overlayLight: 'rgba(0, 0, 0, 0.2)',
  scrim: 'rgba(0, 0, 0, 0.6)',
  
  // Map Specific
  safeGreen: '#4CAF50',
  dangerRed: '#F5484A',
  warningAmber: '#FF9800',
};

export const darkColors = {
  // Primary - Deep Violet (slightly lighter for dark mode)
  primary: '#8B6EF7',
  primaryLight: '#A78FF9',
  primaryDark: '#6C4EF5',
  
  // Danger - ONLY for SOS/Emergency
  danger: '#F76B6C',
  dangerLight: '#F98788',
  dangerDark: '#F5484A',
  
  // Status Colors
  success: '#66BB6A',
  successLight: '#81C784',
  successDark: '#4CAF50',
  
  warning: '#FFB74D',
  warningLight: '#FFC777',
  warningDark: '#FF9800',
  
  info: '#64B5F6',
  infoLight: '#90CAF9',
  infoDark: '#2196F3',
  
  // Backgrounds
  background: '#121212',
  surface: '#1E1E1E',
  surfaceElevated: '#2A2A2A',
  
  // Text Hierarchy
  textPrimary: '#FFFFFF',
  textSecondary: '#B3B3B3',
  textMuted: '#808080',
  textDisabled: '#4D4D4D',
  textInverse: '#1A1A1A',
  
  // UI Elements
  border: '#333333',
  borderLight: '#2A2A2A',
  divider: '#2D2D2D',
  
  // Overlays
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.5)',
  scrim: 'rgba(0, 0, 0, 0.8)',
  
  // Map Specific
  safeGreen: '#66BB6A',
  dangerRed: '#F76B6C',
  warningAmber: '#FFB74D',
};

// Spacing Scale - 4px base
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  
  // Semantic spacing
  containerPadding: 16,
  cardPadding: 16,
  sectionGap: 24,
  itemGap: 12,
};

// Border Radius Scale
export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
  
  // Semantic radius
  card: 16,
  button: 12,
  input: 12,
  pill: 9999,
};

// Shadow Presets (iOS shadowColor/shadowOpacity/shadowRadius + Android elevation)
export const shadows = {
  none: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
  
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.20,
    shadowRadius: 24,
    elevation: 12,
  },
};

// Typography Scale - Clean sans font (Inter or System)
export const typography = {
  // Headings
  heading1: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  
  heading2: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  
  heading3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  
  heading4: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0,
  },
  
  // Body Text
  body: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: 0,
  },
  
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: 0,
  },
  
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0,
  },
  
  // Caption
  caption: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    letterSpacing: 0.1,
  },
  
  captionSmall: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0.2,
  },
  
  // Buttons & Labels
  button: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: 0.3,
  },
  
  buttonSmall: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    letterSpacing: 0.3,
  },
  
  // Overlines & Labels
  overline: {
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 16,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  
  label: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    letterSpacing: 0.2,
  },
};

// Animation Durations
export const durations = {
  fast: 150,
  normal: 250,
  slow: 350,
};

// Animation Easings
export const easings = {
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
};

// Complete Theme Object
export const theme = {
  colors: lightColors,
  spacing,
  radius,
  shadows,
  typography,
  durations,
  easings,
};

// Function to get theme based on mode
export const getTheme = (isDark = false) => ({
  colors: isDark ? darkColors : lightColors,
  spacing,
  radius,
  shadows,
  typography,
  durations,
  easings,
});

// Export individual modules for convenience
export default theme;
