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
import { theme } from '../../theme';

const emergencyNumbers = [
  { name: 'Police', number: '100' },
  { name: 'Medical', number: '102' },
  { name: 'Fire', number: '101' },
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Emergency SOS</Text>
        <Text style={styles.headerSubtitle}>
          {isActivated
            ? 'Activating emergency response'
            : 'Press button to activate emergency alert'}
        </Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {isActivated ? (
          <View style={styles.countdownContainer}>
            <Text style={styles.countdownLabel}>Activating in</Text>
            <Text style={styles.countdownNumber}>{countdown}</Text>
            <TouchableOpacity style={styles.cancelButton} onPress={cancelSOS}>
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
          <Text style={styles.sectionTitle}>Quick Call</Text>
          <View style={styles.actionsGrid}>
            {emergencyNumbers.map((service) => (
              <TouchableOpacity
                key={service.number}
                style={styles.actionCard}
                onPress={() => callNumber(service.number, service.name)}
              >
                <Text style={styles.actionName}>{service.name}</Text>
                <Text style={styles.actionNumber}>{service.number}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Features Info */}
      {!isActivated && (
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>When activated:</Text>
          <View style={styles.infoItem}>
            <View style={styles.infoDot} />
            <Text style={styles.infoText}>Calls emergency services</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoDot} />
            <Text style={styles.infoText}>Shares live location</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoDot} />
            <Text style={styles.infoText}>Alerts emergency contacts</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoDot} />
            <Text style={styles.infoText}>Starts audio recording</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  headerTitle: {
    fontSize: theme.typography.h2,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  sosButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: theme.colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.large,
  },
  sosText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  sosSubtext: {
    fontSize: theme.typography.bodySmall,
    color: '#FFFFFF',
    marginTop: theme.spacing.sm,
    opacity: 0.9,
  },
  countdownContainer: {
    alignItems: 'center',
  },
  countdownLabel: {
    fontSize: theme.typography.h4,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  countdownNumber: {
    fontSize: 96,
    fontWeight: '700',
    color: theme.colors.error,
    marginBottom: theme.spacing.xxl,
  },
  cancelButton: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.xxl,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.error,
  },
  cancelButtonText: {
    fontSize: theme.typography.h5,
    fontWeight: '600',
    color: theme.colors.error,
  },
  quickActions: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.h5,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  actionCard: {
    flex: 1,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  actionName: {
    fontSize: theme.typography.body,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  actionNumber: {
    fontSize: theme.typography.h4,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  infoSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  infoTitle: {
    fontSize: theme.typography.h6,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  infoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.textSecondary,
    marginRight: theme.spacing.md,
  },
  infoText: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
  },
});
