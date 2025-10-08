import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function SignUp() {
  const { register } = useAuth();
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cnic, setCnic] = useState(''); // optional
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const emailValid = (v) => /^(?:[^\s@]+)@(?:[^\s@]+)\.(?:[^\s@]+)$/.test(v.trim());
  const passwordValid = (v) => v.length >= 6; // simple rule; adjust as needed
  const nameValid = (v) => v.trim().length >= 2;

  // Basic password strength: weak (<6), medium (>=6 + letters/numbers), strong (>=8 + letters/numbers/special)
  const passwordStrength = (v) => {
    const len = v.length;
    const hasLetter = /[a-zA-Z]/.test(v);
    const hasNumber = /\d/.test(v);
    const hasSpecial = /[^\da-zA-Z]/.test(v);
    if (!v) return { label: '', color: '#d1d5db', score: 0 };
    if (len < 6) return { label: 'Weak', color: '#ef4444', score: 1 };
    if (len >= 8 && hasLetter && hasNumber && hasSpecial) return { label: 'Strong', color: '#16a34a', score: 3 };
    if (hasLetter && hasNumber) return { label: 'Medium', color: '#f59e0b', score: 2 };
    return { label: 'Weak', color: '#ef4444', score: 1 };
  };

  // Format CNIC as 12345-1234567-1 while user types
  const formatCnic = (v) => {
    const digits = v.replace(/\D/g, '').slice(0, 13);
    let out = '';
    if (digits.length <= 5) out = digits;
    else if (digits.length <= 12) out = `${digits.slice(0, 5)}-${digits.slice(5)}`;
    else out = `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
    return out;
  };

  const onCnicChange = (v) => setCnic(formatCnic(v));

  const validate = () => {
    const errs = {};
    if (!nameValid(name)) errs.name = 'Enter your full name';
    if (!emailValid(email)) errs.email = 'Enter a valid email address';
    if (!passwordValid(password)) errs.password = 'Password must be at least 6 characters';
    // CNIC optional; if provided, ensure 13 digits
    if (cnic && cnic.replace(/\D/g, '').length !== 13) errs.cnic = 'CNIC must have 13 digits';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      if (!validate()) return;
      await register({ name: name.trim(), email: email.trim(), password, cnic: cnic ? cnic.replace(/\D/g, '') : undefined });
    } catch (e) {
      setError(e.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>
        <TextInput placeholder="Full Name" value={name} onChangeText={setName} style={[styles.input, fieldErrors.name && styles.inputError]} />
        {fieldErrors.name ? <Text style={styles.error}>{fieldErrors.name}</Text> : null}
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={[styles.input, fieldErrors.email && styles.inputError]} />
        {fieldErrors.email ? <Text style={styles.error}>{fieldErrors.email}</Text> : null}
        <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={[styles.input, fieldErrors.password && styles.inputError]} />
        {password ? (
          <View style={styles.strengthRow}>
            <View style={[styles.strengthBar, { backgroundColor: passwordStrength(password).color, width: `${passwordStrength(password).score * 33.33}%` }]} />
            <Text style={[styles.strengthText, { color: passwordStrength(password).color }]}>{passwordStrength(password).label}</Text>
          </View>
        ) : null}
        {fieldErrors.password ? <Text style={styles.error}>{fieldErrors.password}</Text> : null}
        <TextInput placeholder="CNIC (optional)" value={cnic} onChangeText={onCnicChange} keyboardType="number-pad" style={[styles.input, fieldErrors.cnic && styles.inputError]} />
        {fieldErrors.cnic ? <Text style={styles.error}>{fieldErrors.cnic}</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title={loading ? 'Creating...' : 'Sign Up'} onPress={onSubmit} disabled={loading} style={{ marginTop: 8 }} />
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 12, alignItems: 'center' }}>
          <Text style={{ color: '#dc2626' }}>Already have an account? Sign in</Text>
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
  inputError: { borderColor: '#ef4444' },
  error: { color: '#ef4444', marginTop: 8 },
  strengthRow: { marginTop: 6, marginBottom: 2 },
  strengthBar: { height: 6, borderRadius: 3 },
  strengthText: { marginTop: 4, fontSize: 12, fontWeight: '600' },
});

