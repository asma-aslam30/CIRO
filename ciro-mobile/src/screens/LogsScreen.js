import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { dataAPI } from '../lib/api';
import { LinearGradient } from 'expo-linear-gradient';

export default function LogsScreen() {
  const [logs, setLogs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLogs = async () => {
    try {
      const data = await dataAPI.getActions();
      if (data && data.actions) {
        setLogs(data.actions.reverse()); // Show newest first
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLogs();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <LinearGradient colors={['#05050f', '#0a0f1e', '#05050f']} style={styles.container}>
      <ScrollView 
        contentContainerStyle={{ padding: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00ff88" />}
      >
        <Text style={styles.header}>Simulation Logs</Text>
        
        <View style={styles.terminal}>
          <Text style={styles.terminalHeader}>root@nexus-core:~/system/logs# tail -f execution.log</Text>
          
          {logs.length === 0 ? (
            <Text style={styles.logText}>_ Waiting for agent activity...</Text>
          ) : (
            logs.map((log, index) => (
              <Text key={index} style={styles.logText}>
                <Text style={styles.timestamp}>[{log.time}] </Text>
                <Text style={styles.agentTag}>[AGENT_EXECUTOR] </Text>
                <Text style={styles.status}>[{log.status}] </Text>
                {log.action} - {log.detail}
              </Text>
            ))
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { color: '#00ff88', fontSize: 28, fontFamily: 'Outfit_700Bold', marginBottom: 20, letterSpacing: 1, textShadowColor: 'rgba(0, 255, 136, 0.5)', textShadowOffset: {width: 0, height: 0}, textShadowRadius: 10 },
  terminal: { backgroundColor: '#020208', borderColor: 'rgba(0, 240, 255, 0.2)', borderWidth: 1, borderRadius: 12, padding: 15, minHeight: 450, shadowColor: '#00f0ff', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.1, shadowRadius: 15 },
  terminalHeader: { color: '#7a8baa', fontFamily: 'monospace', fontSize: 12, marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#1a2235', paddingBottom: 10 },
  logText: { color: '#e0e8ff', fontFamily: 'monospace', fontSize: 12, marginBottom: 8, lineHeight: 18 },
  timestamp: { color: '#7a8baa' },
  agentTag: { color: '#a855f7' },
  status: { color: '#00ff88' },
});
