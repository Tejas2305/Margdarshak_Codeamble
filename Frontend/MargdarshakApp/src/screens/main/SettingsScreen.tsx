import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  StatusBar,
} from 'react-native';
import { theme } from '../../theme';

export default function SettingsScreen({ navigation }: any) {
  const [notifications, setNotifications] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);
  const [nightMode, setNightMode] = useState(false);
  const [autoAlert, setAutoAlert] = useState(false);
  const [shareData, setShareData] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // Navigate back to Auth stack
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
          onPress: () => {
            Alert.alert('Account Deleted', 'Your account has been deleted');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>John Doe</Text>
            <Text style={styles.profileEmail}>john.doe@example.com</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editIcon}>✏</Text>
          </TouchableOpacity>
        </View>

        {/* Privacy & Safety */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Safety</Text>

          <View style={styles.settingCard}>
            <View style={styles.settingLeft}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>N</Text>
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Notifications</Text>
                <Text style={styles.settingDescription}>
                  Receive safety alerts and updates
                </Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary + '60' }}
              thumbColor={notifications ? theme.colors.primary : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingLeft}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>L</Text>
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Location Tracking</Text>
                <Text style={styles.settingDescription}>
                  Share location for safety monitoring
                </Text>
              </View>
            </View>
            <Switch
              value={locationTracking}
              onValueChange={setLocationTracking}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary + '60' }}
              thumbColor={locationTracking ? theme.colors.primary : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingLeft}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>M</Text>
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Night Mode Alerts</Text>
                <Text style={styles.settingDescription}>
                  Extra safety alerts after dark
                </Text>
              </View>
            </View>
            <Switch
              value={nightMode}
              onValueChange={setNightMode}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary + '60' }}
              thumbColor={nightMode ? theme.colors.primary : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingLeft}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>A</Text>
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Auto Emergency Alert</Text>
                <Text style={styles.settingDescription}>
                  Auto-trigger SOS in dangerous areas
                </Text>
              </View>
            </View>
            <Switch
              value={autoAlert}
              onValueChange={setAutoAlert}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary + '60' }}
              thumbColor={autoAlert ? theme.colors.primary : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Emergency Contacts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>E</Text>
            </View>
            <Text style={styles.menuText}>Manage Emergency Contacts</Text>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Data & Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Privacy</Text>

          <View style={styles.settingCard}>
            <View style={styles.settingLeft}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>D</Text>
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Share Anonymous Data</Text>
                <Text style={styles.settingDescription}>
                  Help improve safety for everyone
                </Text>
              </View>
            </View>
            <Switch
              value={shareData}
              onValueChange={setShareData}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary + '60' }}
              thumbColor={shareData ? theme.colors.primary : '#f4f3f4'}
            />
          </View>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>P</Text>
            </View>
            <Text style={styles.menuText}>Privacy Policy</Text>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>T</Text>
            </View>
            <Text style={styles.menuText}>Terms of Service</Text>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>L</Text>
            </View>
            <Text style={styles.menuText}>Language</Text>
            <Text style={styles.menuValue}>English</Text>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>T</Text>
            </View>
            <Text style={styles.menuText}>Theme</Text>
            <Text style={styles.menuValue}>Light</Text>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>S</Text>
            </View>
            <Text style={styles.menuText}>Storage</Text>
            <Text style={styles.menuValue}>128 MB</Text>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>i</Text>
            </View>
            <Text style={styles.menuText}>App Version</Text>
            <Text style={styles.menuValue}>1.0.0</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>★</Text>
            </View>
            <Text style={styles.menuText}>Rate Us</Text>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>F</Text>
            </View>
            <Text style={styles.menuText}>Send Feedback</Text>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>?</Text>
            </View>
            <Text style={styles.menuText}>Help & Support</Text>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>

          <TouchableOpacity style={styles.dangerButton} onPress={handleLogout}>
            <Text style={styles.dangerText}>Logout</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dangerButton, styles.deleteButton]}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.dangerText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          Margdarshak v1.0.0{'\n'}
          Made for safer communities
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.surface,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: theme.colors.text,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
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
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
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
    color: theme.colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: {
    fontSize: 16,
    color: theme.colors.text,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 12,
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
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
    color: theme.colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
  },
  menuValue: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginRight: 8,
  },
  menuArrow: {
    fontSize: 20,
    color: theme.colors.textSecondary,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#FF9800',
  },
  deleteButton: {
    borderColor: theme.colors.error,
  },
  dangerText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  footer: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 20,
  },
});
