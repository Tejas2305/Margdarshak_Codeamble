import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Button } from '../../components/ui';
import { colors, typography, spacing } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Permissions'> & {
  onAuthSuccess?: () => void;
};

export const PermissionsScreen: React.FC<Props> = ({ navigation, onAuthSuccess }) => {
  const handleGrant = async () => {
    // TODO: Request actual permissions
    navigation.navigate('Success', { type: 'register' });
  };

  const handleSkip = () => {
    navigation.navigate('Success', { type: 'register' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📍</Text>
      <Text style={styles.title}>Enable Location</Text>
      <Text style={styles.message}>
        Margdarshak needs access to your location to provide real-time safety information and
        navigation.
      </Text>

      <Button
        title="Enable Location"
        onPress={handleGrant}
        fullWidth
        style={{ marginTop: spacing.xl }}
      />
      <Button
        title="Skip for Now"
        onPress={handleSkip}
        variant="text"
        fullWidth
        style={{ marginTop: spacing.md }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  icon: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.h2,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.body * 1.5,
  },
});
