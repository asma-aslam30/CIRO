import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl, 
  Platform 
} from 'react-native';
import { dataAPI } from '../lib/api';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInUp, 
  Layout,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence
} from 'react-native-reanimated';
import { 
  ListChecks, 
  CheckCircle2, 
  CircleDashed, 
  Terminal,
  Activity,
  Cpu
} from 'lucide-react-native';
import { theme, globalStyles } from '../lib/theme';

export default function ActionPlanScreen() {
  const [actions, setActions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const pulseOpacity = useSharedValue(0.4);

  const fetchActions = async () => {
    try {
      const data = await dataAPI.getActions();
      if (data && data.actions) {
        setActions(data.actions);
      }
    } catch (err) {
      console.error('Failed to query active orchestration logs:', err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchActions();
    setRefreshing(false);
  };

  useEffect(() => {
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0.4, { duration: 1000 })
      ),
      -1,
      true
    );

    fetchActions();
    const interval = setInterval(fetchActions, 3000);
    return () => clearInterval(interval);
  }, []);

  const animatedPulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value
  }));

  // Calculations for progress tracking
  const totalActions = actions.length;
  const executedActions = actions.filter(act => act.status === 'EXECUTED').length;
  const progressPercent = totalActions > 0 ? Math.round((executedActions / totalActions) * 100) : 0;

  return (
    <LinearGradient 
      colors={[theme.colors.bgDark, theme.colors.bgDarkSecondary, theme.colors.bgDark]} 
      style={globalStyles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.accent} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Custom Header Bar */}
        <Animated.View entering={FadeInUp.duration(800)} style={globalStyles.headerRow}>
          <View>
            <Text style={globalStyles.headerTitle}>
              RESPONSE <Text style={[globalStyles.neonText, { color: theme.colors.accent, textShadowColor: 'rgba(176, 38, 255, 0.4)' }]}>PLAN</Text>
            </Text>
            <Text style={globalStyles.subtitle}>Swarms Orchestration matrix</Text>
          </View>
          
          <View style={styles.headerIndicator}>
            <ListChecks color={theme.colors.accent} size={14} />
            <Text style={styles.indicatorText}>SECURE_DECK</Text>
          </View>
        </Animated.View>

        {/* Protocol Execution Progress Meter */}
        <Animated.View entering={FadeInUp.delay(100).duration(800)} style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Cpu color={theme.colors.accent} size={16} />
            <Text style={styles.progressTitle}>MITIGATION PROGRESS</Text>
            <Text style={styles.progressPercentage}>{progressPercent}%</Text>
          </View>
          
          {/* Custom Web-like progress bar */}
          <View style={styles.progressBarBg}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: `${progressPercent}%`, backgroundColor: theme.colors.accent }
              ]} 
            />
          </View>
          
          <View style={styles.progressFooter}>
            <Text style={styles.footerText}>EXECUTED: {executedActions} / {totalActions} PROTOCOLS</Text>
            <Text style={styles.footerText}>LOCK: NOMINAL</Text>
          </View>
        </Animated.View>

        {/* Actions Timeline */}
        {totalActions === 0 ? (
          <View style={styles.emptyContainer}>
            <CircleDashed color={theme.colors.dim} size={42} style={styles.emptyIcon} />
            <Text style={styles.emptyText}>ORCHESTRATION INACTIVE</Text>
            <Text style={styles.emptySub}>Awaiting signal detection. Inject a threat telemetry on the Dashboard to execute action protocols.</Text>
          </View>
        ) : (
          actions.map((act, index) => {
            const isExecuted = act.status === 'EXECUTED';
            return (
              <Animated.View 
                key={index} 
                entering={FadeInUp.delay(index * 100).duration(600)}
                layout={Layout.springify()}
                style={[
                  globalStyles.glassCard, 
                  isExecuted ? styles.cardSuccess : styles.cardPending
                ]}
              >
                {/* Visual vertical glow strip */}
                <View style={[styles.glowStrip, { backgroundColor: isExecuted ? theme.colors.success : theme.colors.accent }]} />
                
                <View style={styles.cardHeader}>
                  <View style={styles.titleRow}>
                    <Terminal color={theme.colors.accent} size={15} />
                    <Text style={styles.actionTitle}>{act.action.toUpperCase()}</Text>
                  </View>
                  
                  <View style={[styles.badge, isExecuted ? styles.badgeSuccess : styles.badgePending]}>
                    {isExecuted ? (
                      <CheckCircle2 color={theme.colors.success} size={12} />
                    ) : (
                      <Animated.View style={[styles.pulsingIconContainer, animatedPulseStyle]}>
                        <CircleDashed color={theme.colors.accent} size={12} />
                      </Animated.View>
                    )}
                    <Text style={[styles.badgeText, { color: isExecuted ? theme.colors.success : theme.colors.accent }]}>
                      {act.status}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.divider} />
                <Text style={styles.detailText}>{act.detail}</Text>
                
                <View style={styles.cardFooter}>
                  <Text style={styles.footerDetailText}>TIMESTAMP: {act.time || '00:00:00'}</Text>
                  <Text style={styles.protocolText}>NXS_PROT_88{index}</Text>
                </View>
              </Animated.View>
            );
          })
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
  headerIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(5, 5, 15, 0.4)',
    borderColor: theme.colors.border,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  indicatorText: {
    color: theme.colors.dim,
    fontFamily: theme.fonts.semibold,
    fontSize: 9,
    letterSpacing: 1,
    marginLeft: 6,
  },
  progressCard: {
    ...theme.glass,
    backgroundColor: 'rgba(5, 5, 15, 0.75)',
    padding: 20,
    marginBottom: 20,
    borderColor: theme.colors.borderPurple,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    color: '#ffffff',
    fontFamily: theme.fonts.bold,
    fontSize: 12,
    letterSpacing: 1.5,
    marginLeft: 8,
    flex: 1,
  },
  progressPercentage: {
    color: theme.colors.accent,
    fontFamily: theme.fonts.bold,
    fontSize: 14,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  footerText: {
    color: theme.colors.dim,
    fontFamily: theme.fonts.semibold,
    fontSize: 8,
    letterSpacing: 1,
  },
  emptyContainer: {
    ...theme.glass,
    padding: 40,
    alignItems: 'center',
    marginTop: 40,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  emptyIcon: {
    opacity: 0.25,
    marginBottom: 20,
  },
  emptyText: {
    color: theme.colors.dim,
    fontFamily: theme.fonts.bold,
    fontSize: 14,
    letterSpacing: 2,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySub: {
    color: 'rgba(100, 116, 139, 0.7)',
    fontFamily: theme.fonts.regular,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 18,
  },
  cardSuccess: {
    borderColor: 'rgba(16, 185, 129, 0.15)',
    shadowColor: theme.colors.success,
    shadowOpacity: 0.1,
  },
  cardPending: {
    borderColor: theme.colors.borderPurple,
    shadowColor: theme.colors.accent,
    shadowOpacity: 0.12,
  },
  glowStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    height: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingLeft: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  actionTitle: {
    color: '#ffffff',
    fontFamily: theme.fonts.bold,
    fontSize: 14,
    marginLeft: 10,
    letterSpacing: 0.5,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 0.5,
  },
  badgeSuccess: {
    borderColor: 'rgba(16, 185, 129, 0.3)',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  badgePending: {
    borderColor: 'rgba(176, 38, 255, 0.3)',
    backgroundColor: 'rgba(176, 38, 255, 0.05)',
  },
  badgeText: {
    fontFamily: theme.fonts.bold,
    fontSize: 9,
    fontWeight: '900',
    marginLeft: 5,
    letterSpacing: 1,
  },
  pulsingIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 15,
  },
  detailText: {
    color: '#cbd5e1',
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    lineHeight: 20,
    paddingLeft: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.03)',
    paddingHorizontal: 8,
  },
  footerDetailText: {
    color: theme.colors.dim,
    fontFamily: theme.fonts.semibold,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  protocolText: {
    color: 'rgba(176, 38, 255, 0.4)',
    fontFamily: theme.fonts.mono,
    fontSize: 9,
    fontWeight: 'bold',
  },
});
