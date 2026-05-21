import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Send, AlertTriangle, CloudRain, ShieldCheck } from 'lucide-react-native';
import { signalsApi } from '../api/client';
import * as Haptics from 'expo-haptics';
import { theme } from '../lib/theme';

const EXAMPLES = [
  { id: '1', text: 'G-10 mein pani bhar gaya hai, gaariyan phans gayi hain', type: 'Flood', icon: CloudRain, color: theme.colors.accent },
  { id: '2', text: 'Severe accident near Srinagar Highway, traffic jammed', type: 'Accident', icon: AlertTriangle, color: theme.colors.alert },
  { id: '3', text: 'Extreme heatwave warning issued for Karachi', type: 'Heatwave', icon: AlertTriangle, color: theme.colors.warning },
];

const InputPanel = ({ navigation }) => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleAddSignal = async (text = inputText) => {
    if (!text) return;
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    try {
      await signalsApi.sendSignals([{ source: 'user_input', text, timestamp: new Date().toISOString() }]);
      setInputText('');
      alert('Signal Ingested Successfully');
    } catch (error) {
      console.error(error);
      alert('Transmission failed. Verify client connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setLoading(true);
    try {
      await signalsApi.analyzeCrisis();
      navigation.navigate('CrisisBoard');
    } catch (error) {
      console.error(error);
      alert('Failed to trigger core analysis matrix.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={[theme.colors.bgDark, theme.colors.bgDarkSecondary]} style={styles.background} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.logoRow}>
          <ShieldCheck color={theme.colors.primary} size={32} />
          <Text style={styles.logoTitle}>CIRO</Text>
        </View>
        <Text style={styles.subtitle}>Crisis Intelligence & Response Orchestrator</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, focused && styles.inputFocused]}
            placeholder="Describe the crisis (English/Urdu/Roman Urdu)..."
            placeholderTextColor={theme.colors.dim}
            multiline
            value={inputText}
            onChangeText={setInputText}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          <TouchableOpacity 
            style={[styles.addButton, (!inputText || loading) && styles.addButtonDisabled]} 
            onPress={() => handleAddSignal()}
            disabled={loading || !inputText}
          >
            {loading ? (
              <ActivityIndicator color={theme.colors.bgDark} size="small" />
            ) : (
              <>
                <Send color={inputText ? theme.colors.bgDark : theme.colors.dim} size={16} />
                <Text style={[styles.buttonText, { color: inputText ? theme.colors.bgDark : theme.colors.dim }]}>Ingest Signal</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>SIMULATOR SHORTS</Text>
        {EXAMPLES.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={[styles.exampleCard, { borderLeftColor: item.color }]}
            onPress={() => {
              if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setInputText(item.text);
            }}
            activeOpacity={0.7}
          >
            <item.icon color={item.color} size={20} />
            <View style={styles.exampleTextContainer}>
              <Text style={[styles.exampleType, { color: item.color }]}>{item.type.toUpperCase()}_SIGNATURE</Text>
              <Text style={styles.exampleText}>{item.text}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity 
          style={styles.analyzeButton} 
          onPress={handleAnalyze}
          disabled={loading}
          activeOpacity={0.8}
        >
          <LinearGradient colors={[theme.colors.primary, theme.colors.accent]} style={styles.gradientButton} start={{x:0,y:0}} end={{x:1,y:0}}>
            <Text style={styles.analyzeText}>{loading ? 'ANALYZING MATRIX...' : 'RUN PIPELINE ANALYSIS'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bgDark },
  background: { ...StyleSheet.absoluteFillObject },
  content: { padding: 20 },
  logoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, gap: 10 },
  logoTitle: { fontSize: 32, fontFamily: theme.fonts.bold, color: '#fff', letterSpacing: 2 },
  subtitle: { fontSize: 11, fontFamily: theme.fonts.semibold, color: theme.colors.dim, textAlign: 'center', marginBottom: 30, letterSpacing: 1.5, textTransform: 'uppercase' },
  inputContainer: { ...theme.glass, backgroundColor: 'rgba(0,0,0,0.5)', padding: 15, marginBottom: 25 },
  input: { color: '#fff', fontSize: 15, fontFamily: theme.fonts.semibold, minHeight: 90, textAlignVertical: 'top', marginBottom: 15 },
  inputFocused: { borderColor: theme.colors.primary },
  addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.primary, padding: 14, borderRadius: 8, gap: 8 },
  addButtonDisabled: { backgroundColor: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255,255,255,0.05)', borderWidth: 1 },
  buttonText: { fontWeight: 'bold', letterSpacing: 1, fontFamily: theme.fonts.bold, fontSize: 12, textTransform: 'uppercase' },
  sectionTitle: { fontSize: 10, fontFamily: theme.fonts.bold, color: theme.colors.dim, marginBottom: 12, letterSpacing: 2 },
  exampleCard: { ...theme.glass, flexDirection: 'row', backgroundColor: 'rgba(5, 5, 15, 0.5)', padding: 15, marginBottom: 12, borderLeftWidth: 4 },
  exampleTextContainer: { marginLeft: 15, flex: 1 },
  exampleType: { fontSize: 9, fontFamily: theme.fonts.bold, marginBottom: 4, letterSpacing: 1 },
  exampleText: { color: '#fff', fontSize: 13, fontFamily: theme.fonts.semibold },
  analyzeButton: { marginTop: 15, borderRadius: 8, overflow: 'hidden', shadowColor: theme.colors.primary, shadowOpacity: 0.4, shadowRadius: 10, elevation: 5 },
  gradientButton: { padding: 16, alignItems: 'center' },
  analyzeText: { color: theme.colors.bgDark, fontSize: 14, fontFamily: theme.fonts.bold, letterSpacing: 1.5 },
});

export default InputPanel;
