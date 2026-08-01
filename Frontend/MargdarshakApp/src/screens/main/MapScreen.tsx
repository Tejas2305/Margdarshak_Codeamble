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
import { theme } from '../../theme';

const { width } = Dimensions.get('window');

// Mock incident data
const mockIncidents = [
  { id: '1', type: 'Road Work', icon: '🚧', time: '2 hours ago' },
  { id: '2', type: 'Patrol', icon: '🚓', time: '30 mins ago' },
  { id: '3', type: 'Accident', icon: '⚠️', time: '1 hour ago' },
  { id: '4', type: 'Theft', icon: '🚨', time: '4 hours ago' },
];

export default function MapScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [safetyScore] = useState(8.9);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Map Placeholder */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapIcon}>🗺️</Text>
        <Text style={styles.mapText}>Map View</Text>
        <Text style={styles.mapSubtext}>Interactive map with safety markers</Text>
        <Text style={styles.mapNote}>(Real map will load here with Google Maps API key)</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Where to?"
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => navigation.navigate('Search')}
          />
        </View>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.filterIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Safety Score Card */}
      <View style={styles.safetyCard}>
        <View style={styles.safetyHeader}>
          <Text style={styles.safetyTitle}>Current Area Safety</Text>
          <TouchableOpacity onPress={() => navigation.navigate('RouteComparison')}>
            <Text style={styles.safetyLink}>Compare Routes →</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.safetyScoreContainer}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreValue}>{safetyScore}</Text>
            <Text style={styles.scoreMax}>/10</Text>
          </View>
          <View style={styles.scoreDetails}>
            <Text style={styles.scoreLabel}>Very Safe</Text>
            <Text style={styles.scoreDescription}>
              Based on recent reports and patrol activity
            </Text>
            <View style={styles.indicators}>
              <View style={styles.indicator}>
                <Text style={styles.indicatorIcon}>🚓</Text>
                <Text style={styles.indicatorText}>High Patrol</Text>
              </View>
              <View style={styles.indicator}>
                <Text style={styles.indicatorIcon}>💡</Text>
                <Text style={styles.indicatorText}>Well Lit</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Emergency Button */}
      <TouchableOpacity
        style={styles.emergencyButton}
        onPress={() => navigation.navigate('SOS')}
      >
        <Text style={styles.emergencyIcon}>🚨</Text>
        <Text style={styles.emergencyText}>Emergency</Text>
      </TouchableOpacity>

      {/* Incidents List (Bottom Sheet Preview) */}
      <View style={styles.incidentsPreview}>
        <View style={styles.dragHandle} />
        <Text style={styles.incidentsTitle}>Nearby Incidents</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {mockIncidents.map((incident) => (
            <TouchableOpacity key={incident.id} style={styles.incidentCard}>
              <Text style={styles.incidentEmoji}>{incident.icon}</Text>
              <Text style={styles.incidentType}>{incident.type}</Text>
              <Text style={styles.incidentTime}>{incident.time}</Text>
            </TouchableOpacity>
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
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  mapIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  mapText: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 8,
  },
  mapSubtext: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  mapNote: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  searchContainer: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    ...theme.shadows.medium,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  filterButton: {
    width: 50,
    height: 50,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.medium,
  },
  filterIcon: {
    fontSize: 24,
  },
  safetyCard: {
    position: 'absolute',
    bottom: 180,
    left: 16,
    right: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 20,
    ...theme.shadows.large,
  },
  safetyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  safetyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  safetyLink: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  safetyScoreContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.success + '20',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: theme.colors.success,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.success,
  },
  scoreMax: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.success,
    marginTop: -4,
  },
  scoreDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  scoreLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  scoreDescription: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  indicators: {
    flexDirection: 'row',
    gap: 12,
  },
  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  indicatorIcon: {
    fontSize: 16,
  },
  indicatorText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  emergencyButton: {
    position: 'absolute',
    top: 120,
    right: 16,
    backgroundColor: theme.colors.error,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    ...theme.shadows.large,
  },
  emergencyIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  emergencyText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  incidentsPreview: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
    ...theme.shadows.large,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  incidentsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 12,
  },
  incidentCard: {
    width: 120,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  incidentEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  incidentType: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  incidentTime: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
});
