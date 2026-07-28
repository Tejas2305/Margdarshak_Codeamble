import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, StatusBar, Platform, Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing } from '../../theme';
import { Button } from '../../components/ui';
import { AuthStackParamList } from '../../navigation/types';

const { width } = Dimensions.get('window');
type Props = { navigation: NativeStackNavigationProp<AuthStackParamList, 'Success'> };

const SuccessScreen: React.FC<Props> = () => {
  const scale    = useRef(new Animated.Value(0)).current;
  const checkOp  = useRef(new Animated.Value(0)).current;
  const ripple1  = useRef(new Animated.Value(0)).current;
  const ripple2  = useRef(new Animated.Value(0)).current;
  const ripple3  = useRef(new Animated.Value(0)).current;
  const contentOp = useRef(new Animated.Value(0)).current;
  const contentY  = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.spring(scale, { toValue: 1, tension: 70, friction: 6, useNativeDriver: true }).start(() => {
      Animated.timing(checkOp, { toValue: 1, duration: 300, useNativeDriver: true }).start();

      const rippleAnim = (r: Animated.Value, delay: number) =>
        Animated.loop(Animated.sequence([
          Animated.delay(delay),
          Animated.timing(r, { toValue: 1, duration: 1200, useNativeDriver: true }),
          Animated.timing(r, { toValue: 0, duration: 0, useNativeDriver: true }),
        ])).start();

      rippleAnim(ripple1, 0); rippleAnim(ripple2, 400); rippleAnim(ripple3, 800);

      setTimeout(() => {
        Animated.parallel([
          Animated.timing(contentOp, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(contentY,  { toValue: 0, duration: 500, useNativeDriver: true }),
        ]).start();
      }, 300);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rippleStyle = (r: Animated.Value) => ({
    position: 'absolute' as const, width: 140, height: 140, borderRadius: 70,
    borderWidth: 2, borderColor: Colors.secondary,
    transform: [{ scale: r.interpolate({ inputRange: [0, 1], outputRange: [1, 2.2] }) }],
    opacity: r.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0.6, 0.3, 0] }),
  });

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <View style={s.accent} />

      <View style={s.illusArea}>
        <Animated.View style={rippleStyle(ripple1)} />
        <Animated.View style={rippleStyle(ripple2)} />
        <Animated.View style={rippleStyle(ripple3)} />
        <Animated.View style={[s.circle, { transform: [{ scale }] }]}>
          <Animated.Text style={[s.check, { opacity: checkOp }]}>✓</Animated.Text>
        </Animated.View>
      </View>

      <Animated.View style={[s.content, { opacity: contentOp, transform: [{ translateY: contentY }] }]}>
        <Text style={s.title}>Welcome to{'\n'}Margdarshak</Text>
        <Text style={s.subtitle}>You're all set and ready to travel safely.{'\n'}Your safety is our priority.</Text>

        <View style={s.statsRow}>
          {[['Live', 'Heatmap'], ['Real-time', 'Alerts'], ['Safe', 'Routing']].map(([val, lbl], i) => (
            <React.Fragment key={i}>
              {i > 0 && <View style={s.statDiv} />}
              <View style={s.stat}>
                <Text style={s.statVal}>{val}</Text>
                <Text style={s.statLbl}>{lbl}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>
      </Animated.View>

      <Animated.View style={[s.btnWrapper, { opacity: contentOp }]}>
        <Button title="Continue to Map" onPress={() => {}} />
        <Text style={s.footer}>Margdarshak — Navigate Safely. Every Journey.</Text>
      </Animated.View>
    </View>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, alignItems: 'center' },
  accent: { position: 'absolute', top: 0, width, height: 300, backgroundColor: Colors.successLight, borderBottomLeftRadius: 60, borderBottomRightRadius: 60, opacity: 0.5 },
  illusArea: { marginTop: Platform.OS === 'ios' ? 120 : 80, width: 140, height: 140, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.massive },
  circle: { width: 120, height: 120, borderRadius: 60, backgroundColor: Colors.secondary, alignItems: 'center', justifyContent: 'center', shadowColor: Colors.secondary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 10 },
  check: { fontSize: 52, color: Colors.textInverse, fontWeight: Typography.fontWeightBold, lineHeight: 60 },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: Spacing.xxl },
  title: { fontSize: Typography.fontSize3XL, fontWeight: Typography.fontWeightBold, color: Colors.text, textAlign: 'center', lineHeight: 40, marginBottom: Spacing.lg },
  subtitle: { fontSize: Typography.fontSizeMD, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24, marginBottom: Spacing.xxxl },
  statsRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 16, paddingVertical: Spacing.xl, paddingHorizontal: Spacing.xxl, borderWidth: 1, borderColor: Colors.border, elevation: 4 },
  stat: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: Typography.fontSizeSM, fontWeight: Typography.fontWeightBold, color: Colors.primary, marginBottom: 2 },
  statLbl: { fontSize: Typography.fontSizeXS, color: Colors.textMuted, fontWeight: Typography.fontWeightMedium },
  statDiv: { width: 1, height: 32, backgroundColor: Colors.border },
  btnWrapper: { width: '100%', paddingHorizontal: Spacing.xxl, paddingBottom: Platform.OS === 'ios' ? 44 : Spacing.xxl, paddingTop: Spacing.lg, alignItems: 'center' },
  footer: { marginTop: Spacing.lg, fontSize: Typography.fontSizeXS, color: Colors.textMuted, textAlign: 'center', letterSpacing: 0.3 },
});

export default SuccessScreen;
