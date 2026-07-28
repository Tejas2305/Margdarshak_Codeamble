import React, { useState } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Input from './Input';
import { Colors, Typography, Spacing } from '../../theme';

interface StrengthConfig { label: string; color: string; width: string }

function getStrength(p: string): StrengthConfig {
  if (!p.length) return { label: '', color: Colors.border, width: '0%' };
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[a-z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  if (s <= 1) return { label: 'Weak', color: Colors.danger, width: '20%' };
  if (s === 2) return { label: 'Fair', color: Colors.warning, width: '40%' };
  if (s === 3) return { label: 'Good', color: '#84CC16', width: '65%' };
  if (s === 4) return { label: 'Strong', color: Colors.secondary, width: '85%' };
  return { label: 'Very Strong', color: '#15803D', width: '100%' };
}

interface Props {
  label?: string; value: string; onChangeText: (t: string) => void;
  error?: string; placeholder?: string; showStrength?: boolean;
  containerStyle?: ViewStyle; required?: boolean;
}

const Req = ({ met, text }: { met: boolean; text: string }) => (
  <View style={styles.req}>
    <Text style={[styles.reqDot, { color: met ? Colors.secondary : Colors.textMuted }]}>{met ? '✓' : '·'}</Text>
    <Text style={[styles.reqText, { color: met ? Colors.text : Colors.textMuted }]}>{text}</Text>
  </View>
);

const PasswordInput: React.FC<Props> = ({ label = 'Password', value, onChangeText, error, placeholder = 'Enter password', showStrength = false, containerStyle, required }) => {
  const [visible, setVisible] = useState(false);
  const strength = getStrength(value);
  return (
    <View style={containerStyle}>
      <Input
        label={label} value={value} onChangeText={onChangeText}
        placeholder={placeholder} secureTextEntry={!visible}
        autoCapitalize="none" autoCorrect={false} error={error} required={required}
        rightIcon={<Text style={{ fontSize: 18 }}>{visible ? '🙈' : '👁️'}</Text>}
        onRightIconPress={() => setVisible(!visible)}
      />
      {showStrength && value.length > 0 && (
        <View style={styles.bar}>
          <View style={styles.track}><View style={[styles.fill, { width: strength.width as any, backgroundColor: strength.color }]} /></View>
          <Text style={[styles.label, { color: strength.color }]}>{strength.label}</Text>
        </View>
      )}
      {showStrength && value.length > 0 && (
        <View style={styles.reqs}>
          <Req met={value.length >= 8} text="8+ characters" />
          <Req met={/[A-Z]/.test(value)} text="Uppercase" />
          <Req met={/[a-z]/.test(value)} text="Lowercase" />
          <Req met={/[0-9]/.test(value)} text="Number" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', marginTop: -Spacing.sm, marginBottom: Spacing.md, paddingHorizontal: Spacing.xs },
  track: { flex: 1, height: 4, backgroundColor: Colors.border, borderRadius: 2, overflow: 'hidden', marginRight: Spacing.md },
  fill: { height: '100%', borderRadius: 2 },
  label: { fontSize: Typography.fontSizeXS, fontWeight: Typography.fontWeightMedium, minWidth: 64, textAlign: 'right' },
  reqs: { marginTop: -Spacing.sm, marginBottom: Spacing.md, paddingHorizontal: Spacing.xs, flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  req: { flexDirection: 'row', alignItems: 'center', width: '48%', marginBottom: 2 },
  reqDot: { fontSize: 13, marginRight: 4, fontWeight: '700' },
  reqText: { fontSize: Typography.fontSizeXS },
});

export default PasswordInput;
