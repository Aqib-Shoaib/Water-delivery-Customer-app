import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Linking } from 'react-native';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:5000';

export default function About() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [about, setAbout] = useState(null);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [aboutRes, settingsRes] = await Promise.all([
          fetch(`${API_BASE}/api/about`),
          fetch(`${API_BASE}/api/site-settings`),
        ]);
        if (!aboutRes.ok) throw new Error(`About HTTP ${aboutRes.status}`);
        if (!settingsRes.ok) throw new Error(`Settings HTTP ${settingsRes.status}`);
        const aboutJson = await aboutRes.json();
        const settingsJson = await settingsRes.json();
        if (!cancelled) {
          setAbout(aboutJson);
          setSettings(settingsJson);
        }
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true };
  }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator /></View>;
  if (error) return <View style={styles.center}><Text>Error: {error}</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{settings?.siteName || 'Water Delivery'}</Text>
      {settings?.contactPhone ? <Text style={styles.row}>Phone: {settings.contactPhone}</Text> : null}
      {settings?.contactEmail ? <Text style={styles.row}>Email: {settings.contactEmail}</Text> : null}
      {settings?.address ? <Text style={styles.row}>Address: {settings.address}</Text> : null}
      {about?.missionStatement ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.sectionText}>{about.missionStatement}</Text>
        </View>
      ) : null}
      {about?.visionStatement ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Vision</Text>
          <Text style={styles.sectionText}>{about.visionStatement}</Text>
        </View>
      ) : null}
      {about?.socialLinks?.length ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social</Text>
          {about.socialLinks.map((s, idx) => (
            <Text key={idx} style={styles.link} onPress={() => s.url && Linking.openURL(s.url)}>
              {s.label || s.url}
            </Text>
          ))}
        </View>
      ) : null}
      {about?.usefulLinks?.length ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Useful Links</Text>
          {about.usefulLinks.map((s, idx) => (
            <Text key={idx} style={styles.link} onPress={() => s.url && Linking.openURL(s.url)}>
              {s.label || s.url}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 12 },
  row: { marginTop: 4, color: '#374151' },
  section: { marginTop: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  sectionText: { color: '#374151' },
  link: { color: '#dc2626', marginTop: 4 },
});
