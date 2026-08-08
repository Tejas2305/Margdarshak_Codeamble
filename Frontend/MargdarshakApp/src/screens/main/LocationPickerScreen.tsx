import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../theme';
import { mapService } from '../../services/api';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function LocationPickerScreen({ navigation, route }: any) {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const webViewRef = useRef<WebView>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
  } | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setIsSearching(true);
      const response = await mapService.searchPlaces(searchQuery, undefined, undefined, 5);
      
      if (response.results.length > 0) {
        const firstResult = response.results[0];
        const location = {
          lat: firstResult.lat,
          lng: firstResult.lng,
          name: firstResult.name.split(',')[0],
        };
        
        setSelectedLocation(location);
        
        // Move map to searched location
        if (webViewRef.current) {
          webViewRef.current.injectJavaScript(`
            if (window.marker) {
              map.removeLayer(window.marker);
            }
            
            var icon = L.divIcon({
              html: '<div style="background: #EA4335; width: 32px; height: 32px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.4);"></div>',
              iconSize: [32, 32],
              iconAnchor: [16, 16],
              className: 'incident-marker'
            });
            
            window.marker = L.marker([${location.lat}, ${location.lng}], { 
              icon: icon,
              draggable: true 
            }).addTo(map);
            
            window.marker.on('dragend', function(e) {
              var pos = e.target.getLatLng();
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'markerMoved',
                lat: pos.lat,
                lng: pos.lng
              }));
            });
            
            map.flyTo([${location.lat}, ${location.lng}], 16, { duration: 1 });
          `);
        }
      } else {
        Alert.alert('No Results', 'No locations found for your search.');
      }
    } catch (error) {
      Alert.alert('Search Error', 'Unable to search locations right now.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleConfirm = () => {
    if (!selectedLocation) {
      Alert.alert('Select Location', 'Please tap on the map or search for a location first.');
      return;
    }

    // Navigate back to MainTabs -> Reports with the selected location
    navigation.navigate('MainTabs', {
      screen: 'Reports',
      params: {
        selectedLocation,
      },
    });
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; overflow: hidden; }
        #map { width: 100vw; height: 100vh; background: #E5E3DF; }
        .incident-marker { background: transparent !important; border: none !important; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map', {
          zoomControl: true,
          attributionControl: false
        }).setView([18.5204, 73.8567], 13);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          maxZoom: 19
        }).addTo(map);

        window.marker = null;

        // Click anywhere to place marker
        map.on('click', function(e) {
          if (window.marker) {
            map.removeLayer(window.marker);
          }
          
          var icon = L.divIcon({
            html: '<div style="background: #EA4335; width: 32px; height: 32px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.4);"></div>',
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            className: 'incident-marker'
          });
          
          window.marker = L.marker(e.latlng, { 
            icon: icon,
            draggable: true 
          }).addTo(map);
          
          window.marker.on('dragend', function(e) {
            var pos = e.target.getLatLng();
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'markerMoved',
              lat: pos.lat,
              lng: pos.lng
            }));
          });
          
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'markerPlaced',
            lat: e.latlng.lat,
            lng: e.latlng.lng
          }));
        });

        setTimeout(() => {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'mapReady' }));
        }, 500);
      </script>
    </body>
    </html>
  `;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Choose Location</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Tap on map or search
          </Text>
        </View>
        <TouchableOpacity 
          onPress={handleConfirm}
          style={[styles.confirmButton, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.confirmButtonText}>Done</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <View style={[styles.searchBar, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <MaterialCommunityIcons name="magnify" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search for location..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {isSearching && <ActivityIndicator size="small" color={colors.primary} />}
          {searchQuery.length > 0 && !isSearching && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialCommunityIcons name="close" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onMessage={(event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);
              if (data.type === 'markerPlaced' || data.type === 'markerMoved') {
                setSelectedLocation({
                  lat: data.lat,
                  lng: data.lng,
                  name: `${data.lat.toFixed(5)}, ${data.lng.toFixed(5)}`,
                });
              }
            } catch (e) {
              console.log('WebView message:', event.nativeEvent.data);
            }
          }}
        />
      </View>

      {/* Selected Location Info */}
      {selectedLocation && (
        <View style={[styles.locationInfo, { backgroundColor: colors.surface }]}>
          <MaterialCommunityIcons name="map-marker" size={24} color="#EA4335" />
          <View style={styles.locationTextContainer}>
            <Text style={[styles.locationName, { color: colors.text }]}>{selectedLocation.name}</Text>
            <Text style={[styles.locationCoords, { color: colors.textSecondary }]}>
              {selectedLocation.lat.toFixed(5)}, {selectedLocation.lng.toFixed(5)}
            </Text>
          </View>
        </View>
      )}

      {/* Instruction Hint */}
      <View style={[styles.hintContainer, { backgroundColor: colors.surface }]}>
        <MaterialCommunityIcons name="information-outline" size={18} color={colors.primary} />
        <Text style={[styles.hintText, { color: colors.textSecondary }]}>
          Tap anywhere on the map to mark incident location. You can drag the marker to adjust.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  confirmButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
  searchContainer: {
    padding: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  mapContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  locationCoords: {
    fontSize: 13,
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  hintText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
  },
});
