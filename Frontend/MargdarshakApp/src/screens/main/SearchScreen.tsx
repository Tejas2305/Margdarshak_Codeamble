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
  { id: '1', query: 'Downtown Mall', type: 'place' },
  { id: '2', query: 'Central Park', type: 'place' },
  { id: '3', query: 'Railway Station', type: 'place' },
];

const popularPlaces = [
  {
    id: '1',
    name: 'City Hospital',
    address: '123 Main Street',
    distance: '2.5 km',
    safetyScore: 9.2,
  },
  {
    id: '2',
    name: 'Central Mall',
    address: '456 Shopping District',
    distance: '1.8 km',
    safetyScore: 8.7,
  },
  {
    id: '3',
    name: 'University Campus',
    address: '789 Education Lane',
    distance: '3.2 km',
    safetyScore: 9.5,
  },
  {
    id: '4',
    name: 'Police Station',
    address: '321 Safety Road',
    distance: '0.8 km',
    safetyScore: 10.0,
  },
];

const categories = [
  { id: '1', name: 'Hospitals', initial: 'H', color: '#EA4335' },
  { id: '2', name: 'Police', initial: 'P', color: '#1A73E8' },
  { id: '3', name: 'Safe Zones', initial: 'S', color: '#34A853' },
  { id: '4', name: 'Hotels', initial: 'HO', color: '#FF9800' },
  { id: '5', name: 'Food', initial: 'F', color: '#FF5722' },
  { id: '6', name: 'ATMs', initial: 'A', color: '#9C27B0' },
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
          <TextInput
            style={styles.searchInput}
            placeholder="Search for places..."
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {categories.map((category) => (
              <TouchableOpacity key={category.id} style={styles.categoryRow}>
                <View style={[styles.categoryCircle, { backgroundColor: category.color }]}>
                  <Text style={styles.categoryInitial}>{category.initial}</Text>
                </View>
                <Text style={styles.categoryText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recent Searches */}
        {searchQuery === '' && recentSearches.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent</Text>
              <TouchableOpacity>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            </View>
            {recentSearches.map((search) => (
              <TouchableOpacity key={search.id} style={styles.recentRow}>
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
                style={styles.placeRow}
                onPress={() => handlePlaceSelect(place)}
              >
                <View style={styles.placeLeft}>
                  <Text style={styles.placeName}>{place.name}</Text>
                  <Text style={styles.placeAddress}>{place.address}</Text>
                </View>
                <View style={styles.placeRight}>
                  <Text style={styles.placeDistance}>{place.distance}</Text>
                  <Text
                    style={[
                      styles.placeScore,
                      { color: getScoreColor(place.safetyScore) },
                    ]}
                  >
                    {place.safetyScore}/10
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptyDescription}>
                Try searching for different places
              </Text>
            </View>
          )}
        </View>
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
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: theme.colors.text,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.text,
  },
  clearIcon: {
    fontSize: 16,
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
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 12,
  },
  clearText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  categoriesScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  categoryRow: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  categoryInitial: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    marginBottom: 8,
  },
  recentText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
  recentArrow: {
    fontSize: 18,
    color: theme.colors.textSecondary,
  },
  placeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    marginBottom: 8,
  },
  placeLeft: {
    flex: 1,
  },
  placeName: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  placeAddress: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  placeRight: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  placeDistance: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  placeScore: {
    fontSize: 13,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 6,
  },
  emptyDescription: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
