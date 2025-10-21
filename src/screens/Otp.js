import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function Otp() {
  const { confirmPasswordReset } = useAuth();
  const navigation = useNavigation();
  const { colors } = useTheme();
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={styles.cardPad}>
        <Text style={[styles.title, { color: colors.text }]}>Enter Reset Token</Text>
        <Input
          label="Token"
          placeholder="Paste reset token"
          value={token}
          onChangeText={setToken}
          autoCapitalize="none"
        />
        <Input
          label="New Password"
          placeholder="Enter new password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          secureToggle
          style={{ marginTop: 12 }}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {info ? <Text style={styles.info}>{info}</Text> : null}
        <Button title={loading ? 'Submitting...' : 'Confirm Reset'} onPress={onSubmit} disabled={loading} style={{ marginTop: 12 }} />
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
