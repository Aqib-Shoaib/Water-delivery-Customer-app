import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity } from 'react-native';
import { useRoute, useTheme } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MOCK_SUPPORT_TICKETS } from '../data/mockData';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:5000';

export default function SupportDetails() {
  const { params } = useRoute();
  const { id } = params;
  const { token } = useAuth();
  const { colors } = useTheme();
  
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  
  // Mock comments/updates
  const [updates, setUpdates] = useState([
     { id: 1, text: 'We have received your request and are looking into it.', sender: 'support', createdAt: new Date(Date.now() - 86400000).toISOString() }
  ]);

  useEffect(() => {
    // In a real app, fetch ticket details + updates by ID
    // For now, find in mock or fetch list
    async function load() {
      try {
        if (!API_BASE.includes('localhost') && token) {
             // fetch detail
        } else {
            const found = MOCK_SUPPORT_TICKETS.find(t => t._id === id);
            if (found) setTicket(found);
            // In a real scenario, we'd have updates inside the ticket object
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const sendReply = () => {
    if (!reply.trim()) return;
    const newUpdate = {
        id: Date.now(),
        text: reply,
        sender: 'user',
        createdAt: new Date().toISOString()
    };
    setUpdates([...updates, newUpdate]);
    setReply('');
  };

  if (loading) return <View style={styles.center}><ActivityIndicator color={colors.primary} /></View>;
  if (!ticket) return <View style={styles.center}><Text style={{ color: colors.text }}>Ticket not found</Text></View>;

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return '#f59e0b';
      case 'resolved': return colors.success;
      default: return colors.textSecondary;
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.headerCard}>
          <View style={styles.headerTop}>
              <Text style={[styles.title, { color: colors.text }]}>{ticket.title}</Text>
              <View style={[styles.badge, { backgroundColor: getStatusColor(ticket.status) + '20' }]}>
                  <Text style={[styles.badgeText, { color: getStatusColor(ticket.status) }]}>{ticket.status.toUpperCase()}</Text>
              </View>
          </View>
          <Text style={[styles.date, { color: colors.textSecondary }]}>Opened on {new Date(ticket.createdAt).toLocaleString()}</Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={[styles.desc, { color: colors.text }]}>{ticket.description}</Text>
        </Card>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ACTIVITY</Text>
        
        {updates.map((u) => {
            const isSupport = u.sender === 'support';
            return (
                <View key={u.id} style={[styles.msgRow, isSupport ? styles.msgLeft : styles.msgRight]}>
                    <View style={[
                        styles.msgBubble, 
                        { 
                            backgroundColor: isSupport ? colors.card : colors.primary,
                            borderBottomLeftRadius: isSupport ? 0 : 16,
                            borderBottomRightRadius: isSupport ? 16 : 0,
                        }
                    ]}>
                        <Text style={[styles.msgText, { color: isSupport ? colors.text : '#fff' }]}>{u.text}</Text>
                        <Text style={[styles.msgDate, { color: isSupport ? colors.textSecondary : 'rgba(255,255,255,0.7)' }]}>
                            {new Date(u.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {u.sender === 'support' ? 'Support Agent' : 'You'}
                        </Text>
                    </View>
                </View>
            );
        })}
      </ScrollView>
      
      <View style={[styles.inputBox, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <TextInput 
            value={reply}
            onChangeText={setReply}
            placeholder="Type a reply..."
            placeholderTextColor={colors.textSecondary}
            style={[styles.input, { color: colors.text, backgroundColor: colors.background }]}
          />
          <TouchableOpacity onPress={sendReply} style={[styles.sendBtn, { backgroundColor: colors.primary }]}>
              <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 20 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  
  headerCard: { padding: 20, marginBottom: 24 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 18, fontWeight: '700', flex: 1, marginRight: 12 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: '700' },
  date: { fontSize: 12, marginTop: 4 },
  divider: { height: 1, marginVertical: 16 },
  desc: { fontSize: 15, lineHeight: 22 },
  
  sectionTitle: { fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 16, marginLeft: 8 },
  
  msgRow: { marginBottom: 16, flexDirection: 'row', width: '100%' },
  msgLeft: { justifyContent: 'flex-start' },
  msgRight: { justifyContent: 'flex-end' },
  msgBubble: { maxWidth: '80%', padding: 12, borderRadius: 16 },
  msgText: { fontSize: 15, marginBottom: 4 },
  msgDate: { fontSize: 11 },
  
  inputBox: { padding: 12, borderTopWidth: 1, flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, height: 44, borderRadius: 22, paddingHorizontal: 16 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginLeft: 12 },
});
