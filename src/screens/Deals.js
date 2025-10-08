import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:5000';

export default function Deals() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/api/deals/public`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) setDeals(data);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true };
  }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator /></View>;
  if (error) return <View style={styles.center}><Text>Error: {error}</Text></View>;

  return (
    <View style={styles.container}>
      <FlatList
        data={deals}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            {item.description ? <Text style={styles.desc}>{item.description}</Text> : null}
            {item.startDate || item.endDate ? (
              <Text style={styles.meta}>
                {item.startDate ? `From: ${new Date(item.startDate).toLocaleDateString()}` : ''}
                {item.endDate ? `  To: ${new Date(item.endDate).toLocaleDateString()}` : ''}
              </Text>
            ) : null}
          </View>
        )}
        ListEmptyComponent={<Text>No deals available</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginBottom: 12 },
  title: { fontSize: 16, fontWeight: '700' },
  desc: { marginTop: 4, color: '#374151' },
  meta: { marginTop: 6, color: '#6b7280', fontSize: 12 },
});
