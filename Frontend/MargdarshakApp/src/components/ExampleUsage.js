/**
 * Example Usage of Design System Components
 * This file demonstrates how to use the design system components
 * DO NOT import this in production - it's for reference only
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { MapPin, FileText, Check, AlertTriangle } from 'lucide-react-native';
import { Card, Button, StatCard, IconButton, BottomNav } from './index';
import { useTheme } from '../contexts/ThemeContext';
import { getTheme } from '../theme/theme';

const ExampleUsage = () => {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  
  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }}>
      <View style={{ padding: theme.spacing.lg }}>
        
        {/* Typography Examples */}
        <Text style={[theme.typography.heading1, { color: theme.colors.textPrimary }]}>
          Heading 1
        </Text>
        <Text style={[theme.typography.heading2, { color: theme.colors.textPrimary, marginTop: theme.spacing.md }]}>
          Heading 2
        </Text>
        <Text style={[theme.typography.body, { color: theme.colors.textSecondary, marginTop: theme.spacing.md }]}>
          Body text with proper line height and spacing for comfortable reading.
        </Text>
        <Text style={[theme.typography.caption, { color: theme.colors.textMuted, marginTop: theme.spacing.sm }]}>
          Caption text for small details
        </Text>
        
        {/* Card Examples */}
        <View style={{ marginTop: theme.spacing.xl }}>
          <Text style={[theme.typography.heading2, { color: theme.colors.textPrimary, marginBottom: theme.spacing.md }]}>
            Cards
          </Text>
          
          <Card style={{ marginBottom: theme.spacing.md }}>
            <Text style={[theme.typography.body, { color: theme.colors.textPrimary }]}>
              Default Card with padding
            </Text>
          </Card>
          
          <Card elevated style={{ marginBottom: theme.spacing.md }}>
            <Text style={[theme.typography.body, { color: theme.colors.textPrimary }]}>
              Elevated Card with medium shadow
            </Text>
          </Card>
        </View>
        
        {/* Button Examples */}
        <View style={{ marginTop: theme.spacing.xl }}>
          <Text style={[theme.typography.heading2, { color: theme.colors.textPrimary, marginBottom: theme.spacing.md }]}>
            Buttons
          </Text>
          
          <Button 
            variant="primary" 
            onPress={() => console.log('Primary')}
            style={{ marginBottom: theme.spacing.sm }}
          >
            Primary Button
          </Button>
          
          <Button 
            variant="secondary" 
            onPress={() => console.log('Secondary')}
            style={{ marginBottom: theme.spacing.sm }}
          >
            Secondary Button
          </Button>
          
          <Button 
            variant="danger" 
            onPress={() => console.log('Danger')}
            style={{ marginBottom: theme.spacing.sm }}
          >
            Danger Button
          </Button>
          
          <Button 
            variant="primary"
            size="small"
            icon={<Check size={16} color="#FFF" />}
            iconPosition="left"
            onPress={() => console.log('With icon')}
            style={{ marginBottom: theme.spacing.sm }}
          >
            With Icon
          </Button>
          
          <Button 
            variant="primary"
            loading
            onPress={() => console.log('Loading')}
            style={{ marginBottom: theme.spacing.sm }}
          >
            Loading
          </Button>
          
          <Button 
            variant="primary"
            disabled
            onPress={() => console.log('Disabled')}
          >
            Disabled
          </Button>
        </View>
        
        {/* StatCard Examples */}
        <View style={{ marginTop: theme.spacing.xl }}>
          <Text style={[theme.typography.heading2, { color: theme.colors.textPrimary, marginBottom: theme.spacing.md }]}>
            Stat Cards
          </Text>
          
          <View style={{ flexDirection: 'row', gap: theme.spacing.md, marginBottom: theme.spacing.md }}>
            <View style={{ flex: 1 }}>
              <StatCard
                value="342"
                label="Total Reports"
                accentColor={theme.colors.success}
              />
            </View>
            <View style={{ flex: 1 }}>
              <StatCard
                value="89%"
                label="Safety Score"
                accentColor={theme.colors.primary}
                trend={{ value: '+5%', direction: 'up' }}
              />
            </View>
          </View>
          
          <StatCard
            value="15"
            label="Active Alerts"
            accentColor={theme.colors.danger}
            icon={<AlertTriangle size={20} color={theme.colors.danger} />}
          />
        </View>
        
        {/* IconButton Examples */}
        <View style={{ marginTop: theme.spacing.xl }}>
          <Text style={[theme.typography.heading2, { color: theme.colors.textPrimary, marginBottom: theme.spacing.md }]}>
            Icon Buttons
          </Text>
          
          <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
            <IconButton onPress={() => console.log('Ghost')}>
              <MapPin size={20} color={theme.colors.primary} />
            </IconButton>
            
            <IconButton 
              variant="filled" 
              onPress={() => console.log('Filled')}
            >
              <FileText size={20} color="#FFF" />
            </IconButton>
            
            <IconButton 
              variant="outlined" 
              onPress={() => console.log('Outlined')}
            >
              <Check size={20} color={theme.colors.primary} />
            </IconButton>
            
            <IconButton 
              size="large"
              color={theme.colors.danger}
              onPress={() => console.log('Large')}
            >
              <AlertTriangle size={24} color={theme.colors.danger} />
            </IconButton>
          </View>
        </View>
        
        {/* Spacing Examples */}
        <View style={{ marginTop: theme.spacing.xl }}>
          <Text style={[theme.typography.heading2, { color: theme.colors.textPrimary, marginBottom: theme.spacing.md }]}>
            Spacing Scale
          </Text>
          
          {Object.entries(theme.spacing).map(([key, value]) => (
            <View key={key} style={{ marginBottom: theme.spacing.sm }}>
              <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
                {key}: {value}px
              </Text>
              <View style={{ height: value, backgroundColor: theme.colors.primary, marginTop: 4 }} />
            </View>
          ))}
        </View>
        
        {/* Add bottom space */}
        <View style={{ height: 100 }} />
      </View>
      
      {/* Bottom Navigation */}
      <BottomNav
        activeTab="Map"
        onTabChange={(tab) => console.log('Tab changed:', tab)}
      />
    </ScrollView>
  );
};

export default ExampleUsage;
