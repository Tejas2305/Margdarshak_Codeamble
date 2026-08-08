import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../theme';
import { mapService } from '../../services/api';
import { PlaceResult } from '../../services/api/types';

export default function SearchScreen({ navigation, route }: any) {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const searchType = route?.params?.searchType || 'to'; // 'from' or 'to'
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PlaceResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const response = await mapService.searchPlaces(
        query,
        undefined,
        undefined,
        10
      );
      setSearchResults(response.results);
    } catch (error: any) {
      console.error('Search error:', error);
      Alert.alert(
        'Search Failed',
        error?.response?.data?.detail || 'Unable to search places right now.'
      );
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectPlace = (place: PlaceResult) => {
    // Navigate back to Map tab, passing the selected place
    navigation.navigate('MainTabs', {
      screen: 'Map',
      params: {
        selectedPlace: {
          name: place.name.split(',')[0],
          fullName: place.name,
          lat: place.lat,
          lng: place.lng,
        },
        searchType,
      },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, { backgroundColor: colors.background }]}>
          <MaterialCommunityIcons name="arrow-left" size={20} color={colors.text} />
        </TouchableOpacity>
        <View style={[styles.searchBar, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <MaterialCommunityIcons 
            name={searchType === 'from' ? 'circle-outline' : 'map-marker'} 
            size={18} 
            color={searchType === 'from' ? colors.primary : '#EA4335'} 
          />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder={searchType === 'from' ? 'Search starting point...' : 'Search destination...'}
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <MaterialCommunityIcons name="close" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Loading State */}
        {isSearching && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Searching...</Text>
          </View>
        )}

        {/* Search Results */}
        {!isSearching && searchQuery !== '' && searchResults.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Results for "{searchQuery}"</Text>
            {searchResults.map((place, index) => (
              <TouchableOpacity 
                key={place.place_id || index}
                style={[styles.resultRow, { backgroundColor: colors.surface }]}
                onPress={() => handleSelectPlace(place)}
              >
                <View style={[styles.iconCircle, { backgroundColor: colors.surfaceVariant }]}>
                  <MaterialCommunityIcons name="map-marker" size={20} color={colors.primary} />
                </View>
                <View style={styles.resultTextContainer}>
                  <Text style={[styles.resultName, { color: colors.text }]} numberOfLines={1}>
                    {place.name.split(',')[0]}
                  </Text>
                  <Text style={[styles.resultAddress, { color: colors.textSecondary }]} numberOfLines={2}>
                    {place.address || place.name}
                  </Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* No Results */}
        {!isSearching && searchQuery !== '' && searchResults.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="map-search-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No places found</Text>
            <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
              Try searching with different keywords
            </Text>
          </View>
        )}

        {/* Initial State */}
        {searchQuery === '' && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="magnify" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              Search for a {searchType === 'from' ? 'starting point' : 'destination'}
            </Text>
            <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
              Type a place name, address, or landmark
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resultTextContainer: {
    flex: 1,
  },
  resultName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  resultAddress: {
    fontSize: 13,
    fontWeight: '400',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 14,
    marginTop: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 16,
  },
  emptyDescription: {
    fontSize: 13,
    textAlign: 'center',
  },
});
