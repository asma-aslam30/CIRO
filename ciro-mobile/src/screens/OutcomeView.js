import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingDown, Users, FileText, RefreshCw, ChevronRight, Activity, ArrowDown } from 'lucide-react-native';
import Animated, { FadeInUp, FadeInDown, FadeInLeft, FadeInRight, useSharedValue, useAnimatedStyle, withSpring, withDelay } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { actionsApi } from '../api/client';
import { theme } from '../lib/theme';

const { width } = Dimensions.get('window');

const OutcomeView = ({ navigation }) => {
  const [state, setState] = useState({ before: {}, after: {} });

  useEffect(() => {
    const fetchState = async () => {
      try {
        const response = await actionsApi.getState();
        setState(response.data);
      } catch (error) {
        console.error('Failed to fetch outcome registers:', error);
      }
    };
    fetchState();
  }, []);

  const renderMetric = (label, val, color, index) => (
    <Animated.View 
      entering={FadeInUp.delay(300 + index * 100).duration(600)}
      key={label} 
      style={styles.stateRow}
    >
      <Text style={styles.stateKey}>{label.toUpperCase()}</Text>
      <Text style={[styles.stateVal, { color }]}>{val}</Text>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={[theme.colors.bgDark, theme.colors.bgDarkSecondary]} style={styles.background} />
      
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(800)} style={styles.header}>
          <TrendingDown color={theme.colors.primary} size={30} />
          <View style={{ marginLeft: 15 }}>
            <Text style={styles.headerTitle}>Impact Summary</Text>
            <Text style={styles.headerSubtitle}>Post-mitigation efficiency metrics</Text>
          </View>
        </Animated.View>

        <View style={styles.comparisonContainer}>
          {/* Pre response card */}
          <Animated.View 
            entering={FadeInLeft.delay(200).duration(600)}
            style={[styles.stateCard, { borderColor: theme.colors.borderRed }]}
          >
            <View style={styles.cardHeader}>
              <Activity color={theme.colors.alert} size={15} />
              <Text style={[styles.stateLabel, { color: theme.colors.alert }]}>PRE-RESPONSE TELEMETRY</Text>
            </View>
            <View style={styles.cardDivider} />
            {Object.entries(state.before).length > 0 ? (
              Object.entries(state.before).map(([key, val], i) => renderMetric(key, val, theme.colors.alert, i))
            ) : (
              <Text style={styles.emptyText}>Zero records processed</Text>
            )}
          </Animated.View>

          <Animated.View 
            entering={FadeInUp.delay(400).duration(400)}
            style={styles.arrowContainer}
          >
            <ArrowDown color={theme.colors.primary} size={22} style={styles.arrowGlow} />
          </Animated.View>

          {/* Post response card */}
          <Animated.View 
            entering={FadeInRight.delay(200).duration(600)}
            style={[styles.stateCard, { borderColor: 'rgba(16, 185, 129, 0.25)' }]}
          >
            <View style={styles.cardHeader}>
              <TrendingDown color={theme.colors.success} size={15} />
              <Text style={[styles.stateLabel, { color: theme.colors.success }]}>POST-RESPONSE Telemetry</Text>
            </View>
            <View style={styles.cardDivider} />
            {Object.entries(state.after).length > 0 ? (
              Object.entries(state.after).map(([key, val], i) => renderMetric(key, val, theme.colors.success, i))
            ) : (
              <Text style={styles.emptyText}>Synthesizing logs...</Text>
            )}
          </Animated.View>
        </View>

        <View style={styles.impactGrid}>
          <Animated.View entering={FadeInUp.delay(600)} style={styles.impactBox}>
            <Users color={theme.colors.primary} size={22} />
            <Text style={styles.impactValue}>12,400</Text>
            <Text style={styles.impactLabel}>Operators Alerted</Text>
          </Animated.View>
          <Animated.View entering={FadeInUp.delay(700)} style={styles.impactBox}>
            <FileText color={theme.colors.warning} size={22} />
            <Text style={styles.impactValue}>4</Text>
            <Text style={styles.impactLabel}>Swarm Clusters</Text>
          </Animated.View>
        </View>

        <Animated.View entering={FadeInUp.delay(800)}>
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={() => {
              if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              navigation.navigate('MainTabs');
            }}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.accent]}
              style={styles.btnGradient}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            >
              <RefreshCw color={theme.colors.bgDark} size={18} />
              <Text style={styles.resetText}>RESET FIELD CONSOLE</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bgDark },
  background: { ...StyleSheet.absoluteFillObject },
  content: { padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 25, marginTop: 10 },
  headerTitle: { fontSize: 24, fontFamily: theme.fonts.bold, color: '#fff', letterSpacing: 1 },
  headerSubtitle: { fontSize: 13, color: theme.colors.dim, marginTop: 4, fontFamily: theme.fonts.semibold },
  comparisonContainer: { marginBottom: 25 },
  stateCard: { ...theme.glass, backgroundColor: 'rgba(5, 5, 15, 0.75)', padding: 18, marginBottom: 10 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  stateLabel: { fontSize: 10, fontFamily: theme.fonts.bold, letterSpacing: 1.5, textTransform: 'uppercase' },
  cardDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginBottom: 12 },
  stateRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  stateKey: { color: theme.colors.dim, fontSize: 11, fontFamily: theme.fonts.bold, letterSpacing: 0.5 },
  stateVal: { fontSize: 13, fontFamily: theme.fonts.bold },
  arrowContainer: { alignItems: 'center', marginVertical: 8, opacity: 0.5 },
  arrowGlow: { shadowColor: theme.colors.primary, shadowOffset: {width:0,height:0}, shadowOpacity: 0.6, shadowRadius: 5 },
  impactGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  impactBox: { ...theme.glass, backgroundColor: 'rgba(0,0,0,0.4)', padding: 18, width: '48%', alignItems: 'center', gap: 6 },
  impactValue: { fontSize: 22, fontFamily: theme.fonts.bold, color: '#fff', marginTop: 4 },
  impactLabel: { fontSize: 9, color: theme.colors.dim, marginTop: 2, fontFamily: theme.fonts.bold, letterSpacing: 1, textTransform: 'uppercase' },
  resetButton: { height: 56, borderRadius: 8, overflow: 'hidden', shadowColor: theme.colors.primary, shadowOpacity: 0.4, shadowRadius: 10, elevation: 8 },
  btnGradient: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  resetText: { color: theme.colors.bgDark, fontSize: 13, fontFamily: theme.fonts.bold, letterSpacing: 1.5 },
  emptyText: { color: theme.colors.dim, fontSize: 11, fontStyle: 'italic', textAlign: 'center', paddingVertical: 10, fontFamily: theme.fonts.semibold }
});

export default OutcomeView;
