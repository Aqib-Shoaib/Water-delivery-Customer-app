import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import Button from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:5000';

export default function Checkout() {
  const { items, total, clear } = useCart();
  const { token } = useAuth();
  const navigation = useNavigation();
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const placeOrder = async () => {
    if (!items.length) {
      Alert.alert('Cart is empty');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          items: items.map((it) => ({ product: it.product, quantity: it.quantity })),
          address,
          notes,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }
      clear();
      Alert.alert('Order placed', 'Your order has been submitted.', [
        { text: 'View Orders', onPress: () => navigation.navigate('Orders') },
      ]);
    } catch (e) {
      setError(e.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      <Text style={styles.sub}>Items: {items.length} • Total: ${total.toFixed(2)}</Text>
      <TextInput
        placeholder="Delivery Address"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
        multiline
      />
      <TextInput
        placeholder="Notes (optional)"
        value={notes}
        onChangeText={setNotes}
        style={styles.input}
        multiline
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title={loading ? 'Placing...' : 'Place Order'} onPress={placeOrder} disabled={loading} style={{ marginTop: 8 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: '700' },
  sub: { marginTop: 6, color: '#6b7280' },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginTop: 12 },
  error: { color: '#ef4444', marginTop: 8 },
});
