import React from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useCart } from '../context/CartContext';
import { useTheme } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Cart() {
  const { items, updateQty, removeItem, total } = useCart();
  const navigation = useNavigation();
  const { colors } = useTheme();

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.itemInfo}>
        <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
          <Ionicons name="water-outline" size={24} color={colors.primary} />
        </View>
        <View style={{ flex: 1, marginHorizontal: 12 }}>
          <Text style={[styles.title, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.sub, { color: colors.textSecondary }]}>{item.sizeLiters} L</Text>
          <Text style={[styles.price, { color: colors.primary }]}>
            ${(item.price * item.quantity).toFixed(2)}
          </Text>
        </View>
      </View>
      
      <View style={styles.actions}>
        <View style={[styles.qtyControl, { borderColor: colors.border }]}>
          <TouchableOpacity 
            onPress={() => updateQty(item.product, Math.max(1, item.quantity - 1))}
            style={styles.qtyBtn}
          >
            <Ionicons name="remove" size={16} color={colors.text} />
          </TouchableOpacity>
          
          <Text style={[styles.qtyText, { color: colors.text }]}>{item.quantity}</Text>
          
          <TouchableOpacity 
            onPress={() => updateQty(item.product, item.quantity + 1)}
            style={styles.qtyBtn}
          >
           <Ionicons name="add" size={16} color={colors.text} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          onPress={() => removeItem(item.product)}
          style={[styles.removeBtn, { backgroundColor: colors.error + '15' }]}
        >
          <Ionicons name="trash-outline" size={18} color={colors.error} />
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={items}
        keyExtractor={(it) => it.product}
        ListEmptyComponent={
          <View style={styles.center}>
            <Ionicons name="cart-outline" size={64} color={colors.textSecondary + '40'} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Your cart is empty</Text>
            <Button title="Browse Products" onPress={() => navigation.navigate('Browse')} style={{ marginTop: 20 }} />
          </View>
        }
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      
      {items.length > 0 && (
        <Card variant="elevated" style={[styles.footer, { borderTopColor: colors.border }]}>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Total Amount</Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>${total.toFixed(2)}</Text>
          </View>
          <Button 
            title="Proceed to Checkout" 
            onPress={() => navigation.navigate('Checkout')} 
            size="lg"
            icon={<Ionicons name="card-outline" size={20} color="#fff" />}
          />
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 100 },
  card: { padding: 12, marginBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  itemInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconBox: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '700' },
  sub: { fontSize: 13, marginTop: 2 },
  price: { fontSize: 14, fontWeight: '700', marginTop: 4 },
  
  actions: { alignItems: 'flex-end', justifyContent: 'space-between', height: '100%' },
  qtyControl: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 8, overflow: 'hidden' },
  qtyBtn: { padding: 8, alignItems: 'center', justifyContent: 'center' },
  qtyText: { paddingHorizontal: 8, fontSize: 14, fontWeight: '600' },
  
  removeBtn: { padding: 8, borderRadius: 8, marginTop: 8 },
  
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { fontSize: 18, marginTop: 16, fontWeight: '500' },
  
  footer: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24, 
    borderBottomLeftRadius: 0, 
    borderBottomRightRadius: 0, 
    padding: 20 
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  totalLabel: { fontSize: 16 },
  totalValue: { fontSize: 24, fontWeight: '800' },
});
