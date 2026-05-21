import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl, 
  Platform,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { dataAPI } from '../lib/api';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  Layout, 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing
} from 'react-native-reanimated';
import { 
  ShieldAlert, 
  MapPin, 
  Target, 
  Zap, 
  Activity,
  Compass,
  CheckCircle,
  Radio
} from 'lucide-react-native';
import { theme, globalStyles } from '../lib/theme';

const { width } = Dimensions.get('window');

export default function DetectionScreen() {
  const [crisis, setCrisis] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('RADAR');
  
  // Rotating sweep angle shared value
  const radarAngle = useSharedValue(0);
  // Blip opacity pulse
  const blipOpacity = useSharedValue(0.2);

  const fetchCrisis = async () => {
    try {
      const data = await dataAPI.getCrisis();
      if (data && data.crisis_type) {
        setCrisis(data);
      } else {
        setCrisis(null);
      }
    } catch (err) {
      console.error('Failed to query active radar matrix:', err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCrisis();
    setRefreshing(false);
  };

  useEffect(() => {
    // 360 degree rotation loop
    radarAngle.value = withRepeat(
      withTiming(360, { 
        duration: 4000, 
        easing: Easing.linear 
      }),
      -1,
      false
    );

    // Blip pulse loop
    blipOpacity.value = withRepeat(
      withSequence(
        withTiming(0.9, { duration: 1500 }),
        withTiming(0.2, { duration: 1500 })
      ),
      -1,
      true
    );

    fetchCrisis();
    const interval = setInterval(fetchCrisis, 3000);
    return () => clearInterval(interval);
  }, []);

  const animatedRadarStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${radarAngle.value}deg` }]
  }));

  const animatedBlipStyle = useAnimatedStyle(() => ({
    opacity: blipOpacity.value
  }));

  const animatedRingStyle = useAnimatedStyle(() => ({
    opacity: 1 - blipOpacity.value,
    transform: [{ scale: blipOpacity.value * 2.5 }]
  }));

  useEffect(() => {
    if (activeTab === 'MAP' && Platform.OS === 'web') {
      let mapInstance = null;
      let markerInstance = null;

      const initWebMap = async () => {
        const L = await new Promise((resolve) => {
          if (window.L) {
            resolve(window.L);
            return;
          }
          if (!document.querySelector('link[href*="leaflet.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
          }
          
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.onload = () => resolve(window.L);
          document.body.appendChild(script);
        });

        const mapEl = document.getElementById('mobile-tactical-map');
        if (mapEl && !mapEl._leaflet_id) {
          mapInstance = L.map('mobile-tactical-map', {
            zoomControl: false,
            attributionControl: false
          }).setView([33.6844, 73.0479], 13);

          L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(mapInstance);

          if (crisis) {
            const coords = {
              'F-6 Markaz': [33.7297, 73.0746],
              'Blue Area': [33.7103, 73.0652],
              'Saddar': [33.5950, 73.0543],
              'Expressway': [33.6844, 73.0479],
              'Citywide': [33.6844, 73.0479]
            };
            const pos = coords[crisis.location] || [33.6844, 73.0479];
            
            const pulseIcon = L.divIcon({
              className: 'mobile-pulse-marker',
              html: `
                <div style="width:20px;height:20px;position:relative;">
                  <div style="width:20px;height:20px;border:2px solid ${theme.colors.alert};border-radius:50%;position:absolute;top:0;left:0;animation:mapPulse 1.5s infinite cubic-bezier(0.4, 0, 0.2, 1);"></div>
                  <div style="width:10px;height:10px;background:${theme.colors.alert};border-radius:50%;position:absolute;top:5px;left:5px;box-shadow:0 0 10px ${theme.colors.alert};"></div>
                </div>
              `,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            });

            if (!document.getElementById('mobile-leaflet-pulse-styles')) {
              const style = document.createElement('style');
              style.id = 'mobile-leaflet-pulse-styles';
              style.innerHTML = `
                @keyframes mapPulse {
                  0% { transform: scale(0.5); opacity: 1; }
                  100% { transform: scale(3); opacity: 0; }
                }
              `;
              document.head.appendChild(style);
            }

            markerInstance = L.marker(pos, { icon: pulseIcon }).addTo(mapInstance);
            mapInstance.setView(pos, 14);
          }
        }
      };

      const timer = setTimeout(initWebMap, 100);

      return () => {
        clearTimeout(timer);
        if (mapInstance) {
          mapInstance.remove();
        }
      };
    }
  }, [activeTab, crisis]);

  return (
    <LinearGradient 
      colors={[theme.colors.bgDark, theme.colors.bgDarkSecondary, theme.colors.bgDark]} 
      style={globalStyles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <Animated.View entering={FadeInDown.duration(800)} style={globalStyles.headerRow}>
          <View>
            <Text style={globalStyles.headerTitle}>
              CRISIS <Text style={globalStyles.neonText}>RADAR</Text>
            </Text>
            <Text style={globalStyles.subtitle}>Autonomous Ingestion Scanner</Text>
          </View>
          
          <View style={styles.headerTelemetry}>
            <Radio color={theme.colors.primary} size={14} />
            <Text style={styles.telemetryText}>MATRIX_ACTIVE</Text>
          </View>
        </Animated.View>

        {/* Navigation Selector Tabs */}
        <Animated.View entering={FadeInDown.delay(50).duration(800)} style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'RADAR' && styles.tabButtonActive]} 
            onPress={() => setActiveTab('RADAR')}
          >
            <Compass color={activeTab === 'RADAR' ? theme.colors.primary : theme.colors.dim} size={14} />
            <Text style={[styles.tabButtonText, activeTab === 'RADAR' && styles.tabButtonTextActive]}>RADAR MATRIX</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'MAP' && styles.tabButtonActive]} 
            onPress={() => setActiveTab('MAP')}
          >
            <MapPin color={activeTab === 'MAP' ? theme.colors.primary : theme.colors.dim} size={14} />
            <Text style={[styles.tabButtonText, activeTab === 'MAP' && styles.tabButtonTextActive]}>TACTICAL MAP</Text>
          </TouchableOpacity>
        </Animated.View>

        {activeTab === 'MAP' ? (
          <Animated.View entering={FadeInDown.delay(100).duration(800)} style={styles.mapPanelContainer}>
            {Platform.OS === 'web' ? (
              <View id="mobile-tactical-map" style={styles.webMapContainer} />
            ) : (
              <View style={styles.nativeFallbackMap}>
                <View style={styles.fallbackGrid}>
                  {/* Grid Lines */}
                  <View style={[styles.fallbackLine, { top: '25%', width: '100%', height: 1 }]} />
                  <View style={[styles.fallbackLine, { top: '50%', width: '100%', height: 1 }]} />
                  <View style={[styles.fallbackLine, { top: '75%', width: '100%', height: 1 }]} />
                  <View style={[styles.fallbackLine, { left: '25%', height: '100%', width: 1 }]} />
                  <View style={[styles.fallbackLine, { left: '50%', height: '100%', width: 1 }]} />
                  <View style={[styles.fallbackLine, { left: '75%', height: '100%', width: 1 }]} />
                  
                  {crisis ? (
                    <View style={styles.targetPulseContainer}>
                      <Animated.View style={[styles.targetPulseRing, animatedRingStyle]} />
                      <View style={styles.targetPulseDot} />
                      <Text style={styles.targetCoordsLabel}>
                        TARGET LOCKED // {crisis.location.toUpperCase()}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.noTargetContainer}>
                      <Text style={styles.noTargetText}>NO_ACTIVE_TARGETS</Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </Animated.View>
        ) : (
          /* Custom Radar Sweeper widget */
          <Animated.View entering={FadeInDown.delay(100).duration(800)} style={styles.radarContainer}>
            <View style={styles.radarBorder}>
              {/* Concentric rings */}
              <View style={[styles.radarRing, { width: 220, height: 220, borderRadius: 110 }]} />
              <View style={[styles.radarRing, { width: 160, height: 160, borderRadius: 80 }]} />
              <View style={[styles.radarRing, { width: 100, height: 100, borderRadius: 50 }]} />
              
              {/* Dashed axes */}
              <View style={styles.radarAxisH} />
              <View style={styles.radarAxisV} />

              {/* Sweep container */}
              <Animated.View style={[styles.radarSweepContainer, animatedRadarStyle]}>
                {/* Main glowing sweep line */}
                <View style={styles.sweepLine} />
                {/* Fading trail 1 */}
                <View style={[styles.sweepLineTrail, { transform: [{ rotate: '-1.5deg' }], opacity: 0.5 }]} />
                {/* Fading trail 2 */}
                <View style={[styles.sweepLineTrail, { transform: [{ rotate: '-3deg' }], opacity: 0.3 }]} />
                {/* Fading trail 3 */}
                <View style={[styles.sweepLineTrail, { transform: [{ rotate: '-5deg' }], opacity: 0.15 }]} />
              </Animated.View>

              {/* Pulsing Target blip (mirrors threat state) */}
              {crisis ? (
                <Animated.View style={[styles.radarBlipRed, animatedBlipStyle]} />
              ) : (
                <>
                  <Animated.View style={[styles.radarBlipGreen, { top: 60, left: 70 }, animatedBlipStyle]} />
                  <Animated.View style={[styles.radarBlipGreen, { bottom: 70, right: 60, opacity: 0.4 }, animatedBlipStyle]} />
                </>
              )}

              <Compass color="rgba(0, 240, 255, 0.2)" size={48} style={styles.compassOverlay} />
            </View>
          </Animated.View>
        )}

        {/* Telemetry Display */}
        {!crisis ? (
          <Animated.View 
            entering={FadeInUp.delay(200)}
            style={styles.clearCard}
          >
            <CheckCircle color={theme.colors.success} size={42} style={styles.clearIcon} />
            <Text style={styles.clearText}>NOMINAL STATUS SYSTEM</Text>
            <Text style={styles.clearSubText}>No active threats or crisis clusters isolated in current scanning sweeps.</Text>
            
            <View style={styles.hudTerminal}>
              <Text style={styles.hudTerminalText}>&gt; SCANNING FREQ: 9.4 GHz (SECURE)</Text>
              <Text style={styles.hudTerminalText}>&gt; CLUSTER_DETECTION: 0.00% ACCURACY</Text>
              <Text style={styles.hudTerminalText}>&gt; SWARM LOCK: STANDBY</Text>
            </View>
          </Animated.View>
        ) : (
          <Animated.View 
            entering={FadeInDown.duration(600)}
            layout={Layout.springify()}
            style={[
              globalStyles.glassCard, 
              crisis.severity === 'CRITICAL' ? styles.cardCritical : styles.cardHigh
            ]}
          >
            {/* Visual indicator corner glows */}
            <View style={crisis.severity === 'CRITICAL' ? styles.glowCritical : styles.glowHigh} />
            
            <View style={styles.alertHeaderRow}>
              <ShieldAlert color={crisis.severity === 'CRITICAL' ? theme.colors.alert : theme.colors.warning} size={30} />
              <View style={styles.alertTitleCol}>
                <Text style={styles.alertTitleText}>{crisis.crisis_type.toUpperCase()}</Text>
                <View style={[styles.badge, crisis.severity === 'CRITICAL' ? styles.badgeCritical : styles.badgeHigh]}>
                  <Text style={[styles.badgeText, { color: crisis.severity === 'CRITICAL' ? theme.colors.alert : theme.colors.warning }]}>
                    {crisis.severity} THREAT
                  </Text>
                </View>
              </View>
            </View>
            
            {/* Telemetry details HUD grid */}
            <View style={styles.infoGrid}>
              <View style={styles.gridRow}>
                <View style={styles.gridCell}>
                  <View style={styles.cellHeader}>
                    <MapPin color={theme.colors.dim} size={14} />
                    <Text style={styles.cellLabel}>ISOLATED LOC</Text>
                  </View>
                  <Text style={styles.cellValue}>{crisis.location.toUpperCase()}</Text>
                </View>
                
                <View style={styles.gridCell}>
                  <View style={styles.cellHeader}>
                    <Target color={theme.colors.dim} size={14} />
                    <Text style={styles.cellLabel}>SWARM CONFIDENCE</Text>
                  </View>
                  <Text style={styles.cellValue}>{crisis.confidence}% ACCURACY</Text>
                </View>
              </View>

              <View style={styles.gridRow}>
                <View style={[styles.gridCell, { borderBottomWidth: 0 }]}>
                  <View style={styles.cellHeader}>
                    <Zap color={theme.colors.dim} size={14} />
                    <Text style={styles.cellLabel}>AFFECTED BUFFER</Text>
                  </View>
                  <Text style={styles.cellValue}>
                    {crisis.affected_area_km2 || '4.2'} KM² IMPACT
                  </Text>
                </View>
                
                <View style={[styles.gridCell, { borderBottomWidth: 0 }]}>
                  <View style={styles.cellHeader}>
                    <Activity color={theme.colors.dim} size={14} />
                    <Text style={styles.cellLabel}>DETECTION ID</Text>
                  </View>
                  <Text style={styles.cellValue}>NXS-782A-C</Text>
                </View>
              </View>
            </View>

            {/* AI Reasoning Core console block */}
            <View style={styles.reasoningBox}>
              <View style={styles.reasoningHeader}>
                <Activity color={theme.colors.primary} size={14} />
                <Text style={styles.reasoningLabel}>AI COGNITION REASONING CORE</Text>
              </View>
              <Text style={styles.reasoningText}>
                {`[MATRIXLOG] `}{crisis.reasoning}
              </Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 110,
  },
  headerTelemetry: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(5, 5, 15, 0.4)',
    borderColor: theme.colors.border,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  telemetryText: {
    color: theme.colors.dim,
    fontFamily: theme.fonts.semibold,
    fontSize: 9,
    letterSpacing: 1,
    marginLeft: 6,
  },
  radarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 25,
  },
  radarBorder: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderColor: 'rgba(0, 240, 255, 0.15)',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },
  radarRing: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.08)',
  },
  radarAxisH: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(0, 240, 255, 0.08)',
  },
  radarAxisV: {
    position: 'absolute',
    height: '100%',
    width: 1,
    backgroundColor: 'rgba(0, 240, 255, 0.08)',
  },
  radarSweepContainer: {
    position: 'absolute',
    width: 240,
    height: 240,
    alignItems: 'center',
  },
  sweepLine: {
    position: 'absolute',
    top: 0,
    width: 2,
    height: 120,
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  sweepLineTrail: {
    position: 'absolute',
    top: 0,
    width: 1.5,
    height: 120,
    backgroundColor: theme.colors.primary,
  },
  radarBlipRed: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.alert,
    top: 80,
    right: 70,
    shadowColor: theme.colors.alert,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  radarBlipGreen: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.success,
    shadowColor: theme.colors.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
  },
  compassOverlay: {
    position: 'absolute',
    opacity: 0.2,
  },
  clearCard: {
    ...theme.glass,
    backgroundColor: 'rgba(16, 185, 129, 0.03)',
    borderColor: 'rgba(16, 185, 129, 0.15)',
    padding: 30,
    alignItems: 'center',
    shadowColor: theme.colors.success,
    shadowOpacity: 0.05,
  },
  clearIcon: {
    shadowColor: theme.colors.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    marginBottom: 15,
  },
  clearText: {
    color: theme.colors.success,
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    letterSpacing: 2,
    marginBottom: 8,
    textAlign: 'center',
  },
  clearSubText: {
    color: theme.colors.dim,
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  hudTerminal: {
    backgroundColor: '#020205',
    width: '100%',
    padding: 15,
    borderRadius: 8,
    borderColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
  },
  hudTerminalText: {
    color: theme.colors.dim,
    fontFamily: theme.fonts.mono,
    fontSize: 10,
    lineHeight: 16,
  },
  cardCritical: {
    borderColor: theme.colors.borderRed,
    shadowColor: theme.colors.alert,
    shadowOpacity: 0.18,
  },
  cardHigh: {
    borderColor: 'rgba(255, 224, 102, 0.15)',
    shadowColor: theme.colors.warning,
    shadowOpacity: 0.15,
  },
  glowCritical: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 6,
    height: '100%',
    backgroundColor: theme.colors.alert,
  },
  glowHigh: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 6,
    height: '100%',
    backgroundColor: theme.colors.warning,
  },
  alertHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingLeft: 10,
  },
  alertTitleCol: {
    marginLeft: 15,
  },
  alertTitleText: {
    color: '#ffffff',
    fontFamily: theme.fonts.bold,
    fontSize: 20,
    letterSpacing: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 0.5,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  badgeCritical: {
    borderColor: theme.colors.borderRed,
    backgroundColor: 'rgba(255, 0, 60, 0.08)',
  },
  badgeHigh: {
    borderColor: 'rgba(255, 224, 102, 0.2)',
    backgroundColor: 'rgba(255, 224, 102, 0.08)',
  },
  badgeText: {
    fontFamily: theme.fonts.bold,
    fontSize: 8,
    letterSpacing: 1.5,
  },
  infoGrid: {
    marginBottom: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    overflow: 'hidden',
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridCell: {
    flex: 1,
    padding: 15,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
  },
  cellHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cellLabel: {
    color: theme.colors.dim,
    fontFamily: theme.fonts.semibold,
    fontSize: 8,
    letterSpacing: 1,
    marginLeft: 6,
  },
  cellValue: {
    color: '#ffffff',
    fontFamily: theme.fonts.bold,
    fontSize: 13,
    marginTop: 2,
  },
  reasoningBox: {
    marginTop: 5,
    backgroundColor: '#020205',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  reasoningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reasoningLabel: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.bold,
    fontSize: 8,
    letterSpacing: 1.5,
    marginLeft: 6,
  },
  reasoningText: {
    color: '#cbd5e1',
    fontFamily: theme.fonts.mono,
    fontSize: 11,
    lineHeight: 18,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(5, 5, 15, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.15)',
    borderRadius: 8,
    padding: 3,
    marginVertical: 15,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 6,
    gap: 8,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(0, 240, 255, 0.12)',
    borderColor: 'rgba(0, 240, 255, 0.3)',
    borderWidth: 0.5,
  },
  tabButtonText: {
    fontFamily: theme.fonts.semibold,
    fontSize: 11,
    letterSpacing: 1,
    color: theme.colors.dim,
  },
  tabButtonTextActive: {
    color: theme.colors.primary,
    textShadowColor: 'rgba(0, 240, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  mapPanelContainer: {
    width: '100%',
    height: 320,
    marginVertical: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  webMapContainer: {
    width: '100%',
    height: '100%',
  },
  nativeFallbackMap: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  fallbackGrid: {
    width: '90%',
    height: '90%',
    borderColor: 'rgba(0, 240, 255, 0.08)',
    borderWidth: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackLine: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 240, 255, 0.05)',
  },
  targetPulseContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  targetPulseRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: theme.colors.alert,
    position: 'absolute',
  },
  targetPulseDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: theme.colors.alert,
  },
  targetCoordsLabel: {
    fontFamily: theme.fonts.mono,
    fontSize: 9,
    letterSpacing: 1,
    color: theme.colors.alert,
    marginTop: 40,
    textAlign: 'center',
  },
  noTargetContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTargetText: {
    fontFamily: theme.fonts.mono,
    fontSize: 10,
    letterSpacing: 2,
    color: theme.colors.dim,
  },
});
