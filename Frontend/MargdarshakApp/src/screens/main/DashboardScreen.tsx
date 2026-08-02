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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../theme';

const { width } = Dimensions.get('window');

// Mock data - Professional, no colors
const emergencyContacts = [
  { id: '1', name: 'Police', number: '100' },
  { id: '2', name: 'Ambulance', number: '102' },
  { id: '3', name: 'Fire', number: '101' },
  { id: '4', name: 'Women Helpline', number: '1091' },
];

const recentAlerts = [
  {
    id: '1',
    type: 'High Crime Area',
    location: 'Downtown Plaza',
    time: '2h ago',
  },
  {
    id: '2',
    type: 'Road Closure',
    location: 'Main Street',
    time: '4h ago',
  },
  {
    id: '3',
    type: 'Patrol Activity',
    location: 'City Center',
    time: '6h ago',
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>Safety Overview</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Safety Score Card */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Safety Score</Text>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreValue}>{safetyScore}</Text>
            <Text style={styles.scoreMax}>/ {maxScore}</Text>
          </View>
          <View style={styles.scoreBar}>
            <View style={[styles.scoreBarFill, { width: `${percentage}%` }]} />
          </View>
          <Text style={styles.scoreDescription}>
            You're in safe areas {percentage.toFixed(0)}% of the time
          </Text>
        </View>

        {/* Night Mode Toggle */}
        <View style={styles.toggleCard}>
          <View style={styles.toggleLeft}>
            <Text style={styles.toggleTitle}>Night Mode Alerts</Text>
            <Text style={styles.toggleDescription}>
              Extra safety alerts after dark
            </Text>
          </View>
          <Switch
            value={nightMode}
            onValueChange={setNightMode}
            trackColor={{ false: '#E0E0E0', true: '#5B8DEE' }}
            thumbColor={nightMode ? '#5B8DEE' : '#FFFFFF'}
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
            <TouchableOpacity key={alert.id} style={styles.alertRow}>
              <View style={styles.alertLeft}>
                <Text style={styles.alertType}>{alert.type}</Text>
                <Text style={styles.alertLocation}>{alert.location}</Text>
              </View>
              <Text style={styles.alertTime}>{alert.time}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Emergency Contacts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          {emergencyContacts.map((contact) => (
            <TouchableOpacity
              key={contact.id}
              style={styles.contactRow}
              onPress={() => handleCall(contact.number, contact.name)}
            >
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactNumber}>{contact.number}</Text>
            </TouchableOpacity>
          ))}
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '400',
    color: '#000000',
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666666',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  scoreCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  scoreLabel: {
    fontSize: 13,
    fontWeight: '400',
    color: '#666666',
    marginBottom: 12,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '300',
    color: '#333333',
    letterSpacing: -1,
  },
  scoreMax: {
    fontSize: 20,
    fontWeight: '300',
    color: '#999999',
    marginLeft: 4,
  },
  scoreBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },
  scoreBarFill: {
    height: '100%',
    backgroundColor: '#5B8DEE',
    borderRadius: 2,
  },
  scoreDescription: {
    fontSize: 13,
    fontWeight: '400',
    color: '#666666',
    lineHeight: 18,
  },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  toggleLeft: {
    flex: 1,
    marginRight: 16,
  },
  toggleTitle: {
    fontSize: 15,
    fontWeight: '400',
    color: '#000000',
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 13,
    fontWeight: '400',
    color: '#666666',
    lineHeight: 18,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '400',
    color: '#000000',
    marginBottom: 12,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 2,
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#666666',
  },
  toggleTextActive: {
    color: '#000000',
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    height: 180,
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
    backgroundColor: '#5B8DEE',
    borderRadius: 4,
    alignItems: 'center',
    paddingTop: 4,
  },
  chartBarValue: {
    fontSize: 10,
    fontWeight: '400',
    color: '#FFFFFF',
  },
  chartBarLabel: {
    fontSize: 11,
    fontWeight: '400',
    color: '#999999',
    marginTop: 8,
  },
  alertRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    marginBottom: 8,
  },
  alertLeft: {
    flex: 1,
  },
  alertType: {
    fontSize: 14,
    fontWeight: '400',
    color: '#000000',
    marginBottom: 4,
  },
  alertLocation: {
    fontSize: 13,
    fontWeight: '400',
    color: '#666666',
  },
  alertTime: {
    fontSize: 12,
    fontWeight: '400',
    color: '#999999',
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    marginBottom: 8,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '400',
    color: '#000000',
  },
  contactNumber: {
    fontSize: 15,
    fontWeight: '400',
    color: '#666666',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '300',
    color: '#000000',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: '#666666',
    textAlign: 'center',
  },
});
