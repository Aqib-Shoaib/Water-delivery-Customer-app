import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { MOCK_PRODUCTS } from '../data/mockData';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:5000';

export default function Browse() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [demoMode, setDemoMode] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigation = useNavigation();

  const loadData = async (query = '') => {
    try {
      if (!API_BASE.includes('localhost')) {
        const url = query 
           ? `${API_BASE}/api/products?q=${encodeURIComponent(query)}`
           : `${API_BASE}/api/products`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
          setError(null);
          setDemoMode(false);
        } else {
          throw new Error('Failed to fetch');
        }
      } else {
        throw new Error('Localhost fallback');
      }
    } catch (e) {
      console.log('Using mock data');
      if (query) {
         setProducts(MOCK_PRODUCTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase())));
      } else {
         setProducts(MOCK_PRODUCTS);
      }
      setDemoMode(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const onSearch = (text) => {
    setLoading(true);
    if (window.searchTimeout) clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
        loadData(text);
    }, 500);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={[styles.greeting, { color: colors.textSecondary }]}>
          Good Morning,
        </Text>
        <Text style={[styles.userName, { color: colors.text }]}>
          {user?.name || 'Guest'}
        </Text>
      </View>
      <TouchableOpacity 
        style={[styles.cartBtn, { backgroundColor: colors.card }]} 
        onPress={() => navigation.navigate('Cart')}
      >
        <Ionicons name="cart-outline" size={24} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );

  const renderProduct = ({ item }) => (
    <Card style={styles.productCard}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.images?.[0] || 'https://picsum.photos/seed/water/200/300' }} 
          style={styles.productImage} 
        />
        {item.sizeLiters > 0 && (
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Text style={styles.badgeText}>{item.sizeLiters}L</Text>
          </View>
        )}
      </View>
      
      <View style={styles.productInfo}>
        <View>
          <Text style={[styles.productName, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
          <Text style={[styles.productDesc, { color: colors.textSecondary }]} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: colors.primary }]}>${item.price}</Text>
          <Button 
            title="Add" 
            onPress={() => addItem(item, 1)} 
            size="sm" 
            icon={<Ionicons name="add" size={16} color="#fff" />}
          />
        </View>
      </View>
    </Card>
  );

  if (loading && !refreshing && products.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          {renderHeader()}
          <Input 
             placeholder="Search products..." 
             leftIcon="search-outline" 
             onChangeText={onSearch}
             style={{ marginBottom: 16 }}
          />
      </View>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={renderProduct}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No products found</Text>
          </View>
        }
      />
      {demoMode && (
        <View style={[styles.demoBanner, { backgroundColor: colors.primary + '15' }]}>
          <Text style={[styles.demoText, { color: colors.primary }]}>Demo Mode</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
  },
  cartBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  // Product Card
  productCard: {
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
  },
  badge: {
    position: 'absolute',
    top: -8,
    left: -8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  productInfo: {
    flex: 1,
    height: 100,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  productDesc: {
    fontSize: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
  },
  demoBanner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    alignItems: 'center',
  },
  demoText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
    // minHeight: 200, // optional
  },
  emptyText: {
    fontSize: 16,
  },
});
