import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform,
  TextInput, Animated, ScrollView, KeyboardAvoidingView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme';
import { Button } from '../../components/ui';
import { AuthStackParamList } from '../../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'OTPVerification'>;
  route: RouteProp<AuthStackParamList, 'OTPVerification'>;
};

const LEN = 6;
const RESEND = 30;

const OTPVerificationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { email } = route.params;
  const [otp, setOtp] = useState(Array(LEN).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(RESEND);
  const [canResend, setCanResend] = useState(false);
  const refs = useRef<(TextInput | null)[]>([]);
  const shake = useRef(new Animated.Value(0)).current;

  useEffect(() => { refs.current[0]?.focus(); }, []);
  useEffect(() => {
    if (!countdown) { setCanResend(true); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const doShake = () => Animated.sequence([
    Animated.timing(shake, { toValue: 10, duration: 80, useNativeDriver: true }),
    Animated.timing(shake, { toValue: -10, duration: 80, useNativeDriver: true }),
    Animated.timing(shake, { toValue: 8, duration: 80, useNativeDriver: true }),
    Animated.timing(shake, { toValue: -8, duration: 80, useNativeDriver: true }),
    Animated.timing(shake, { toValue: 0, duration: 80, useNativeDriver: true }),
  ]).start();

  const onChange = (i: number, val: string) => {
    if (val.length > 1) {
      const digits = val.replace(/\D/g, '').slice(0, LEN).split('');
      const next = [...otp];
      digits.forEach((d, j) => { if (i + j < LEN) next[i + j] = d; });
      setOtp(next); setError('');
      refs.current[Math.min(i + digits.length, LEN - 1)]?.focus();
      return;
    }
    const d = val.replace(/\D/g, '');
    const next = [...otp]; next[i] = d; setOtp(next); setError('');
    if (d && i < LEN - 1) refs.current[i + 1]?.focus();
  };

  const onKey = (i: number, key: string) => {
    if (key === 'Backspace' && !otp[i] && i > 0) {
      const next = [...otp]; next[i - 1] = ''; setOtp(next);
      refs.current[i - 1]?.focus();
    }
  };

  const verify = async () => {
    if (otp.join('').length < LEN) { setError('Enter the complete 6-digit code'); doShake(); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    navigation.navigate('ResetPassword', { email });
  };

  const resend = () => {
    if (!canResend) return;
    setOtp(Array(LEN).fill('')); setError(''); setCountdown(RESEND); setCanResend(false);
    refs.current[0]?.focus();
  };

  const masked = email.replace(/(.{2})[^@]+(@.+)/, '$1***$2');

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={s.back} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={s.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={s.iconBox}><Text style={s.iconEmoji}>📱</Text></View>
        <Text style={s.title}>Verify Email</Text>
        <Text style={s.subtitle}>We sent a 6-digit code to{'\n'}<Text style={s.emailHL}>{masked}</Text></Text>

        <Animated.View style={[s.otpRow, { transform: [{ translateX: shake }] }]}>
          {otp.map((d, i) => (
            <TextInput key={i} ref={r => { refs.current[i] = r; }}
              style={[s.box, d && s.boxFilled, !!error && s.boxErr]}
              value={d} onChangeText={v => onChange(i, v)}
              onKeyPress={({ nativeEvent }) => onKey(i, nativeEvent.key)}
              keyboardType="number-pad" maxLength={LEN} selectTextOnFocus textAlign="center" caretHidden />
          ))}
        </Animated.View>

        {error ? <Text style={s.err}>{error}</Text> : null}

        <View style={s.resendRow}>
          <Text style={s.resendLabel}>Didn't receive the code? </Text>
          {canResend
            ? <TouchableOpacity onPress={resend} activeOpacity={0.7}><Text style={s.resendLink}>Resend OTP</Text></TouchableOpacity>
            : <Text style={s.countdown}>Resend in {countdown}s</Text>}
        </View>
        <Button title="Verify" onPress={verify} loading={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const s = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  content: { flexGrow: 1, paddingHorizontal: Spacing.xxl, paddingTop: Platform.OS === 'ios' ? 60 : Spacing.xxl },
  back: { width: 40, height: 40, borderRadius: BorderRadius.md, backgroundColor: Colors.inputBg, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xxxl },
  backIcon: { fontSize: 20, color: Colors.text, fontWeight: Typography.fontWeightBold },
  iconBox: { width: 72, height: 72, borderRadius: 20, backgroundColor: Colors.primary + '12', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xl },
  iconEmoji: { fontSize: 36 },
  title: { fontSize: Typography.fontSize2XL, fontWeight: Typography.fontWeightBold, color: Colors.text, marginBottom: Spacing.md },
  subtitle: { fontSize: Typography.fontSizeMD, color: Colors.textSecondary, lineHeight: 24, marginBottom: Spacing.xxxl },
  emailHL: { color: Colors.primary, fontWeight: Typography.fontWeightSemiBold },
  otpRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.lg, gap: Spacing.sm },
  box: { flex: 1, aspectRatio: 1, maxWidth: 52, borderRadius: BorderRadius.md, borderWidth: 2, borderColor: Colors.border, backgroundColor: Colors.inputBg, fontSize: Typography.fontSizeXL, fontWeight: Typography.fontWeightBold, color: Colors.text },
  boxFilled: { borderColor: Colors.primary, backgroundColor: Colors.primary + '08' },
  boxErr: { borderColor: Colors.danger, backgroundColor: Colors.dangerLight },
  err: { fontSize: Typography.fontSizeXS, color: Colors.danger, textAlign: 'center', marginBottom: Spacing.lg },
  resendRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.xxl },
  resendLabel: { fontSize: Typography.fontSizeSM, color: Colors.textSecondary },
  resendLink: { fontSize: Typography.fontSizeSM, color: Colors.primary, fontWeight: Typography.fontWeightSemiBold },
  countdown: { fontSize: Typography.fontSizeSM, color: Colors.textMuted, fontWeight: Typography.fontWeightMedium },
});

export default OTPVerificationScreen;
