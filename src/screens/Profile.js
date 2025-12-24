import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity, Image, Modal, FlatList, Platform } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:5000';

export default function Profile() {
  const { user, fetchMe, updateMe, changePassword, logout, token } = useAuth();
  const { colors } = useTheme();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cpLoading, setCpLoading] = useState(false);
  const [cpError, setCpError] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeSection, setActiveSection] = useState('overview');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: false,
  });

  useEffect(() => {
    fetchMe().catch(() => {});
  }, []);

  useEffect(() => {
    setName(user?.name || '');
    setPhone(user?.phone || '');
    setAddress(user?.address || '');
    setEmail(user?.email || '');
  }, [user]);

  const onSave = async () => {
    setLoading(true);
    setError('');
    try {
      await updateMe({ name, phone, address, email });
      Alert.alert('Success', 'Profile updated successfully');
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
      Alert.alert('Success', 'Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordModal(false);
    } catch (e) {
      setCpError(e.message || 'Change password failed');
    } finally {
      setCpLoading(false);
    }
  };

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const uploadAvatar = async (uri) => {
    if (!uri) return;
    setUploading(true);
    try {
      // Mock for demo mode or localhost if specialized upload not reachable? 
      // check if we are in demo mode from AuthContext might be good, but let's try calling API.
      if (API_BASE.includes('localhost') && !token) { 
         // Mock upload update locally if running mock
         updateMe({ avatar: uri }); 
         return;
      }

      const formData = new FormData();
      formData.append('avatar', {
        uri,
        name: 'avatar.jpg',
        type: 'image/jpeg',
      });

      const res = await fetch(`${API_BASE}/api/auth/avatar`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }
      const data = await res.json();
      // Refetch user to get new avatar url
      await fetchMe();
      Alert.alert('Success', 'Profile picture updated');
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to upload image. ' + e.message);
    } finally {
      setUploading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      uploadAvatar(result.assets[0].uri);
    }
  };

  const renderOverview = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <Card style={[styles.profileHeader, { backgroundColor: colors.card }]}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: user?.avatar || 'https://picsum.photos/seed/user/100/100' }} 
              style={[styles.avatar, { borderColor: colors.background }]} 
            />
            {uploading && (
                <View style={[StyleSheet.absoluteFill, { alignItems:'center', justifyContent:'center', backgroundColor:'rgba(0,0,0,0.3)', borderRadius: 40 }]}>
                    <ActivityIndicator color="#fff" />
                </View>
            )}
            <TouchableOpacity 
                style={[styles.cameraButton, { backgroundColor: colors.primary }]}
                onPress={pickImage}
                disabled={uploading}
            >
              <Ionicons name="camera" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.userDetails}>
            <Text style={[styles.userName, { color: colors.text }]}>{user?.name}</Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user?.email}</Text>
            <View style={[styles.memberBadge, { backgroundColor: colors.primary + '15', marginTop: 8 }]}>
                <Ionicons name="shield-checkmark" size={12} color={colors.primary} style={{ marginRight: 4 }} />
                <Text style={[styles.memberText, { color: colors.primary }]}>Verified Member</Text>
            </View>
          </View>
        </View>
        
        <View style={[styles.statsRow, { borderTopColor: colors.border }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>12</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Orders</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>$240</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Spent</Text>
          </View>
        </View>
      </Card>

      <View style={styles.sectionGrid}>
        <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.card }]} onPress={() => setActiveSection('personal')}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
            <Ionicons name="person-outline" size={22} color={colors.primary} />
          </View>
          <Text style={[styles.menuTitle, { color: colors.text }]}>Personal Info</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.card }]} onPress={() => setActiveSection('notifications')}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
            <Ionicons name="notifications-outline" size={22} color={colors.primary} />
          </View>
          <Text style={[styles.menuTitle, { color: colors.text }]}>Notifications</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.card }]} onPress={() => setShowPasswordModal(true)}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
            <Ionicons name="lock-closed-outline" size={22} color={colors.primary} />
          </View>
          <Text style={[styles.menuTitle, { color: colors.text }]}>Security</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.card, marginTop: 24 }]} onPress={logout}>
          <View style={[styles.iconContainer, { backgroundColor: colors.error + '15' }]}>
            <Ionicons name="log-out-outline" size={22} color={colors.error} />
          </View>
          <Text style={[styles.menuTitle, { color: colors.error }]}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderPersonalInfo = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <Card style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <TouchableOpacity onPress={() => setActiveSection('overview')} style={{ paddingRight: 16 }}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Information</Text>
        </View>
        
        <Input label="Full Name" value={name} onChangeText={setName} placeholder="Your name" leftIcon="person-outline" />
        <Input label="Email" value={email} onChangeText={setEmail} placeholder="your@email.com" keyboardType="email-address" style={{ marginTop: 16 }} leftIcon="mail-outline" />
        <Input label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="03xx-xxxxxxx" style={{ marginTop: 16 }} leftIcon="call-outline" />
        <Input label="Address" value={address} onChangeText={setAddress} placeholder="Your address" style={{ marginTop: 16 }} leftIcon="location-outline" multiline />
        
        {error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}
        <Button title={loading ? 'Saving...' : 'Save Changes'} onPress={onSave} disabled={loading} style={{ marginTop: 24 }} />
      </Card>
    </ScrollView>
  );

  const renderNotifications = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <Card style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <TouchableOpacity onPress={() => setActiveSection('overview')} style={{ paddingRight: 16 }}>
             <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifications</Text>
        </View>
        
        {Object.keys(notifications).map((key) => (
            <View key={key} style={[styles.notificationItem, { borderBottomColor: colors.border }]}>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.notificationTitle, { color: colors.text }]}>
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Text>
                    <Text style={[styles.notificationDesc, { color: colors.textSecondary }]}>
                        Receive updates about {key}
                    </Text>
                </View>
                <TouchableOpacity 
                    style={[
                        styles.toggle, 
                        { backgroundColor: notifications[key] ? colors.primary : colors.border }
                    ]}
                    onPress={() => toggleNotification(key)}
                >
                    <View style={[
                        styles.toggleCircle, 
                        notifications[key] ? styles.toggleCircleActive : {},
                        { backgroundColor: '#fff' }
                    ]} />
                </TouchableOpacity>
            </View>
        ))}
      </Card>
    </ScrollView>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {activeSection === 'overview' && renderOverview()}
      {activeSection === 'personal' && renderPersonalInfo()}
      {activeSection === 'notifications' && renderNotifications()}

      <Modal
        visible={showPasswordModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Change Password</Text>
            <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <Input 
              label="Current Password" 
              value={currentPassword} 
              onChangeText={setCurrentPassword} 
              secureTextEntry 
              placeholder="Current password" 
            />
            <Input 
              label="New Password" 
              value={newPassword} 
              onChangeText={setNewPassword} 
              secureTextEntry 
              placeholder="New password" 
              style={{ marginTop: 16 }} 
            />
            <Input 
              label="Confirm New Password" 
              value={confirmPassword} 
              onChangeText={setConfirmPassword} 
              secureTextEntry 
              placeholder="Confirm new password" 
              style={{ marginTop: 16 }} 
            />
            {cpError ? <Text style={[styles.error, { color: colors.error }]}>{cpError}</Text> : null}
            <Button 
              title={cpLoading ? 'Updating...' : 'Update Password'} 
              onPress={onChangePassword} 
              disabled={cpLoading} 
              style={{ marginTop: 24 }} 
            />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16 },
  
  // Header
  profileHeader: { padding: 20, marginBottom: 20 },
  profileInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  avatarContainer: { position: 'relative', marginRight: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 4 },
  cameraButton: { position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  userDetails: { flex: 1 },
  userName: { fontSize: 20, fontWeight: '700' },
  userEmail: { fontSize: 13, marginTop: 2 },
  memberBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  memberText: { fontSize: 10, fontWeight: '700' },
  
  statsRow: { flexDirection: 'row', paddingTop: 16, borderTopWidth: 1 },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 18, fontWeight: '700' },
  statLabel: { fontSize: 12 },
  statDivider: { width: 1, height: '80%', alignSelf: 'center' },
  
  // Menu
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 12 },
  iconContainer: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  menuTitle: { flex: 1, fontSize: 16, fontWeight: '600' },
  
  // Sections
  sectionCard: { padding: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '700' },
  
  // Notifications
  notificationItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1 },
  notificationTitle: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  notificationDesc: { fontSize: 12 },
  toggle: { width: 50, height: 28, borderRadius: 14, padding: 2 },
  toggleCircle: { width: 24, height: 24, borderRadius: 12 },
  toggleCircleActive: { alignSelf: 'flex-end' },
  
  error: { marginTop: 12, fontSize: 14 },
  
  // Modal
  modalContainer: { flex: 1 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1 },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  modalContent: { padding: 20 },
});
