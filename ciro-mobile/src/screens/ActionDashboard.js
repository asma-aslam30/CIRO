import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Dimensions, ActivityIndicator, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Activity, CheckCircle2, Clock, Terminal, Shield, Zap, ChevronRight } from 'lucide-react-native';
import Animated, { FadeInUp, FadeInRight, useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { actionsApi } from '../api/client';
import { theme } from '../lib/theme';

const { width } = Dimensions.get('window');

const ActionDashboard = ({ navigation }) => {
  const [actions, setActions] = useState([]);
  const pulseBase = useSharedValue(1);

  useEffect(() => {
    pulseBase.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );

    const fetchActions = async () => {
      try {
        const response = await actionsApi.getActions();
        const newActions = response.data.actions || [];
        if (newActions.length > actions.length && Platform.OS !== 'web') {
           Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        setActions(newActions);
      } catch (error) {
        console.error('Failed to fetch actions:', error);
      }
    };

    const interval = setInterval(fetchActions, 2000);
    return () => clearInterval(interval);
  }, [actions.length]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseBase.value }],
    opacity: 0.8 / pulseBase.value
  }));

  const renderActionItem = ({ item, index }) => {
    const isCompleted = item.status === 'Completed' || item.status === 'EXECUTED';
    return (
      <Animated.View 
        entering={FadeInUp.delay(index * 100).duration(500)}
        style={styles.actionCard}
      >
        <LinearGradient
          colors={['rgba(5, 5, 15, 0.75)', 'rgba(10, 10, 20, 0.85)']}
          style={styles.cardGradient}
        />
        
        <View style={[styles.cardGlow, { backgroundColor: isCompleted ? theme.colors.success : theme.colors.primary }]} />

        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Zap color={isCompleted ? theme.colors.success : theme.colors.primary} size={20} />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.actionTitle}>{item.action.toUpperCase()}</Text>
            <View style={styles.timeRow}>
              <Clock color={theme.colors.dim} size={12} />
              <Text style={styles.timeText}>{item.time || '00:00:00'}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, isCompleted ? styles.statusCompleted : styles.statusActive]}>
            <CheckCircle2 color={isCompleted ? theme.colors.success : theme.colors.primary} size={11} />
            <Text style={[styles.statusText, { color: isCompleted ? theme.colors.success : theme.colors.primary }]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.cardDivider} />

        <Text style={styles.actionDetail}>{item.detail}</Text>
        
        <View style={styles.cardFooter}>
          <Shield color="rgba(0, 240, 255, 0.3)" size={13} />
          <Text style={styles.footerText}>SECURE PROTOCOL {index + 104}-B</Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={[theme.colors.bgDark, theme.colors.bgDarkSecondary]} style={styles.background} />
      
      <Animated.View entering={FadeInRight.duration(800)} style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.brand}>
            <Activity color={theme.colors.primary} size={22} />
            <Text style={styles.brandText}>NEXUS<Text style={{fontWeight: '300'}}>CORE</Text></Text>
          </View>
          <View style={styles.onlineStatus}>
            <Animated.View style={[styles.pulseDot, pulseStyle]} />
            <View style={[styles.pulseDot, { position: 'absolute', left: 10 }]} />
            <Text style={styles.onlineText}>LIVE PIPELINE</Text>
          </View>
        </View>
        
        <Text style={styles.headerTitle}>Action Orchestration</Text>
        <Text style={styles.headerSubtitle}>Real-time mitigation execution stream</Text>
      </Animated.View>

      <View style={styles.terminalBar}>
        <Terminal color={theme.colors.primary} size={14} />
        <Text style={styles.terminalText}>SYSTEM_ACTION_LOGS.sh</Text>
        <View style={styles.terminalDecor} />
      </View>

      <FlatList
        data={actions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderActionItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ActivityIndicator color={theme.colors.primary} size="large" />
            <Text style={styles.emptyText}>Awaiting pipeline triggers...</Text>
          </View>
        }
      />

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.doneButton}
          onPress={() => {
            if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            navigation.navigate('OutcomeView');
          }}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.accent]}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.doneButtonText}>VIEW IMPACT SUMMARY</Text>
            <ChevronRight color={theme.colors.bgDark} size={18} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bgDark },
  background: { ...StyleSheet.absoluteFillObject },
  header: { padding: 20, paddingTop: 10 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  brand: { flexDirection: 'row', alignItems: 'center' },
  brandText: { color: '#fff', fontSize: 18, fontFamily: theme.fonts.bold, marginLeft: 10, letterSpacing: 2 },
  onlineStatus: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 240, 255, 0.08)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderColor: theme.colors.border, borderWidth: 1 },
  pulseDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: theme.colors.primary, marginRight: 6 },
  onlineText: { color: theme.colors.primary, fontSize: 9, fontFamily: theme.fonts.bold, letterSpacing: 0.5 },
  headerTitle: { fontSize: 26, fontFamily: theme.fonts.bold, color: '#fff', letterSpacing: 1 },
  headerSubtitle: { fontSize: 13, color: theme.colors.dim, marginTop: 4, fontFamily: theme.fonts.semibold },
  terminalBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#020205', marginHorizontal: 20, padding: 12, borderRadius: 8, borderLeftWidth: 4, borderLeftColor: theme.colors.primary, borderWidth: 1, borderColor: 'rgba(255,255,255,0.03)' },
  terminalText: { color: theme.colors.primary, fontSize: 11, fontFamily: theme.fonts.mono, marginLeft: 10 },
  terminalDecor: { flex: 1, height: 1, backgroundColor: 'rgba(0, 240, 255, 0.05)', marginLeft: 15 },
  listContent: { padding: 20, paddingBottom: 100 },
  actionCard: { ...theme.glass, marginBottom: 15, position: 'relative', overflow: 'hidden' },
  cardGradient: { ...StyleSheet.absoluteFillObject },
  cardGlow: { position: 'absolute', top: 0, left: 0, width: 4, height: '100%' },
  cardHeader: { flexDirection: 'row', padding: 15, alignItems: 'center' },
  iconContainer: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0, 240, 255, 0.08)', justifyContent: 'center', alignItems: 'center' },
  titleContainer: { flex: 1, marginLeft: 12 },
  actionTitle: { color: '#fff', fontSize: 14, fontFamily: theme.fonts.bold },
  timeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2, gap: 4 },
  timeText: { color: theme.colors.dim, fontSize: 11, fontFamily: theme.fonts.semibold },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: 'rgba(0,0,0,0.4)', gap: 4 },
  statusCompleted: { borderColor: 'rgba(16, 185, 129, 0.2)', borderWidth: 0.5 },
  statusActive: { borderColor: theme.colors.border, borderWidth: 0.5 },
  statusText: { fontSize: 8, fontFamily: theme.fonts.bold, letterSpacing: 1 },
  cardDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginHorizontal: 15 },
  actionDetail: { color: '#cbd5e1', fontSize: 13, lineHeight: 18, padding: 15, fontFamily: theme.fonts.regular },
  cardFooter: { flexDirection: 'row', alignItems: 'center', padding: 10, paddingHorizontal: 15, backgroundColor: 'rgba(0,0,0,0.2)', gap: 8 },
  footerText: { color: theme.colors.dim, fontSize: 9, fontFamily: theme.fonts.bold, letterSpacing: 1 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: 'transparent' },
  doneButton: { height: 56, borderRadius: 8, overflow: 'hidden', shadowColor: theme.colors.primary, shadowOpacity: 0.4, shadowRadius: 10, elevation: 8 },
  buttonGradient: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  doneButtonText: { color: theme.colors.bgDark, fontSize: 13, fontFamily: theme.fonts.bold, letterSpacing: 1.5 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { color: theme.colors.dim, marginTop: 20, fontSize: 14, fontFamily: theme.fonts.semibold }
});

export default ActionDashboard;
