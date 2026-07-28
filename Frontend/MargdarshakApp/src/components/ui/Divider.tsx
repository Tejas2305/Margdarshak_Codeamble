import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../../theme';

const Divider: React.FC<{ label?: string }> = ({ label }) => {
  if (!label) return <View style={styles.line} />;
  return (
    <View style={styles.row}>
      <View style={styles.line} />
      <Text style={styles.text}>{label}</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: Spacing.lg },
  line: { flex: 1, height: 1, backgroundColor: Colors.border },
  text: { marginHorizontal: Spacing.lg, fontSize: Typography.fontSizeSM, color: Colors.textMuted, fontWeight: Typography.fontWeightMedium },
});

export default Divider;
