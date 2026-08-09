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
  View,
  Pressable,
} from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring 
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ShoppingBag,
  UserX,
  Eye,
  Car,
  Construction,
  Flame,
  Moon,
  Dog,
  AlertCircle,
  Shield,
  MapPin,
  Camera,
  X,
} from 'lucide-react-native';
import { Card, Button } from '../../components';
import { useTheme } from '../../contexts/ThemeContext';
import { getTheme } from '../../theme/theme';
import { reportService } from '../../services/api';
import { Category } from '../../services/api/types';

const DEFAULT_LOCATION = {
  latitude: 18.5204,
  longitude: 73.8567,
};

// Category visual mapping with lucide icons
const categoryVisuals = [
  { icon: ShoppingBag, color: '#2196F3', name: 'Theft' },          // Blue
  { icon: UserX, color: '#E91E63', name: 'Harassment' },           // Pink
  { icon: Eye, color: '#FF9800', name: 'Following' },              // Orange
  { icon: Car, color: '#F44336', name: 'Attack' },                 // Red
  { icon: Construction, color: '#9C27B0', name: 'Road Issue' },    // Purple
  { icon: Flame, color: '#F44336', name: 'Fire' },                 // Red
  { icon: Moon, color: '#607D8B', name: 'Night Safety' },          // Blue Grey
  { icon: Dog, color: '#795548', name: 'Animal' },                 // Brown
  { icon: AlertCircle, color: '#FF9800', name: 'Other' },          // Orange
  { icon: Shield, color: '#009688', name: 'Security' },            // Teal
];

