import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, TextInput } from 'react-native';
import { signalAPI } from '../lib/api';
import { LinearGradient } from 'expo-linear-gradient';

export default function InputScreen() {
  const [loading, setLoading] = useState(false);
  const [customText, setCustomText] = useState('');

  const sendSignal = async (type, payload = null) => {
    setLoading(true);
    try {
      let signalData;
      if (type === 'custom' && payload) {
        signalData = { source: 'social_media', text: payload, location: 'Unknown' };
      } else if (type === 'social') {
        signalData = { source: 'social_media', text: 'G-10 mein pani bhar gaya hai, gaariyan phans gayi hain', location: 'G-10' };
      } else if (type === 'weather') {
        signalData = { source: 'weather_api', text: 'Heavy rainfall alert: 50mm expected in next 2 hours', location: 'Citywide', severity: 'HIGH' };
      } else if (type === 'traffic') {
        signalData = { source: 'traffic_sensors', text: 'Traffic congestion spike. Average speed < 5km/h', location: 'G-10 Markaz', severity: 'HIGH' };
      }
      
      await signalAPI.sendSignals([signalData]);
      alert(`Success: ${type.toUpperCase()} signal injected into CIRO Nexus.`);
      setCustomText(''); // clear input after sending
    } catch (err) {
      alert('Error: Failed to send signal.');
    } finally {
      setLoading(false);
    }
  };

  const triggerAnalysis = async () => {
    setLoading(true);
    try {
      await signalAPI.triggerAnalysis();
      alert('Analysis Triggered: Antigravity pipeline started in background. Check other tabs.');
    } catch (err) {
      alert('Error: No signals to analyze or pipeline failed.');
    } finally {
      setLoading(false);
    }
  };

  const resetSystem = async () => {
    await signalAPI.resetState();
    alert('Reset: CIRO Nexus state cleared.');
  };

  return (
    <LinearGradient colors={['#05050f', '#0a0f1e', '#05050f']} style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Signal Injection</Text>
        
        <View style={styles.glassCard}>
          <Text style={styles.cardTitle}>Simulate Crisis Inputs</Text>
          <Text style={styles.cardDesc}>Inject live field data directly into the CIRO central processing matrix.</Text>
          
          <View style={styles.customInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type custom social post..."
              placeholderTextColor="#7a8baa"
              value={customText}
              onChangeText={setCustomText}
            />
            <TouchableOpacity style={styles.btnCustom} onPress={() => sendSignal('custom', customText)} disabled={loading || !customText}>
              <Text style={styles.btnText}>Send</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.btnSocial} onPress={() => sendSignal('social')} disabled={loading}>
            <Text style={styles.btnText}>📝 Add Social Post (Flood)</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.btnWeather} onPress={() => sendSignal('weather')} disabled={loading}>
            <Text style={styles.btnText}>🌧 Trigger Weather Alert</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.btnTraffic} onPress={() => sendSignal('traffic')} disabled={loading}>
            <Text style={styles.btnText}>🚗 Simulate Traffic Spike</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.glassCard}>
          <Text style={styles.cardTitle}>Pipeline Control</Text>
          
          <TouchableOpacity onPress={triggerAnalysis} disabled={loading}>
            <LinearGradient colors={['#00f0ff', '#0099cc']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btnAnalyze}>
              <Text style={styles.btnTextAnalyze}>⚡ TRIGGER AI ANALYSIS</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnReset} onPress={resetSystem} disabled={loading}>
            <Text style={styles.btnTextReset}>↻ RESET SYSTEM STATE</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { color: '#00f0ff', fontSize: 28, fontFamily: 'Outfit_700Bold', marginBottom: 20, letterSpacing: 1, textShadowColor: 'rgba(0, 240, 255, 0.5)', textShadowOffset: {width: 0, height: 0}, textShadowRadius: 10 },
  glassCard: { backgroundColor: 'rgba(10, 15, 30, 0.6)', borderColor: 'rgba(0, 240, 255, 0.2)', borderWidth: 1, borderRadius: 16, padding: 20, marginBottom: 20, shadowColor: '#00f0ff', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 10 },
  cardTitle: { color: '#e0e8ff', fontSize: 20, fontFamily: 'Outfit_700Bold', marginBottom: 10 },
  cardDesc: { color: '#7a8baa', fontSize: 14, fontFamily: 'Outfit_400Regular', marginBottom: 20 },
  btnSocial: { backgroundColor: 'rgba(168, 85, 247, 0.15)', borderColor: '#a855f7', borderWidth: 1, padding: 15, borderRadius: 8, marginBottom: 12 },
  btnWeather: { backgroundColor: 'rgba(0, 240, 255, 0.15)', borderColor: '#00f0ff', borderWidth: 1, padding: 15, borderRadius: 8, marginBottom: 12 },
  btnTraffic: { backgroundColor: 'rgba(255, 224, 102, 0.15)', borderColor: '#ffe066', borderWidth: 1, padding: 15, borderRadius: 8, marginBottom: 12 },
  btnText: { color: '#fff', fontSize: 16, fontFamily: 'Outfit_600SemiBold', textAlign: 'center' },
  customInputContainer: { flexDirection: 'row', marginBottom: 15 },
  input: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', borderColor: 'rgba(0, 240, 255, 0.3)', borderWidth: 1, borderRadius: 8, padding: 12, color: '#e0e8ff', fontFamily: 'Outfit_400Regular', marginRight: 10 },
  btnCustom: { backgroundColor: 'rgba(0, 240, 255, 0.2)', borderColor: '#00f0ff', borderWidth: 1, padding: 12, borderRadius: 8, justifyContent: 'center' },
  btnAnalyze: { padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 15, shadowColor: '#00f0ff', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 8 },
  btnTextAnalyze: { color: '#05050f', fontSize: 16, fontFamily: 'Outfit_700Bold', letterSpacing: 1 },
  btnReset: { backgroundColor: 'transparent', borderColor: '#ff003c', borderWidth: 1, padding: 15, borderRadius: 8, alignItems: 'center' },
  btnTextReset: { color: '#ff003c', fontSize: 14, fontFamily: 'Outfit_700Bold', letterSpacing: 1 },
});
