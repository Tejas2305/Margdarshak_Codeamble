import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Button } from '../../components/ui';
import { colors, typography, spacing, borderRadius } from '../../theme';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;

const slides = [
  {
    id: '1',
    icon: '🗺️',
    title: 'Navigate Safely',
    description: 'Get real-time safety information about your route and surrounding areas',
  },
  {
    id: '2',
    icon: '⚠️',
    title: 'Live Incident Alerts',
    description: 'Receive instant notifications about nearby incidents and hazards',
  },
  {
    id: '3',
    icon: '🛡️',
    title: 'Community Protection',
    description: 'Report incidents and help keep your community safe',
  },
];

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace('AuthLanding');
    }
  };

  const handleSkip = () => {
    navigation.replace('AuthLanding');
  };

  const renderSlide = ({ item }: { item: typeof slides[0] }) => (
    <View style={styles.slide}>
      <Text style={styles.icon}>{item.icon}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.activeDot,
              ]}
            />
          ))}
        </View>

        <Button
          title={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          fullWidth
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: spacing.lg,
    zIndex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  skipText: {
    fontSize: typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  icon: {
    fontSize: 100,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.h2,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.body * typography.lineHeightRelaxed,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: colors.primary,
  },
});
