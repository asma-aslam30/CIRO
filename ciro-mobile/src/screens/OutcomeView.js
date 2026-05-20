import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingDown, Users, FileText, RefreshCw } from 'lucide-react-native';
import { actionsApi } from '../api/client';

const OutcomeView = ({ navigation }) => {
  const [state, setState] = useState({ before: {}, after: {} });

  useEffect(() => {
    const fetchState = async () => {
      try {
        const response = await actionsApi.getState();
        setState(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchState();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#0f172a', '#1e293b']} style={styles.background} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TrendingDown color="#10b981" size={32} />
          <Text style={styles.headerTitle}>System Outcome</Text>
        </View>

        <View style={styles.comparisonContainer}>
          <View style={styles.stateCard}>
            <Text style={styles.stateLabel}>BEFORE RESPONSE</Text>
            {Object.entries(state.before).map(([key, val]) => (
              <View key={key} style={styles.stateRow}>
                <Text style={styles.stateKey}>{key.toUpperCase()}:</Text>
                <Text style={[styles.stateVal, { color: '#ef4444' }]}>{val}</Text>
              </View>
            ))}
          </View>

          <View style={styles.arrowContainer}>
            <Text style={styles.arrowText}>↓</Text>
          </View>

          <View style={styles.stateCard}>
            <Text style={styles.stateLabel}>AFTER RESPONSE</Text>
            {Object.entries(state.after).map(([key, val]) => (
              <View key={key} style={styles.stateRow}>
                <Text style={styles.stateKey}>{key.toUpperCase()}:</Text>
                <Text style={[styles.stateVal, { color: '#10b981' }]}>{val}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.impactGrid}>
          <View style={styles.impactBox}>
            <Users color="#3b82f6" size={24} />
            <Text style={styles.impactValue}>12,400</Text>
            <Text style={styles.impactLabel}>Users Alerted</Text>
          </View>
          <View style={styles.impactBox}>
            <FileText color="#f59e0b" size={24} />
            <Text style={styles.impactValue}>4</Text>
            <Text style={styles.impactLabel}>Agencies Coordinated</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.resetButton}
          onPress={() => navigation.navigate('InputPanel')}
        >
          <RefreshCw color="#fff" size={20} />
          <Text style={styles.resetText}>NEW SCENARIO</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  background: { ...StyleSheet.absoluteFillObject },
  content: { padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 25, marginTop: 10 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginLeft: 12 },
  comparisonContainer: { marginBottom: 30 },
  stateCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  stateLabel: { fontSize: 12, fontWeight: 'bold', color: '#94a3b8', marginBottom: 12, letterSpacing: 1 },
  stateRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  stateKey: { color: '#fff', fontSize: 14, fontWeight: '500' },
  stateVal: { fontSize: 14, fontWeight: 'bold' },
  arrowContainer: { alignItems: 'center', padding: 10 },
  arrowText: { color: '#3b82f6', fontSize: 24, fontWeight: 'bold' },
  impactGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  impactBox: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 20, width: '48%', alignItems: 'center' },
  impactValue: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginTop: 10 },
  impactLabel: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
  resetButton: { flexDirection: 'row', backgroundColor: '#3b82f6', padding: 18, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  resetText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
});

export default OutcomeView;
