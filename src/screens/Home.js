import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:5000';

export default function Home() {
  const [state, setState] = useState({ loading: true, status: 'unknown', error: null });

  useEffect(() => {
    let cancelled = false;
    async function check() {
      try {
        const res = await fetch(`${API_BASE}/api/health`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled) setState({ loading: false, status: json.status || 'ok', error: null });
      } catch (e) {
        if (!cancelled) setState({ loading: false, status: 'down', error: e.message });
      }
    }
    check();
    return () => { cancelled = true };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer App</Text>
      <Text style={styles.sub}>API: {API_BASE}</Text>
      {state.loading ? (
        <ActivityIndicator style={{ marginTop: 10 }} />
      ) : (
        <Text style={{ marginTop: 10, color: state.status === 'ok' ? 'green' : 'red' }}>Status: {state.status}</Text>
      )}
      {state.error && <Text style={{ marginTop: 8, color: 'red' }}>Error: {state.error}</Text>}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  title: { fontSize: 20, fontWeight: '700' },
  sub: { marginTop: 6, color: '#666' },
});
