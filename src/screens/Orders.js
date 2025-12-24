import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation, useTheme } from '@react-navigation/native';
import Card from '../components/ui/Card';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MOCK_ORDERS } from '../data/mockData';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:5000';

export default function Orders() {
  const { token } = useAuth();
  const { colors } = useTheme();
  const navigation = useNavigation();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async () => {
    try {
      if (!API_BASE.includes('localhost') && token) {
        const res = await fetch(`${API_BASE}/api/orders`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        } else {
          throw new Error(`HTTP ${res.status}`);
        }
      } else {
        // Fallback for demo
        setOrders(MOCK_ORDERS);
      }
    } catch (e) {
      console.log('Error loading orders', e);
      // Fallback
      setOrders(MOCK_ORDERS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadOrders(); }, [token]);

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return colors.success;
      case 'en_route': return '#f59e0b'; // Amber
      case 'placed': return colors.primary;
      case 'cancelled': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return 'checkmark-circle';
      case 'en_route': return 'bicycle';
      case 'placed': return 'time';
      case 'cancelled': return 'close-circle';
      default: return 'help-circle';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const renderOrder = ({ item }) => {
    const statusColor = getStatusColor(item.status);
    
    return (
      <TouchableOpacity onPress={() => navigation.navigate('OrderDetails', { order: item })}>
        <Card style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.idContainer}>
              <View style={[styles.iconBox, { backgroundColor: statusColor + '15' }]}>
                <Ionicons name={getStatusIcon(item.status)} size={20} color={statusColor} />
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text style={[styles.orderId, { color: colors.text }]}>Order #{item._id.slice(-6).toUpperCase()}</Text>
                <Text style={[styles.date, { color: colors.textSecondary }]}>{formatDate(item.createdAt)}</Text>
              </View>
            </View>
            <View style={[styles.badge, { backgroundColor: statusColor + '15' }]}>
              <Text style={[styles.badgeText, { color: statusColor }]}>
                {item.status.replace('_', ' ')}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.detailsRow}>
            <View>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Total Amount</Text>
              <Text style={[styles.amount, { color: colors.text }]}>${item.totalAmount}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
               <Text style={[styles.label, { color: colors.textSecondary }]}>Items</Text>
               <Text style={[styles.items, { color: colors.text }]}>{item.items?.length || 0}</Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={renderOrder}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        ListEmptyComponent={
           <View style={styles.center}>
            <Ionicons name="clipboard-outline" size={64} color={colors.textSecondary + '40'} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No orders yet</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  card: { padding: 16, marginBottom: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  idContainer: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  orderId: { fontSize: 16, fontWeight: '700' },
  date: { fontSize: 13, marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  divider: { height: 1, marginVertical: 16 },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: 12, marginBottom: 4 },
  amount: { fontSize: 18, fontWeight: '700' },
  items: { fontSize: 18, fontWeight: '600' },
  emptyText: { marginTop: 16, fontSize: 16 },
});
