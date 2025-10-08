import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, fetchMe, updateMe } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // ensure we have fresh data
    fetchMe().catch(() => {});
  }, []);

  useEffect(() => {
    setName(user?.name || '');
    setPhone(user?.phone || '');
    setAddress(user?.address || '');
  }, [user]);

  const onSave = async () => {
    setLoading(true);
    setError('');
    try {
      await updateMe({ name, phone, address });
      Alert.alert('Profile updated');
    } catch (e) {
      setError(e.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={styles.input} />
      <TextInput placeholder="Address" value={address} onChangeText={setAddress} style={styles.input} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title={loading ? 'Saving...' : 'Save Changes'} onPress={onSave} disabled={loading} style={{ marginTop: 8 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginTop: 8 },
  error: { color: '#ef4444', marginTop: 8 },
});
