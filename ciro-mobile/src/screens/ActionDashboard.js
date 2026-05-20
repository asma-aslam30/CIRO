import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Activity, CheckCircle2, Clock, Terminal } from 'lucide-react-native';
import { actionsApi } from '../api/client';

const ActionDashboard = ({ navigation }) => {
  const [actions, setActions] = useState([]);

  useEffect(() => {
    const fetchActions = async () => {
      try {
        const response = await actionsApi.getActions();
        setActions(response.data.actions);
      } catch (error) {
        console.error(error);
      }
    };

    const interval = setInterval(fetchActions, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#0f172a', '#1e293b']} style={styles.background} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Activity color="#3b82f6" size={32} />
          <Text style={styles.headerTitle}>Response Orchestration</Text>
        </View>

        <View style={styles.terminalHeader}>
          <Terminal color="#10b981" size={18} />
          <Text style={styles.terminalHeaderText}>EXECUTION LOG</Text>
        </View>

        <FlatList
          data={actions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.actionItem}>
              <View style={styles.timeContainer}>
                <Clock color="#94a3b8" size={12} />
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
              <View style={styles.actionContent}>
                <View style={styles.actionHeader}>
                  <Text style={styles.actionTitle}>{item.action}</Text>
                  <View style={styles.statusBadge}>
                    <CheckCircle2 color="#10b981" size={14} />
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                </View>
                <Text style={styles.actionDetail}>{item.detail}</Text>
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />

        <TouchableOpacity 
          style={styles.doneButton}
          onPress={() => navigation.navigate('OutcomeView')}
        >
          <Text style={styles.doneButtonText}>VIEW IMPACT SUMMARY</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  background: { ...StyleSheet.absoluteFillObject },
  content: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 25, marginTop: 10 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginLeft: 12 },
  terminalHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: 10, borderTopLeftRadius: 12, borderTopRightRadius: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(16, 185, 129, 0.2)' },
  terminalHeaderText: { color: '#10b981', fontWeight: 'bold', fontSize: 12, marginLeft: 8, letterSpacing: 1 },
  listContent: { backgroundColor: 'rgba(0,0,0,0.2)', borderBottomLeftRadius: 12, borderBottomRightRadius: 12, padding: 15 },
  actionItem: { flexDirection: 'row', marginBottom: 20 },
  timeContainer: { width: 60, alignItems: 'center' },
  timeText: { color: '#94a3b8', fontSize: 12, marginTop: 4 },
  actionContent: { flex: 1, marginLeft: 10 },
  actionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  actionTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  statusBadge: { flexDirection: 'row', alignItems: 'center' },
  statusText: { color: '#10b981', fontSize: 12, fontWeight: 'bold', marginLeft: 4 },
  actionDetail: { color: '#94a3b8', fontSize: 14, lineHeight: 20 },
  doneButton: { backgroundColor: '#10b981', padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 20 },
  doneButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default ActionDashboard;
