import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:5000';

export default function Browse() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/api/products`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) setProducts(data);
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
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.sub}>{item.sizeLiters} L</Text>
            <Text style={styles.price}>${item.price}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No products yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginBottom: 12 },
  title: { fontSize: 16, fontWeight: '600' },
  sub: { color: '#666', marginTop: 4 },
  price: { marginTop: 6, fontWeight: '700' },
});
