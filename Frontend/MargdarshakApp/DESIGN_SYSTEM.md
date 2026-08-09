# Design System Documentation

## Overview

This design system provides a comprehensive set of components, tokens, and guidelines for building consistent, accessible, and beautiful UI in the Margdarshak app.

---

## 🎨 Theme

Located at: `src/theme/theme.js`

### Colors

#### Primary Colors
- **Primary**: `#6C4EF5` (Deep Violet) - Main brand color
- **Primary Light**: `#8B6EF7`
- **Primary Dark**: `#5639D6`

#### Danger (SOS/Emergency ONLY)
- **Danger**: `#F5484A` - Reserved exclusively for SOS and emergency features
- **Danger Light**: `#F76B6C`
- **Danger Dark**: `#D63839`

#### Status Colors
- **Success**: `#4CAF50` (Green)
- **Warning**: `#FF9800` (Amber)
- **Info**: `#2196F3` (Blue)

#### Backgrounds
- **Background**: `#FAFAFA` (Light gray)
- **Surface**: `#FFFFFF` (White)
- **Surface Elevated**: `#FFFFFF`

#### Text Hierarchy
- **Text Primary**: `#1A1A1A` (Almost black)
- **Text Secondary**: `#666666` (Medium gray)
- **Text Muted**: `#999999` (Light gray)
- **Text Disabled**: `#CCCCCC` (Very light gray)

#### Usage Guidelines
```javascript
import { getTheme } from '../theme/theme';
import { useTheme } from '../contexts/ThemeContext';

const MyComponent = () => {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  
  return <View style={{ backgroundColor: theme.colors.surface }} />;
};
```

---

### Spacing Scale

Based on 4px increments:

```javascript
spacing = {
  xs: 4,      // Extra small
  sm: 8,      // Small
  md: 12,     // Medium
  lg: 16,     // Large (default)
  xl: 24,     // Extra large
  xxl: 32,    // Double extra large
  xxxl: 48,   // Triple extra large
}
```

**Semantic spacing:**
- Container padding: `16px`
- Card padding: `16px`
- Section gap: `24px`
- Item gap: `12px`

---

### Border Radius Scale

```javascript
radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,     // Default for cards
  xl: 24,
  xxl: 32,
  full: 9999, // Perfect circles
  
  // Semantic
  card: 16,
  button: 12,
  input: 12,
}
```

---

### Shadow Presets

Optimized for both iOS and Android:

```javascript
shadows = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: { ... },
  large: { ... },
  xl: { ... },
}
```

**Usage:**
```javascript
<View style={[styles.card, theme.shadows.soft]} />
```

---

### Typography Scale

Clean sans-serif font (Inter or System font):

```javascript
typography = {
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
  body: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: 0,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    letterSpacing: 0.1,
  },
  button: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: 0.3,
  },
}
```

---

## 🧩 Components

Located at: `src/components/`

### Card

Surface background, 16px radius, soft shadow, 16px padding.

```javascript
import { Card } from '../components';

<Card>
  <Text>Content goes here</Text>
</Card>

<Card noPadding elevated>
  <Image source={...} />
</Card>
```

**Props:**
- `padding`: Custom padding (default: 16)
- `noPadding`: Remove all padding (default: false)
- `noShadow`: Remove shadow (default: false)
- `elevated`: Use medium shadow instead of soft (default: false)
- `style`: Additional styles

---

### Button

Primary/Secondary/Danger variants with press-scale animation.

```javascript
import { Button } from '../components';

<Button onPress={handlePress}>
  Submit
</Button>

<Button 
  variant="secondary"
  size="small"
  icon={<Icon name="check" />}
  iconPosition="left"
  fullWidth
  loading={isLoading}
  onPress={handlePress}
>
  Continue
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'ghost' (default: 'primary')
- `size`: 'small' | 'medium' | 'large' (default: 'medium')
- `disabled`: Disable button (default: false)
- `loading`: Show loading spinner (default: false)
- `icon`: Icon component
- `iconPosition`: 'left' | 'right' (default: 'left')
- `fullWidth`: Expand to container width (default: false)

---

### StatCard

Dashboard stat card with number, label, and colored accent bar.

```javascript
import { StatCard } from '../components';

