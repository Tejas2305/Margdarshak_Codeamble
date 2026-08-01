export const colors = {
  // Primary Brand Colors
  primary: '#4A90E2',
  primaryDark: '#357ABD',
  primaryLight: '#7FB3EA',
  
  // Safety Colors
  safeGreen: '#4CAF50',
  warningYellow: '#FFC107',
  dangerRed: '#F44336',
  
  // Neutral Colors
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: '#212121',
  textSecondary: '#757575',
  textLight: '#9E9E9E',
  border: '#E0E0E0',
  
  // Dark Mode (for future)
  backgroundDark: '#121212',
  surfaceDark: '#1E1E1E',
  
  // Status
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FFC107',
  info: '#2196F3',
  
  // Social
  google: '#DB4437',
  apple: '#000000',
  
  // Transparent
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
};

export const typography = {
  // Font Families
  regular: 'System',
  medium: 'System',
  bold: 'System',
  
  // Font Sizes
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  h5: 18,
  h6: 16,
  body: 16,
  bodySmall: 14,
  caption: 12,
  button: 16,
  
  // Line Heights
  lineHeightTight: 1.2,
  lineHeightNormal: 1.5,
  lineHeightRelaxed: 1.8,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
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
