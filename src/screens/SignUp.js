import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useTheme } from '@react-navigation/native';

export default function SignUp({ navigation }) {
  const { register, loading } = useAuth();
  const { colors } = useTheme();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cnic, setCnic] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if(!name || !email || !password || !cnic) {
      setError("Please fill in all fields");
      return;
    }
    setError('');
    try {
      await register({ name, email, password, cnic });
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Join us and get water delivered to your doorstep
            </Text>
          </View>

          <Card variant="glass" style={styles.formCard}>
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={name}
              onChangeText={setName}
              leftIcon="person-outline"
            />

            <Input
              label="Email Address"
              placeholder="john@example.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={{ marginTop: 16 }}
              leftIcon="mail-outline"
            />
            
            <Input
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={{ marginTop: 16 }}
              leftIcon="lock-closed-outline"
            />

            <Input
              label="CNIC"
              placeholder="12345-1234567-1"
              value={cnic}
              onChangeText={setCnic}
              keyboardType="numeric"
              style={{ marginTop: 16 }}
              leftIcon="card-outline"
            />

            {error ? (
              <View style={[styles.errorBox, { backgroundColor: colors.error + '15' }]}>
                <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
              </View>
            ) : null}

            <Button 
              title="Sign Up" 
              onPress={handleRegister} 
              loading={loading} 
              disabled={loading}
              size="lg"
              style={{ marginTop: 24 }}
            />
          </Card>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.linkText, { color: colors.primary }]}> Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  formCard: {
    padding: 24,
  },
  errorBox: {
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
    paddingBottom: 24,
  },
  footerText: {
    fontSize: 15,
  },
  linkText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
