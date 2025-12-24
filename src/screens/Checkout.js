import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useStripe } from '@stripe/stripe-react-native';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:5000';

export default function Checkout() {
  const { items, total, clear } = useCart();
  const { token, user } = useAuth();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  
  const [address, setAddress] = useState(user?.address || '');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const initializePaymentSheet = async (clientSecret) => {
    const { error } = await initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
      merchantDisplayName: 'Water Delivery App',
      allowsDelayedPaymentMethods: true,
    });
    if (error) {
       throw new Error(error.message);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      throw new Error(error.message);
    } else {
      return true;
    }
  };

  const placeOrder = async () => {
    if (!items.length) {
      Alert.alert('Cart is empty');
      return;
    }
    if (!address.trim()) {
      setError('Delivery address is required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // 1. Create Order (and get PaymentIntent if card)
      let orderResponse;
      if(!API_BASE.includes('localhost') && token) {
        const res = await fetch(`${API_BASE}/api/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: items.map((it) => ({ product: it.product, quantity: it.quantity })),
            address,
            notes,
            paymentMethod,
          }),
        });
        
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || `HTTP ${res.status}`);
        }
        orderResponse = await res.json();
      } else {
        // Mock
        await new Promise(r => setTimeout(r, 1000));
        orderResponse = { clientSecret: null }; 
      }

      // 2. Handle Payment
      if (paymentMethod === 'card' && orderResponse?.clientSecret) {
          await initializePaymentSheet(orderResponse.clientSecret);
          const paid = await openPaymentSheet();
          if (!paid) throw new Error('Payment cancelled');
      }

      // 3. Success
      clear();
      Alert.alert('Order Placed!', `Your water is on the way (${paymentMethod === 'cod' ? 'Cash' : 'Paid'}).`, [
        { text: 'Track Order', onPress: () => navigation.navigate('Orders') },
      ]);
      
    } catch (e) {
      setError(e.message || 'Order failed');
      Alert.alert('Payment Failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Checkout</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Complete your order details
          </Text>
        </View>

        <Card style={styles.summaryCard}>
          <Text style={[styles.summaryTitle, { color: colors.text }]}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Items</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{items.length}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Amount</Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>${total.toFixed(2)}</Text>
          </View>
        </Card>

        <View style={styles.formSection}>
          <Text style={[styles.sectionHeader, { color: colors.text }]}>Delivery Details</Text>
          <Input 
            label="Delivery Address"
            value={address} 
            onChangeText={setAddress} 
            placeholder="Enter full address" 
            leftIcon="location-outline"
            multiline
            style={{ marginBottom: 16 }}
          />

          <Input 
            label="Delivery Notes (Optional)"
            value={notes} 
            onChangeText={setNotes} 
            placeholder="Gate code, instructions..." 
            leftIcon="document-text-outline"
            multiline
            style={{ marginBottom: 16 }}
          />
        </View>

        <View style={styles.formSection}>
           <Text style={[styles.sectionHeader, { color: colors.text }]}>Payment Method</Text>
           <View style={styles.paymentMethods}>
               <TouchableOpacity 
                  onPress={() => setPaymentMethod('cod')}
                  style={[
                    styles.methodCard, 
                    { backgroundColor: colors.card, borderColor: paymentMethod === 'cod' ? colors.primary : colors.border },
                    paymentMethod === 'cod' && styles.activeMethod
                  ]}
               >
                   <Ionicons name="cash-outline" size={24} color={paymentMethod === 'cod' ? colors.primary : colors.textSecondary} />
                   <Text style={[styles.methodText, { color: paymentMethod === 'cod' ? colors.primary : colors.text }]}>Cash on Delivery</Text>
                   {paymentMethod === 'cod' && <Ionicons name="checkmark-circle" size={20} color={colors.primary} style={styles.checkIcon} />}
               </TouchableOpacity>

               <TouchableOpacity 
                  onPress={() => setPaymentMethod('card')}
                  style={[
                    styles.methodCard, 
                    { backgroundColor: colors.card, borderColor: paymentMethod === 'card' ? colors.primary : colors.border },
                    paymentMethod === 'card' && styles.activeMethod
                  ]}
               >
                   <Ionicons name="card-outline" size={24} color={paymentMethod === 'card' ? colors.primary : colors.textSecondary} />
                   <Text style={[styles.methodText, { color: paymentMethod === 'card' ? colors.primary : colors.text }]}>Pay with Card</Text>
                   {paymentMethod === 'card' && <Ionicons name="checkmark-circle" size={20} color={colors.primary} style={styles.checkIcon} />}
               </TouchableOpacity>
           </View>
        </View>

        {error ? (
          <View style={[styles.errorBox, { backgroundColor: colors.error + '15' }]}>
            <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
          </View>
        ) : null}

      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <Button 
          title={loading ? 'Processing...' : `Place Order - $${total.toFixed(2)}`} 
          onPress={placeOrder} 
          disabled={loading} 
          size="lg"
          icon={!loading && <Ionicons name={paymentMethod === 'card' ? "lock-closed" : "checkmark-circle"} size={20} color="#fff" />}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 120 },
  header: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 4 },
  subtitle: { fontSize: 16 },
  
  summaryCard: { padding: 20, marginBottom: 32 },
  summaryTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 15 },
  summaryValue: { fontSize: 15, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 12 },
  totalLabel: { fontSize: 18, fontWeight: '700' },
  totalValue: { fontSize: 24, fontWeight: '800' },
  
  sectionHeader: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  formSection: { marginBottom: 24 },
  
  paymentMethods: { gap: 12 },
  methodCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderWidth: 1, borderRadius: 12 },
  activeMethod: { borderWidth: 2 },
  methodText: { marginLeft: 12, fontSize: 16, fontWeight: '600', flex: 1 },
  checkIcon: {},

  errorBox: { padding: 12, borderRadius: 12, alignItems: 'center' },
  errorText: { fontSize: 14, fontWeight: '500' },
  
  footer: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    padding: 20, 
    borderTopWidth: 1,
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24 
  },
});
