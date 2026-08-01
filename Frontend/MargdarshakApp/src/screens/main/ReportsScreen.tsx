import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Switch,
  Alert,
  StatusBar,
} from 'react-native';
import { theme } from '../../theme';

const incidentCategories = [
  { id: '1', name: 'Theft', icon: '🚨', color: '#FF4444', description: 'Report theft or robbery' },
  { id: '2', name: 'Harassment', icon: '⚠️', color: '#FF6B6B', description: 'Report harassment' },
  { id: '3', name: 'Suspicious Activity', icon: '👁️', color: '#FFA500', description: 'Report suspicious behavior' },
  { id: '4', name: 'Accident', icon: '🚗', color: '#FF8C00', description: 'Report traffic accident' },
  { id: '5', name: 'Road Block', icon: '🚧', color: '#FFC107', description: 'Report road blockage' },
  { id: '6', name: 'Fire', icon: '🔥', color: '#D32F2F', description: 'Report fire incident' },
];

export default function ReportsScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [location, setLocation] = useState('Current Location');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  const handleSubmit = () => {
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select an incident category');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please provide a description');
      return;
    }

    Alert.alert(
      'Report Submitted',
      'Thank you for reporting. Your report helps keep the community safe.',
      [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setSelectedCategory(null);
            setDescription('');
            setIsAnonymous(false);
            setPhotos([]);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Report Incident</Text>
        <Text style={styles.headerSubtitle}>Help keep your community safe</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What happened?</Text>
          <View style={styles.categoriesGrid}>
            {incidentCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  selectedCategory === category.id && styles.categoryCardSelected,
                  { borderColor: category.color },
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <View
                  style={[
                    styles.categoryIconContainer,
                    { backgroundColor: category.color + '20' },
                  ]}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryDescription}>{category.description}</Text>
                {selectedCategory === category.id && (
                  <View style={[styles.selectedBadge, { backgroundColor: category.color }]}>
                    <Text style={styles.selectedBadgeText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <TouchableOpacity style={styles.locationCard}>
            <Text style={styles.locationIcon}>📍</Text>
            <View style={styles.locationDetails}>
              <Text style={styles.locationText}>{location}</Text>
              <Text style={styles.locationSubtext}>Tap to change location</Text>
            </View>
            <Text style={styles.locationArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe what happened in detail..."
            placeholderTextColor={theme.colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{description.length}/500</Text>
        </View>

        {/* Photo Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Photos (Optional)</Text>
          <View style={styles.photoContainer}>
            {photos.map((photo, index) => (
              <View key={index} style={styles.photoItem}>
                <Image source={{ uri: photo }} style={styles.photoImage} />
                <TouchableOpacity
                  style={styles.photoRemove}
                  onPress={() => setPhotos(photos.filter((_, i) => i !== index))}
                >
                  <Text style={styles.photoRemoveText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
            {photos.length < 4 && (
              <TouchableOpacity
                style={styles.photoAdd}
                onPress={() => Alert.alert('Photo Upload', 'Camera/Gallery picker will open here')}
              >
                <Text style={styles.photoAddIcon}>📷</Text>
                <Text style={styles.photoAddText}>Add Photo</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.photoHint}>You can add up to 4 photos</Text>
        </View>

        {/* Anonymous Toggle */}
        <View style={styles.section}>
          <View style={styles.anonymousCard}>
            <View style={styles.anonymousLeft}>
              <Text style={styles.anonymousIcon}>🕵️</Text>
              <View style={styles.anonymousTextContainer}>
                <Text style={styles.anonymousTitle}>Report Anonymously</Text>
                <Text style={styles.anonymousDescription}>
                  Your identity will remain hidden
                </Text>
              </View>
            </View>
            <Switch
              value={isAnonymous}
              onValueChange={setIsAnonymous}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary + '60' }}
              thumbColor={isAnonymous ? theme.colors.primary : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Report</Text>
        </TouchableOpacity>

        {/* Help Text */}
        <Text style={styles.helpText}>
          Reports are reviewed by our team and shared with local authorities when necessary.
          False reports may result in account suspension.
        </Text>
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
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
    position: 'relative',
  },
  categoryCardSelected: {
    borderWidth: 3,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    fontSize: 32,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  categoryDescription: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
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
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  locationIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  locationDetails: {
    flex: 1,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  locationSubtext: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  locationArrow: {
    fontSize: 24,
    color: theme.colors.textSecondary,
  },
  textArea: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 140,
  },
  charCount: {
    fontSize: 12,
    color: theme.colors.textSecondary,
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
    backgroundColor: theme.colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoRemoveText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  photoAdd: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
  },
  photoAddIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  photoAddText: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  photoHint: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 8,
  },
  anonymousCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  anonymousLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  anonymousIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  anonymousTextContainer: {
    flex: 1,
  },
  anonymousTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  anonymousDescription: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  helpText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
    paddingHorizontal: 20,
  },
});
