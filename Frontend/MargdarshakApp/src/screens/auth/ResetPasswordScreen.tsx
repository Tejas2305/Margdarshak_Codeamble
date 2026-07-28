import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar,
  Platform, KeyboardAvoidingView, ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme';
import { Button, PasswordInput } from '../../components/ui';
import { AuthStackParamList } from '../../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'ResetPassword'>;
  route: RouteProp<AuthStackParamList, 'ResetPassword'>;
};

const ResetPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [pw, setPw] = useState('');
  const [cpw, setCpw] = useState('');
  const [errors, setErrors] = useState<{ pw?: string; cpw?: string }>({});
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const e: typeof errors = {};
    if (!pw) e.pw = 'Password is required';
    else if (pw.length < 8) e.pw = 'At least 8 characters';
    else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(pw)) e.pw = 'Include uppercase, lowercase, and a number';
    if (!cpw) e.cpw = 'Please confirm your password';
    else if (pw !== cpw) e.cpw = 'Passwords do not match';
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={s.back} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={s.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={s.iconBox}><Text style={s.iconEmoji}>🔑</Text></View>
        <Text style={s.title}>New Password</Text>
        <Text style={s.subtitle}>Create a strong new password, different from your previous one.</Text>
        <PasswordInput label="New Password" value={pw} onChangeText={v => { setPw(v); setErrors(p => ({ ...p, pw: undefined })); }}
          placeholder="Enter new password" showStrength error={errors.pw} required />
        <PasswordInput label="Confirm Password" value={cpw} onChangeText={v => { setCpw(v); setErrors(p => ({ ...p, cpw: undefined })); }}
          placeholder="Re-enter new password" error={errors.cpw} required />
        <Button title="Update Password" onPress={submit} loading={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const s = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  content: { flexGrow: 1, paddingHorizontal: Spacing.xxl, paddingTop: Platform.OS === 'ios' ? 60 : Spacing.xxl },
  back: { width: 40, height: 40, borderRadius: BorderRadius.md, backgroundColor: Colors.inputBg, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xxxl },
  backIcon: { fontSize: 20, color: Colors.text, fontWeight: Typography.fontWeightBold },
  iconBox: { width: 72, height: 72, borderRadius: 20, backgroundColor: Colors.secondary + '15', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xl },
  iconEmoji: { fontSize: 36 },
  title: { fontSize: Typography.fontSize2XL, fontWeight: Typography.fontWeightBold, color: Colors.text, marginBottom: Spacing.md },
  subtitle: { fontSize: Typography.fontSizeMD, color: Colors.textSecondary, lineHeight: 22, marginBottom: Spacing.xxxl },
});

export default ResetPasswordScreen;
