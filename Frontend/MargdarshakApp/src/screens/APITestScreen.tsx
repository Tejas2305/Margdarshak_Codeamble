import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, typography } from '../theme';
import {
  testBackendHealth,
  testRegister,
  testLogin,
  testGetProfile,
  testUpdateProfile,
  testGetCategories,
  testCreateEmergencyContact,
  testGetEmergencyContacts,
  testLogout,
  runAllTests,
} from '../services/api/__tests__/apiTest';

interface TestResult {
  success: boolean;
  data?: any;
  error?: any;
}

export default function APITestScreen() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, TestResult>>({});

  const runTest = async (testName: string, testFn: () => Promise<TestResult>) => {
    setLoading(true);
    const result = await testFn();
    setResults((prev) => ({ ...prev, [testName]: result }));
    setLoading(false);
  };

  const runAll = async () => {
    setLoading(true);
    setResults({});
    const allResults = await runAllTests();
    setResults(allResults);
    setLoading(false);
  };

  const TestButton = ({ title, onPress }: { title: string; onPress: () => void }) => (
    <TouchableOpacity style={styles.testButton} onPress={onPress} disabled={loading}>
      <Text style={styles.testButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  const ResultItem = ({ name, result }: { name: string; result: TestResult }) => (
    <View style={styles.resultItem}>
      <Text style={styles.resultTitle}>
        {result.success ? '✅' : '❌'} {name}
      </Text>
      {result.data && (
        <Text style={styles.resultData}>{JSON.stringify(result.data, null, 2)}</Text>
      )}
      {result.error && (
        <Text style={styles.resultError}>{JSON.stringify(result.error, null, 2)}</Text>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>API Connection Tests</Text>
        <Text style={styles.subtitle}>Test backend connectivity</Text>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Running tests...</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TestButton title="🚀 Run All Tests" onPress={runAll} />
        
        <View style={styles.divider} />
        
        <TestButton
          title="1. Backend Health Check"
          onPress={() => runTest('health', testBackendHealth)}
        />
        <TestButton
          title="2. Register User"
          onPress={() => runTest('register', testRegister)}
        />
        <TestButton
          title="3. Login User"
          onPress={() => runTest('login', testLogin)}
        />
        <TestButton
          title="4. Get Profile"
          onPress={() => runTest('profile', testGetProfile)}
        />
        <TestButton
          title="5. Update Profile"
          onPress={() => runTest('updateProfile', testUpdateProfile)}
        />
        <TestButton
          title="6. Get Categories"
          onPress={() => runTest('categories', testGetCategories)}
        />
        <TestButton
          title="7. Create Emergency Contact"
          onPress={() => runTest('createContact', testCreateEmergencyContact)}
        />
        <TestButton
          title="8. Get Emergency Contacts"
          onPress={() => runTest('getContacts', testGetEmergencyContacts)}
        />
        <TestButton title="9. Logout" onPress={() => runTest('logout', testLogout)} />
      </View>

      {Object.keys(results).length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Test Results:</Text>
          {Object.entries(results).map(([name, result]) => (
            <ResultItem key={name} name={name} result={result} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.primary,
  },
  title: {
    fontSize: typography.h4,
    fontWeight: 'bold',
    color: colors.background,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.background,
    opacity: 0.9,
  },
  loadingContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  buttonContainer: {
    padding: spacing.md,
  },
  testButton: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  testButtonText: {
    fontSize: typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  resultsContainer: {
    padding: spacing.md,
    paddingTop: spacing.lg,
  },
  resultsTitle: {
    fontSize: typography.h5,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  resultItem: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultTitle: {
    fontSize: typography.body,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  resultData: {
    fontSize: typography.bodySmall,
    color: colors.success,
    fontFamily: 'monospace',
  },
  resultError: {
    fontSize: typography.bodySmall,
    color: colors.error,
    fontFamily: 'monospace',
  },
});
