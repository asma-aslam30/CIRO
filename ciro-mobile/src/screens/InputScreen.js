import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  TextInput, 
  Platform, 
  ActivityIndicator 
} from 'react-native';
import { signalAPI } from '../lib/api';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, { 
  FadeInDown, 
  Layout, 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence 
} from 'react-native-reanimated';
import { 
  Activity, 
  Radio, 
  Cpu, 
  RefreshCw, 
  Send, 
  Sparkles,
  CloudRain,
  AlertTriangle,
  Car
} from 'lucide-react-native';
import { theme, globalStyles } from '../lib/theme';

export default function InputScreen() {
  const [loading, setLoading] = useState(false);
  const [customText, setCustomText] = useState('');
  const [focusedInput, setFocusedInput] = useState(false);
  
  // Dynamic metrics for the data stream bars
  const [socialLoad, setSocialLoad] = useState(65);
  const [weatherLoad, setWeatherLoad] = useState(38);
  const [trafficLoad, setTrafficLoad] = useState(84);
  const [isAutopilot, setIsAutopilot] = useState(false);

  // Pulse animation for the live system status dot
  const pulseVal = useSharedValue(1);

  useEffect(() => {
    pulseVal.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );

    // Periodically fluctuate load numbers slightly for realism
    const interval = setInterval(() => {
      setSocialLoad(prev => Math.min(Math.max(prev + Math.floor(Math.random() * 11) - 5, 20), 95));
      setWeatherLoad(prev => Math.min(Math.max(prev + Math.floor(Math.random() * 9) - 4, 10), 95));
      setTrafficLoad(prev => Math.min(Math.max(prev + Math.floor(Math.random() * 7) - 3, 40), 98));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseVal.value }],
    opacity: 0.8 / pulseVal.value,
  }));

  const sendSignal = async (type, payload = null) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    try {
      let signalData;
      if (type === 'custom' && payload) {
        signalData = { source: 'social_media', text: payload, location: 'Field Operator' };
      } else {
        signalData = await signalAPI.getRandomSignal(type);
      }
      
      await signalAPI.sendSignals([signalData]);
      
      Alert.alert(
        "SIGNAL INJECTED",
        `Source: ${signalData.source.toUpperCase()}\nLocation: ${signalData.location.toUpperCase()}\n\n"${signalData.text}"`,
        [{ text: "OK" }]
      );
      
      setCustomText('');
    } catch (err) {
      Alert.alert('TRANSMISSION ERROR', 'Failed to inject signal stream. Verify server link.');
    } finally {
      setLoading(false);
    }
  };

  const triggerAnalysis = async () => {
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setLoading(true);
    try {
      await signalAPI.triggerAnalysis();
      Alert.alert('ANALYSIS ACTIVE', 'AI core pipeline initialized. Inspect Detection and Response tabs.');
    } catch (err) {
      Alert.alert('CORE FAILURE', 'No signals found to execute analysis matrix.');
    } finally {
      setLoading(false);
    }
  };

  const resetSystem = async () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      "CONFIRM FLUSH",
      "Are you sure you want to restore system settings to default?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "CONFIRM", 
          onPress: async () => {
            try {
              await signalAPI.resetState();
              Alert.alert('SYSTEM FLUSHED', 'All registers restored to factory metrics.');
            } catch (e) {
              Alert.alert('Error', 'Failed to flush registers.');
            }
          } 
        }
      ]
    );
  };

  const toggleAutopilot = async () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    try {
      const data = await signalAPI.toggleAutopilot();
      setIsAutopilot(data.enabled);
      Alert.alert(
        'AUTOPILOT ' + (data.enabled ? 'ENABLED' : 'DISABLED'), 
        data.enabled ? 'Live simulator active. Signals will inject automatically.' : 'Manual mode restored.'
      );
    } catch (e) {
      Alert.alert('Error', 'Failed to toggle autopilot.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAutopilot = async () => {
      try {
        const data = await signalAPI.getAutopilotStatus();
        setIsAutopilot(data.enabled);
      } catch (e) {
        // Silently fail if not reachable yet
      }
    };
    fetchAutopilot();
  }, []);

  return (
    <LinearGradient 
      colors={[theme.colors.bgDark, theme.colors.bgDarkSecondary, theme.colors.bgDark]} 
      style={globalStyles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Custom Header Bar */}
        <Animated.View entering={FadeInDown.duration(600)} style={globalStyles.headerRow}>
          <View>
            <Text style={styles.brandTitle}>
              NEXUS <Text style={styles.neonBrand}>CORE</Text>
            </Text>
            <Text style={styles.brandSubtitle}>COGNITIVE CONSOLE v2.0</Text>
          </View>

          <View style={styles.statusBadge}>
            <Animated.View style={[styles.pulseDot, pulseStyle]} />
            <View style={[styles.pulseDot, { position: 'absolute', left: 10 }]} />
            <Text style={styles.statusText}>LIVE MATRIX</Text>
          </View>
        </Animated.View>

        {/* Data Stream Metrics (Web Parity) */}
        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.hudCard}>
          <View style={styles.cardHeader}>
            <Cpu color={theme.colors.primary} size={16} />
            <Text style={styles.cardTitle}>SWARM COGNITION DATA STREAMS</Text>
          </View>
          <View style={styles.divider} />

          {/* Social Load Stream */}
          <View style={styles.streamRow}>
            <View style={styles.streamLabelRow}>
              <Text style={styles.streamLabel}>SOCIAL_MEDIA_STREAM</Text>
              <Text style={[styles.streamVal, { color: theme.colors.primary }]}>{socialLoad}%</Text>
            </View>
            <View style={styles.streamBarBackground}>
              <View style={[styles.streamBarFill, { width: `${socialLoad}%`, backgroundColor: theme.colors.primary }]} />
            </View>
          </View>

          {/* Weather Load Stream */}
          <View style={styles.streamRow}>
            <View style={styles.streamLabelRow}>
              <Text style={styles.streamLabel}>METEOROLOGICAL_SENSORS</Text>
              <Text style={[styles.streamVal, { color: theme.colors.accent }]}>{weatherLoad}%</Text>
            </View>
            <View style={styles.streamBarBackground}>
              <View style={[styles.streamBarFill, { width: `${weatherLoad}%`, backgroundColor: theme.colors.accent }]} />
            </View>
          </View>

          {/* Traffic Load Stream */}
          <View style={styles.streamRow}>
            <View style={styles.streamLabelRow}>
              <Text style={styles.streamLabel}>VEHICULAR_TELEMETRY</Text>
              <Text style={[styles.streamVal, { color: theme.colors.warning }]}>{trafficLoad}%</Text>
            </View>
            <View style={styles.streamBarBackground}>
              <View style={[styles.streamBarFill, { width: `${trafficLoad}%`, backgroundColor: theme.colors.warning }]} />
            </View>
          </View>
        </Animated.View>

        {/* Custom Input Ingestion */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={globalStyles.glassCard}>
          <View style={styles.cardHeader}>
            <Radio color={theme.colors.primary} size={16} />
            <Text style={styles.cardTitle}>MANUAL INGESTION VECTOR</Text>
          </View>
          <Text style={styles.cardDesc}>Inject text-based reports directly into active logic processing buffers.</Text>
          
          <View style={styles.inputWrapper}>
            <TextInput
              style={[
                styles.customTextInput,
                focusedInput && styles.customTextInputFocused
              ]}
              placeholder="Enter field telemetry in English, Urdu or Roman Urdu..."
              placeholderTextColor={theme.colors.dim}
              value={customText}
              onChangeText={setCustomText}
              onFocus={() => setFocusedInput(true)}
              onBlur={() => setFocusedInput(false)}
              multiline
            />
            <TouchableOpacity 
              style={[
                styles.sendBtn,
                (!customText || loading) && styles.sendBtnDisabled
              ]} 
              onPress={() => sendSignal('custom', customText)}
              disabled={loading || !customText}
              activeOpacity={0.8}
            >
              <Send color={customText ? theme.colors.bgDark : theme.colors.dim} size={18} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Simulator Grid buttons */}
        <Animated.View entering={FadeInDown.delay(300).duration(600)} style={globalStyles.glassCard}>
          <View style={styles.cardHeader}>
            <Sparkles color={theme.colors.accent} size={16} />
            <Text style={styles.cardTitle}>SIMULATE CRITICAL PATTERNS</Text>
          </View>
          <Text style={styles.cardDesc}>Synthesize telemetry signatures to stress-test regional mitigation scripts.</Text>

          <View style={styles.simulationGrid}>
            {/* Social Post */}
            <TouchableOpacity 
              style={[styles.simButton, { borderColor: theme.colors.accent }]}
              onPress={() => sendSignal('social')}
              disabled={loading}
              activeOpacity={0.7}
            >
              <LinearGradient 
                colors={['rgba(176, 38, 255, 0.03)', 'rgba(176, 38, 255, 0.1)']} 
                style={styles.simButtonGradient}
              >
                <CloudRain color={theme.colors.accent} size={22} />
                <Text style={[styles.simButtonText, { color: theme.colors.accent }]}>FLOOD REPORT</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Weather alert */}
            <TouchableOpacity 
              style={[styles.simButton, { borderColor: theme.colors.primary }]}
              onPress={() => sendSignal('weather')}
              disabled={loading}
              activeOpacity={0.7}
            >
              <LinearGradient 
                colors={['rgba(0, 240, 255, 0.03)', 'rgba(0, 240, 255, 0.1)']} 
                style={styles.simButtonGradient}
              >
                <AlertTriangle color={theme.colors.primary} size={22} />
                <Text style={[styles.simButtonText, { color: theme.colors.primary }]}>WEATHER INCIDENT</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Traffic alert */}
            <TouchableOpacity 
              style={[styles.simButton, { borderColor: theme.colors.warning }]}
              onPress={() => sendSignal('traffic')}
              disabled={loading}
              activeOpacity={0.7}
            >
              <LinearGradient 
                colors={['rgba(255, 224, 102, 0.03)', 'rgba(255, 224, 102, 0.1)']} 
                style={styles.simButtonGradient}
              >
                <Car color={theme.colors.warning} size={22} />
                <Text style={[styles.simButtonText, { color: theme.colors.warning }]}>TRAFFIC STAKE</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Core Controls */}
        <Animated.View entering={FadeInDown.delay(400).duration(600)} style={globalStyles.glassCard}>
          <View style={styles.cardHeader}>
            <Cpu color={theme.colors.primary} size={16} />
            <Text style={styles.cardTitle}>PIPELINE CONTROL COMMANDS</Text>
          </View>
          <Text style={styles.cardDesc}>Activate machine analysis arrays over currently buffered ingestion loads.</Text>
          
          <TouchableOpacity onPress={triggerAnalysis} disabled={loading || isAutopilot} activeOpacity={0.8}>
            <LinearGradient 
              colors={[theme.colors.primary, theme.colors.accent]} 
              start={{ x: 0, y: 0 }} 
              end={{ x: 1, y: 0 }} 
              style={styles.btnAnalyze}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.bgDark} />
              ) : (
                <Text style={styles.btnTextAnalyze}>⚡ EXECUTE SWARM REASONING</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnReset} onPress={resetSystem} disabled={loading || isAutopilot} activeOpacity={0.7}>
            <RefreshCw color={theme.colors.alert} size={16} />
            <Text style={styles.btnTextReset}>FLUSH MEMORY REGISTERS</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.btnReset, 
              { marginTop: 15, borderColor: isAutopilot ? theme.colors.success : '#b026ff', backgroundColor: isAutopilot ? 'rgba(16, 185, 129, 0.1)' : 'transparent' }
            ]} 
            onPress={toggleAutopilot} 
            disabled={loading} 
            activeOpacity={0.7}
          >
            <Activity color={isAutopilot ? theme.colors.success : '#b026ff'} size={16} />
            <Text style={[styles.btnTextReset, { color: isAutopilot ? theme.colors.success : '#b026ff' }]}>
              {isAutopilot ? '⚡ AUTOPILOT ACTIVE' : 'AUTOPILOT MODE'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 110, // Margin to protect against overlapping bottom tabs
  },
  brandTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 24,
    color: '#ffffff',
    letterSpacing: 2,
  },
  neonBrand: {
    color: theme.colors.primary,
    textShadowColor: 'rgba(0, 240, 255, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  brandSubtitle: {
    fontFamily: theme.fonts.semibold,
    fontSize: 9,
    color: theme.colors.dim,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 240, 255, 0.08)',
    borderColor: theme.colors.border,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    marginRight: 8,
  },
  statusText: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.bold,
    fontSize: 9,
    letterSpacing: 1,
  },
  hudCard: {
    ...theme.glass,
    backgroundColor: 'rgba(5, 5, 15, 0.75)',
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    color: '#ffffff',
    fontFamily: theme.fonts.bold,
    fontSize: 12,
    letterSpacing: 1.5,
    marginLeft: 8,
  },
  cardDesc: {
    color: theme.colors.dim,
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: 12,
  },
  streamRow: {
    marginBottom: 14,
  },
  streamLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  streamLabel: {
    color: theme.colors.dim,
    fontFamily: theme.fonts.semibold,
    fontSize: 9,
    letterSpacing: 1,
  },
  streamVal: {
    fontFamily: theme.fonts.bold,
    fontSize: 11,
  },
  streamBarBackground: {
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 0.5,
    borderRadius: 2,
    overflow: 'hidden',
  },
  streamBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 4,
  },
  customTextInput: {
    flex: 1,
    minHeight: 80,
    maxHeight: 150,
    color: theme.colors.text,
    fontFamily: theme.fonts.semibold,
    fontSize: 14,
    padding: 10,
    textAlignVertical: 'top',
  },
  customTextInputFocused: {
    borderColor: theme.colors.primary,
  },
  sendBtn: {
    backgroundColor: theme.colors.primary,
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    marginRight: 4,
    marginBottom: 4,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  sendBtnDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    shadowOpacity: 0,
  },
  simulationGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  simButton: {
    flex: 1,
    height: 70,
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  simButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
  },
  simButtonText: {
    fontFamily: theme.fonts.bold,
    fontSize: 9,
    letterSpacing: 0.5,
    marginTop: 6,
    textAlign: 'center',
  },
  btnAnalyze: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  btnTextAnalyze: {
    color: theme.colors.bgDark,
    fontFamily: theme.fonts.bold,
    fontSize: 14,
    letterSpacing: 1.5,
  },
  btnReset: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderColor: theme.colors.alert,
    borderWidth: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnTextReset: {
    color: theme.colors.alert,
    fontFamily: theme.fonts.bold,
    fontSize: 12,
    letterSpacing: 1,
  },
});
