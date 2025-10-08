import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState('');

  const emailValid = (v) => /^(?:[^\s@]+)@(?:[^\s@]+)\.(?:[^\s@]+)$/.test(v.trim());

  const onSubmit = async () => {
    setLoading(true);
    setError('');
    setFieldError('');
    try {
      if (!emailValid(email)) {
        setFieldError('Enter a valid email address');
        return;
      }
      await login({ email, password });
    } catch (e) {
      setError(e.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Customer Login</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={[styles.input, fieldError && styles.inputError]}
        />
        {fieldError ? <Text style={styles.error}>{fieldError}</Text> : null}
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title={loading ? 'Signing in...' : 'Sign In'} onPress={onSubmit} disabled={loading} style={{ marginTop: 8 }} />
        <View style={{ marginTop: 12 }}>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={{ alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ color: '#dc2626' }}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={{ alignItems: 'center' }}>
            <Text style={{ color: '#dc2626' }}>New here? Create an account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', padding: 16 },
  card: { width: '100%', maxWidth: 400, backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', padding: 16 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginTop: 8 },
  inputError: { borderColor: '#ef4444' },
  error: { color: '#ef4444', marginTop: 8 },
});
