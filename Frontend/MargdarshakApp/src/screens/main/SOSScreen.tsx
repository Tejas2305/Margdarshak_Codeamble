import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
} from 'react-native';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Phone, 
  Ambulance, 
  Flame, 
  MapPin, 
  Users, 
  Clock,
  Check
} from 'lucide-react-native';
import { Card } from '../../components';
import { useTheme } from '../../contexts/ThemeContext';
import { getTheme } from '../../theme/theme';
import { sosService } from '../../services/api';

const emergencyNumbers = [
  { name: 'Police', number: '100', icon: Phone },
  { name: 'Medical', number: '102', icon: Ambulance },
  { name: 'Fire', number: '101', icon: Flame },
];

const DEFAULT_LOCATION = {
  latitude: 18.5204,
  longitude: 73.8567,
};

const BUTTON_SIZE = 200;

export default function SOSScreen({ navigation }: any) {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  const [isSending, setIsSending] = useState(false);
  
  // Pulsing outer ring animation
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(1)).current;

  // Pulsing animation loop
  useEffect(() => {
    const animation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseScale, {
            toValue: 1.4,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseScale, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(pulseOpacity, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, []);

  const resolveLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return DEFAULT_LOCATION;
    }

    const position = await Location.getCurrentPositionAsync({});
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
  };

  const triggerEmergency = async () => {
    if (isSending) return;
    
    try {
      setIsSending(true);
      
      const currentLocation = await resolveLocation();
      const response = await sosService.trigger({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        address: `${currentLocation.latitude.toFixed(5)}, ${currentLocation.longitude.toFixed(5)}`,
        battery_percentage: null,
      });

      Alert.alert(
        'Emergency Alert Sent', 
        `${response.message}\n\nLocation: ${response.google_maps_url}`, 
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      Alert.alert('SOS Failed', error?.response?.data?.detail || 'Unable to send SOS right now.');
    } finally {
      setIsSending(false);
    }
  };

  const callNumber = (number: string, name: string) => {
    Alert.alert(`Call ${name}?`, `Dial ${number}`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Call',
        onPress: () => Linking.openURL(`tel:${number}`),
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[theme.typography.heading1, { color: theme.colors.textPrimary }]}>
              Emergency SOS
            </Text>
            <Text style={[theme.typography.body, { color: theme.colors.textSecondary, marginTop: theme.spacing.xs }]}>
              {isSending ? 'Sending alert...' : 'Tap to activate emergency alert'}
            </Text>
          </View>

          {/* SOS Button with Pulsing Ring */}
          <View style={styles.sosContainer}>
            {/* Pulsing Outer Ring */}
            <Animated.View
              style={[
                styles.pulseRing,
                {
                  backgroundColor: theme.colors.danger,
                  transform: [{ scale: pulseScale }],
                  opacity: pulseOpacity,
                },
              ]}
            />

            {/* Main SOS Button */}
            <Pressable
              onPress={triggerEmergency}
              disabled={isSending}
              style={[
                styles.sosButton,
                { 
                  backgroundColor: theme.colors.danger,
                  opacity: isSending ? 0.6 : 1,
                },
                theme.shadows.xl,
              ]}
            >
              <Text style={styles.sosText}>SOS</Text>
              <Text style={styles.sosSubtext}>
                {isSending ? 'Sending...' : 'Tap to Send'}
              </Text>
            </Pressable>
          </View>

          {/* Quick Call Cards */}
          <View style={styles.section}>
            <Text style={[theme.typography.heading3, { color: theme.colors.textPrimary, marginBottom: theme.spacing.md }]}>
              Quick Call
            </Text>
            <View style={styles.quickCallGrid}>
              {emergencyNumbers.map((service) => {
                const IconComponent = service.icon;
                return (
                  <Pressable
                    key={service.number}
                    onPress={() => callNumber(service.number, service.name)}
                    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1, flex: 1 }]}
                  >
                    <Card style={styles.quickCallCard}>
                      <View style={[styles.iconCircle, { backgroundColor: `${theme.colors.primary}10` }]}>
                        <IconComponent size={24} color={theme.colors.primary} strokeWidth={2} />
                      </View>
                      <Text style={[theme.typography.label, { color: theme.colors.textPrimary, marginTop: theme.spacing.sm }]}>
                        {service.name}
                      </Text>
                      <Text style={[theme.typography.heading3, { color: theme.colors.primary, marginTop: theme.spacing.xs }]}>
                        {service.number}
                      </Text>
                    </Card>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* When Activated Section */}
          <View style={styles.section}>
            <Text style={[theme.typography.heading3, { color: theme.colors.textPrimary, marginBottom: theme.spacing.md }]}>
              When activated
            </Text>
            <Card>
              <View style={styles.infoItem}>
                <View style={[styles.checkCircle, { backgroundColor: `${theme.colors.success}15` }]}>
                  <Check size={16} color={theme.colors.success} strokeWidth={3} />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={[theme.typography.body, { color: theme.colors.textPrimary }]}>
                    Shares current location
                  </Text>
                  <Text style={[theme.typography.caption, { color: theme.colors.textMuted, marginTop: 2 }]}>
                    Real-time GPS coordinates
                  </Text>
                </View>
              </View>

              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

              <View style={styles.infoItem}>
                <View style={[styles.checkCircle, { backgroundColor: `${theme.colors.success}15` }]}>
                  <Check size={16} color={theme.colors.success} strokeWidth={3} />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={[theme.typography.body, { color: theme.colors.textPrimary }]}>
                    Alerts emergency contacts
                  </Text>
                  <Text style={[theme.typography.caption, { color: theme.colors.textMuted, marginTop: 2 }]}>
                    SMS with location link
                  </Text>
                </View>
              </View>

              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

              <View style={styles.infoItem}>
                <View style={[styles.checkCircle, { backgroundColor: `${theme.colors.success}15` }]}>
                  <Check size={16} color={theme.colors.success} strokeWidth={3} />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={[theme.typography.body, { color: theme.colors.textPrimary }]}>
                    Stores SOS history
                  </Text>
                  <Text style={[theme.typography.caption, { color: theme.colors.textMuted, marginTop: 2 }]}>
                    Saved in your account
                  </Text>
                </View>
              </View>
            </Card>
          </View>

          {/* Bottom spacing */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 32,
  },
  sosContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
    height: BUTTON_SIZE + 100,
  },
  pulseRing: {
    position: 'absolute',
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
  },
  progressRingContainer: {
    position: 'absolute',
  },
  sosButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  sosText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 4,
  },
  sosSubtext: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 8,
    opacity: 0.9,
  },
  section: {
    marginBottom: 32,
  },
  quickCallGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickCallCard: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
});
