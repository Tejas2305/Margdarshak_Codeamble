// Google Maps inspired professional theme
export const colors = {
  // Primary - Google Maps Blue
  primary: '#1A73E8',
  primaryDark: '#1557B0',
  primaryLight: '#4285F4',
  
  // Safety Colors - Google style
  success: '#34A853',
  warning: '#FBBC04',
  error: '#EA4335',
  info: '#4285F4',
  
  // Background - Clean white
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceVariant: '#F8F9FA',
  
  // Text - Google's hierarchy
  text: '#202124',
  textSecondary: '#5F6368',
  textTertiary: '#80868B',
  textDisabled: '#BDC1C6',
  textLight: '#80868B',
  
  // UI Elements - Subtle
  border: '#DADCE0',
  borderLight: '#E8EAED',
  divider: '#F1F3F4',
  
  // Map specific
  mapBackground: '#E8F5E9',
  safeGreen: '#34A853',
  dangerRed: '#EA4335',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.4)',
  overlayLight: 'rgba(0, 0, 0, 0.2)',
  
  // Social
  google: '#EA4335',
  apple: '#000000',
  
  // Transparent
  transparent: 'transparent',
};

export const typography = {
  // Font Sizes - Google's scale
  h1: 28,
  h2: 24,
  h3: 20,
  h4: 18,
  h5: 16,
  h6: 14,
  body: 14,
  bodyLarge: 16,
  bodySmall: 13,
  caption: 12,
  overline: 11,
  button: 14,
  
  // Font Families
  regular: 'System',
  medium: 'System',
  bold: 'System',
  
  // Line Heights
  lineHeightTight: 1.2,
  lineHeightNormal: 1.4,
  lineHeightRelaxed: 1.6,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  full: 9999,
};

export const shadows = {
  // Google's subtle elevation
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
};

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
};

export type Theme = typeof theme;
