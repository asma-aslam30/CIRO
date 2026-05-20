import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { dataAPI } from '../lib/api';
import { LinearGradient } from 'expo-linear-gradient';

export default function ActionPlanScreen() {
  const [actions, setActions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchActions = async () => {
    try {
      const data = await dataAPI.getActions();
      if (data && data.actions) {
        setActions(data.actions);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchActions();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchActions();
    const interval = setInterval(fetchActions, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <LinearGradient colors={['#05050f', '#0a0f1e', '#05050f']} style={styles.container}>
      <ScrollView 
        contentContainerStyle={{ padding: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#a855f7" />}
      >
        <Text style={styles.header}>Response Plan</Text>

        {actions.length === 0 ? (
          <Text style={styles.emptyText}>No active response plans.</Text>
        ) : (
          actions.map((act, index) => (
            <View key={index} style={styles.glassCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.actionTitle}>{act.action}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{act.status}</Text>
                </View>
              </View>
              <Text style={styles.detail}>{act.detail}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { color: '#a855f7', fontSize: 28, fontFamily: 'Outfit_700Bold', marginBottom: 20, letterSpacing: 1, textShadowColor: 'rgba(168, 85, 247, 0.5)', textShadowOffset: {width: 0, height: 0}, textShadowRadius: 10 },
  emptyText: { color: '#7a8baa', fontSize: 16, fontFamily: 'Outfit_400Regular', textAlign: 'center', marginTop: 50 },
  glassCard: { backgroundColor: 'rgba(168, 85, 247, 0.05)', borderColor: 'rgba(168, 85, 247, 0.3)', borderWidth: 1, borderRadius: 16, padding: 20, marginBottom: 15, shadowColor: '#a855f7', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  actionTitle: { color: '#e0e8ff', fontSize: 18, fontFamily: 'Outfit_700Bold' },
  badge: { backgroundColor: 'rgba(0, 240, 255, 0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0, 240, 255, 0.4)' },
  badgeText: { color: '#00f0ff', fontSize: 10, fontFamily: 'Outfit_700Bold', letterSpacing: 1 },
  detail: { color: '#7a8baa', fontSize: 14, fontFamily: 'Outfit_400Regular', lineHeight: 22 },
});
