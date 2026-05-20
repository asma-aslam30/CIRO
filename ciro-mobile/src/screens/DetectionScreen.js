import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { dataAPI } from '../lib/api';
import { LinearGradient } from 'expo-linear-gradient';

export default function DetectionScreen() {
  const [crisis, setCrisis] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCrisis = async () => {
    try {
      const data = await dataAPI.getCrisis();
      if (data && data.crisis_type) {
        setCrisis(data);
      } else {
        setCrisis(null); // Clear or none
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCrisis();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchCrisis();
    const interval = setInterval(fetchCrisis, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <LinearGradient colors={['#05050f', '#0a0f1e', '#05050f']} style={styles.container}>
      <ScrollView 
        contentContainerStyle={{ padding: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00f0ff" />}
      >
        <Text style={styles.header}>Crisis Radar</Text>
        
        {!crisis ? (
          <View style={styles.clearCard}>
            <Text style={styles.clearText}>Status: Clear</Text>
            <Text style={styles.subText}>No critical incidents detected.</Text>
          </View>
        ) : (
          <View style={[styles.glassCard, crisis.severity === 'CRITICAL' ? styles.cardCritical : styles.cardHigh]}>
            <Text style={styles.alertHeader}>🚨 {crisis.crisis_type} Detected</Text>
            
            <View style={styles.row}>
              <Text style={styles.label}>Location:</Text>
              <Text style={styles.value}>{crisis.location}</Text>
            </View>
            
            <View style={styles.row}>
              <Text style={styles.label}>Confidence:</Text>
              <Text style={styles.value}>{crisis.confidence}%</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Severity:</Text>
              <Text style={[styles.value, { color: crisis.severity === 'CRITICAL' ? '#ff003c' : '#ffe066' }]}>
                {crisis.severity}
              </Text>
            </View>

            <View style={styles.reasoningBox}>
              <Text style={styles.reasoningLabel}>AI Reasoning:</Text>
              <Text style={styles.reasoningText}>{crisis.reasoning}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { color: '#00f0ff', fontSize: 28, fontFamily: 'Outfit_700Bold', marginBottom: 20, letterSpacing: 1, textShadowColor: 'rgba(0, 240, 255, 0.5)', textShadowOffset: {width: 0, height: 0}, textShadowRadius: 10 },
  clearCard: { backgroundColor: 'rgba(0, 240, 255, 0.05)', borderColor: '#00f0ff', borderWidth: 1, borderRadius: 16, padding: 30, alignItems: 'center' },
  clearText: { color: '#00f0ff', fontSize: 20, fontFamily: 'Outfit_700Bold', marginBottom: 10 },
  subText: { color: '#7a8baa', fontSize: 14, fontFamily: 'Outfit_400Regular' },
  glassCard: { backgroundColor: 'rgba(10, 15, 30, 0.6)', borderRadius: 16, padding: 20, marginBottom: 20, borderWidth: 1, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 10 },
  cardHigh: { borderColor: 'rgba(255, 224, 102, 0.4)', shadowColor: '#ffe066' },
  cardCritical: { borderColor: 'rgba(255, 0, 60, 0.4)', shadowColor: '#ff003c' },
  alertHeader: { color: '#fff', fontSize: 24, fontFamily: 'Outfit_700Bold', marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  label: { color: '#7a8baa', fontSize: 16, fontFamily: 'Outfit_600SemiBold' },
  value: { color: '#fff', fontSize: 16, fontFamily: 'Outfit_700Bold' },
  reasoningBox: { marginTop: 20, backgroundColor: 'rgba(5, 8, 20, 0.8)', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0, 240, 255, 0.3)' },
  reasoningLabel: { color: '#00f0ff', fontSize: 14, fontFamily: 'Outfit_700Bold', marginBottom: 5 },
  reasoningText: { color: '#e0e8ff', fontSize: 14, fontFamily: 'Outfit_400Regular', lineHeight: 22 },
});
