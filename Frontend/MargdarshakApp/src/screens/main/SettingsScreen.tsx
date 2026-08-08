import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  StatusBar,
  TextInput,
  Modal,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../theme';
import { authService, userService } from '../../services/api';
import { User } from '../../services/api/types';

export default function SettingsScreen({ navigation }: any) {
  const { isDark, toggleTheme } = useTheme();
  const colors = getThemeColors(isDark);
  
  const [notifications, setNotifications] = useState(true);
  const [shareData, setShareData] = useState(true);
  const [profile, setProfile] = useState<User | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  
  // Phone verification states
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const result = await userService.getProfile();
      setProfile(result);
      setPhoneVerified(result.phone_verified);
      if (result.phone_number) {
        setPhoneNumber(result.phone_number.replace(/^\+91/, ''));
      }
    } catch (error: any) {
      Alert.alert('Profile Unavailable', error?.response?.data?.detail || 'Unable to load profile.');
    }
  };

  const profileInitials = useMemo(() => {
    if (!profile) return '--';
    return `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase() || '--';
  }, [profile]);

  const profileName = profile ? `${profile.first_name} ${profile.last_name}`.trim() : 'Loading profile';
  const profileEmail = profile?.email || '';

  const handleSendOtp = async () => {
    if (phoneNumber.length !== 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit phone number');
      return;
    }

    const formattedPhone = `+91${phoneNumber}`;
    try {
      setIsSendingOtp(true);
      await userService.updateProfile({ phone_number: formattedPhone });
      await userService.sendPhoneOTP(formattedPhone);
      Alert.alert('OTP Sent', `Verification code sent to ${formattedPhone}`);
      setShowOtpInput(true);
      await loadProfile();
    } catch (error: any) {
      Alert.alert('OTP Failed', error?.response?.data?.detail || 'Unable to send OTP right now.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the 6-digit OTP');
      return;
    }

    try {
      setIsVerifyingOtp(true);
      await userService.verifyPhoneOTP(`+91${phoneNumber}`, otp);
      Alert.alert('Success', 'Phone number verified successfully!');
      setPhoneVerified(true);
      setShowPhoneModal(false);
      setShowOtpInput(false);
      setOtp('');
      await loadProfile();
    } catch (error: any) {
      Alert.alert('Verification Failed', error?.response?.data?.detail || 'Please check the OTP and try again.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handlePhoneVerification = () => {
    if (phoneVerified) {
      Alert.alert(
        'Phone Verified',
        'Your phone number is already verified. Do you want to change it?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Change',
            onPress: () => {
              setPhoneVerified(false);
              setShowPhoneModal(true);
            },
          },
        ]
      );
    } else {
      setShowPhoneModal(true);
    }
  };

  // Dynamic styles based on theme
  const dynamicStyles = {
    header: {
      ...styles.header,
      backgroundColor: colors.surface,
      borderBottomColor: colors.border,
    },
    backButton: {
      ...styles.backButton,
      backgroundColor: colors.background,
    },
    backIcon: {
      ...styles.backIcon,
      color: colors.text,
    },
    headerTitle: {
      ...styles.headerTitle,
      color: colors.text,
    },
    profileCard: {
      ...styles.profileCard,
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    avatar: {
      ...styles.avatar,
      backgroundColor: colors.primary,
    },
    profileName: {
      ...styles.profileName,
      color: colors.text,
    },
    profileEmail: {
      ...styles.profileEmail,
      color: colors.textSecondary,
    },
    editButton: {
      ...styles.editButton,
      backgroundColor: colors.background,
    },
    editIcon: {
      ...styles.editIcon,
      color: colors.text,
    },
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await authService.logout();
            navigation.getParent()?.reset({
              index: 0,
              routes: [{ name: 'Auth' }],
            });
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await userService.deleteAccount();
              await authService.logout();
              Alert.alert('Account Deleted', 'Your account has been deleted');
              navigation.getParent()?.reset({
                index: 0,
                routes: [{ name: 'Auth' }],
              });
            } catch (error: any) {
              Alert.alert('Delete Failed', error?.response?.data?.detail || 'Unable to delete account right now.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={dynamicStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={dynamicStyles.backButton}>
          <Text style={dynamicStyles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={dynamicStyles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={dynamicStyles.profileCard}>
          <View style={dynamicStyles.avatar}>
            <Text style={styles.avatarText}>{profileInitials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={dynamicStyles.profileName}>{profileName}</Text>
            <Text style={dynamicStyles.profileEmail}>{profileEmail}</Text>
          </View>
          <TouchableOpacity style={dynamicStyles.editButton}>
            <Text style={dynamicStyles.editIcon}>✏</Text>
          </TouchableOpacity>
        </View>

        {/* Account Security */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account Security</Text>

          <TouchableOpacity 
            style={[styles.verificationCard, { backgroundColor: colors.surface, borderColor: colors.border }]} 
            onPress={handlePhoneVerification}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconCircle, { backgroundColor: phoneVerified ? '#4CAF5015' : '#5B8DEE15' }]}>
                <MaterialCommunityIcons 
                  name="phone-check" 
                  size={20} 
                  color={phoneVerified ? '#4CAF50' : '#5B8DEE'} 
                />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Phone Verification</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  {phoneVerified ? 'Phone number verified' : 'Verify your phone number (Optional)'}
                </Text>
              </View>
            </View>
            <View style={styles.verificationStatus}>
              {phoneVerified ? (
                <MaterialCommunityIcons name="check-circle" size={24} color="#4CAF50" />
              ) : (
                <Text style={[styles.menuArrow, { color: colors.textSecondary }]}>→</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Privacy & Safety */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Privacy & Safety</Text>

          <View style={[styles.settingCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconCircle, { backgroundColor: colors.primary + '15' }]}>
                <MaterialCommunityIcons name="bell-outline" size={20} color={colors.primary} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Notifications</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Receive safety alerts and updates
                </Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.border, true: colors.primary + '60' }}
              thumbColor={notifications ? colors.primary : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Emergency Contacts */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Emergency Contacts</Text>
          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => navigation.navigate('EmergencyContacts')}
          >
            <View style={[styles.iconCircle, { backgroundColor: colors.primary + '15' }]}>
              <MaterialCommunityIcons name="account-group" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.menuText, { color: colors.text }]}>Manage Emergency Contacts</Text>
            <Text style={[styles.menuArrow, { color: colors.textSecondary }]}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Data & Privacy */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Data & Privacy</Text>

          <View style={[styles.settingCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconCircle, { backgroundColor: colors.primary + '15' }]}>
                <MaterialCommunityIcons name="database-outline" size={20} color={colors.primary} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Share Anonymous Data</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Help improve safety for everyone
                </Text>
              </View>
            </View>
            <Switch
              value={shareData}
              onValueChange={setShareData}
              trackColor={{ false: colors.border, true: colors.primary + '60' }}
              thumbColor={shareData ? colors.primary : '#f4f3f4'}
            />
          </View>

          <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primary + '15' }]}>
              <MaterialCommunityIcons name="shield-lock-outline" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.menuText, { color: colors.text }]}>Privacy Policy</Text>
            <Text style={[styles.menuArrow, { color: colors.textSecondary }]}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primary + '15' }]}>
              <MaterialCommunityIcons name="file-document-outline" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.menuText, { color: colors.text }]}>Terms of Service</Text>
            <Text style={[styles.menuArrow, { color: colors.textSecondary }]}>→</Text>
          </TouchableOpacity>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>App Settings</Text>

          <View style={[styles.settingCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconCircle, { backgroundColor: colors.primary + '15' }]}>
                <MaterialCommunityIcons 
                  name={isDark ? "weather-night" : "weather-sunny"} 
                  size={20} 
                  color={colors.primary} 
                />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Dark Mode</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  {isDark ? 'Switch to light theme' : 'Switch to dark theme'}
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary + '60' }}
              thumbColor={isDark ? colors.primary : '#f4f3f4'}
            />
          </View>

          <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primary + '15' }]}>
              <MaterialCommunityIcons name="translate" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.menuText, { color: colors.text }]}>Language</Text>
            <Text style={[styles.menuValue, { color: colors.textSecondary }]}>English</Text>
            <Text style={[styles.menuArrow, { color: colors.textSecondary }]}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primary + '15' }]}>
              <MaterialCommunityIcons name="database" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.menuText, { color: colors.text }]}>Storage</Text>
            <Text style={[styles.menuValue, { color: colors.textSecondary }]}>128 MB</Text>
            <Text style={[styles.menuArrow, { color: colors.textSecondary }]}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Danger Zone</Text>

          <TouchableOpacity style={[styles.dangerButton, { backgroundColor: colors.surface }]} onPress={handleLogout}>
            <Text style={[styles.dangerText, { color: colors.text }]}>Logout</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dangerButton, styles.deleteButton, { backgroundColor: colors.surface }]}
            onPress={handleDeleteAccount}
          >
            <Text style={[styles.dangerText, { color: colors.text }]}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.footer, { color: colors.textSecondary }]}>
          Margdarshak v1.0.0{'\n'}
          Made for safer communities
        </Text>
      </ScrollView>

      {/* Phone Verification Modal */}
      <Modal
        visible={showPhoneModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowPhoneModal(false);
          setShowOtpInput(false);
          setPhoneNumber('');
          setOtp('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Verify Phone Number</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowPhoneModal(false);
                  setShowOtpInput(false);
                  setPhoneNumber('');
                  setOtp('');
                }}
              >
                <MaterialCommunityIcons name="close" size={24} color="#333333" />
              </TouchableOpacity>
            </View>

            {!showOtpInput ? (
              <>
                <Text style={styles.modalDescription}>
                  Enter your phone number to receive a verification code
                </Text>

                <View style={styles.phoneInputContainer}>
                  <View style={styles.countryCode}>
                    <Text style={styles.countryCodeText}>+91</Text>
                  </View>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="Enter 10-digit phone number"
                    placeholderTextColor="#999999"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.modalButton, phoneNumber.length !== 10 && styles.modalButtonDisabled]}
                  onPress={handleSendOtp}
                  disabled={phoneNumber.length !== 10 || isSendingOtp}
                >
                  <Text style={styles.modalButtonText}>{isSendingOtp ? 'Sending...' : 'Send OTP'}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.modalDescription}>
                  Enter the 6-digit code sent to +91 {phoneNumber}
                </Text>

                <TextInput
                  style={styles.otpInput}
                  placeholder="Enter 6-digit OTP"
                  placeholderTextColor="#999999"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={otp}
                  onChangeText={setOtp}
                />

                <TouchableOpacity
                  style={[styles.modalButton, otp.length !== 6 && styles.modalButtonDisabled]}
                  onPress={handleVerifyOtp}
                  disabled={otp.length !== 6 || isVerifyingOtp}
                >
                  <Text style={styles.modalButtonText}>{isVerifyingOtp ? 'Verifying...' : 'Verify OTP'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.resendButton}
                  onPress={handleSendOtp}
                >
                  <Text style={styles.resendText}>Resend OTP</Text>
                </TouchableOpacity>
              </>
            )}

            <Text style={styles.modalFooter}>
              This is optional and helps secure your account
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
    borderWidth: 1,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: {
    fontSize: 16,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 16,
    fontWeight: '700',
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  menuValue: {
    fontSize: 14,
    marginRight: 8,
  },
  menuArrow: {
    fontSize: 20,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#FF9800',
  },
  deleteButton: {
    borderColor: '#EA4335',
  },
  dangerText: {
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 20,
  },
  verificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  verificationStatus: {
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '400',
    color: '#333333',
  },
  modalDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666666',
    marginBottom: 24,
    lineHeight: 20,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  countryCode: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333333',
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '400',
    color: '#333333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    height: 50,
  },
  otpInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 24,
    fontWeight: '400',
    color: '#333333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    height: 60,
    textAlign: 'center',
    letterSpacing: 8,
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: '#5B8DEE',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  modalButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  resendText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#5B8DEE',
  },
  modalFooter: {
    fontSize: 12,
    fontWeight: '400',
    color: '#999999',
    textAlign: 'center',
    marginTop: 16,
  },
});
