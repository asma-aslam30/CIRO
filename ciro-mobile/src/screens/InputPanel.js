import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Send, AlertTriangle, CloudRain, Car } from 'lucide-react-native';
import { signalsApi } from '../api/client';

const EXAMPLES = [
  { id: '1', text: 'G-10 mein pani bhar gaya hai, gaariyan phans gayi hain', type: 'Flood', icon: CloudRain, color: '#3b82f6' },
  { id: '2', text: 'Severe accident near Srinagar Highway, traffic jammed', type: 'Accident', icon: AlertTriangle, color: '#ef4444' },
  { id: '3', text: 'Extreme heatwave warning issued for Karachi', type: 'Heatwave', icon: AlertTriangle, color: '#f59e0b' },
];

const InputPanel = ({ navigation }) => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddSignal = async (text = inputText) => {
    if (!text) return;
    setLoading(true);
    try {
      await signalsApi.sendSignals([{ source: 'user_input', text, timestamp: new Date().toISOString() }]);
      setInputText('');
      alert('Signal Added Successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to add signal');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      await signalsApi.analyzeCrisis();
      navigation.navigate('CrisisBoard');
    } catch (error) {
      console.error(error);
      alert('Failed to trigger analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#0f172a', '#1e293b']} style={styles.background} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>🚨 CIRO</Text>
        <Text style={styles.subtitle}>Crisis Intelligence & Response Orchestrator</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Describe the crisis (English/Urdu/Roman Urdu)..."
            placeholderTextColor="#94a3b8"
            multiline
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.addButton} onPress={() => handleAddSignal()}>
            <Send color="#fff" size={20} />
            <Text style={styles.buttonText}>Add Signal</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Example Signals</Text>
        {EXAMPLES.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={[styles.exampleCard, { borderLeftColor: item.color }]}
            onPress={() => setInputText(item.text)}
          >
            <item.icon color={item.color} size={24} />
            <View style={styles.exampleTextContainer}>
              <Text style={styles.exampleType}>{item.type}</Text>
              <Text style={styles.exampleText}>{item.text}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity 
          style={styles.analyzeButton} 
          onPress={handleAnalyze}
          disabled={loading}
        >
          <LinearGradient colors={['#ef4444', '#b91c1c']} style={styles.gradientButton}>
            <Text style={styles.analyzeText}>{loading ? 'ANALYZING...' : 'ANALYZE CRISIS'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  background: { ...StyleSheet.absoluteFillObject },
  content: { padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginTop: 20 },
  subtitle: { fontSize: 14, color: '#94a3b8', textAlign: 'center', marginBottom: 30 },
  inputContainer: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 15, marginBottom: 30, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  input: { color: '#fff', fontSize: 16, minHeight: 100, textAlignVertical: 'top', marginBottom: 15 },
  addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#3b82f6', padding: 12, borderRadius: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', marginLeft: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 15 },
  exampleCard: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 15, marginBottom: 12, borderLeftWidth: 4 },
  exampleTextContainer: { marginLeft: 15, flex: 1 },
  exampleType: { fontSize: 12, fontWeight: 'bold', color: '#94a3b8', marginBottom: 4 },
  exampleText: { color: '#fff', fontSize: 14 },
  analyzeButton: { marginTop: 20, borderRadius: 16, overflow: 'hidden' },
  gradientButton: { padding: 18, alignItems: 'center' },
  analyzeText: { color: '#fff', fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },
});

export default InputPanel;
