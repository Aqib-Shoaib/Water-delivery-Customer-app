import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { useNavigation, useRoute, useTheme } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Otp() {
  const { confirmPasswordReset } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useTheme();
  
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async () => {
    if (!token || !password) {
      setError("Please enter the code and new password");
      return;
    }
    setLoading(true);
    setError('');
    try {
      await confirmPasswordReset({ token, password });
      Alert.alert('Success', 'Password reset successfully', [
        { text: 'Login', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <View style={styles.content}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
             <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Reset Password</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Enter the verification code sent to {route.params?.email}
            </Text>
          </View>

          <Card variant="glass" style={styles.formCard}>
            <Input
              label="Verification Code"
              placeholder="123456"
              value={token}
              onChangeText={setToken}
              keyboardType="number-pad"
              style={{ marginBottom: 16 }}
              leftIcon="key-outline"
            />
            
            <Input
              label="New Password"
              placeholder="Enter new password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              leftIcon="lock-closed-outline"
            />
            
            {error ? (
              <View style={[styles.errorBox, { backgroundColor: colors.error + '15' }]}>
                <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
              </View>
            ) : null}

            <Button 
              title="Reset Password" 
              onPress={onSubmit} 
              loading={loading} 
              size="lg"
              style={{ marginTop: 24 }}
            />
          </Card>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  backBtn: { position: 'absolute', top: 20, left: 24, zIndex: 10 },
  header: { marginBottom: 32 },
  title: { fontSize: 32, fontWeight: '700', marginBottom: 12 },
  subtitle: { fontSize: 16, lineHeight: 24 },
  formCard: { padding: 24 },
  errorBox: { padding: 12, borderRadius: 12, marginTop: 16, alignItems: 'center' },
  errorText: { fontSize: 14, fontWeight: '500' },
});
