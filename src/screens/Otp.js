import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function Otp() {
  const { confirmPasswordReset } = useAuth();
  const navigation = useNavigation();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const onSubmit = async () => {
    setLoading(true);
    setError('');
    setInfo('');
    try {
      await confirmPasswordReset({ token, password });
      setInfo('Password changed successfully. You can now sign in.');
      setTimeout(() => navigation.navigate('Login'), 800);
    } catch (e) {
      setError(e.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Enter Reset Token</Text>
        <TextInput placeholder="Token" value={token} onChangeText={setToken} autoCapitalize="none" style={styles.input} />
        <TextInput placeholder="New Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {info ? <Text style={styles.info}>{info}</Text> : null}
        <Button title={loading ? 'Submitting...' : 'Confirm Reset'} onPress={onSubmit} disabled={loading} style={{ marginTop: 8 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', padding: 16 },
  card: { width: '100%', maxWidth: 400, backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', padding: 16 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginTop: 8 },
  error: { color: '#ef4444', marginTop: 8 },
  info: { color: '#065f46', marginTop: 8 },
});