// Animated Card Component with Press Scale
const CategoryCard = ({ 
  category, 
  visual, 
  isSelected, 
  onPress, 
  theme 
}: any) => {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const handlePressIn = () => {
    scale.value = withSpring(0.95, {
      damping: 15,
      stiffness: 200,
    });
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 200,
    });
  };
  
  const IconComponent = visual.icon;
  
  return (
    <Animated.View style={[styles.categoryCardWrapper, animatedStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Card 
          style={[
            styles.categoryCard,
            isSelected && {
              borderWidth: 2,
              borderColor: visual.color,
            },
          ]}
        >
          {/* Icon */}
          <View 
            style={[
              styles.iconCircle, 
              { backgroundColor: `${visual.color}15` }
            ]}
          >
            <IconComponent 
              size={28} 
              color={visual.color} 
              strokeWidth={2}
            />
          </View>
          
          {/* Title */}
          <Text 
            style={[
              theme.typography.label,
              { 
                color: theme.colors.textPrimary,
                marginTop: theme.spacing.md,
                textAlign: 'center',
              }
            ]}
          >
            {category.name}
          </Text>
          
          {/* Description */}
          <Text 
            style={[
              theme.typography.caption,
              { 
                color: theme.colors.textMuted,
                marginTop: theme.spacing.xs,
                textAlign: 'center',
              }
            ]}
            numberOfLines={2}
          >
            {category.description}
          </Text>
          
          {/* Selected Badge */}
          {isSelected && (
            <View 
              style={[
                styles.selectedBadge, 
                { backgroundColor: visual.color }
              ]}
            >
              <Text style={styles.selectedBadgeText}>✓</Text>
            </View>
          )}
        </Card>
      </Pressable>
    </Animated.View>
  );
};

export default function ReportsScreen({ navigation, route }: any) {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [location, setLocation] = useState('Current Location');
  const [coordinates, setCoordinates] = useState(DEFAULT_LOCATION);
  const [description, setDescription] = useState('');
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

    try {
      setIsSubmitting(true);
      const reportData = {
        category_id: selectedCategory,
        user_rating: severityRating,
        description: description.trim() || null,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      };
      
      if (photos.length > 0) {
        await reportService.createReportWithImage(reportData, photos[0]);
      } else {
        await reportService.createReport(reportData);
      }

      Alert.alert('Report Submitted', 'Thank you for reporting. Your report helps keep the community safe.', [
        {
          text: 'OK',
          onPress: () => {
            setSelectedCategory(null);
            setDescription('');
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

  const handleAddPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant photo library access to add images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhotos([...photos, result.assets[0].uri]);
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to pick image');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[theme.typography.heading1, { color: theme.colors.textPrimary }]}>
          Report Incident
        </Text>
        <Text style={[theme.typography.body, { color: theme.colors.textSecondary, marginTop: theme.spacing.xs }]}>
          Help keep your community safe
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Categories Grid */}
        <View style={styles.section}>
          <Text style={[theme.typography.heading3, { color: theme.colors.textPrimary, marginBottom: theme.spacing.md }]}>
            What happened?
          </Text>
          {isLoadingCategories ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : (
            <View style={styles.categoriesGrid}>
              {categories.map((category, index) => {
                const visual = categoryVisuals[index % categoryVisuals.length];
                return (
                  <CategoryCard
                    key={category.category_id}
                    category={category}
                    visual={visual}
                    isSelected={selectedCategory === category.category_id}
                    onPress={() => setSelectedCategory(category.category_id)}
                    theme={theme}
                  />
                );
              })}
            </View>
          )}
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={[theme.typography.heading3, { color: theme.colors.textPrimary, marginBottom: theme.spacing.md }]}>
            Location
          </Text>
          <Pressable onPress={loadCurrentLocation}>
            <Card>
              <View style={styles.locationRow}>
                <MapPin size={20} color={theme.colors.primary} />
                <View style={styles.locationTextContainer}>
                  <Text style={[theme.typography.body, { color: theme.colors.textPrimary }]}>
                    {location}
                  </Text>
                  <Text style={[theme.typography.caption, { color: theme.colors.textMuted, marginTop: 2 }]}>
                    Tap to refresh current location
                  </Text>
                </View>
              </View>
            </Card>
          </Pressable>
          
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, textAlign: 'center', marginVertical: theme.spacing.md }]}>
            OR
          </Text>
          
          <Button
            variant="secondary"
            icon={<MapPin size={18} color={theme.colors.primary} />}
            onPress={() => navigation.navigate('LocationPicker')}
          >
            Choose on map
          </Button>
        </View>

        {/* Severity */}
        <View style={styles.section}>
          <Text style={[theme.typography.heading3, { color: theme.colors.textPrimary, marginBottom: theme.spacing.md }]}>
            Severity
          </Text>
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((rating) => (
              <Pressable
                key={rating}
                onPress={() => setSeverityRating(rating)}
                style={({ pressed }) => [
                  styles.ratingButton,
                  {
                    backgroundColor: severityRating === rating ? theme.colors.primary : theme.colors.surface,
                    borderColor: severityRating === rating ? theme.colors.primary : theme.colors.border,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Text 
                  style={[
                    theme.typography.button,
                    { 
                      color: severityRating === rating ? '#FFFFFF' : theme.colors.textPrimary 
                    }
                  ]}
                >
                  {rating}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={[theme.typography.heading3, { color: theme.colors.textPrimary, marginBottom: theme.spacing.md }]}>
            Description
          </Text>
          <TextInput
            style={[
              styles.textArea,
              theme.typography.body,
              { 
                backgroundColor: theme.colors.surface, 
                color: theme.colors.textPrimary, 
                borderColor: theme.colors.border 
              },
            ]}
            placeholder="Describe what happened in detail..."
            placeholderTextColor={theme.colors.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={[theme.typography.caption, { color: theme.colors.textMuted, textAlign: 'right', marginTop: theme.spacing.xs }]}>
            {description.length}/500
          </Text>
        </View>

        {/* Photos */}
        <View style={styles.section}>
          <Text style={[theme.typography.heading3, { color: theme.colors.textPrimary, marginBottom: theme.spacing.md }]}>
            Add Photos (Optional)
          </Text>
          <View style={styles.photoGrid}>
            {photos.map((photo, index) => (
              <View key={photo} style={styles.photoItem}>
                <Image source={{ uri: photo }} style={styles.photoImage} />
                <Pressable
                  style={[styles.photoRemove, { backgroundColor: theme.colors.danger }]}
                  onPress={() => setPhotos(photos.filter((_, i) => i !== index))}
                >
                  <X size={14} color="#FFF" strokeWidth={3} />
                </Pressable>
              </View>
            ))}
            {photos.length < 4 && (
              <Pressable onPress={handleAddPhoto}>
                <Card noPadding style={styles.photoAdd}>
                  <Camera size={24} color={theme.colors.textMuted} />
                  <Text style={[theme.typography.caption, { color: theme.colors.textMuted, marginTop: theme.spacing.xs }]}>
                    Add
                  </Text>
                </Card>
              </Pressable>
            )}
          </View>
          <Text style={[theme.typography.caption, { color: theme.colors.textMuted, marginTop: theme.spacing.sm }]}>
            You can add up to 4 photos
          </Text>
        </View>

        {/* Submit Button */}
        <Button
          variant="primary"
          size="large"
          fullWidth
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Submit Report
        </Button>

        {/* Help Text */}
        <Text style={[theme.typography.caption, { color: theme.colors.textMuted, textAlign: 'center', marginTop: theme.spacing.lg, lineHeight: 18 }]}>
          Reports are reviewed by our team and shared with local authorities when necessary. 
          False reports may result in account suspension.
        </Text>

        {/* Bottom spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCardWrapper: {
    width: '48%',
  },
  categoryCard: {
    alignItems: 'center',
    paddingVertical: 20,
    position: 'relative',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  locationTextContainer: {
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 12,
  },
  ratingButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textArea: {
    borderRadius: 16,
    padding: 16,
    minHeight: 140,
    borderWidth: 1,
  },
  photoGrid: {
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
  photoAdd: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#E0E0E0',
  },
  anonymousRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  anonymousTextContainer: {
    flex: 1,
    marginRight: 16,
  },
});
