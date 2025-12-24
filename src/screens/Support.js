import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { useNavigation, useTheme } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MOCK_SUPPORT_TICKETS } from '../data/mockData';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:5000';

export default function Support() {
  const { token } = useAuth();
  const { colors } = useTheme();
  const navigation = useNavigation();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tickets, setTickets] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const loadTickets = async () => {
    try {
      if (!API_BASE.includes('localhost') && token) {
        const res = await fetch(`${API_BASE}/api/customer-support`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setTickets(data);
        }
      } else {
        setTickets(MOCK_SUPPORT_TICKETS);
      }
    } catch (e) {
      setTickets(MOCK_SUPPORT_TICKETS);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { loadTickets(); }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadTickets();
  };

  const onSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      if(!API_BASE.includes('localhost') && token) {
        const res = await fetch(`${API_BASE}/api/customer-support`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: title.trim(), description: description.trim() }),
        });
        if (!res.ok) throw new Error('Failed to submit');
      } else {
         // Mock
        const newTicket = {
            _id: `ticket_${Date.now()}`,
            title: title.trim(),
            description: description.trim(),
            status: 'open',
            createdAt: new Date().toISOString()
        };
        setTickets([newTicket, ...tickets]);
      }
      
      setTitle('');
      setDescription('');
      setShowForm(false);
      if(!API_BASE.includes('localhost') && token) loadTickets();
      
    } catch (e) {
      setError(e.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return '#f59e0b';
      case 'resolved': return colors.success;
      case 'closed': return colors.textSecondary;
      default: return colors.textSecondary;
    }
  };

  const renderTicket = ({ item }) => {
    const statusColor = getStatusColor(item.status);
    return (
      <TouchableOpacity onPress={() => navigation.navigate('SupportDetails', { id: item._id })}>
        <Card style={styles.card}>
          <View style={styles.ticketHeader}>
            <View style={[styles.iconBox, { backgroundColor: statusColor + '15' }]}>
               <Ionicons name="chatbubble-ellipses-outline" size={20} color={statusColor} />
            </View>
            <View style={{ flex: 1, marginHorizontal: 12 }}>
              <Text style={[styles.tktTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
              <Text style={[styles.tktDate, { color: colors.textSecondary }]}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: statusColor + '15' }]}>
              <Text style={[styles.badgeText, { color: statusColor }]}>{item.status.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={[styles.tktDesc, { color: colors.textSecondary }]} numberOfLines={2}>{item.description}</Text>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Support Center</Text>
        <Button 
          title={showForm ? "Cancel" : "New Ticket"} 
          variant={showForm ? "ghost" : "primary"}
          size="sm"
          onPress={() => setShowForm(!showForm)} 
        />
      </View>

      {showForm && (
        <Card style={styles.formCard}>
           <Text style={[styles.formTitle, { color: colors.text }]}>Create New Ticket</Text>
           
           <Input 
             label="Subject"
             placeholder="Brief summary..." 
             value={title} 
             onChangeText={setTitle} 
             style={{ marginBottom: 12 }}
           />
           <Input 
             label="Description"
             placeholder="Describe your issue in detail..." 
             value={description} 
             onChangeText={setDescription} 
             multiline 
             numberOfLines={4}
             style={{ marginBottom: 12, height: 100 }}
           />
           
           {error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}
           
           <Button title={loading ? 'Submitting...' : 'Submit Ticket'} onPress={onSubmit} loading={loading} style={{ marginTop: 8 }} />
        </Card>
      )}

      <FlatList
        data={tickets}
        keyExtractor={(it) => it._id}
        renderItem={renderTicket}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        ListEmptyComponent={
          !showForm && (
            <View style={styles.center}>
              <Ionicons name="headset-outline" size={64} color={colors.textSecondary + '40'} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No tickets found</Text>
              <Text style={[styles.subEmpty, { color: colors.textSecondary }]}>Create a ticket to get help</Text>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 10 },
  title: { fontSize: 24, fontWeight: '700' },
  listContent: { padding: 16 },
  
  formCard: { margin: 16, marginTop: 0, padding: 16 },
  formTitle: { fontSize: 16, fontWeight: '600', marginBottom: 16 },
  error: { fontSize: 13, marginBottom: 12 },
  
  card: { padding: 16, marginBottom: 12 },
  ticketHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  tktTitle: { fontSize: 16, fontWeight: '600' },
  tktDate: { fontSize: 12, marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: '700' },
  tktDesc: { fontSize: 14, lineHeight: 20 },
  
  center: { alignItems: 'center', marginTop: 60, opacity: 0.8 },
  emptyText: { fontSize: 18, fontWeight: '600', marginTop: 16 },
  subEmpty: { fontSize: 14, marginTop: 4 },
});
