import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Platform, Animated, KeyboardAvoidingView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme';
import { Button, Input, PasswordInput, Divider, SocialButton } from '../../components/ui';
import { AuthStackParamList } from '../../navigation/types';

type Props = { navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'> };

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const fade  = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    navigation.navigate('Permissions');
  };

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView style={s.scroll} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={s.back} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={s.backIcon}>←</Text>
        </TouchableOpacity>

        <Animated.View style={{ opacity: fade, transform: [{ translateY: slide }] }}>
          <View style={s.iconBox}><Text style={s.iconEmoji}>🔐</Text></View>
          <Text style={s.title}>Welcome Back</Text>
          <Text style={s.subtitle}>Login to continue your safe journey.</Text>

          <Input label="Email Address" value={email} onChangeText={v => { setEmail(v); setErrors(p => ({ ...p, email: undefined })); }}
            placeholder="Enter your email" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} error={errors.email} required />

          <View style={s.pwHeader}>
            <Text style={s.pwLabel}>Password <Text style={s.req}>*</Text></Text>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} activeOpacity={0.7}>
              <Text style={s.forgot}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
          <PasswordInput value={password} onChangeText={v => { setPassword(v); setErrors(p => ({ ...p, password: undefined })); }}
            placeholder="Enter your password" error={errors.password} />

          <Button title="Login" onPress={handleLogin} loading={loading} />

          <Divider label="OR" />
          <SocialButton title="Continue with Google" provider="google" onPress={() => {}} style={{ marginBottom: Spacing.md }} />
          {Platform.OS === 'ios' && <SocialButton title="Continue with Apple" provider="apple" onPress={() => {}} />}

          <View style={s.regRow}>
            <Text style={s.regText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')} activeOpacity={0.7}>
              <Text style={s.regLink}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const s = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Spacing.xxl, paddingTop: Platform.OS === 'ios' ? 60 : Spacing.xxl },
  back: { width: 40, height: 40, borderRadius: BorderRadius.md, backgroundColor: Colors.inputBg, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xxl },
  backIcon: { fontSize: 20, color: Colors.text, fontWeight: Typography.fontWeightBold },
  iconBox: { width: 64, height: 64, borderRadius: 18, backgroundColor: Colors.primary + '12', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xl },
  iconEmoji: { fontSize: 32 },
  title: { fontSize: Typography.fontSize3XL, fontWeight: Typography.fontWeightBold, color: Colors.text, marginBottom: Spacing.sm },
  subtitle: { fontSize: Typography.fontSizeMD, color: Colors.textSecondary, marginBottom: Spacing.xxxl, lineHeight: 22 },
  pwHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  pwLabel: { fontSize: Typography.fontSizeSM, fontWeight: Typography.fontWeightMedium, color: Colors.text },
  req: { color: Colors.danger },
  forgot: { fontSize: Typography.fontSizeSM, color: Colors.primary, fontWeight: Typography.fontWeightMedium },
  regRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: Spacing.xxl },
  regText: { fontSize: Typography.fontSizeMD, color: Colors.textSecondary },
  regLink: { fontSize: Typography.fontSizeMD, color: Colors.primary, fontWeight: Typography.fontWeightSemiBold },
});

export default LoginScreen;
