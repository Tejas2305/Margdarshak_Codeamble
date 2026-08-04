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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../theme';

const emergencyNumbers = [
  { name: 'Police', number: '100' },
  { name: 'Medical', number: '102' },
  { name: 'Fire', number: '101' },
];

export default function SOSScreen() {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  
  const [isActivated, setIsActivated] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
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
      'Activate Emergency Alert?',
      'This will notify emergency services and your contacts.',
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
    Alert.alert(
      'Emergency Alert Sent',
      'Your location has been shared with emergency contacts.',
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Emergency SOS</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {isActivated
              ? 'Activating emergency response'
              : 'Press button to activate emergency alert'}
          </Text>
        </View>

      {/* Main Content */}
      <View style={styles.content}>
        {isActivated ? (
          <View style={styles.countdownContainer}>
            <Text style={[styles.countdownLabel, { color: colors.text }]}>Activating in</Text>
            <Text style={styles.countdownNumber}>{countdown}</Text>
            <TouchableOpacity style={[styles.cancelButton, { backgroundColor: colors.surface, borderColor: '#E85D5D' }]} onPress={cancelSOS}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              style={styles.sosButton}
              onPress={handleSOSPress}
              activeOpacity={0.9}
            >
              <Text style={styles.sosText}>SOS</Text>
              <Text style={styles.sosSubtext}>Press & Hold</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>

      {/* Quick Actions */}
      {!isActivated && (
        <View style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Call</Text>
          <View style={styles.actionsGrid}>
            {emergencyNumbers.map((service) => (
              <TouchableOpacity
                key={service.number}
                style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => callNumber(service.number, service.name)}
              >
                <Text style={[styles.actionName, { color: colors.text }]}>{service.name}</Text>
                <Text style={styles.actionNumber}>{service.number}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Features Info */}
      {!isActivated && (
        <View style={styles.infoSection}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>When activated:</Text>
          <View style={styles.infoItem}>
            <View style={[styles.infoDot, { backgroundColor: colors.textSecondary }]} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>Calls emergency services</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={[styles.infoDot, { backgroundColor: colors.textSecondary }]} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>Shares live location</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={[styles.infoDot, { backgroundColor: colors.textSecondary }]} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>Alerts emergency contacts</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={[styles.infoDot, { backgroundColor: colors.textSecondary }]} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>Starts audio recording</Text>
          </View>
        </View>
      )}
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '400',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '400',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  sosButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#E85D5D',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sosText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  sosSubtext: {
    fontSize: 13,
    color: '#FFFFFF',
    marginTop: 8,
    opacity: 0.9,
    fontWeight: '400',
  },
  countdownContainer: {
    alignItems: 'center',
  },
  countdownLabel: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: '400',
  },
  countdownNumber: {
    fontSize: 96,
    fontWeight: '700',
    color: '#E85D5D',
    marginBottom: 40,
  },
  cancelButton: {
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: '400',
    color: '#E85D5D',
  },
  quickActions: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '400',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  actionName: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 4,
  },
  actionNumber: {
    fontSize: 20,
    fontWeight: '400',
    color: '#5B8DEE',
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 12,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '400',
  },
});
