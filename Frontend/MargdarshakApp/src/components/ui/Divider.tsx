import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../theme';

interface DividerProps {
  text?: string;
}

export const Divider: React.FC<DividerProps> = ({ text }) => {
  if (text) {
    return (
      <View style={styles.container}>
        <View style={styles.line} />
        <Text style={styles.text}>{text}</Text>
        <View style={styles.line} />
      </View>
    );
  }

  return <View style={[styles.line, { marginVertical: spacing.md }]} />;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  text: {
    marginHorizontal: spacing.md,
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
  },
});
