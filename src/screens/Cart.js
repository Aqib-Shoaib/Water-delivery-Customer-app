import React from 'react';
import { View, Text, FlatList, StyleSheet, TextInput } from 'react-native';
import Button from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';

export default function Cart() {
  const { items, updateQty, removeItem, total } = useCart();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(it) => it.product}
        ListEmptyComponent={<Text>Your cart is empty</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.sub}>{item.sizeLiters} L</Text>
              <Text style={styles.price}>${item.price} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
            <View style={{ width: 100, marginLeft: 12 }}>
              <TextInput
                value={String(item.quantity)}
                onChangeText={(v) => {
                  const n = parseInt(v.replace(/\D/g, '') || '1', 10);
                  updateQty(item.product, isNaN(n) ? 1 : n);
                }}
                keyboardType="number-pad"
                style={styles.qtyInput}
              />
              <Button title="Remove" variant="outline" onPress={() => removeItem(item.product)} style={{ marginTop: 6 }} />
            </View>
          </View>
        )}
      />
      <View style={styles.footer}>
        <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
        <Button title="Checkout" onPress={() => navigation.navigate('Checkout')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginBottom: 12 },
  title: { fontSize: 16, fontWeight: '600' },
  sub: { color: '#666', marginTop: 2 },
  price: { marginTop: 4, fontWeight: '700' },
  qtyInput: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 6, paddingVertical: 8, textAlign: 'center' },
  footer: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 12 },
  total: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
});
