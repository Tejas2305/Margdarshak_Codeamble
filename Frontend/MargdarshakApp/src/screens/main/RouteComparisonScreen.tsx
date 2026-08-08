import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { mapService } from '../../services/api';
import { LocationPoint, RouteSafetyOption } from '../../services/api/types';
import { theme } from '../../theme';

const { width, height } = Dimensions.get('window');

const DEFAULT_ORIGIN = {
  lat: 18.5204,
  lng: 73.8567,
};

const DEFAULT_DESTINATION = {
  lat: 18.5314,
  lng: 73.8446,
};

const formatDistance = (meters: number) => `${(meters / 1000).toFixed(1)} km`;

const formatDuration = (seconds: number) => {
  const minutes = Math.max(1, Math.round(seconds / 60));
  return `${minutes} mins`;
};

const getScoreColor = (score: number) => {
  if (score >= 8) return '#4CAF50';
  if (score >= 6) return '#FFC107';
  if (score >= 4) return '#FF9800';
  return '#F44336';
};

const getRouteName = (item: RouteSafetyOption, index: number) => {
  if (item.is_safest) return 'Safest Route';
  if (index === 0) return 'Fastest Route';
  return `Route ${index + 1}`;
};

const normalizePoint = (value: unknown, fallback: LocationPoint): LocationPoint => {
  const candidate = value as Partial<LocationPoint> | undefined;
  if (typeof candidate?.lat === 'number' && typeof candidate?.lng === 'number') {
    return { lat: candidate.lat, lng: candidate.lng };
  }

  return fallback;
};

