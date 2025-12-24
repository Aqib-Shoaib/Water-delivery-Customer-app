import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useRoute, useTheme } from '@react-navigation/native';
import Card from '../components/ui/Card';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function OrderDetails() {
  const { params } = useRoute();
  const { colors } = useTheme();
  const { order } = params || {};

  if (!order) return null;

  const renderStatusStep = (step, currentStatus, index) => {
    // simplified status logic
    const steps = ['placed', 'en_route', 'delivered'];
    const currentIndex = steps.indexOf(currentStatus);
    const stepIndex = steps.indexOf(step);
    const isActive = stepIndex <= currentIndex;
    const isCurrent = stepIndex === currentIndex;

    return (
      <View key={step} style={styles.stepContainer}>
        <View style={styles.stepIconContainer}>
          <View style={[
            styles.stepDot, 
            { 
              backgroundColor: isActive ? colors.primary : colors.border,
              borderColor: isCurrent ? colors.background : 'transparent',
              borderWidth: isCurrent ? 2 : 0,
              width: isCurrent ? 20 : 16,
              height: isCurrent ? 20 : 16,
            }
          ]} />
          {index < 2 && <View style={[styles.stepLine, { backgroundColor: stepIndex < currentIndex ? colors.primary : colors.border }]} />}
        </View>
        <View style={styles.stepTextContainer}>
          <Text style={[styles.stepTitle, { color: isActive ? colors.text : colors.textSecondary }]}>
            {step.replace('_', ' ').toUpperCase()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Card style={styles.section}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Order #{order._id.slice(-6).toUpperCase()}</Text>
        <Text style={[styles.headerDate, { color: colors.textSecondary }]}>
          Placed on {new Date(order.createdAt).toLocaleString()}
        </Text>
        
        <View style={styles.tracker}>
          {['placed', 'en_route', 'delivered'].map((s, i) => renderStatusStep(s, order.status, i))}
        </View>
      </Card>

      <View style={styles.sectionTitleContainer}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ITEMS</Text>
      </View>

      <Card style={styles.section}>
        {order.items?.map((item, idx) => (
          <View key={idx} style={[styles.itemRow, idx < order.items.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
            <View style={styles.itemInfo}>
              <Text style={[styles.itemName, { color: colors.text }]}>{item.product?.name || 'Product'}</Text>
              <Text style={[styles.itemSub, { color: colors.textSecondary }]}>Qty: {item.quantity}</Text>
            </View>
            <Text style={[styles.itemPrice, { color: colors.text }]}>
              ${((item.product?.price || 0) * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}
        <View style={[styles.totalRow, { borderTopColor: colors.border }]}>
          <Text style={[styles.totalLabel, { color: colors.text }]}>Grand Total</Text>
          <Text style={[styles.totalValue, { color: colors.primary }]}>${order.totalAmount}</Text>
        </View>
      </Card>

      <View style={styles.sectionTitleContainer}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>DELIVERY DETAILS</Text>
      </View>

      <Card style={styles.section}>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={20} color={colors.primary} style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Delivery Address</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{order.address}</Text>
          </View>
        </View>
        
        {order.notes ? (
           <View style={[styles.detailRow, { marginTop: 16 }]}>
            <Ionicons name="document-text-outline" size={20} color={colors.primary} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Notes</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{order.notes}</Text>
            </View>
          </View>
        ) : null}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  section: { padding: 20, marginBottom: 8 },
  headerTitle: { fontSize: 24, fontWeight: '700' },
  headerDate: { fontSize: 13, marginTop: 4, marginBottom: 24 },
  
  tracker: { flexDirection: 'column' },
  stepContainer: { flexDirection: 'row', height: 60 },
  stepIconContainer: { alignItems: 'center', width: 24, marginRight: 12 },
  stepDot: { borderRadius: 10 },
  stepLine: { width: 2, flex: 1, marginTop: 4 },
  stepTextContainer: { justifyContent: 'flex-start', paddingTop: -2 },
  stepTitle: { fontSize: 14, fontWeight: '600', marginTop: 0 },

  sectionTitleContainer: { marginTop: 24, marginBottom: 8, paddingHorizontal: 4 },
  sectionTitle: { fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  itemInfo: {},
  itemName: { fontSize: 16, fontWeight: '500' },
  itemSub: { fontSize: 13, marginTop: 2 },
  itemPrice: { fontSize: 16, fontWeight: '600' },
  
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 16, borderTopWidth: 1, borderStyle: 'dashed' },
  totalLabel: { fontSize: 16, fontWeight: '700' },
  totalValue: { fontSize: 20, fontWeight: '800' },

  detailRow: { flexDirection: 'row', alignItems: 'flex-start' },
  detailLabel: { fontSize: 12, marginBottom: 2 },
  detailValue: { fontSize: 15 },
});
