import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../theme';
import { mapService, reportService } from '../../services/api';
import { Report, SpeedLimitResponse } from '../../services/api/types';

const DEFAULT_LOCATION = {
  latitude: 18.5204,
  longitude: 73.8567,
};

const DEFAULT_DESTINATION = {
  lat: 18.5314,
  lng: 73.8446,
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

const getSafetyLabel = (riskScore?: number) => {
  if (riskScore === undefined) return 'Checking';
  if (riskScore < 25) return 'Very Safe';
  if (riskScore < 50) return 'Moderate';
  if (riskScore < 75) return 'Caution';
  return 'High Risk';
};

export default function MapScreen({ navigation }: any) {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const insets = useSafeAreaInsets();

  const [coordinates, setCoordinates] = useState(DEFAULT_LOCATION);
  const [nearbyReports, setNearbyReports] = useState<Report[]>([]);
  const [speedInfo, setSpeedInfo] = useState<SpeedLimitResponse | null>(null);
  const [isLoadingSafety, setIsLoadingSafety] = useState(true);

  useEffect(() => {
    loadMapData();
  }, []);

  const loadMapData = async () => {
    try {
      setIsLoadingSafety(true);
      const currentCoordinates = await resolveCurrentLocation();
      setCoordinates(currentCoordinates);

      try {
        const speedLimit = await mapService.getSpeedLimit({
          lat: currentCoordinates.latitude,
          lng: currentCoordinates.longitude,
        });
        setSpeedInfo(speedLimit);
      } catch {
        setSpeedInfo(null);
      }

      const reports = await reportService.getNearbyReports(currentCoordinates.latitude, currentCoordinates.longitude);
      setNearbyReports(reports);
    } catch (error: any) {
      Alert.alert('Map Data Unavailable', error?.response?.data?.detail || 'Unable to load safety data right now.');
    } finally {
      setIsLoadingSafety(false);
    }
  };

  const resolveCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return DEFAULT_LOCATION;
    }

    const position = await Location.getCurrentPositionAsync({});
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
  };

  const riskScore = speedInfo?.risk_score;
  const safetyScore = riskScore === undefined ? null : Math.max(0, Math.min(10, 10 - riskScore / 10));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      <View style={styles.mapContainer}>
        <View style={[styles.mapPlaceholder, { backgroundColor: colors.surfaceVariant }]}>
          <Text style={[styles.mapText, { color: colors.text }]}>Map View</Text>
          <Text style={[styles.mapSubtext, { color: colors.textSecondary }]}>
            {coordinates.latitude.toFixed(5)}, {coordinates.longitude.toFixed(5)}
          </Text>
        </View>
      </View>

      <View style={[styles.searchContainer, { top: insets.top + 12 }]}>
        <TouchableOpacity
          style={[styles.searchBar, { backgroundColor: colors.surface }]}
          onPress={() => navigation.navigate('Search')}
          activeOpacity={0.8}
        >
          <Text style={[styles.searchIcon, { color: colors.textSecondary }]}>Search</Text>
          <Text style={[styles.searchPlaceholder, { color: colors.textSecondary }]}>Search destination</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colors.surface }]}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={[styles.iconText, { color: colors.textSecondary }]}>Set</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.emergencyButton, { top: insets.top + 72 }]}
        onPress={() => navigation.navigate('SOS')}
      >
        <Text style={styles.emergencyIcon}>!</Text>
      </TouchableOpacity>

      <View style={[styles.bottomSheet, { backgroundColor: colors.surface }]}>
        <View style={[styles.handle, { backgroundColor: colors.border }]} />

        <View style={[styles.safetyCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <View style={styles.safetyRow}>
            <View style={styles.safetyLeft}>
              <Text style={[styles.safetyLabel, { color: colors.textSecondary }]}>
                {speedInfo?.road_name || 'Current Area'}
              </Text>
              <Text style={[styles.safetyStatus, { color: colors.text }]}>
                {isLoadingSafety ? 'Loading...' : getSafetyLabel(riskScore)}
              </Text>
            </View>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreValue}>{safetyScore === null ? '--' : safetyScore.toFixed(1)}</Text>
              <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>/10</Text>
            </View>
          </View>
          {speedInfo && (
            <Text style={[styles.speedText, { color: colors.textSecondary }]}>
              Speed limit {speedInfo.updated_speed_kmh} km/h, risk {speedInfo.risk_score.toFixed(1)}
            </Text>
          )}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('RouteComparison', {
                origin: { lat: coordinates.latitude, lng: coordinates.longitude },
                destination: DEFAULT_DESTINATION,
              })
            }
          >
            <Text style={[styles.linkText, { color: colors.primary }]}>Compare routes</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sheetTitle, { color: colors.text }]}>Nearby Activity</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.incidentsList}
          contentContainerStyle={styles.incidentsContent}
        >
          {nearbyReports.length === 0 ? (
            <View style={[styles.incidentCard, { backgroundColor: colors.surfaceVariant }]}>
              <Text style={[styles.incidentType, { color: colors.text }]}>No recent reports</Text>
              <Text style={[styles.incidentTime, { color: colors.textSecondary }]}>Area is quiet</Text>
            </View>
          ) : (
            nearbyReports.map((report) => (
              <View key={report.report_id} style={[styles.incidentCard, { backgroundColor: colors.surfaceVariant }]}>
                <Text style={[styles.incidentType, { color: colors.text }]}>
                  {report.category_name || `Category ${report.category_id}`}
                </Text>
                <Text style={[styles.incidentTime, { color: colors.textSecondary }]}>
                  {formatTimeAgo(report.created_at)}
                </Text>
              </View>
            ))
          )}
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
    fontSize: 12,
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
    fontSize: 12,
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
  speedText: {
    fontSize: 12,
    marginBottom: 10,
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
    width: 140,
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
