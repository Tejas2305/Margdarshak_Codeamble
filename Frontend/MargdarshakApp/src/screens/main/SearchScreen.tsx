import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { theme } from '../../theme';

// Mock search data
const recentSearches = [
  { id: '1', query: 'Downtown Mall', icon: '🏬', type: 'place' },
  { id: '2', query: 'Central Park', icon: '🌳', type: 'place' },
  { id: '3', query: 'Railway Station', icon: '🚉', type: 'place' },
];

const popularPlaces = [
  {
    id: '1',
    name: 'City Hospital',
    address: '123 Main Street',
    distance: '2.5 km',
    safetyScore: 9.2,
    icon: '🏥',
  },
  {
    id: '2',
    name: 'Central Mall',
    address: '456 Shopping District',
    distance: '1.8 km',
    safetyScore: 8.7,
    icon: '🏬',
  },
  {
    id: '3',
    name: 'University Campus',
    address: '789 Education Lane',
    distance: '3.2 km',
    safetyScore: 9.5,
    icon: '🎓',
  },
  {
    id: '4',
    name: 'Police Station',
    address: '321 Safety Road',
    distance: '0.8 km',
    safetyScore: 10.0,
    icon: '🚓',
  },
];

const categories = [
  { id: '1', name: 'Hospitals', icon: '🏥', color: '#F44336' },
  { id: '2', name: 'Police Stations', icon: '🚓', color: '#2196F3' },
  { id: '3', name: 'Safe Zones', icon: '🛡️', color: '#4CAF50' },
  { id: '4', name: 'Hotels', icon: '🏨', color: '#FF9800' },
  { id: '5', name: 'Restaurants', icon: '🍽️', color: '#FF5722' },
  { id: '6', name: 'ATMs', icon: '🏧', color: '#9C27B0' },
];

export default function SearchScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPlaces, setFilteredPlaces] = useState(popularPlaces);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredPlaces(popularPlaces);
    } else {
      const filtered = popularPlaces.filter(
        (place) =>
          place.name.toLowerCase().includes(query.toLowerCase()) ||
          place.address.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPlaces(filtered);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 9) return '#4CAF50';
    if (score >= 7) return '#FFC107';
    if (score >= 5) return '#FF9800';
    return '#F44336';
  };

  const handlePlaceSelect = (place: any) => {
    navigation.navigate('RouteComparison', { destination: place });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for places, addresses..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryCard, { borderColor: category.color }]}
              >
                <View
                  style={[
                    styles.categoryIcon,
                    { backgroundColor: category.color + '20' },
                  ]}
                >
                  <Text style={styles.categoryEmoji}>{category.icon}</Text>
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Searches */}
        {searchQuery === '' && recentSearches.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              <TouchableOpacity>
                <Text style={styles.clearText}>Clear All</Text>
              </TouchableOpacity>
            </View>
            {recentSearches.map((search) => (
              <TouchableOpacity key={search.id} style={styles.recentItem}>
                <Text style={styles.recentIcon}>{search.icon}</Text>
                <Text style={styles.recentText}>{search.query}</Text>
                <Text style={styles.recentArrow}>→</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Search Results / Popular Places */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {searchQuery === '' ? 'Popular Places' : 'Search Results'}
          </Text>
          {filteredPlaces.length > 0 ? (
            filteredPlaces.map((place) => (
              <TouchableOpacity
                key={place.id}
                style={styles.placeCard}
                onPress={() => handlePlaceSelect(place)}
              >
                <View style={styles.placeIconContainer}>
                  <Text style={styles.placeIcon}>{place.icon}</Text>
                </View>
                <View style={styles.placeDetails}>
                  <Text style={styles.placeName}>{place.name}</Text>
                  <Text style={styles.placeAddress}>{place.address}</Text>
                  <View style={styles.placeMetrics}>
                    <View style={styles.placeMetric}>
                      <Text style={styles.metricIcon}>📏</Text>
                      <Text style={styles.metricText}>{place.distance}</Text>
                    </View>
                    <View style={styles.placeMetric}>
                      <Text style={styles.metricIcon}>🛡️</Text>
                      <Text
                        style={[
                          styles.metricText,
                          { color: getScoreColor(place.safetyScore) },
                        ]}
                      >
                        {place.safetyScore}/10
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.placeArrow}>→</Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptyDescription}>
                Try searching for different places or addresses
              </Text>
            </View>
          )}
        </View>

        {/* Safety Tips */}
        {searchQuery === '' && (
          <View style={styles.tipsCard}>
            <Text style={styles.tipsIcon}>💡</Text>
            <View style={styles.tipsContent}>
              <Text style={styles.tipsTitle}>Safety Tip</Text>
              <Text style={styles.tipsText}>
                Always check the safety score before visiting new places. Green scores
                (8-10) indicate well-lit, patrolled areas with low crime rates.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.surface,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: theme.colors.text,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
  },
  clearIcon: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 12,
  },
  clearText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '31%',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  recentIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  recentText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
  },
  recentArrow: {
    fontSize: 20,
    color: theme.colors.textSecondary,
  },
  placeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  placeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  placeIcon: {
    fontSize: 28,
  },
  placeDetails: {
    flex: 1,
  },
  placeName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  placeAddress: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  placeMetrics: {
    flexDirection: 'row',
    gap: 16,
  },
  placeMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricIcon: {
    fontSize: 14,
  },
  metricText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
  },
  placeArrow: {
    fontSize: 24,
    color: theme.colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  tipsCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: theme.colors.primary + '40',
  },
  tipsIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  tipsContent: {
    flex: 1,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  tipsText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
});
