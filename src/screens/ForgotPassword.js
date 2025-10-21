import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function ForgotPassword() {
  const { requestPasswordReset } = useAuth();
  const navigation = useNavigation();
  const { colors } = useTheme();
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={styles.cardPad}>
        <Text style={[styles.title, { color: colors.text }]}>Forgot Password</Text>
        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          error={fieldError}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {info ? <Text style={[styles.info]}>{info}</Text> : null}
        {__DEV__ && devToken ? (
          <View style={{ marginTop: 8 }}>
            <Text style={{ fontSize: 12, color: '#6b7280' }}>Dev Token (testing):</Text>
            <Text selectable style={{ fontWeight: '600' }}>{devToken}</Text>
          </View>
        ) : null}
        <Button title={loading ? 'Submitting...' : 'Request Reset'} onPress={onSubmit} disabled={loading} style={{ marginTop: 12 }} />
        <TouchableOpacity onPress={goToOtp} style={{ marginTop: 16, alignItems: 'center' }}>
          <Text style={{ color: '#dc2626' }}>Already have a token? Enter it</Text>
        </TouchableOpacity>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  cardPad: { width: '100%', maxWidth: 400, padding: 16 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  error: { color: '#ef4444', marginTop: 8 },
  info: { color: '#065f46', marginTop: 8 },
});
