import React from 'react';
import { TextInput, Text, View, StyleSheet } from 'react-native';

export default function Input({ label, error, style, ...props }) {
  return (
    <View style={style}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor="#9ca3af"
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 12, color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    backgroundColor: 'white',
  },
  inputError: { borderColor: '#ef4444' },
  error: { marginTop: 4, color: '#ef4444', fontSize: 12 },
});
