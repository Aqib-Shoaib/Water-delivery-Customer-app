import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:5000';

export default function Support() {
  const { token } = useAuth();
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tickets, setTickets] = useState([]);

  const loadTickets = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/customer-support`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setTickets(data);
    } catch (e) {
      setError(e.message || 'Failed to load tickets');
    }
  };

  useEffect(() => { loadTickets(); }, []);

  const onSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      if (!title.trim() || !description.trim()) {
        setError('Title and description are required');
        return;
      }
      const res = await fetch(`${API_BASE}/api/customer-support`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: title.trim(), description: description.trim() }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }
      setTitle('');
      setDescription('');
      await loadTickets();
    } catch (e) {
      setError(e.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Support</Text>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} multiline />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title={loading ? 'Sending...' : 'Submit Ticket'} onPress={onSubmit} disabled={loading} style={{ marginTop: 8 }} />

      <Text style={[styles.title, { marginTop: 16 }]}>My Tickets</Text>
      <FlatList
        data={tickets}
        keyExtractor={(it) => it._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('SupportDetails', { id: item._id })}>
            <View style={styles.card}>
              <Text style={styles.tktTitle}>{item.title}</Text>
              <Text style={styles.tktStatus}>Status: {item.status}</Text>
              {item.description ? <Text style={styles.tktDesc}>{item.description}</Text> : null}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>No tickets yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: '700' },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginTop: 8 },
  error: { color: '#ef4444', marginTop: 8 },
  card: { padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginTop: 12 },
  tktTitle: { fontWeight: '700' },
  tktStatus: { marginTop: 4, color: '#374151' },
  tktDesc: { marginTop: 6, color: '#374151' },
});
