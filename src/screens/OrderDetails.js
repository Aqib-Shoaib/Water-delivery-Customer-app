import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export default function OrderDetails({ route }) {
  const order = route.params?.order;
  if (!order) return <View style={styles.center}><Text>No order data</Text></View>;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order #{order._id?.slice(-6)}</Text>
      <Text>Status: {order.status}</Text>
      <Text>Total: ${order.totalAmount}</Text>
      <Text style={styles.section}>Items</Text>
      <FlatList
        data={order.items || []}
        keyExtractor={(it, idx) => `${it.product?._id || it.product || 'p'}-${idx}`}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text style={styles.itemName}>{item.product?.name || 'Product'}</Text>
            <Text style={styles.itemMeta}>{item.quantity} x ${item.unitPrice}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No items</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  section: { marginTop: 12, fontSize: 16, fontWeight: '700' },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemName: { fontWeight: '600' },
  itemMeta: { color: '#374151' },
});
