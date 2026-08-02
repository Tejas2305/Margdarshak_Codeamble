import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../theme';

const { width } = Dimensions.get('window');

// Mock incident data
const mockIncidents = [
  { id: '1', type: 'Road Work', time: '2h ago' },
  { id: '2', type: 'Patrol', time: '30m ago' },
  { id: '3', type: 'Accident', time: '1h ago' },
];

export default function MapScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Map Area */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapText}>Map View</Text>
          <Text style={styles.mapSubtext}>Interactive map area</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { top: insets.top + 12 }]}>
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate('Search')}
          activeOpacity={0.8}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Search destination</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.iconText}>⚙</Text>
        </TouchableOpacity>
      </View>

      {/* Emergency Button - Top Right */}
      <TouchableOpacity
        style={[styles.emergencyButton, { top: insets.top + 72 }]}
        onPress={() => navigation.navigate('SOS')}
      >
        <Text style={styles.emergencyIcon}>!</Text>
      </TouchableOpacity>

      {/* Bottom Sheet - Safety Info + Nearby Activity */}
      <View style={styles.bottomSheet}>
        <View style={styles.handle} />
        
        {/* Safety Score - Inside Bottom Sheet */}
        <View style={styles.safetyCard}>
          <View style={styles.safetyRow}>
            <View style={styles.safetyLeft}>
              <Text style={styles.safetyLabel}>Current Area</Text>
              <Text style={styles.safetyStatus}>Very Safe</Text>
            </View>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreValue}>8.9</Text>
              <Text style={styles.scoreLabel}>/10</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('RouteComparison')}>
            <Text style={styles.linkText}>Compare routes →</Text>
          </TouchableOpacity>
        </View>

        {/* Nearby Activity */}
        <Text style={styles.sheetTitle}>Nearby Activity</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.incidentsList}
          contentContainerStyle={styles.incidentsContent}
        >
          {mockIncidents.map((incident) => (
            <View key={incident.id} style={styles.incidentCard}>
              <Text style={styles.incidentType}>{incident.type}</Text>
              <Text style={styles.incidentTime}>{incident.time}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  mapContainer: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: theme.colors.mapBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapText: {
    fontSize: theme.typography.h3,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  mapSubtext: {
    fontSize: theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  searchContainer: {
    position: 'absolute',
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    flexDirection: 'row',
    gap: theme.spacing.sm,
    zIndex: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    ...theme.shadows.medium,
  },
  searchIcon: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.md,
  },
  searchPlaceholder: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
  },
  iconButton: {
    width: 48,
    height: 48,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.medium,
  },
  iconText: {
    fontSize: 18,
    color: theme.colors.textSecondary,
  },
  emergencyButton: {
    position: 'absolute',
    right: theme.spacing.lg,
    width: 56,
    height: 56,
    backgroundColor: theme.colors.error,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.large,
    zIndex: 10,
  },
  emergencyIcon: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 90,
    ...theme.shadows.large,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.borderLight,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  safetyCard: {
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  safetyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  safetyLeft: {
    flex: 1,
  },
  safetyLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  safetyStatus: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreValue: {
    fontSize: 40,
    fontWeight: '800',
    color: theme.colors.success,
  },
  scoreLabel: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  linkText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 12,
  },
  incidentsList: {
    flexDirection: 'row',
  },
  incidentsContent: {
    paddingRight: 20,
  },
  incidentCard: {
    width: 120,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
  },
  incidentType: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  incidentTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});
