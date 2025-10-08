import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function ForgotPassword() {
  const { requestPasswordReset } = useAuth();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [devToken, setDevToken] = useState(''); // useful in non-production since API returns token for testing
  const [fieldError, setFieldError] = useState('');

  const emailValid = (v) => /^(?:[^\s@]+)@(?:[^\s@]+)\.(?:[^\s@]+)$/.test(v.trim());

  const onSubmit = async () => {
    setLoading(true);
    setError('');
    setInfo('');
    setFieldError('');
    try {
      if (!emailValid(email)) {
        setFieldError('Enter a valid email address');
        return;
      }
      const res = await requestPasswordReset({ email });
      setInfo('If an account exists, a reset token has been generated.');
      if (res?.token) setDevToken(res.token);
    } catch (e) {
      setError(e.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const goToOtp = () => {
    navigation.navigate('Otp');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Forgot Password</Text>
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={[styles.input, fieldError && styles.inputError]} />
        {fieldError ? <Text style={styles.error}>{fieldError}</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {info ? <Text style={styles.info}>{info}</Text> : null}
        {__DEV__ && devToken ? (
          <View style={{ marginTop: 8 }}>
            <Text style={{ fontSize: 12, color: '#6b7280' }}>Dev Token (testing):</Text>
            <Text selectable style={{ fontWeight: '600' }}>{devToken}</Text>
          </View>
        ) : null}
        <Button title={loading ? 'Submitting...' : 'Request Reset'} onPress={onSubmit} disabled={loading} style={{ marginTop: 8 }} />
        <TouchableOpacity onPress={goToOtp} style={{ marginTop: 12, alignItems: 'center' }}>
          <Text style={{ color: '#dc2626' }}>Already have a token? Enter it</Text>
        </TouchableOpacity>
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
