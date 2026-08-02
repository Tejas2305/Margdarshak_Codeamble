import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Dimensions,
  StatusBar,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme';

const { width } = Dimensions.get('window');

// Mock data
const emergencyContacts = [
  { id: '1', name: 'Police', number: '100', initial: 'P', color: '#1A73E8' },
  { id: '2', name: 'Ambulance', number: '102', initial: 'A', color: '#EA4335' },
  { id: '3', name: 'Fire', number: '101', initial: 'F', color: '#FF6F00' },
  { id: '4', name: 'Women Helpline', number: '1091', initial: 'W', color: '#9C27B0' },
];

const recentAlerts = [
  {
    id: '1',
    type: 'High Crime Area',
    location: 'Downtown Plaza',
    time: '2 hours ago',
    severity: 'high',
  },
  {
    id: '2',
    type: 'Road Closure',
    location: 'Main Street',
    time: '4 hours ago',
    severity: 'medium',
  },
  {
    id: '3',
    type: 'Patrol Activity',
    location: 'City Center',
    time: '6 hours ago',
    severity: 'safe',
  },
];

const weeklyData = [
  { day: 'Mon', score: 8.2 },
  { day: 'Tue', score: 8.5 },
  { day: 'Wed', score: 8.8 },
  { day: 'Thu', score: 8.4 },
  { day: 'Fri', score: 8.9 },
  { day: 'Sat', score: 8.7 },
  { day: 'Sun', score: 9.0 },
];

export default function DashboardScreen() {
  const [nightMode, setNightMode] = useState(false);
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');
  const safetyScore = 850;
  const maxScore = 1000;
  const percentage = (safetyScore / maxScore) * 100;

  const handleCall = (number: string, name: string) => {
    Alert.alert(
      `Call ${name}?`,
      `Dial ${number}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => Linking.openURL(`tel:${number}`),
        },
      ]
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return '#FF4444';
      case 'medium':
        return '#FFA500';
      case 'safe':
        return theme.colors.success;
      default:
        return theme.colors.primary;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Safety Dashboard</Text>
          <Text style={styles.headerSubtitle}>Track your safety metrics</Text>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Safety Score Card */}
        <View style={styles.scoreCard}>
          <LinearGradient
            colors={['#4CAF50', '#81C784']}
            style={styles.scoreGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.scoreLabel}>Personal Safety Score</Text>
            <View style={styles.scoreCircleContainer}>
              <View style={styles.scoreCircle}>
                <Text style={styles.scoreValue}>{safetyScore}</Text>
                <Text style={styles.scoreMax}>/{maxScore}</Text>
              </View>
            </View>
            <View style={styles.scoreBar}>
              <View style={[styles.scoreBarFill, { width: `${percentage}%` }]} />
            </View>
            <Text style={styles.scoreDescription}>
              Excellent! You're in safe areas {percentage.toFixed(0)}% of the time
            </Text>
          </LinearGradient>
        </View>

        {/* Night Mode Toggle */}
        <View style={styles.nightModeCard}>
          <View style={styles.nightModeLeft}>
            <Text style={styles.nightModeIcon}>🌙</Text>
            <View style={styles.nightModeTextContainer}>
              <Text style={styles.nightModeTitle}>Night Mode Alerts</Text>
              <Text style={styles.nightModeDescription}>
                Get extra safety alerts after dark
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

        {/* Safety Trends */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Safety Trends</Text>
            <View style={styles.viewToggle}>
              <TouchableOpacity
                style={[styles.toggleButton, viewMode === 'weekly' && styles.toggleButtonActive]}
                onPress={() => setViewMode('weekly')}
              >
                <Text
                  style={[styles.toggleText, viewMode === 'weekly' && styles.toggleTextActive]}
                >
                  Weekly
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, viewMode === 'monthly' && styles.toggleButtonActive]}
                onPress={() => setViewMode('monthly')}
              >
                <Text
                  style={[styles.toggleText, viewMode === 'monthly' && styles.toggleTextActive]}
                >
                  Monthly
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Chart */}
          <View style={styles.chart}>
            {weeklyData.map((data, index) => {
              const height = (data.score / 10) * 120;
              return (
                <View key={index} style={styles.chartBar}>
                  <View style={styles.chartBarContainer}>
                    <View style={[styles.chartBarFill, { height }]}>
                      <Text style={styles.chartBarValue}>{data.score}</Text>
                    </View>
                  </View>
                  <Text style={styles.chartBarLabel}>{data.day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Recent Alerts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Alerts</Text>
          {recentAlerts.map((alert) => (
            <TouchableOpacity key={alert.id} style={styles.alertCard}>
              <View
                style={[
                  styles.alertIndicator,
                  { backgroundColor: getSeverityColor(alert.severity) },
                ]}
              />
              <View style={styles.alertContent}>
                <Text style={styles.alertType}>{alert.type}</Text>
                <Text style={styles.alertLocation}>📍 {alert.location}</Text>
              </View>
              <Text style={styles.alertTime}>{alert.time}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Emergency Contacts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          <View style={styles.contactsGrid}>
            {emergencyContacts.map((contact) => (
              <TouchableOpacity
                key={contact.id}
                style={[styles.contactCard, { borderColor: contact.color }]}
                onPress={() => handleCall(contact.number, contact.name)}
              >
                <View style={[styles.contactIcon, { backgroundColor: contact.color }]}>
                  <Text style={styles.contactInitial}>{contact.initial}</Text>
                </View>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={[styles.contactNumber, { color: contact.color }]}>
                  {contact.number}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>42</Text>
            <Text style={styles.statLabel}>Safe Routes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>18</Text>
            <Text style={styles.statLabel}>Reports Filed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>127</Text>
            <Text style={styles.statLabel}>Safe Trips</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.surface,
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    fontSize: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  scoreCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    ...theme.shadows.large,
  },
  scoreGradient: {
    padding: 24,
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 16,
  },
  scoreCircleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 8,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  scoreMax: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: -8,
  },
  scoreBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  scoreBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  scoreDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  nightModeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  nightModeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  nightModeIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  nightModeTextContainer: {
    flex: 1,
  },
  nightModeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  nightModeDescription: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    height: 180,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
  },
  chartBarContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    paddingHorizontal: 4,
  },
  chartBarFill: {
    width: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    paddingTop: 4,
  },
  chartBarValue: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  chartBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginTop: 8,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  alertIndicator: {
    width: 8,
    height: 40,
    borderRadius: 4,
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertType: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  alertLocation: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  alertTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  contactsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  contactCard: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
  },
  contactIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  contactInitial: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  contactName: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  contactNumber: {
    fontSize: 16,
    fontWeight: '800',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
