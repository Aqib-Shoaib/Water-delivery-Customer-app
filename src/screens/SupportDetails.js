import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:5000';

export default function SupportDetails({ route }) {
  const { token } = useAuth();
  const ticketId = route.params?.id;
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [posting, setPosting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/customer-support/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setTicket(data);
    } catch (e) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [ticketId]);

  const submitComment = async () => {
    setPosting(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/customer-support/${ticketId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }
      setMessage('');
      await load();
    } catch (e) {
      setError(e.message || 'Failed to post');
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <View style={styles.center}><Text>Loading...</Text></View>;
  if (error) return <View style={styles.center}><Text>Error: {error}</Text></View>;
  if (!ticket) return <View style={styles.center}><Text>No data</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ticket.title}</Text>
      <Text>Status: {ticket.status}</Text>
      {ticket.description ? <Text style={{ marginTop: 6 }}>{ticket.description}</Text> : null}

      <Text style={[styles.title, { marginTop: 16 }]}>Comments</Text>
      <FlatList
        data={ticket.comments || []}
        keyExtractor={(c, idx) => `${c._id || idx}`}
        renderItem={({ item }) => (
          <View style={styles.comment}>
            <Text style={styles.commentAuthor}>{item.author?.name || 'User'}</Text>
            <Text style={styles.commentText}>{item.message}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No comments yet</Text>}
      />

      <TextInput placeholder="Write a comment" value={message} onChangeText={setMessage} style={styles.input} />
      <Button title={posting ? 'Posting...' : 'Post Comment'} onPress={submitComment} disabled={posting || !message.trim()} style={{ marginTop: 8 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '700' },
  comment: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  commentAuthor: { fontWeight: '700' },
  commentText: { marginTop: 2, color: '#374151' },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginTop: 8 },
});
