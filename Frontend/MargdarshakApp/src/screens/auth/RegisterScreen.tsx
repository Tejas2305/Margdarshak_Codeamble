import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Platform, Animated, KeyboardAvoidingView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme';
import { Button, Input, PasswordInput, Divider, SocialButton } from '../../components/ui';
import { AuthStackParamList } from '../../navigation/types';

type Props = { navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'> };

interface Form {
  fullName: string; email: string; phone: string;
  password: string; confirmPassword: string;
  emergencyContact: string; agreedToTerms: boolean;
}
interface Errors { fullName?: string; email?: string; phone?: string; password?: string; confirmPassword?: string; terms?: string }

function validate(f: Form): Errors {
  const e: Errors = {};
  if (!f.fullName.trim()) e.fullName = 'Full name is required';
  else if (f.fullName.trim().length < 3) e.fullName = 'Name must be at least 3 characters';
  if (!f.email.trim()) e.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Enter a valid email address';
  if (!f.phone.trim()) e.phone = 'Phone number is required';
  else if (!/^\d{10}$/.test(f.phone.replace(/\s/g, ''))) e.phone = 'Enter a valid 10-digit phone number';
  if (!f.password) e.password = 'Password is required';
  else if (f.password.length < 8) e.password = 'Must be at least 8 characters';
  else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(f.password)) e.password = 'Include uppercase, lowercase, and a number';
  if (!f.confirmPassword) e.confirmPassword = 'Please confirm your password';
  else if (f.password !== f.confirmPassword) e.confirmPassword = 'Passwords do not match';
  if (!f.agreedToTerms) e.terms = 'You must agree to the Terms & Privacy Policy';
  return e;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [form, setForm] = useState<Form>({ fullName: '', email: '', phone: '', password: '', confirmPassword: '', emergencyContact: '', agreedToTerms: false });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const checkAnim = useRef(new Animated.Value(0)).current;

  const set = (k: keyof Form) => (v: string | boolean) => {
    setForm(p => ({ ...p, [k]: v }));
    setErrors(p => ({ ...p, [k]: undefined }));
  };

  const toggleTerms = () => {
    const next = !form.agreedToTerms;
    setForm(p => ({ ...p, agreedToTerms: next }));
    Animated.spring(checkAnim, { toValue: next ? 1 : 0, useNativeDriver: true, tension: 80, friction: 6 }).start();
    setErrors(p => ({ ...p, terms: undefined }));
  };

  const submit = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    navigation.navigate('Permissions');
  };

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView style={s.scroll} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity style={s.back} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Text style={s.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={s.stepBadge}><Text style={s.stepText}>Create Account</Text></View>
        </View>

        <Text style={s.title}>Create Account</Text>
        <Text style={s.subtitle}>Join Margdarshak for safer journeys.</Text>

        <Input label="Full Name" value={form.fullName} onChangeText={set('fullName')} placeholder="Enter your full name" autoCapitalize="words" error={errors.fullName} required />
        <Input label="Email Address" value={form.email} onChangeText={set('email')} placeholder="Enter your email" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} error={errors.email} required />
        <Input label="Phone Number" value={form.phone} onChangeText={set('phone')} placeholder="10-digit phone number" keyboardType="phone-pad" error={errors.phone} required />
        <PasswordInput label="Password" value={form.password} onChangeText={set('password')} placeholder="Create a strong password" showStrength error={errors.password} required />
        <PasswordInput label="Confirm Password" value={form.confirmPassword} onChangeText={set('confirmPassword')} placeholder="Re-enter your password" error={errors.confirmPassword} required />
        <Input label="Emergency Contact" value={form.emergencyContact} onChangeText={set('emergencyContact')} placeholder="Optional — for emergency alerts" keyboardType="phone-pad" hint="Notified during emergency mode." />

        {/* Terms */}
        <TouchableOpacity style={s.termsRow} onPress={toggleTerms} activeOpacity={0.8}>
          <View style={[s.checkbox, form.agreedToTerms && s.checkboxOn]}>
            <Animated.Text style={[s.checkmark, { transform: [{ scale: checkAnim }] }]}>✓</Animated.Text>
          </View>
          <Text style={s.termsText}>I agree to the <Text style={s.link}>Terms of Service</Text> and <Text style={s.link}>Privacy Policy</Text></Text>
        </TouchableOpacity>
        {errors.terms && <Text style={s.termsErr}>{errors.terms}</Text>}

        <Button title="Create Account" onPress={submit} loading={loading} style={{ marginTop: Spacing.lg }} />

        <Divider label="OR" />
        <SocialButton title="Continue with Google" provider="google" onPress={() => {}} style={{ marginBottom: Spacing.md }} />
        {Platform.OS === 'ios' && <SocialButton title="Continue with Apple" provider="apple" onPress={() => {}} />}

        <View style={s.loginRow}>
          <Text style={s.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.7}>
            <Text style={s.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const s = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Spacing.xxl, paddingTop: Platform.OS === 'ios' ? 60 : Spacing.xxl },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.xxl },
  back: { width: 40, height: 40, borderRadius: BorderRadius.md, backgroundColor: Colors.inputBg, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 20, color: Colors.text, fontWeight: Typography.fontWeightBold },
  stepBadge: { backgroundColor: Colors.primary + '15', paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.full },
  stepText: { fontSize: Typography.fontSizeXS, color: Colors.primary, fontWeight: Typography.fontWeightMedium },
  title: { fontSize: Typography.fontSize3XL, fontWeight: Typography.fontWeightBold, color: Colors.text, marginBottom: Spacing.sm },
  subtitle: { fontSize: Typography.fontSizeMD, color: Colors.textSecondary, marginBottom: Spacing.xxxl, lineHeight: 22 },
  termsRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: Spacing.sm, gap: Spacing.md },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', marginTop: 1, flexShrink: 0 },
  checkboxOn: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  checkmark: { fontSize: 13, color: Colors.textInverse, fontWeight: Typography.fontWeightBold },
  termsText: { flex: 1, fontSize: Typography.fontSizeSM, color: Colors.textSecondary, lineHeight: 20 },
  link: { color: Colors.primary, fontWeight: Typography.fontWeightMedium },
  termsErr: { fontSize: Typography.fontSizeXS, color: Colors.danger, marginBottom: Spacing.md, marginLeft: Spacing.xs },
  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: Spacing.xxl },
  loginText: { fontSize: Typography.fontSizeMD, color: Colors.textSecondary },
  loginLink: { fontSize: Typography.fontSizeMD, color: Colors.primary, fontWeight: Typography.fontWeightSemiBold },
});

export default RegisterScreen;
