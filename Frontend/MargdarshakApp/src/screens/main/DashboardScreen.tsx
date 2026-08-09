import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../theme';
import { emergencyContactService, reportService } from '../../services/api';
import { EmergencyContact, Report } from '../../services/api/types';

export default function DashboardScreen() {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [contactsData, reportsData] = await Promise.all([
        emergencyContactService.getContacts(),
        reportService.getMyReports(1, 10),
      ]);
      setContacts(contactsData);
      setReports(reportsData);
    } catch (error: any) {
      Alert.alert('Error', 'Unable to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (value?: string | null) => {
    if (!value) return 'Recently';
    const date = new Date(value);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const handleCall = (number: string, name: string) => {
    Alert.alert(
      `Call ${name}?`,
      number,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => Linking.openURL(`tel:${number}`) },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Dashboard</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* My Reports */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>My Reports</Text>
          {reports.length === 0 ? (
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No reports yet</Text>
            </View>
          ) : (
            reports.map((report) => (
              <View key={report.report_id} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.reportHeader}>
                  <Text style={[styles.reportCategory, { color: colors.text }]}>
                    {report.category_name || `Category ${report.category_id}`}
                  </Text>
                  <Text style={[styles.reportTime, { color: colors.textSecondary }]}>
                    {formatTime(report.created_at)}
                  </Text>
                </View>
                <Text style={[styles.reportDetails, { color: colors.textSecondary }]}>
                  Status: {report.status} • Severity: {report.computed_severity}/100
                </Text>
                {report.description && (
                  <Text style={[styles.reportDescription, { color: colors.textSecondary }]}>
                    {report.description}
                  </Text>
                )}
              </View>
            ))
          )}
        </View>

        {/* Emergency Contacts */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Emergency Contacts</Text>
          {contacts.length === 0 ? (
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No contacts added</Text>
            </View>
          ) : (
            contacts.map((contact) => (
              <TouchableOpacity
                key={contact.contact_id}
                style={[styles.contactCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => handleCall(contact.phone_number, contact.name)}
              >
                <View style={styles.contactInfo}>
                  <Text style={[styles.contactName, { color: colors.text }]}>{contact.name}</Text>
                  <Text style={[styles.contactNumber, { color: colors.textSecondary }]}>
                    {contact.phone_number}
                  </Text>
                </View>
                <MaterialCommunityIcons name="phone" size={20} color={colors.primary} />
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: colors.text }]}>{reports.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Reports</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: colors.text }]}>{contacts.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Contacts</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 8,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportCategory: {
    fontSize: 15,
    fontWeight: '600',
  },
  reportTime: {
    fontSize: 12,
  },
  reportDetails: {
    fontSize: 13,
    marginBottom: 4,
  },
  reportDescription: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  contactCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  contactNumber: {
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
  },
  statValue: {
    fontSize: 36,
    fontWeight: '600',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    textAlign: 'center',
  },
});
