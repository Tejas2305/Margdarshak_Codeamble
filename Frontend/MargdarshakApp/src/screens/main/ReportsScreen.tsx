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
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../theme';

const incidentCategories = [
  { id: '1', name: 'Theft', icon: 'bag-personal' as const, color: '#5B8DEE', description: 'Report theft or robbery' },
  { id: '2', name: 'Harassment', icon: 'account-alert' as const, color: '#E85D75', description: 'Report harassment' },
  { id: '3', name: 'Suspicious Activity', icon: 'eye-outline' as const, color: '#F59E42', description: 'Report suspicious behavior' },
  { id: '4', name: 'Accident', icon: 'car-crash' as const, color: '#E8684A', description: 'Report traffic accident' },
  { id: '5', name: 'Road Block', icon: 'road-variant' as const, color: '#9B87C7', description: 'Report road blockage' },
  { id: '6', name: 'Fire', icon: 'fire' as const, color: '#E85D5D', description: 'Report fire incident' },
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
    <SafeAreaView style={styles.container} edges={['top']}>
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
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <View style={[styles.categoryIconContainer, { backgroundColor: category.color + '15' }]}>
                  <MaterialCommunityIcons 
                    name={category.icon as any} 
                    size={28} 
                    color={category.color} 
                  />
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
            <View style={styles.locationDetails}>
              <Text style={styles.locationText}>{location}</Text>
              <Text style={styles.locationSubtext}>Tap to change location</Text>
            </View>
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
                <Text style={styles.photoAddText}>+ Add Photo</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.photoHint}>You can add up to 4 photos</Text>
        </View>

        {/* Anonymous Toggle */}
        <View style={styles.section}>
          <View style={styles.anonymousCard}>
            <View style={styles.anonymousLeft}>
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
              trackColor={{ false: '#E0E0E0', true: '#5B8DEE' }}
              thumbColor={isAnonymous ? '#5B8DEE' : '#FFFFFF'}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '400',
    color: '#333333',
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666666',
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
    color: '#333333',
    marginBottom: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F0F0F0',
    position: 'relative',
  },
  categoryCardSelected: {
    borderWidth: 2,
    borderColor: '#555555',
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '400',
    color: '#333333',
    marginBottom: 4,
    textAlign: 'center',
  },
  categoryDescription: {
    fontSize: 12,
    fontWeight: '400',
    color: '#666666',
    textAlign: 'center',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '400',
  },
  locationCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  locationDetails: {
    flex: 1,
  },
  locationText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#333333',
    marginBottom: 4,
  },
  locationSubtext: {
    fontSize: 13,
    fontWeight: '400',
    color: '#666666',
  },
  textArea: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    fontWeight: '400',
    color: '#333333',
    minHeight: 140,
  },
  charCount: {
    fontSize: 12,
    fontWeight: '400',
    color: '#999999',
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
    backgroundColor: '#555555',
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
    borderColor: '#F0F0F0',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
  },
  photoAddText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#666666',
  },
  photoHint: {
    fontSize: 12,
    fontWeight: '400',
    color: '#999999',
    marginTop: 8,
  },
  anonymousCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
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
    color: '#333333',
    marginBottom: 4,
  },
  anonymousDescription: {
    fontSize: 13,
    fontWeight: '400',
    color: '#666666',
  },
  submitButton: {
    backgroundColor: '#5B8DEE',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#FFFFFF',
  },
  helpText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#999999',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
});
