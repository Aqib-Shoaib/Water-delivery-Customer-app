import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, fetchMe, updateMe, changePassword } = useAuth();
  const { colors } = useTheme();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cpLoading, setCpLoading] = useState(false);
  const [cpError, setCpError] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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

  const onChangePassword = async () => {
    setCpLoading(true);
    setCpError('');
    try {
      if (!newPassword || newPassword.length < 6) {
        setCpError('New password must be at least 6 characters');
        return;
      }
      if (newPassword !== confirmPassword) {
        setCpError('Passwords do not match');
        return;
      }
      await changePassword({ currentPassword, newPassword });
      Alert.alert('Password changed');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e) {
      setCpError(e.message || 'Change password failed');
    } finally {
      setCpLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={styles.cardPad}>
        <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
        <Input label="Name" value={name} onChangeText={setName} placeholder="Your name" />
        <Input label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="03xx-xxxxxxx" style={{ marginTop: 12 }} />
        <Input label="Address" value={address} onChangeText={setAddress} placeholder="Address" style={{ marginTop: 12 }} />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title={loading ? 'Saving...' : 'Save Changes'} onPress={onSave} disabled={loading} style={{ marginTop: 12 }} />
      </Card>

      <Card style={[styles.cardPad, { marginTop: 16 }]}>
        <Text style={[styles.title, { color: colors.text }]}>Change Password</Text>
        <Input label="Current Password" value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry secureToggle placeholder="Current password" />
        <Input label="New Password" value={newPassword} onChangeText={setNewPassword} secureTextEntry secureToggle placeholder="New password" style={{ marginTop: 12 }} />
        <Input label="Confirm New Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry secureToggle placeholder="Confirm new password" style={{ marginTop: 12 }} />
        {cpError ? <Text style={styles.error}>{cpError}</Text> : null}
        <Button title={cpLoading ? 'Updating...' : 'Update Password'} onPress={onChangePassword} disabled={cpLoading} style={{ marginTop: 12 }} />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  cardPad: { padding: 16 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  error: { color: '#ef4444', marginTop: 8 },
});
