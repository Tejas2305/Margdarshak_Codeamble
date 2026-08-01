import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme';

const { width, height } = Dimensions.get('window');

// Mock route data
const routes = {
  safest: {
    id: 'safest',
    name: 'Safest Route',
    safetyScore: 9.5,
    distance: '5.2 km',
    duration: '18 mins',
    color: '#4CAF50',
    features: ['Well-lit streets', 'High patrol', 'CCTV coverage', 'Low crime rate'],
  },
  fastest: {
    id: 'fastest',
    name: 'Fastest Route',
    safetyScore: 4.2,
    distance: '3.8 km',
    duration: '12 mins',
    color: '#9E9E9E',
    features: ['Shorter distance', 'Less traffic', 'Highway route', 'Faster ETA'],
  },
  balanced: {
    id: 'balanced',
    name: 'Balanced Route',
    safetyScore: 7.8,
    distance: '4.5 km',
    duration: '15 mins',
    color: '#2196F3',
    features: ['Good safety', 'Moderate traffic', 'Mixed lighting', 'Reasonable time'],
  },
};

export default function RouteComparisonScreen({ navigation }: any) {
  const [selectedRoute, setSelectedRoute] = useState<string>('safest');

  const handleStartNavigation = () => {
    const route = routes[selectedRoute as keyof typeof routes];
    Alert.alert(
      'Start Navigation',
      `Navigate via ${route.name}?\n\nSafety Score: ${route.safetyScore}/10\nDistance: ${route.distance}\nETA: ${route.duration}`,
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

  const getScoreColor = (score: number) => {
    if (score >= 8) return '#4CAF50';
    if (score >= 6) return '#FFC107';
    if (score >= 4) return '#FF9800';
    return '#F44336';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Map Placeholder */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapIcon}>🗺️</Text>
        <Text style={styles.mapText}>Route Map</Text>
        <Text style={styles.mapSubtext}>3 routes displayed with safety scores</Text>
        <View style={styles.routeColors}>
          <View style={styles.routeColorItem}>
            <View style={[styles.colorDot, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.colorText}>Safest</Text>
          </View>
          <View style={styles.routeColorItem}>
            <View style={[styles.colorDot, { backgroundColor: '#2196F3' }]} />
            <Text style={styles.colorText}>Balanced</Text>
          </View>
          <View style={styles.routeColorItem}>
            <View style={[styles.colorDot, { backgroundColor: '#9E9E9E' }]} />
            <Text style={styles.colorText}>Fastest</Text>
          </View>
        </View>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Compare Routes</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Route Cards */}
      <ScrollView
        horizontal
        style={styles.routesScroll}
        contentContainerStyle={styles.routesContent}
        showsHorizontalScrollIndicator={false}
      >
        {Object.values(routes).map((route) => {
          const isSelected = selectedRoute === route.id;
          const scoreColor = getScoreColor(route.safetyScore);

          return (
            <TouchableOpacity
              key={route.id}
              style={[
                styles.routeCard,
                isSelected && styles.routeCardSelected,
                { borderColor: route.color },
              ]}
              onPress={() => setSelectedRoute(route.id)}
            >
              <View style={styles.routeHeader}>
                <Text style={styles.routeName}>{route.name}</Text>
                {isSelected && (
                  <View style={[styles.selectedBadge, { backgroundColor: route.color }]}>
                    <Text style={styles.selectedBadgeText}>✓</Text>
                  </View>
                )}
              </View>

              {/* Safety Score */}
              <View style={styles.scoreContainer}>
                <View style={[styles.scoreCircle, { borderColor: scoreColor }]}>
                  <Text style={[styles.scoreValue, { color: scoreColor }]}>
                    {route.safetyScore}
                  </Text>
                  <Text style={styles.scoreMax}>/10</Text>
                </View>
                <View style={styles.scoreDetails}>
                  <View style={styles.routeStat}>
                    <Text style={styles.routeStatIcon}>📏</Text>
                    <Text style={styles.routeStatValue}>{route.distance}</Text>
                  </View>
                  <View style={styles.routeStat}>
                    <Text style={styles.routeStatIcon}>⏱️</Text>
                    <Text style={styles.routeStatValue}>{route.duration}</Text>
                  </View>
                </View>
              </View>

              {/* Features */}
              <View style={styles.features}>
                {route.features.map((feature, index) => (
                  <View key={index} style={styles.feature}>
                    <Text style={styles.featureDot}>•</Text>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              {/* Route Color Indicator */}
              <View style={[styles.routeIndicator, { backgroundColor: route.color }]} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Start Navigation Button */}
      <View style={styles.bottomContainer}>
        <LinearGradient
          colors={[theme.colors.primary, '#5E35B1']}
          style={styles.startButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableOpacity
            style={styles.startButtonInner}
            onPress={handleStartNavigation}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonIcon}>🧭</Text>
            <Text style={styles.startButtonText}>Start Navigation</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Route Info Summary */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>🛡️</Text>
            <Text style={styles.infoText}>
              {routes[selectedRoute as keyof typeof routes].safetyScore}/10 Safety
            </Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>🚗</Text>
            <Text style={styles.infoText}>
              {routes[selectedRoute as keyof typeof routes].duration} ETA
            </Text>
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
    height: height * 0.5,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  mapIcon: {
    fontSize: 64,
    marginBottom: 12,
  },
  mapText: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 6,
  },
  mapSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 16,
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: theme.colors.text,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  placeholder: {
    width: 40,
  },
  routesScroll: {
    position: 'absolute',
    top: height * 0.5 - 100,
    left: 0,
    right: 0,
  },
  routesContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  routeCard: {
    width: width * 0.7,
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 3,
    borderColor: theme.colors.border,
    ...theme.shadows.large,
  },
  routeCardSelected: {
    borderWidth: 4,
    transform: [{ scale: 1.05 }],
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  routeName: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text,
  },
  selectedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBadgeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  scoreCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  scoreMax: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginTop: -4,
  },
  scoreDetails: {
    flex: 1,
    gap: 8,
  },
  routeStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeStatIcon: {
    fontSize: 18,
  },
  routeStatValue: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
  },
  features: {
    gap: 8,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureDot: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  featureText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  routeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 6,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  },
  startButton: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
    ...theme.shadows.large,
  },
  startButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 12,
  },
  startButtonIcon: {
    fontSize: 24,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  infoRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoIcon: {
    fontSize: 20,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  infoDivider: {
    width: 1,
    height: 24,
    backgroundColor: theme.colors.border,
  },
});
