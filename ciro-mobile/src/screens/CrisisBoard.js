import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield, MapPin, AlertCircle, CheckCircle } from 'lucide-react-native';
import { crisisApi } from '../api/client';
import { theme } from '../lib/theme';
import * as Haptics from 'expo-haptics';

const CrisisBoard = ({ navigation }) => {
  const [crisis, setCrisis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pollCrisis = setInterval(async () => {
      try {
        const response = await crisisApi.getCrisis();
        if (response.data && response.data.crisis_type) {
          setCrisis(response.data);
          setLoading(false);
          clearInterval(pollCrisis);
        }
      } catch (error) {
        console.error('Failed to poll crisis register:', error);
      }
    }, 2000);

    return () => clearInterval(pollCrisis);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={[theme.colors.bgDark, theme.colors.bgDarkSecondary]} style={styles.background} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>AGENT MATRIX SEARCHING...</Text>
          <Text style={styles.loadingSubtext}>Antigravity is cross-referencing field data streams</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={[theme.colors.bgDark, theme.colors.bgDarkSecondary]} style={styles.background} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Shield color={theme.colors.alert} size={30} />
          <Text style={styles.headerTitle}>Threat Isolated</Text>
        </View>

        <View style={[styles.crisisCard, crisis.severity === 'CRITICAL' ? styles.cardCritical : styles.cardHigh]}>
          <View style={styles.glowStrip} />
          
          <View style={styles.typeRow}>
            <Text style={styles.crisisType}>{crisis.crisis_type.toUpperCase()}</Text>
            <View style={[styles.severityBadge, { backgroundColor: crisis.severity === 'CRITICAL' ? 'rgba(255, 0, 60, 0.15)' : 'rgba(255, 224, 102, 0.15)', borderColor: crisis.severity === 'CRITICAL' ? theme.colors.alert : theme.colors.warning }]}>
              <Text style={[styles.severityText, { color: crisis.severity === 'CRITICAL' ? theme.colors.alert : theme.colors.warning }]}>{crisis.severity}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MapPin color={theme.colors.dim} size={16} />
            <Text style={styles.infoText}>{crisis.location.toUpperCase()}</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{crisis.confidence}%</Text>
              <Text style={styles.statLabel}>Confidence</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{crisis.affected_area_km2 || '4.2'}</Text>
              <Text style={styles.statLabel}>Area km²</Text>
            </View>
          </View>

          <Text style={styles.reasoningTitle}>AI REASONING CORE:</Text>
          <Text style={styles.reasoningText}>{crisis.reasoning}</Text>
        </View>

        <TouchableOpacity 
          style={styles.nextButton}
          onPress={() => {
            if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            navigation.navigate('ActionDashboard');
          }}
          activeOpacity={0.8}
        >
          <LinearGradient colors={[theme.colors.primary, theme.colors.accent]} style={styles.btnGradient} start={{x:0,y:0}} end={{x:1,y:0}}>
            <Text style={styles.nextButtonText}>VIEW RESPONSE STRATEGY</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bgDark },
  background: { ...StyleSheet.absoluteFillObject },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  loadingText: { color: '#fff', fontSize: 16, fontFamily: theme.fonts.bold, marginTop: 20, textAlign: 'center', letterSpacing: 1.5 },
  loadingSubtext: { color: theme.colors.dim, fontSize: 12, fontFamily: theme.fonts.regular, marginTop: 8, textAlign: 'center', lineHeight: 18 },
  content: { padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 25, marginTop: 10, gap: 12 },
  headerTitle: { fontSize: 24, fontFamily: theme.fonts.bold, color: '#fff', letterSpacing: 1 },
  crisisCard: { ...theme.glass, backgroundColor: 'rgba(5, 5, 15, 0.75)', padding: 20, position: 'relative', overflow: 'hidden' },
  cardCritical: { borderColor: theme.colors.borderRed },
  cardHigh: { borderColor: 'rgba(255, 224, 102, 0.15)' },
  glowStrip: { position: 'absolute', top: 0, left: 0, width: 4, height: '100%', backgroundColor: theme.colors.primary },
  typeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  crisisType: { fontSize: 20, fontFamily: theme.fonts.bold, color: '#fff', letterSpacing: 0.5 },
  severityBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 0.5 },
  severityText: { fontFamily: theme.fonts.bold, fontSize: 10, letterSpacing: 1 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 8 },
  infoText: { color: theme.colors.dim, fontSize: 14, fontFamily: theme.fonts.semibold },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statBox: { backgroundColor: 'rgba(0, 0, 0, 0.4)', padding: 15, borderRadius: 10, width: '48%', alignItems: 'center', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.03)' },
  statValue: { fontSize: 18, fontFamily: theme.fonts.bold, color: '#fff' },
  statLabel: { fontSize: 10, color: theme.colors.dim, marginTop: 4, fontFamily: theme.fonts.semibold, letterSpacing: 0.5, textTransform: 'uppercase' },
  reasoningTitle: { fontSize: 11, fontFamily: theme.fonts.bold, color: theme.colors.primary, marginBottom: 8, letterSpacing: 1.5 },
  reasoningText: { color: '#cbd5e1', fontSize: 13, lineHeight: 20, fontFamily: theme.fonts.mono },
  nextButton: { marginTop: 25, borderRadius: 8, overflow: 'hidden', shadowColor: theme.colors.primary, shadowOpacity: 0.4, shadowRadius: 10, elevation: 5 },
  btnGradient: { padding: 16, alignItems: 'center' },
  nextButtonText: { color: theme.colors.bgDark, fontSize: 14, fontFamily: theme.fonts.bold, letterSpacing: 1.5 },
});

export default CrisisBoard;
