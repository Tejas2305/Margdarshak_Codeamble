import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  PanResponder,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useRoutePlanning } from '../../contexts/RoutePlanningContext';
import { getThemeColors } from '../../theme';
import { mapService } from '../../services/api';
import OpenStreetMapView from '../../components/OpenStreetMapView';
import { 
  SpeedLimitResponse, 
  Report,
  RouteSafetyResponse,
  RouteSafetyOption,
  SynthesizedWarning,
} from '../../services/api/types';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const BOTTOM_SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.7;
const BOTTOM_SHEET_MIN_HEIGHT = 180;

// Pune center
const PUNE_CENTER = {
  latitude: 18.5204,
  longitude: 73.8567,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

interface SelectedPlace {
  name: string;
  fullName: string;
  lat: number;
  lng: number;
}

type AppState = 'idle' | 'loading' | 'route_displayed';

const getSafetyColor = (safetyIndex: number): string => {
  if (safetyIndex >= 80) return '#4CAF50';
  if (safetyIndex >= 60) return '#8BC34A';
  if (safetyIndex >= 40) return '#FFC107';
  if (safetyIndex >= 20) return '#FF9800';
  return '#F44336';
};

const getSeverityFromNumber = (severity: number): 'high' | 'medium' | 'low' => {
  if (severity >= 70) return 'high';
  if (severity >= 40) return 'medium';
  return 'low';
};

const getSeverityColor = (severity: number): string => {
  if (severity >= 70) return '#F44336';
  if (severity >= 40) return '#FF9800';
  return '#FFC107';
};

export default function MapScreen({ navigation, route }: any) {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  
  // Use context for places - this persists across navigation
  const { fromPlace, toPlace, setFromPlace, setToPlace, clearRoute: clearRoutePlaces } = useRoutePlanning();

  // Route planning state
  const [appState, setAppState] = useState<AppState>('idle');
  const [routeResponse, setRouteResponse] = useState<RouteSafetyResponse | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<RouteSafetyOption | null>(null);

  // Bottom sheet animation
  const bottomSheetY = useRef(new Animated.Value(BOTTOM_SHEET_MIN_HEIGHT)).current;
  const [isExpanded, setIsExpanded] = useState(false);

  // Speed limit / road safety data
  const [speedData, setSpeedData] = useState<SpeedLimitResponse | null>(null);
  const [loadingSpeed, setLoadingSpeed] = useState(false);

  // Nearby reports (mock for now)
  const [nearbyReports, setNearbyReports] = useState<Report[]>([]);

  // Log when places change from context
  useEffect(() => {
    console.log('🔄 Places from context:', { 
      from: fromPlace?.name || 'NOT SET', 
      to: toPlace?.name || 'NOT SET' 
    });
  }, [fromPlace, toPlace]);

  // Auto-call API when both places are selected
  useEffect(() => {
    if (fromPlace && toPlace && appState === 'idle') {
      console.log('🚀 Both places ready! Calling route API...');
      console.log('  FROM:', { name: fromPlace.name, lat: fromPlace.lat, lng: fromPlace.lng });
      console.log('  TO:', { name: toPlace.name, lat: toPlace.lat, lng: toPlace.lng });
      handleFindRoute();
    } else {
      console.log('⏸️ Waiting for both places:', {
        hasFrom: !!fromPlace,
        hasTo: !!toPlace,
        state: appState
      });
    }
  }, [fromPlace, toPlace, appState]);

  // Load default speed data for Pune center
  useEffect(() => {
    loadSpeedData(PUNE_CENTER.latitude, PUNE_CENTER.longitude);
  }, []);

  const loadSpeedData = async (lat: number, lng: number) => {
    try {
      setLoadingSpeed(true);
      const data = await mapService.getSpeedLimit({ lat, lng });
      setSpeedData(data);
    } catch (error) {
      console.error('Failed to load speed data:', error);
    } finally {
      setLoadingSpeed(false);
    }
  };

  // Find safest route
  const handleFindRoute = useCallback(async () => {
    if (!fromPlace || !toPlace) {
      console.log('❌ Missing places:', { fromPlace, toPlace });
      return;
    }
    
    try {
      console.log('🌐 Calling /map/route-safety API...');
      console.log('   Origin:', { lat: fromPlace.lat, lng: fromPlace.lng });
      console.log('   Destination:', { lat: toPlace.lat, lng: toPlace.lng });
      
      setAppState('loading');
      
      const response = await mapService.analyzeRouteSafety(
        { lat: fromPlace.lat, lng: fromPlace.lng },
        { lat: toPlace.lat, lng: toPlace.lng }
      );
      
      console.log('✅ API Response received:', response);
      console.log('   Routes:', response.routes.length);
      console.log('   Recommended:', response.recommended_route_index);
      
      setRouteResponse(response);
      const safest = response.routes[response.recommended_route_index] || response.routes[0];
      
      console.log('📍 Selected route:', {
        index: safest.route_index,
        distance: safest.distance_meters,
        duration: safest.duration_seconds,
        safety: safest.safety_index,
        warnings: safest.warnings.length,
      });
      
      setSelectedRoute(safest);
      setAppState('route_displayed');
      
      console.log('✅ Route ready to display');
    } catch (error: any) {
      console.error('❌ API Error:', error);
      console.error('   Status:', error?.response?.status);
      console.error('   Data:', error?.response?.data);
      setAppState('idle');
      Alert.alert(
        'Route Error',
        error?.response?.data?.detail || error?.message || 'Unable to calculate route.'
      );
    }
  }, [fromPlace, toPlace]);

  // Clear route
  const handleClearRoute = () => {
    clearRoutePlaces();  // Clear from context
    setAppState('idle');
    setRouteResponse(null);
    setSelectedRoute(null);
  };

  // Route coordinates for Polyline
  const routeCoordinates = selectedRoute?.geometry
    ? ((selectedRoute.geometry as any)?.coordinates as number[][] || []).map(c => ({
        latitude: c[1],
        longitude: c[0],
      }))
    : [];

  // Log route coordinates for debugging
  useEffect(() => {
    if (selectedRoute) {
      console.log('🗺️ Route selected:', {
        hasGeometry: !!selectedRoute.geometry,
        geometryType: selectedRoute.geometry ? (selectedRoute.geometry as any).type : 'none',
        coordinatesCount: routeCoordinates.length,
        firstCoord: routeCoordinates[0],
        lastCoord: routeCoordinates[routeCoordinates.length - 1],
      });
      
      if (routeCoordinates.length === 0) {
        console.log('⚠️ NO ROUTE COORDINATES! Geometry:', JSON.stringify(selectedRoute.geometry));
      } else {
        console.log('✅ Route coordinates ready:', routeCoordinates.length, 'points');
      }
    }
  }, [selectedRoute, routeCoordinates.length]);

  // Pan responder for bottom sheet drag
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newHeight = BOTTOM_SHEET_MIN_HEIGHT - gestureState.dy;
        if (newHeight >= BOTTOM_SHEET_MIN_HEIGHT && newHeight <= BOTTOM_SHEET_MAX_HEIGHT) {
          bottomSheetY.setValue(newHeight);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -50) {
          // Swipe up - expand
          expandBottomSheet();
        } else if (gestureState.dy > 50) {
          // Swipe down - collapse
          collapseBottomSheet();
        } else {
          // Return to current state
          Animated.spring(bottomSheetY, {
            toValue: isExpanded ? BOTTOM_SHEET_MAX_HEIGHT : BOTTOM_SHEET_MIN_HEIGHT,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const expandBottomSheet = () => {
    setIsExpanded(true);
    Animated.spring(bottomSheetY, {
      toValue: BOTTOM_SHEET_MAX_HEIGHT,
      useNativeDriver: false,
    }).start();
  };

  const collapseBottomSheet = () => {
    setIsExpanded(false);
    Animated.spring(bottomSheetY, {
      toValue: BOTTOM_SHEET_MIN_HEIGHT,
      useNativeDriver: false,
    }).start();
  };

  const getSafetyRating = (riskScore: number): { text: string; color: string } => {
    if (riskScore < 20) return { text: 'Very Safe', color: '#4CAF50' };
    if (riskScore < 40) return { text: 'Safe', color: '#8BC34A' };
    if (riskScore < 60) return { text: 'Moderate', color: '#FFC107' };
    if (riskScore < 80) return { text: 'Caution', color: '#FF9800' };
    return { text: 'High Risk', color: '#F44336' };
  };

  const formatTimeAgo = (dateString: string) => {
    // Simple mock - you can enhance this
    return '30m ago';
  };

  const safety = speedData ? getSafetyRating(speedData.risk_score) : { text: 'Loading...', color: '#999' };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* ======== MAP ======== */}
      <OpenStreetMapView
        coordinates={routeCoordinates}
        fromPlace={fromPlace}
        toPlace={toPlace}
        warnings={selectedRoute?.warnings}
        routeColor={getSafetyColor(selectedRoute?.safety_index || 50)}
        onMapReady={() => {
          console.log('🗺️ OpenStreetMap is ready!');
        }}
      />

      {/* ======== TOP: FROM/TO SEARCH BAR ======== */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <View style={styles.searchCard}>
          {/* FROM */}
          <TouchableOpacity
            style={styles.searchRow}
            onPress={() => navigation.navigate('Search', { searchType: 'from' })}
          >
            <View style={[styles.dotIndicator, { backgroundColor: '#4CAF50' }]} />
            <Text
              style={[
                styles.searchText,
                fromPlace ? { color: colors.text } : { color: colors.textSecondary },
              ]}
              numberOfLines={1}
            >
              {fromPlace?.name || 'Select starting point'}
            </Text>
            {fromPlace && (
              <TouchableOpacity onPress={() => setFromPlace(null)}>
                <MaterialCommunityIcons name="close-circle" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>

          <View style={[styles.searchDivider, { backgroundColor: colors.border }]} />

          {/* TO */}
          <TouchableOpacity
            style={styles.searchRow}
            onPress={() => navigation.navigate('Search', { searchType: 'to' })}
          >
            <View style={[styles.dotIndicator, { backgroundColor: '#EA4335' }]} />
            <Text
              style={[
                styles.searchText,
                toPlace ? { color: colors.text } : { color: colors.textSecondary },
              ]}
              numberOfLines={1}
            >
              {toPlace?.name || 'Select destination'}
            </Text>
            {toPlace && (
              <TouchableOpacity onPress={() => setToPlace(null)}>
                <MaterialCommunityIcons name="close-circle" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </View>

        {/* Settings */}
        <TouchableOpacity
          style={[styles.settingsButton, { backgroundColor: colors.surface }]}
          onPress={() => navigation.navigate('Settings')}
        >
          <MaterialCommunityIcons name="cog-outline" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* ======== FIND SAFEST ROUTE BUTTON ======== */}
      {/* Auto-calls when both places selected, no manual button needed */}

      {/* ======== LOADING ======== */}
      {appState === 'loading' && (
        <View style={styles.loadingOverlay}>
          <View style={[styles.loadingCard, { backgroundColor: colors.surface }]}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.text }]}>Analyzing route safety...</Text>
          </View>
        </View>
      )}

      {/* ======== SLIDING BOTTOM SHEET ======== */}
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            height: bottomSheetY,
            backgroundColor: colors.background,
          },
        ]}
      >
        {/* Drag Handle */}
        <View {...panResponder.panHandlers} style={styles.dragHandle}>
          <View style={[styles.dragIndicator, { backgroundColor: colors.border }]} />
        </View>

        {/* Content */}
        <View style={styles.sheetContent}>
          {/* Show Route Info if route is displayed */}
          {appState === 'route_displayed' && selectedRoute ? (
            <>
              <View style={[styles.scoreCard, { backgroundColor: colors.surface }]}>
                <View style={styles.scoreHeader}>
                  <Text style={[styles.scoreTitle, { color: colors.textSecondary }]}>
                    Safest Route
                  </Text>
                  <View style={styles.scoreRow}>
                    <Text style={[styles.scoreValue, { color: getSafetyColor(selectedRoute.safety_index) }]}>
                      {selectedRoute.safety_index.toFixed(1)}
                    </Text>
                    <Text style={[styles.scoreMax, { color: colors.textSecondary }]}>/100</Text>
                  </View>
                </View>
                <Text style={[styles.scoreLabel, { color: getSafetyColor(selectedRoute.safety_index) }]}>
                  Safety Index
                </Text>
                <Text style={[styles.scoreDetails, { color: colors.textSecondary }]}>
                  Distance: {(selectedRoute.distance_meters / 1000).toFixed(1)} km • 
                  Duration: {Math.round(selectedRoute.adjusted_duration_seconds / 60)} min • 
                  Warnings: {selectedRoute.warnings.length}
                </Text>
                <TouchableOpacity style={styles.compareButton} onPress={handleClearRoute}>
                  <Text style={[styles.compareText, { color: colors.primary }]}>Clear route</Text>
                </TouchableOpacity>
              </View>

              {/* Warnings */}
              {selectedRoute.warnings.length > 0 && (
                <>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Warnings</Text>
                  {selectedRoute.warnings.map((warning, index) => (
                    <View key={index} style={[styles.activityCard, { backgroundColor: colors.surface }]}>
                      <View style={styles.warningRow}>
                        <View style={[styles.warningDot, { backgroundColor: getSeverityColor(warning.severity) }]} />
                        <View style={styles.warningContent}>
                          <Text style={[styles.activityCategory, { color: colors.text }]}>{warning.message}</Text>
                          <Text style={[styles.activityTime, { color: colors.textSecondary }]}>
                            Severity: {warning.severity}/100
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </>
              )}
            </>
          ) : (
            <>
              {/* Safety Score Card */}
              <View style={[styles.scoreCard, { backgroundColor: colors.surface }]}>
                <View style={styles.scoreHeader}>
                  <Text style={[styles.scoreTitle, { color: colors.textSecondary }]}>
                    {speedData?.road_name || 'Default Pune Road Segment'}
                  </Text>
                  <View style={styles.scoreRow}>
                    <Text style={[styles.scoreValue, { color: safety.color }]}>
                      {speedData ? (speedData.risk_score / 10).toFixed(1) : '-.-'}
                    </Text>
                    <Text style={[styles.scoreMax, { color: colors.textSecondary }]}>/10</Text>
                  </View>
                </View>
                <Text style={[styles.scoreLabel, { color: safety.color }]}>{safety.text}</Text>

                {speedData && (
                  <Text style={[styles.scoreDetails, { color: colors.textSecondary }]}>
                    Speed limit {speedData.updated_speed_kmh.toFixed(1)} km/h, risk {speedData.risk_score.toFixed(1)}
                  </Text>
                )}

                <TouchableOpacity
                  style={styles.compareButton}
                  onPress={() => navigation.navigate('RouteComparison')}
                >
                  <Text style={[styles.compareText, { color: colors.primary }]}>Compare routes</Text>
                </TouchableOpacity>
              </View>

              {/* Nearby Activity */}
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Nearby Activity</Text>

              {nearbyReports.length === 0 ? (
                <View style={[styles.activityCard, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                    No recent reports in this area
                  </Text>
                </View>
              ) : (
                nearbyReports.map((report, index) => (
                  <View key={index} style={[styles.activityCard, { backgroundColor: colors.surface }]}>
                    <View style={styles.activityRow}>
                      <View style={styles.activityLeft}>
                        <Text style={[styles.activityCategory, { color: colors.text }]}>
                          Category {report.category_id}
                        </Text>
                        <Text style={[styles.activityTime, { color: colors.textSecondary }]}>
                          {formatTimeAgo(report.created_at || '')}
                        </Text>
                      </View>
                      <View style={styles.activityRight}>
                        <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
                      </View>
                    </View>
                  </View>
                ))
              )}
            </>
          )}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },

  // Search bar
  searchContainer: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
    zIndex: 10,
  },
  searchCard: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  dotIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  searchDivider: {
    height: 1,
    marginLeft: 20,
  },
  settingsButton: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
  },
  searchText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },

  // Markers
  fromMarkerContainer: {
    alignItems: 'center',
  },
  fromMarkerDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  fromMarkerInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFF',
  },
  warningMarker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9800',
    borderWidth: 2,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  warningMarkerText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
  },

  // Find route button
  findRouteContainer: {
    position: 'absolute',
    bottom: BOTTOM_SHEET_MIN_HEIGHT + 20,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  findRouteButton: {
    backgroundColor: '#1A73E8',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#1A73E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  findRouteText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },

  // Loading
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  loadingCard: {
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: '600',
  },

  // Bottom sheet
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 16,
  },
  dragHandle: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  sheetContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // Score card
  scoreCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  scoreTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    marginRight: 12,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: '700',
  },
  scoreMax: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 2,
  },
  scoreLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  scoreDetails: {
    fontSize: 13,
    marginBottom: 16,
  },
  compareButton: {
    paddingVertical: 4,
  },
  compareText: {
    fontSize: 15,
    fontWeight: '600',
  },

  // Activity section
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  activityCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activityLeft: {
    flex: 1,
  },
  activityCategory: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 13,
  },
  activityRight: {},
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },

  // Warning row
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  warningDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  warningContent: {
    flex: 1,
  },
});