export default function RouteComparisonScreen({ navigation, route }: any) {
  const params = route?.params || {};
  const origin = normalizePoint(params.origin, DEFAULT_ORIGIN);
  const destination = normalizePoint(params.destination, DEFAULT_DESTINATION);

  const [routes, setRoutes] = useState<RouteSafetyOption[]>([]);
  const [recommendedRouteIndex, setRecommendedRouteIndex] = useState(0);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRoutes();
  }, []);

  const selectedRoute = useMemo(
    () => routes.find((item) => item.route_index === selectedRouteIndex) || routes[0],
    [routes, selectedRouteIndex]
  );

  const loadRoutes = async () => {
    try {
      setIsLoading(true);
      const response = await mapService.analyzeRouteSafety(origin, destination);
      setRoutes(response.routes);
      setRecommendedRouteIndex(response.recommended_route_index);
      setSelectedRouteIndex(response.recommended_route_index);
    } catch (error: any) {
      Alert.alert('Routes Unavailable', error?.response?.data?.detail || 'Unable to compare routes right now.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartNavigation = () => {
    if (!selectedRoute) {
      Alert.alert('No Route Selected', 'Please wait for route options to load.');
      return;
    }

    Alert.alert(
      'Start Navigation',
      `Navigate via ${getRouteName(selectedRoute, selectedRoute.route_index)}?\n\nSafety Score: ${selectedRoute.safety_index.toFixed(1)}/10\nDistance: ${formatDistance(selectedRoute.distance_meters)}\nETA: ${formatDuration(selectedRoute.adjusted_duration_seconds)}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start',
          onPress: () => {
            Alert.alert('Navigation Started', 'Follow the route on the map');
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>Route Comparison</Text>
        <Text style={styles.mapSubtext}>
          {origin.lat.toFixed(4)}, {origin.lng.toFixed(4)} to {destination.lat.toFixed(4)}, {destination.lng.toFixed(4)}
        </Text>
        <View style={styles.routeColors}>
          <View style={styles.routeColorItem}>
            <View style={[styles.colorDot, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.colorText}>Safer</Text>
          </View>
          <View style={styles.routeColorItem}>
            <View style={[styles.colorDot, { backgroundColor: '#FFC107' }]} />
            <Text style={styles.colorText}>Moderate</Text>
          </View>
          <View style={styles.routeColorItem}>
            <View style={[styles.colorDot, { backgroundColor: '#F44336' }]} />
            <Text style={styles.colorText}>Risky</Text>
          </View>
        </View>
      </View>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Compare Routes</Text>
        <TouchableOpacity onPress={loadRoutes} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading routes...</Text>
        </View>
      ) : routes.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No routes found</Text>
          <Text style={styles.emptyDescription}>Try again after checking backend OSRM routing data.</Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          style={styles.routesScroll}
          contentContainerStyle={styles.routesContent}
          showsHorizontalScrollIndicator={false}
        >
          {routes.map((item, index) => {
            const isSelected = selectedRouteIndex === item.route_index;
            const scoreColor = getScoreColor(item.safety_index);

            return (
              <TouchableOpacity
                key={item.route_index}
                style={[styles.routeCard, isSelected && styles.routeCardSelected, { borderColor: scoreColor }]}
                onPress={() => setSelectedRouteIndex(item.route_index)}
              >
                <View style={styles.routeHeader}>
                  <Text style={styles.routeName}>{getRouteName(item, index)}</Text>
                  {item.route_index === recommendedRouteIndex && (
                    <View style={[styles.selectedBadge, { backgroundColor: scoreColor }]}>
                      <Text style={styles.selectedBadgeText}>Best</Text>
                    </View>
                  )}
                </View>

                <View style={styles.scoreContainer}>
                  <View style={[styles.scoreCircle, { borderColor: scoreColor }]}>
                    <Text style={[styles.scoreValue, { color: scoreColor }]}>{item.safety_index.toFixed(1)}</Text>
                    <Text style={styles.scoreMax}>/10</Text>
                  </View>
                  <View style={styles.scoreDetails}>
                    <View style={styles.routeStat}>
                      <Text style={styles.statLabel}>Distance</Text>
                      <Text style={styles.routeStatValue}>{formatDistance(item.distance_meters)}</Text>
                    </View>
                    <View style={styles.routeStat}>
                      <Text style={styles.statLabel}>Duration</Text>
                      <Text style={styles.routeStatValue}>{formatDuration(item.adjusted_duration_seconds)}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.features}>
                  {(item.warnings.length > 0 ? item.warnings : ['No safety warnings reported']).map((warning) => (
                    <View key={warning} style={styles.feature}>
                      <Text style={styles.featureDot}>-</Text>
                      <Text style={styles.featureText}>{warning}</Text>
                    </View>
                  ))}
                </View>

                <View style={[styles.routeIndicator, { backgroundColor: scoreColor }]} />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.startButton} onPress={handleStartNavigation} activeOpacity={0.8}>
          <Text style={styles.startButtonText}>Start Navigation</Text>
        </TouchableOpacity>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Safety Score</Text>
            <Text style={styles.infoValue}>{selectedRoute ? `${selectedRoute.safety_index.toFixed(1)}/10` : '--'}</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>ETA</Text>
            <Text style={styles.infoValue}>{selectedRoute ? formatDuration(selectedRoute.adjusted_duration_seconds) : '--'}</Text>
          </View>
        </View>
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
    width,
    height: height * 0.45,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  mapText: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 8,
  },
  mapSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  routeColors: {
    flexDirection: 'row',
    gap: 16,
  },
  routeColorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  colorText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    ...theme.shadows.medium,
  },
  headerButton: {
    minWidth: 56,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  headerButtonText: {
    fontSize: 12,
    color: theme.colors.text,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  loadingContainer: {
    position: 'absolute',
    top: height * 0.45 - 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    color: theme.colors.textSecondary,
  },
  emptyState: {
    position: 'absolute',
    top: height * 0.45 - 60,
    left: 24,
    right: 24,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 18,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 6,
  },
  emptyDescription: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  routesScroll: {
    position: 'absolute',
    top: height * 0.45 - 80,
    left: 0,
    right: 0,
  },
  routesContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  routeCard: {
    width: width * 0.65,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: theme.colors.border,
    ...theme.shadows.medium,
  },
  routeCardSelected: {
    borderWidth: 3,
    transform: [{ scale: 1.02 }],
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  routeName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    flex: 1,
  },
  selectedBadge: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  selectedBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  scoreCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  scoreMax: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginTop: -2,
  },
  scoreDetails: {
    flex: 1,
    gap: 6,
  },
  routeStat: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  routeStatValue: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
  },
  features: {
    gap: 6,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureDot: {
    fontSize: 10,
    color: theme.colors.textSecondary,
  },
  featureText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  routeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  },
  startButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    ...theme.shadows.medium,
  },
  startButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  infoRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  infoItem: {
    alignItems: 'center',
    gap: 4,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
  },
  infoDivider: {
    width: 1,
    height: 32,
    backgroundColor: theme.colors.border,
  },
});
