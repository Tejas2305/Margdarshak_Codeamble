import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar,
  Platform, KeyboardAvoidingView, ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme';
import { Button, Input } from '../../components/ui';
import { AuthStackParamList } from '../../navigation/types';

type Props = { navigation: NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'> };

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email.trim()) { setError('Email is required'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email address'); return; }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    navigation.navigate('OTPVerification', { email });
  };

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={s.back} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={s.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={s.iconBox}><Text style={s.iconEmoji}>📧</Text></View>
        <Text style={s.title}>Forgot Password?</Text>
        <Text style={s.subtitle}>Enter your registered email and we'll send you a verification code.</Text>
        <Input label="Email Address" value={email} onChangeText={v => { setEmail(v); setError(''); }}
          placeholder="Enter your registered email" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} error={error} required />
        <Button title="Send OTP" onPress={submit} loading={loading} />
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={s.backLink}>
          <Text style={s.backLinkText}>← Back to Login</Text>
        </TouchableOpacity>
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
  subtitle: { fontSize: Typography.fontSizeMD, color: Colors.textSecondary, lineHeight: 22, marginBottom: Spacing.xxxl },
  backLink: { marginTop: Spacing.xxl, alignItems: 'center' },
  backLinkText: { fontSize: Typography.fontSizeMD, color: Colors.primary, fontWeight: Typography.fontWeightMedium },
});

export default ForgotPasswordScreen;
