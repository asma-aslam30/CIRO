import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield, MapPin, AlertCircle, CheckCircle } from 'lucide-react-native';
import { crisisApi } from '../api/client';

const CrisisBoard = ({ navigation }) => {
  const [crisis, setCrisis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pollCrisis = setInterval(async () => {
      try {
        const response = await crisisApi.getCrisis();
        if (response.data.crisis_type) {
          setCrisis(response.data);
          setLoading(false);
          clearInterval(pollCrisis);
        }
      } catch (error) {
        console.error(error);
      }
    }, 2000);

    return () => clearInterval(pollCrisis);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#0f172a', '#1e293b']} style={styles.background} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#ef4444" />
          <Text style={styles.loadingText}>AGENT PIPELINE IN PROGRESS...</Text>
          <Text style={styles.loadingSubtext}>Antigravity is cross-referencing signals</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#0f172a', '#1e293b']} style={styles.background} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Shield color="#ef4444" size={32} />
          <Text style={styles.headerTitle}>Crisis Detected</Text>
        </View>

        <View style={styles.crisisCard}>
          <View style={styles.typeRow}>
            <Text style={styles.crisisType}>{crisis.crisis_type}</Text>
            <View style={[styles.severityBadge, { backgroundColor: crisis.severity === 'HIGH' ? '#ef4444' : '#f59e0b' }]}>
              <Text style={styles.severityText}>{crisis.severity}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MapPin color="#94a3b8" size={18} />
            <Text style={styles.infoText}>{crisis.location}</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{crisis.confidence}%</Text>
              <Text style={styles.statLabel}>Confidence</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{crisis.affected_area_km2}</Text>
              <Text style={styles.statLabel}>Area km²</Text>
            </View>
          </View>

          <Text style={styles.reasoningTitle}>Agent Reasoning:</Text>
          <Text style={styles.reasoningText}>{crisis.reasoning}</Text>
        </View>

        <TouchableOpacity 
          style={styles.nextButton}
          onPress={() => navigation.navigate('ActionDashboard')}
        >
          <Text style={styles.nextButtonText}>VIEW RESPONSE STRATEGY</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  background: { ...StyleSheet.absoluteFillObject },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  loadingText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 20, textAlign: 'center' },
  loadingSubtext: { color: '#94a3b8', fontSize: 14, marginTop: 8, textAlign: 'center' },
  content: { padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 25, marginTop: 10 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginLeft: 12 },
  crisisCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  typeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  crisisType: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  severityBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  severityText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  infoText: { color: '#94a3b8', marginLeft: 8, fontSize: 16 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statBox: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 15, borderRadius: 12, width: '48%', alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  statLabel: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
  reasoningTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  reasoningText: { color: '#cbd5e1', fontSize: 14, lineHeight: 20 },
  nextButton: { backgroundColor: '#3b82f6', padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 30 },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default CrisisBoard;