<StatCard
  value="342"
  label="Total Reports"
  accentColor="#4CAF50"
  icon={<Icon name="file" />}
  trend={{ value: '+12%', direction: 'up' }}
/>
```

**Props:**
- `value`: Main stat value (string or number)
- `label`: Description text
- `accentColor`: Top accent bar color (default: primary)
- `icon`: Optional icon
- `trend`: Optional trend indicator { value, direction }

---

### IconButton

Circular or square button with icon and press animation.

```javascript
import { IconButton } from '../components';
import { Settings } from 'lucide-react-native';

<IconButton onPress={handlePress}>
  <Settings size={20} color="#6C4EF5" />
</IconButton>

<IconButton 
  variant="filled"
  size="large"
  shape="square"
  color="#F5484A"
  onPress={handlePress}
>
  <AlertTriangle size={24} color="#FFF" />
</IconButton>
```

**Props:**
- `variant`: 'ghost' | 'filled' | 'outlined' (default: 'ghost')
- `size`: 'small' | 'medium' | 'large' (default: 'medium')
- `shape`: 'circle' | 'square' (default: 'circle')
- `color`: Custom color (overrides theme)
- `disabled`: Disable button (default: false)

---

### BottomNav

Navigation bar with lucide icons and active state pill.

```javascript
import { BottomNav } from '../components';

<BottomNav
  activeTab="Map"
  onTabChange={(tab) => navigation.navigate(tab)}
/>
```

**Built-in tabs:**
- Map (MapPin icon)
- Reports (FileText icon)
- Dashboard (LayoutDashboard icon)
- SOS (AlertTriangle icon - uses danger color)

**Props:**
- `activeTab`: Current active tab key
- `onTabChange`: Callback when tab is pressed

---

## 📦 Icons

Using `lucide-react-native` for consistent, modern icons.

```javascript
import { MapPin, FileText, AlertTriangle } from 'lucide-react-native';

<MapPin size={24} color="#6C4EF5" strokeWidth={2} />
```

**Common icons:**
- Navigation: `MapPin`, `Navigation`, `Compass`
- Actions: `Plus`, `Check`, `X`, `ChevronRight`
- Files: `FileText`, `File`, `Upload`
- Users: `User`, `Users`, `UserCheck`
- Alerts: `AlertTriangle`, `AlertCircle`, `Info`
- Settings: `Settings`, `Bell`, `Lock`

---

## 🎭 Animations

Using `react-native-reanimated` for smooth 60fps animations.

**Press Scale Animation (built into Button/IconButton):**
```javascript
const scale = useSharedValue(1);

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));

// In onPressIn
scale.value = withSpring(0.96, {
  damping: 15,
  stiffness: 150,
});
```

**Duration Constants:**
```javascript
durations = {
  fast: 150,
  normal: 250,
  slow: 350,
}
```

---

## 🎯 Usage Examples

### Building a Screen

```javascript
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Card, Button, StatCard } from '../components';
import { useTheme } from '../contexts/ThemeContext';
import { getTheme } from '../theme/theme';

const DashboardScreen = () => {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  
  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }}>
      <View style={{ padding: theme.spacing.lg }}>
        <Text style={[theme.typography.heading1, { color: theme.colors.textPrimary }]}>
          Dashboard
        </Text>
        
        <View style={{ marginTop: theme.spacing.xl }}>
          <StatCard
            value="342"
            label="Total Reports"
            accentColor={theme.colors.success}
          />
        </View>
        
        <Button 
          variant="primary" 
          fullWidth
          onPress={() => {}}
          style={{ marginTop: theme.spacing.xl }}
        >
          Create Report
        </Button>
      </View>
    </ScrollView>
  );
};
```

---

## ✅ Design Principles

1. **Consistency**: Use design tokens (spacing, colors, typography) everywhere
2. **Accessibility**: Maintain 4.5:1 contrast ratio for text
3. **Performance**: Use reanimated for smooth animations
4. **Simplicity**: Favor clarity over complexity
5. **Hierarchy**: Clear visual hierarchy through typography and spacing
6. **Feedback**: Always provide visual feedback for interactions

---

## 🚀 Next Steps

- Use these components for all new screens
- Refactor existing screens to use the design system
- Add more specialized components as needed
- Maintain consistency across the app

