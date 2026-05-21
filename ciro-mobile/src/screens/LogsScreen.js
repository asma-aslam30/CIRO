import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl, 
  Platform,
  TouchableOpacity
} from 'react-native';
import { dataAPI } from '../lib/api';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeIn, 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence 
} from 'react-native-reanimated';
import { Terminal, Shield, Filter } from 'lucide-react-native';
import { theme, globalStyles } from '../lib/theme';

export default function LogsScreen() {
  const [logs, setLogs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL', 'EXECUTED', 'PENDING'
  
  const cursorOpacity = useSharedValue(1);

  const fetchLogs = async () => {
    try {
      const data = await dataAPI.getActions();
      if (data && data.actions) {
        setLogs([...data.actions].reverse()); // Newest first
      }
    } catch (err) {
      console.error('Failed to query kernel execution logs:', err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLogs();
    setRefreshing(false);
  };

  useEffect(() => {
    cursorOpacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 500 }),
        withTiming(1, { duration: 500 })
      ),
      -1,
      true
    );

    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  const cursorStyle = useAnimatedStyle(() => ({
    opacity: cursorOpacity.value
  }));

  // Filtering logic
  const filteredLogs = logs.filter(log => {
    if (activeFilter === 'ALL') return true;
    return log.status === activeFilter;
  });

  return (
    <LinearGradient 
      colors={[theme.colors.bgDark, theme.colors.bgDarkSecondary, theme.colors.bgDark]} 
      style={globalStyles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.success} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Custom Header Bar */}
        <Animated.View entering={FadeIn.duration(800)} style={globalStyles.headerRow}>
          <View>
            <Text style={globalStyles.headerTitle}>
              KERNEL <Text style={[globalStyles.neonText, { color: theme.colors.success, textShadowColor: 'rgba(16, 185, 129, 0.4)' }]}>LOGS</Text>
            </Text>
            <Text style={globalStyles.subtitle}>Real-time kernel execution stream</Text>
          </View>
          
          <View style={styles.headerTelemetry}>
            <Terminal color={theme.colors.success} size={14} />
            <Text style={styles.telemetryText}>SYSTEM_TAIL</Text>
          </View>
        </Animated.View>

        {/* Dynamic Category Filters */}
        <View style={styles.filterContainer}>
          <View style={styles.filterLabelRow}>
            <Filter color={theme.colors.dim} size={12} />
            <Text style={styles.filterLabelText}>FILTER KERNEL STREAM:</Text>
          </View>
          <View style={styles.filterButtonsRow}>
            <TouchableOpacity 
              style={[styles.filterBtn, activeFilter === 'ALL' && styles.filterBtnActive]}
              onPress={() => setActiveFilter('ALL')}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterBtnText, activeFilter === 'ALL' && styles.filterBtnTextActive]}>ALL_STREAM</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.filterBtn, activeFilter === 'EXECUTED' && styles.filterBtnActiveExecuted]}
              onPress={() => setActiveFilter('EXECUTED')}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterBtnText, activeFilter === 'EXECUTED' && styles.filterBtnTextActiveExecuted]}>EXECUTED</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.filterBtn, activeFilter === 'PENDING' && styles.filterBtnActivePending]}
              onPress={() => setActiveFilter('PENDING')}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterBtnText, activeFilter === 'PENDING' && styles.filterBtnTextActivePending]}>PENDING</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Terminal block */}
        <View style={styles.terminalPanel}>
          {/* Windows decoration handles */}
          <View style={styles.terminalTopBar}>
            <View style={styles.windowControls}>
              <View style={[styles.circleDot, { backgroundColor: '#ff5f56' }]} />
              <View style={[styles.circleDot, { backgroundColor: '#ffbd2e' }]} />
              <View style={[styles.circleDot, { backgroundColor: '#27c93f' }]} />
            </View>
            <Text style={styles.terminalTitle}>root@nexus-field-terminal:~/logs/stream</Text>
            <View style={{ width: 50 }} /> {/* Spacer to center title */}
          </View>
          
          <View style={styles.terminalHeader}>
            <Text style={styles.terminalHeaderText}>[CMD] tail -f /var/log/nexus_mitigation.log</Text>
          </View>
          
          <ScrollView 
            style={styles.logContainer} 
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {filteredLogs.length === 0 ? (
              <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                <Text style={styles.logText}>_ Awaiting pipeline activities or triggers </Text>
                <Animated.View style={[styles.cursor, cursorStyle]} />
              </View>
            ) : (
              filteredLogs.map((log, index) => (
                <Animated.Text 
                  entering={FadeIn.delay(index * 30)} 
                  key={index} 
                  style={styles.logText}
                >
                  <Text style={styles.logTimestamp}>[{log.time || '00:00:00'}] </Text>
                  <Text style={styles.logTag}>[SYS_EXEC] </Text>
                  <Text 
                    style={[
                      styles.logStatus, 
                      { color: log.status === 'EXECUTED' ? theme.colors.success : theme.colors.warning }
                    ]}
                  >
                    [{log.status}] 
                  </Text>
                  <Text style={styles.logBody}> {log.action} » {log.detail}</Text>
                </Animated.Text>
              ))
            )}
            {filteredLogs.length > 0 && (
              <View style={{ flexDirection: 'row', marginTop: 15, paddingBottom: 15 }}>
                <Text style={styles.terminalPrompt}>operator@nexus:~$ </Text>
                <Animated.View style={[styles.cursor, cursorStyle]} />
              </View>
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 110,
  },
  headerTelemetry: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(5, 5, 15, 0.4)',
    borderColor: theme.colors.border,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  telemetryText: {
    color: theme.colors.dim,
    fontFamily: theme.fonts.semibold,
    fontSize: 9,
    letterSpacing: 1,
    marginLeft: 6,
  },
  filterContainer: {
    ...theme.glass,
    backgroundColor: 'rgba(5, 5, 15, 0.5)',
    padding: 15,
    marginBottom: 20,
    borderColor: 'rgba(255, 255, 255, 0.03)',
  },
  filterLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterLabelText: {
    color: theme.colors.dim,
    fontFamily: theme.fonts.bold,
    fontSize: 9,
    letterSpacing: 1.5,
    marginLeft: 6,
  },
  filterButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterBtn: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnActive: {
    borderColor: theme.colors.border,
    backgroundColor: 'rgba(0, 240, 255, 0.08)',
  },
  filterBtnActiveExecuted: {
    borderColor: 'rgba(16, 185, 129, 0.3)',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  filterBtnActivePending: {
    borderColor: 'rgba(176, 38, 255, 0.3)',
    backgroundColor: 'rgba(176, 38, 255, 0.08)',
  },
  filterBtnText: {
    color: theme.colors.dim,
    fontFamily: theme.fonts.bold,
    fontSize: 9,
    letterSpacing: 1,
  },
  filterBtnTextActive: {
    color: theme.colors.primary,
  },
  filterBtnTextActiveExecuted: {
    color: theme.colors.success,
  },
  filterBtnTextActivePending: {
    color: theme.colors.accent,
  },
  terminalPanel: {
    backgroundColor: '#020205',
    borderColor: 'rgba(0, 240, 255, 0.15)',
    borderWidth: 1.5,
    borderRadius: 16,
    minHeight: 480,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.08,
    shadowRadius: 20,
    overflow: 'hidden',
  },
  terminalTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#08080f',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  windowControls: {
    flexDirection: 'row',
    gap: 6,
  },
  circleDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  terminalTitle: {
    color: theme.colors.dim,
    fontFamily: theme.fonts.semibold,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  terminalHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.03)',
  },
  terminalHeaderText: {
    color: '#64748b',
    fontFamily: theme.fonts.mono,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  logContainer: {
    flex: 1,
    padding: 15,
  },
  logText: {
    color: theme.colors.text,
    fontFamily: theme.fonts.mono,
    fontSize: 10.5,
    lineHeight: 18,
    marginBottom: 8,
  },
  logTimestamp: {
    color: '#64748b',
  },
  logTag: {
    color: theme.colors.accent,
    fontWeight: 'bold',
  },
  logStatus: {
    fontWeight: 'bold',
  },
  logBody: {
    color: '#e2e8f0',
  },
  terminalPrompt: {
    color: theme.colors.success,
    fontFamily: theme.fonts.mono,
    fontSize: 10.5,
  },
  cursor: {
    width: 6,
    height: 12,
    backgroundColor: theme.colors.success,
    marginLeft: 2,
    marginTop: 3,
    shadowColor: theme.colors.success,
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
});
