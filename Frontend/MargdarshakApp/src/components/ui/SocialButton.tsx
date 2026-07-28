import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Typography, BorderRadius, Spacing } from '../../theme';

interface Props {
  title: string; onPress: () => void;
  provider: 'google' | 'apple'; style?: ViewStyle; disabled?: boolean;
}

const SocialButton: React.FC<Props> = ({ title, onPress, provider, style, disabled }) => {
  const isApple = provider === 'apple';
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.8}
      style={[styles.btn, isApple && styles.appleBg, style]}>
      <View style={styles.row}>
        <View style={[styles.iconBox, isApple && styles.appleIconBox]}>
          <Text style={[styles.icon, isApple && styles.appleIcon]}>{isApple ? '' : 'G'}</Text>
        </View>
        <Text style={[styles.text, isApple && styles.appleText]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: { width: '100%', paddingVertical: Spacing.md + 2, paddingHorizontal: Spacing.xl, borderRadius: BorderRadius.lg, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center' },
  appleBg: { backgroundColor: Colors.text, borderColor: Colors.text },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  iconBox: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#4285F4', alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  appleIconBox: { backgroundColor: 'transparent' },
  icon: { fontSize: 13, fontWeight: Typography.fontWeightBold, color: Colors.textInverse },
  appleIcon: { fontSize: 18, color: Colors.textInverse },
  text: { fontSize: Typography.fontSizeMD, fontWeight: Typography.fontWeightSemiBold, color: Colors.text, letterSpacing: 0.2 },
  appleText: { color: Colors.textInverse },
});

export default SocialButton;
