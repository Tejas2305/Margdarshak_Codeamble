import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { Colors, Typography, Spacing } from '../../theme';

const HomeScreen: React.FC = () => (
  <View style={s.container}>
    <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
    <Text style={s.emoji}>🗺️</Text>
    <Text style={s.title}>Margdarshak</Text>
    <Text style={s.subtitle}>Home map screen — coming next.</Text>
  </View>
);

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xxl },
  emoji: { fontSize: 48, marginBottom: Spacing.lg },
  title: { fontSize: Typography.fontSize2XL, fontWeight: Typography.fontWeightBold, color: Colors.text, marginBottom: Spacing.md },
  subtitle: { fontSize: Typography.fontSizeMD, color: Colors.textSecondary, textAlign: 'center' },
});

export default HomeScreen;
