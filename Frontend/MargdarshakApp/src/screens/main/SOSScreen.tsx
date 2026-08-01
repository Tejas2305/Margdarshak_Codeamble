import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  Animated,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme';

const emergencyNumbers = [
  { name: 'Police', number: '100', icon: '🚓' },
  { name: 'Ambulance', number: '102', icon: '🚑' },
  { name: 'Fire', number: '101', icon: '🚒' },
];

export default function SOSScreen() {
  const [isActivated, setIsActivated] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isActivated && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (isActivated && countdown === 0) {
      triggerEmergency();
    }
    return () => clearTimeout(timer);
  }, [isActivated, countdown]);

  const handleSOSPress = () => {
    Alert.alert(
      'Activate Emergency SOS?',
      'This will:\n• Call emergency services\n• Share your location\n• Alert your emergency contacts\n• Record audio/video',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Activate',
          style: 'destructive',
          onPress: () => {
            setIsActivated(true);
            setCountdown(5);
          },
        },
      ]
    );
  };

  const cancelSOS = () => {
    setIsActivated(false);
    setCountdown(5);
  };

  const triggerEmergency = () => {
    // In production, this would:
    // 1. Call emergency services
    // 2. Share GPS location
    // 3. Send SMS to emergency contacts
    // 4. Start recording audio/video
    // 5. Alert nearby app users
    
    Alert.alert(
      'SOS Activated!',
      'Emergency services have been notified. Help is on the way.',
      [
        {
          text: 'OK',
          onPress: () => {
            setIsActivated(false);
            setCountdown(5);
          },
        },
      ]
    );
  };

  const callNumber = (number: string, name: string) => {
    Alert.alert(
      `Call ${name}?`,
      `Dial ${number}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => Linking.openURL(`tel:${number}`),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={isActivated ? ['#D32F2F', '#F44336'] : ['#FF5252', '#FF1744']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Emergency SOS</Text>
          <Text style={styles.headerSubtitle}>
            {isActivated
              ? 'Activating emergency response...'
              : 'Press button to activate emergency alert'}
          </Text>
        </View>

        {/* Main SOS Button */}
        <View style={styles.sosContainer}>
          {isActivated ? (
            <View style={styles.countdownContainer}>
              <Text style={styles.countdownText}>Activating in</Text>
              <Text style={styles.countdownNumber}>{countdown}</Text>
              <Text style={styles.countdownSubtext}>Tap cancel to abort</Text>
            </View>
          ) : (
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity
                style={styles.sosButton}
                onPress={handleSOSPress}
                activeOpacity={0.8}
              >
                <View style={styles.sosButtonInner}>
                  <Text style={styles.sosIcon}>🚨</Text>
                  <Text style={styles.sosText}>SOS</Text>
                  <Text style={styles.sosSubtext}>Press & Hold</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>

        {/* Cancel Button (shown when activated) */}
        {isActivated && (
          <TouchableOpacity style={styles.cancelButton} onPress={cancelSOS}>
            <Text style={styles.cancelButtonText}>Cancel Emergency Alert</Text>
          </TouchableOpacity>
        )}

        {/* Quick Actions */}
        {!isActivated && (
          <View style={styles.quickActions}>
            <Text style={styles.quickActionsTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              {emergencyNumbers.map((service) => (
                <TouchableOpacity
                  key={service.number}
                  style={styles.quickActionCard}
                  onPress={() => callNumber(service.number, service.name)}
                >
                  <Text style={styles.quickActionIcon}>{service.icon}</Text>
                  <Text style={styles.quickActionName}>{service.name}</Text>
                  <Text style={styles.quickActionNumber}>{service.number}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Features List */}
        {!isActivated && (
          <View style={styles.features}>
            <Text style={styles.featuresTitle}>When SOS is activated:</Text>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📞</Text>
              <Text style={styles.featureText}>Calls emergency services automatically</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📍</Text>
              <Text style={styles.featureText}>Shares your live location</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📱</Text>
              <Text style={styles.featureText}>Alerts your emergency contacts via SMS</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🎥</Text>
              <Text style={styles.featureText}>Starts recording audio and video</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>👥</Text>
              <Text style={styles.featureText}>Notifies nearby Margdarshak users</Text>
            </View>
          </View>
        )}

        {/* False Alarm Warning */}
        {!isActivated && (
          <View style={styles.warning}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.warningText}>
              False emergency alerts may result in legal consequences. Only use in genuine
              emergencies.
            </Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  sosContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  sosButton: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 8,
    borderColor: '#FFFFFF',
  },
  sosButtonInner: {
    alignItems: 'center',
  },
  sosIcon: {
    fontSize: 72,
    marginBottom: 12,
  },
  sosText: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 4,
  },
  sosSubtext: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 8,
  },
  countdownContainer: {
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 16,
  },
  countdownNumber: {
    fontSize: 120,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 120,
  },
  countdownSubtext: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 16,
  },
  cancelButton: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 20,
  },
  cancelButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#D32F2F',
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  quickActionNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  features: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    flex: 1,
  },
  warning: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  warningIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 18,
  },
});
