import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useTheme } from '@react-navigation/native';
import { useThemeContext } from '../context/ThemeContext';

export default function Login({ navigation }) {
  const { login, loading } = useAuth();
  const { colors } = useTheme();
  const { mode } = useThemeContext();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if(!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setError('');
    try {
      await login({ identifier: email, password });
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
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={[styles.logoContainer]}>
              <Image source={require('../../assets/logo-liflon.png')} style={styles.logo} />
            </View>
            <Text style={[styles.subtitle, { color: colors.textSecondary, fontSize: 12 }]}>
              Liflon - A Product of KSHEALTHPLUS
            </Text>
            <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Sign in to manage your water deliveries
            </Text>
          </View>

          <Card variant="glass" style={styles.formCard}>
            <Input
              label="Email, Username or Mobile"
              placeholder="Enter email, username or mobile"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="default"
              leftIcon="person-outline"
            />
            
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={{ marginTop: 16 }}
              leftIcon="lock-closed-outline"
            />
            
            <TouchableOpacity 
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotPass}
            >
              <Text style={[styles.forgotPassText, { color: colors.primary }]}>Forgot Password?</Text>
            </TouchableOpacity>

            {error ? (
              <View style={[styles.errorBox, { backgroundColor: colors.error + '15' }]}>
                <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
              </View>
            ) : null}

            <Button 
              title="Sign In" 
              onPress={handleLogin} 
              loading={loading} 
              size="lg"
              style={{ marginTop: 24 }}
            />
          </Card>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={[styles.linkText, { color: colors.primary }]}> Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  content: {
    flex: 1,
    padding: 12,
  },
  header: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 40,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '800',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  formCard: {
    padding: 12,
    marginTop: 10,
  },
  forgotPass: {
    alignSelf: 'flex-end',
    marginTop: 12,
  },
  forgotPassText: {
    fontSize: 14,
    fontWeight: '600',
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
  },
  footerText: {
    fontSize: 15,
  },
  linkText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
