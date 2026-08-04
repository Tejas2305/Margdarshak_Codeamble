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
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../theme';

const { width } = Dimensions.get('window');

// Mock incident data
const mockIncidents = [
  { id: '1', type: 'Road Work', time: '2h ago' },
  { id: '2', type: 'Patrol', time: '30m ago' },
  { id: '3', type: 'Accident', time: '1h ago' },
];

export default function MapScreen({ navigation }: any) {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const [searchQuery, setSearchQuery] = useState('');
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

      {/* Map Area */}
      <View style={styles.mapContainer}>
        <View style={[styles.mapPlaceholder, { backgroundColor: colors.surfaceVariant }]}>
          <Text style={[styles.mapText, { color: colors.text }]}>Map View</Text>
          <Text style={[styles.mapSubtext, { color: colors.textSecondary }]}>Interactive map area</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { top: insets.top + 12 }]}>
        <TouchableOpacity
          style={[styles.searchBar, { backgroundColor: colors.surface }]}
          onPress={() => navigation.navigate('Search')}
          activeOpacity={0.8}
        >
          <Text style={[styles.searchIcon, { color: colors.textSecondary }]}>🔍</Text>
          <Text style={[styles.searchPlaceholder, { color: colors.textSecondary }]}>Search destination</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colors.surface }]}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={[styles.iconText, { color: colors.textSecondary }]}>⚙</Text>
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
      <View style={[styles.bottomSheet, { backgroundColor: colors.surface }]}>
        <View style={[styles.handle, { backgroundColor: colors.border }]} />
        
        {/* Safety Score - Inside Bottom Sheet */}
        <View style={[styles.safetyCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <View style={styles.safetyRow}>
            <View style={styles.safetyLeft}>
              <Text style={[styles.safetyLabel, { color: colors.textSecondary }]}>Current Area</Text>
              <Text style={[styles.safetyStatus, { color: colors.text }]}>Very Safe</Text>
            </View>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreValue}>8.9</Text>
              <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>/10</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('RouteComparison')}>
            <Text style={[styles.linkText, { color: colors.primary }]}>Compare routes →</Text>
          </TouchableOpacity>
        </View>

        {/* Nearby Activity */}
        <Text style={[styles.sheetTitle, { color: colors.text }]}>Nearby Activity</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.incidentsList}
          contentContainerStyle={styles.incidentsContent}
        >
          {mockIncidents.map((incident) => (
            <View key={incident.id} style={[styles.incidentCard, { backgroundColor: colors.surfaceVariant }]}>
              <Text style={[styles.incidentType, { color: colors.text }]}>{incident.type}</Text>
              <Text style={[styles.incidentTime, { color: colors.textSecondary }]}>{incident.time}</Text>
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
  },
  mapContainer: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapText: {
    fontSize: 20,
    fontWeight: '400',
    marginBottom: 4,
  },
  mapSubtext: {
    fontSize: 14,
    fontWeight: '400',
  },
  searchContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
    zIndex: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  searchPlaceholder: {
    fontSize: 14,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  iconText: {
    fontSize: 18,
  },
  emergencyButton: {
    position: 'absolute',
    right: 16,
    width: 56,
    height: 56,
    backgroundColor: '#EA4335',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 10,
  },
  emergencyIcon: {
    fontSize: 32,
    fontWeight: '400',
    color: '#FFFFFF',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 90,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  safetyCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
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
    fontWeight: '400',
    marginBottom: 4,
  },
  safetyStatus: {
    fontSize: 20,
    fontWeight: '400',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreValue: {
    fontSize: 40,
    fontWeight: '300',
    color: '#34A853',
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: '400',
    marginLeft: 4,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '400',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '400',
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
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
  },
  incidentType: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 4,
  },
  incidentTime: {
    fontSize: 12,
    fontWeight: '400',
  },
});
