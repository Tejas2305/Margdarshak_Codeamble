import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../theme';
import { reportService } from '../../services/api';
import { Category } from '../../services/api/types';

const DEFAULT_LOCATION = {
  latitude: 18.5204,
  longitude: 73.8567,
};

const categoryStyles = [
  { icon: 'bag-personal' as const, color: '#5B8DEE' },
  { icon: 'account-alert' as const, color: '#E85D75' },
  { icon: 'eye-outline' as const, color: '#F59E42' },
  { icon: 'car-side' as const, color: '#E8684A' },
  { icon: 'road-variant' as const, color: '#9B87C7' },
  { icon: 'fire' as const, color: '#E85D5D' },
  { icon: 'weather-night' as const, color: '#607D8B' },
  { icon: 'dog' as const, color: '#795548' },
  { icon: 'alert-circle-outline' as const, color: '#FF9800' },
  { icon: 'shield-alert-outline' as const, color: '#009688' },
];

export default function ReportsScreen({ navigation, route }: any) {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [location, setLocation] = useState('Current Location');
  const [coordinates, setCoordinates] = useState(DEFAULT_LOCATION);
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [severityRating, setSeverityRating] = useState(5);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadCategories();
    loadCurrentLocation();
  }, []);

  // Handle location selected from LocationPicker
  useEffect(() => {
    if (route?.params?.selectedLocation) {
      const loc = route.params.selectedLocation;
      setCoordinates({ latitude: loc.lat, longitude: loc.lng });
      setLocation(loc.name);
      // Clear the param
      navigation.setParams({ selectedLocation: undefined });
    }
  }, [route?.params?.selectedLocation]);

  const loadCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const result = await reportService.getCategories();
      setCategories(result);
    } catch (error: any) {
      Alert.alert('Unable to Load Categories', error?.response?.data?.detail || 'Please log in and try again.');
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const loadCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocation('Pune default location');
        return;
      }

      const currentPosition = await Location.getCurrentPositionAsync({});
      const nextCoordinates = {
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude,
      };

      setCoordinates(nextCoordinates);
      setLocation(`${nextCoordinates.latitude.toFixed(5)}, ${nextCoordinates.longitude.toFixed(5)}`);
    } catch {
      setLocation('Pune default location');
    }
  };

  const handleSubmit = async () => {
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select an incident category');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please provide a description');
      return;
    }

    try {
      setIsSubmitting(true);
      await reportService.createReport({
        category_id: selectedCategory,
        user_rating: severityRating,
        description: description.trim(),
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      });

      Alert.alert('Report Submitted', 'Thank you for reporting. Your report helps keep the community safe.', [
        {
          text: 'OK',
          onPress: () => {
            setSelectedCategory(null);
            setDescription('');
            setIsAnonymous(false);
            setPhotos([]);
            setSeverityRating(5);
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Submission Failed', error?.response?.data?.detail || 'Unable to submit report right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Report Incident</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Help keep your community safe</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>What happened?</Text>
          {isLoadingCategories ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <View style={styles.categoriesGrid}>
              {categories.map((category, index) => {
                const visual = categoryStyles[index % categoryStyles.length];

                return (
                  <TouchableOpacity
                    key={category.category_id}
                    style={[
                      styles.categoryCard,
                      { backgroundColor: colors.surface, borderColor: colors.border },
                      selectedCategory === category.category_id && [
                        styles.categoryCardSelected,
                        { borderColor: visual.color },
                      ],
                    ]}
                    onPress={() => setSelectedCategory(category.category_id)}
                  >
                    <View style={[styles.categoryIconContainer, { backgroundColor: visual.color + '15' }]}>
                      <MaterialCommunityIcons name={visual.icon as any} size={28} color={visual.color} />
                    </View>
                    <Text style={[styles.categoryName, { color: colors.text }]}>{category.name}</Text>
                    <Text style={[styles.categoryDescription, { color: colors.textSecondary }]}>
                      {category.description}
                    </Text>
                    {selectedCategory === category.category_id && (
                      <View style={[styles.selectedBadge, { backgroundColor: visual.color }]}>
                        <Text style={styles.selectedBadgeText}>OK</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Location</Text>
          <TouchableOpacity
            style={[styles.locationCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={loadCurrentLocation}
          >
            <View style={styles.locationDetails}>
              <MaterialCommunityIcons name="crosshairs-gps" size={20} color={colors.primary} style={{ marginBottom: 8 }} />
              <Text style={[styles.locationText, { color: colors.text }]}>{location}</Text>
              <Text style={[styles.locationSubtext, { color: colors.textSecondary }]}>Tap to refresh current location</Text>
            </View>
          </TouchableOpacity>
          
          <Text style={[styles.orText, { color: colors.textSecondary }]}>OR</Text>
          
          <TouchableOpacity
            style={[styles.searchLocationButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => navigation.navigate('LocationPicker')}
          >
            <MaterialCommunityIcons name="map-marker-plus" size={20} color={colors.primary} />
            <Text style={[styles.searchLocationText, { color: colors.text }]}>Choose incident location on map</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Severity</Text>
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((rating) => (
              <TouchableOpacity
                key={rating}
                style={[
                  styles.ratingButton,
                  { borderColor: colors.border, backgroundColor: colors.surface },
                  severityRating === rating && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
                onPress={() => setSeverityRating(rating)}
              >
                <Text style={[styles.ratingText, { color: severityRating === rating ? '#FFFFFF' : colors.text }]}>
                  {rating}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
          <TextInput
            style={[
              styles.textArea,
              { backgroundColor: colors.surfaceVariant, color: colors.text, borderColor: colors.border },
            ]}
            placeholder="Describe what happened in detail..."
            placeholderTextColor={colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
          <Text style={[styles.charCount, { color: colors.textSecondary }]}>{description.length}/500</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Add Photos (Optional)</Text>
          <View style={styles.photoContainer}>
            {photos.map((photo, index) => (
              <View key={photo} style={styles.photoItem}>
                <Image source={{ uri: photo }} style={styles.photoImage} />
                <TouchableOpacity
                  style={[styles.photoRemove, { backgroundColor: colors.textSecondary }]}
                  onPress={() => setPhotos(photos.filter((_, itemIndex) => itemIndex !== index))}
                >
                  <Text style={styles.photoRemoveText}>x</Text>
                </TouchableOpacity>
              </View>
            ))}
            {photos.length < 4 && (
              <TouchableOpacity
                style={[styles.photoAdd, { borderColor: colors.border, backgroundColor: colors.surface }]}
                onPress={() => Alert.alert('Photo Upload', 'Camera/Gallery picker will open here')}
              >
                <Text style={[styles.photoAddText, { color: colors.textSecondary }]}>+ Add Photo</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={[styles.photoHint, { color: colors.textSecondary }]}>You can add up to 4 photos</Text>
        </View>

        <View style={styles.section}>
          <View style={[styles.anonymousCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.anonymousLeft}>
              <View style={styles.anonymousTextContainer}>
                <Text style={[styles.anonymousTitle, { color: colors.text }]}>Report Anonymously</Text>
                <Text style={[styles.anonymousDescription, { color: colors.textSecondary }]}>
                  Your identity will remain hidden
                </Text>
              </View>
            </View>
            <Switch
              value={isAnonymous}
              onValueChange={setIsAnonymous}
              trackColor={{ false: colors.border, true: '#5B8DEE' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>{isSubmitting ? 'Submitting...' : 'Submit Report'}</Text>
        </TouchableOpacity>

        <Text style={[styles.helpText, { color: colors.textSecondary }]}>
          Reports are reviewed by our team and shared with local authorities when necessary. False reports may result
          in account suspension.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '400',
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '400',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '400',
    marginBottom: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    position: 'relative',
  },
  categoryCardSelected: {
    borderWidth: 2,
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 4,
    textAlign: 'center',
  },
  categoryDescription: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    minWidth: 24,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  selectedBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '400',
  },
  locationCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  locationDetails: {
    flex: 1,
  },
  locationText: {
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 4,
  },
  locationSubtext: {
    fontSize: 13,
    fontWeight: '400',
  },
  orText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    marginVertical: 12,
  },
  searchLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    gap: 10,
  },
  searchLocationText: {
    fontSize: 15,
    fontWeight: '500',
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 10,
  },
  ratingButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingText: {
    fontSize: 15,
    fontWeight: '400',
  },
  textArea: {
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    fontWeight: '400',
    minHeight: 140,
    borderWidth: 1,
  },
  charCount: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'right',
    marginTop: 8,
  },
  photoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoItem: {
    width: 80,
    height: 80,
    borderRadius: 12,
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  photoRemove: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoRemoveText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '400',
  },
  photoAdd: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoAddText: {
    fontSize: 12,
    fontWeight: '400',
  },
  photoHint: {
    fontSize: 12,
    fontWeight: '400',
    marginTop: 8,
  },
  anonymousCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  anonymousLeft: {
    flex: 1,
    marginRight: 16,
  },
  anonymousTextContainer: {
    flex: 1,
  },
  anonymousTitle: {
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 4,
  },
  anonymousDescription: {
    fontSize: 13,
    fontWeight: '400',
  },
  submitButton: {
    backgroundColor: '#5B8DEE',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#FFFFFF',
  },
  helpText: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
});
