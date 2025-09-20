import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:5000';

export default function Orders() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/api/orders`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) setOrders(data);
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
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>Order #{item._id.slice(-6)}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Total: ${item.totalAmount}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No orders yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginBottom: 12 },
  title: { fontSize: 16, fontWeight: '600' },
});
