// Professional minimal theme - Black, White, Gray with Dark mode support

export const lightColors = {
  // Primary - Minimal blue usage
  primary: '#1A73E8',
  primaryDark: '#1557B0',
  primaryLight: '#4285F4',
  
  // Safety Colors - Only for critical use
  success: '#34A853',
  warning: '#FBBC04',
  error: '#EA4335',
  info: '#1A73E8',
  
  // Background - Clean white
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceVariant: '#F8F9FA',
  
  // Text - Black and gray hierarchy
  text: '#000000',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textDisabled: '#CCCCCC',
  textLight: '#999999',
  
  // UI Elements - Gray tones
  border: '#F0F0F0',
  borderLight: '#F5F5F5',
  divider: '#F0F0F0',
  
  // Map specific
  mapBackground: '#F5F5F5',
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

export const darkColors = {
  // Primary - Minimal blue usage
  primary: '#5B8DEE',
  primaryDark: '#4A7BCE',
  primaryLight: '#7CA3F2',
  
  // Safety Colors - Only for critical use
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#5B8DEE',
  
  // Background - Dark theme
  background: '#121212',
  surface: '#1E1E1E',
  surfaceVariant: '#2A2A2A',
  
  // Text - Light colors for dark theme
  text: '#FFFFFF',
  textSecondary: '#B3B3B3',
  textTertiary: '#808080',
  textDisabled: '#666666',
  textLight: '#B3B3B3',
  
  // UI Elements - Dark tones
  border: '#333333',
  borderLight: '#2A2A2A',
  divider: '#333333',
  
  // Map specific
  mapBackground: '#1A1A1A',
  safeGreen: '#4CAF50',
  dangerRed: '#F44336',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.5)',
  
  // Social
  google: '#EA4335',
  apple: '#FFFFFF',
  
  // Transparent
  transparent: 'transparent',
};

export const colors = lightColors; // Default export for backward compatibility

export const typography = {
  // Font Sizes - Clean hierarchy
  h1: 28,
  h2: 24,
  h3: 20,
  h4: 18,
  h5: 17,
  h6: 15,
  body: 14,
  bodyLarge: 15,
  bodySmall: 13,
  caption: 12,
  overline: 11,
  button: 15,
  
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
  lg: 10,
  xl: 12,
  xxl: 16,
  full: 9999,
};

export const shadows = {
  // Minimal subtle shadows
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
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

// Function to get theme colors based on mode
export const getThemeColors = (isDark: boolean) => {
  return isDark ? darkColors : lightColors;
};

export type Theme = typeof theme;
