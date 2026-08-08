import React, { useEffect, useMemo, useState } from 'react';
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
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import { emergencyContactService, reportService } from '../../services/api';
import { EmergencyContact, Report } from '../../services/api/types';

const { width } = Dimensions.get('window');

// Mock data - Professional, no colors
const emergencyNumbers = [
  { id: '1', name: 'Police', number: '100' },
  { id: '2', name: 'Ambulance', number: '102' },
  { id: '3', name: 'Fire', number: '101' },
  { id: '4', name: 'Women Helpline', number: '1091' },
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
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const navigation = useNavigation();
  
  const [nightMode, setNightMode] = useState(false);
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const maxScore = 1000;
  const safetyScore = useMemo(() => {
    if (reports.length === 0) return 850;
    const averageSeverity = reports.reduce((sum, report) => sum + report.computed_severity, 0) / reports.length;
    return Math.max(100, Math.round(1000 - averageSeverity * 10));
  }, [reports]);
  const percentage = (safetyScore / maxScore) * 100;
  const dashboardContacts = contacts.length > 0
    ? contacts.map((contact) => ({
        id: String(contact.contact_id),
        name: contact.name,
        number: contact.phone_number,
      }))
    : emergencyNumbers;

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoadingDashboard(true);
      const [contactResult, reportResult] = await Promise.all([
        emergencyContactService.getContacts(),
        reportService.getMyReports(1, 5),
      ]);
      setContacts(contactResult);
      setReports(reportResult);
    } catch (error: any) {
      Alert.alert('Dashboard Unavailable', error?.response?.data?.detail || 'Unable to load dashboard data.');
    } finally {
      setIsLoadingDashboard(false);
    }
  };

  const formatTimeAgo = (value?: string) => {
    if (!value) return 'Recently';
    const createdAt = new Date(value).getTime();
    if (Number.isNaN(createdAt)) return 'Recently';
    const diffMinutes = Math.max(1, Math.floor((Date.now() - createdAt) / 60000));
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Dashboard</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Safety Overview</Text>
        </View>
        <TouchableOpacity
          style={styles.apiTestButton}
          onPress={() => navigation.navigate('APITest' as never)}
        >
          <MaterialCommunityIcons name="api" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Safety Score Card */}
        <View style={[styles.scoreCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>Safety Score</Text>
          <View style={styles.scoreRow}>
            <Text style={[styles.scoreValue, { color: colors.text }]}>{safetyScore}</Text>
            <Text style={[styles.scoreMax, { color: colors.textSecondary }]}>/ {maxScore}</Text>
          </View>
          <View style={[styles.scoreBar, { backgroundColor: colors.border }]}>
            <View style={[styles.scoreBarFill, { width: `${percentage}%` }]} />
          </View>
          <Text style={[styles.scoreDescription, { color: colors.textSecondary }]}>
            You're in safe areas {percentage.toFixed(0)}% of the time
          </Text>
        </View>

        {/* Night Mode Toggle */}
        <View style={[styles.toggleCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.toggleLeft}>
            <Text style={[styles.toggleTitle, { color: colors.text }]}>Night Mode Alerts</Text>
            <Text style={[styles.toggleDescription, { color: colors.textSecondary }]}>
              Extra safety alerts after dark
            </Text>
          </View>
          <Switch
            value={nightMode}
            onValueChange={setNightMode}
            trackColor={{ false: colors.border, true: '#5B8DEE' }}
            thumbColor={nightMode ? '#5B8DEE' : '#FFFFFF'}
          />
        </View>

        {/* Safety Trends */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Safety Trends</Text>
            <View style={styles.viewToggle}>
              <TouchableOpacity
                style={[styles.toggleButton, viewMode === 'weekly' && [styles.toggleButtonActive, { backgroundColor: colors.text }]]}
                onPress={() => setViewMode('weekly')}
              >
                <Text
                  style={[styles.toggleText, { color: colors.textSecondary }, viewMode === 'weekly' && [styles.toggleTextActive, { color: colors.background }]]}
                >
                  Weekly
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, viewMode === 'monthly' && [styles.toggleButtonActive, { backgroundColor: colors.text }]]}
                onPress={() => setViewMode('monthly')}
              >
                <Text
                  style={[styles.toggleText, { color: colors.textSecondary }, viewMode === 'monthly' && [styles.toggleTextActive, { color: colors.background }]]}
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
                      <Text style={[styles.chartBarValue, { color: '#FFFFFF' }]}>{data.score}</Text>
                    </View>
                  </View>
                  <Text style={[styles.chartBarLabel, { color: colors.textSecondary }]}>{data.day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Recent Alerts */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Alerts</Text>
          {reports.length === 0 ? (
            <TouchableOpacity style={[styles.alertRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.alertLeft}>
                <Text style={[styles.alertType, { color: colors.text }]}>
                  {isLoadingDashboard ? 'Loading reports' : 'No reports filed'}
                </Text>
                <Text style={[styles.alertLocation, { color: colors.textSecondary }]}>Your recent report activity</Text>
              </View>
              <Text style={[styles.alertTime, { color: colors.textSecondary }]}>{isLoadingDashboard ? '...' : 'Now'}</Text>
            </TouchableOpacity>
          ) : (
            reports.map((alert) => (
              <TouchableOpacity key={alert.report_id} style={[styles.alertRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.alertLeft}>
                  <Text style={[styles.alertType, { color: colors.text }]}>
                    {alert.category_name || `Category ${alert.category_id}`}
                  </Text>
                  <Text style={[styles.alertLocation, { color: colors.textSecondary }]}>
                    {alert.status} near {alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}
                  </Text>
                </View>
                <Text style={[styles.alertTime, { color: colors.textSecondary }]}>{formatTimeAgo(alert.created_at)}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Emergency Contacts */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Emergency Contacts</Text>
          {dashboardContacts.map((contact) => (
            <TouchableOpacity
              key={contact.id}
              style={[styles.contactRow, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => handleCall(contact.number, contact.name)}
            >
              <Text style={[styles.contactName, { color: colors.text }]}>{contact.name}</Text>
              <Text style={[styles.contactNumber, { color: colors.textSecondary }]}>{contact.number}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: colors.text }]}>42</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Safe Routes</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: colors.text }]}>{reports.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Reports Filed</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: colors.text }]}>127</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Safe Trips</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  apiTestButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '400',
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '400',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  scoreCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  scoreLabel: {
    fontSize: 13,
    fontWeight: '400',
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
    letterSpacing: -1,
  },
  scoreMax: {
    fontSize: 20,
    fontWeight: '300',
    marginLeft: 4,
  },
  scoreBar: {
    height: 4,
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
    lineHeight: 18,
  },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  toggleLeft: {
    flex: 1,
    marginRight: 16,
  },
  toggleTitle: {
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 13,
    fontWeight: '400',
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
    marginBottom: 12,
  },
  viewToggle: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 2,
    backgroundColor: '#00000008',
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  toggleButtonActive: {
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '400',
  },
  toggleTextActive: {
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
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
  },
  chartBarLabel: {
    fontSize: 11,
    fontWeight: '400',
    marginTop: 8,
  },
  alertRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
  },
  alertLeft: {
    flex: 1,
  },
  alertType: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 4,
  },
  alertLocation: {
    fontSize: 13,
    fontWeight: '400',
  },
  alertTime: {
    fontSize: 12,
    fontWeight: '400',
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '400',
  },
  contactNumber: {
    fontSize: 15,
    fontWeight: '400',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '300',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
  },
});
