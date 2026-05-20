import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { authAPI } from '../lib/api';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen({ navigation, route }) {
  const [email, setEmail] = useState('admin@ciro.nexus');
  const [password, setPassword] = useState('NexusAdmin2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await authAPI.login(email, password);
      if (route.params?.onLogin) {
        route.params.onLogin();
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#05050f', '#0a0f1e', '#05050f']} style={styles.container}>
      <View style={styles.glassCard}>
        <Text style={styles.title}>CIRO NEXUS</Text>
        <Text style={styles.subtitle}>Mobile Field Command</Text>

        {error ? <Text style={styles.errorText}>[ERR] {error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Operator Email"
          placeholderTextColor="#7a8baa"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#7a8baa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity onPress={handleLogin} disabled={loading}>
          <LinearGradient
            colors={['#00f0ff', '#0099cc']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            {loading ? (
              <ActivityIndicator color="#05050f" />
            ) : (
              <Text style={styles.buttonText}>AUTHENTICATE</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  glassCard: {
    backgroundColor: 'rgba(5, 8, 20, 0.7)',
    borderColor: 'rgba(0, 240, 255, 0.3)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 30,
    shadowColor: '#00f0ff',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    color: '#00f0ff',
    fontSize: 36,
    fontFamily: 'Outfit_700Bold',
    textAlign: 'center',
    letterSpacing: 3,
    marginBottom: 5,
    textShadowColor: 'rgba(0, 240, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    color: '#7a8baa',
    fontSize: 12,
    fontFamily: 'Outfit_600SemiBold',
    textAlign: 'center',
    letterSpacing: 4,
    marginBottom: 40,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderColor: 'rgba(0, 240, 255, 0.4)',
    borderWidth: 1,
    borderRadius: 8,
    color: '#e0e8ff',
    fontFamily: 'Outfit_400Regular',
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#00f0ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  buttonText: {
    color: '#05050f',
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    letterSpacing: 2,
  },
  errorText: {
    color: '#ff003c',
    fontFamily: 'Outfit_600SemiBold',
    marginBottom: 15,
    textAlign: 'center',
  }
});
