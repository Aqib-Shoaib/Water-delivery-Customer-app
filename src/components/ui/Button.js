import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

export default function Button({ title, variant = 'primary', style, textStyle, ...props }) {
  const variantStyle = styles[variant] || styles.primary;
  const variantText = styles[`${variant}Text`] || styles.primaryText;
  return (
    <Pressable style={({ pressed }) => [styles.base, variantStyle, pressed && styles.pressed, style]} {...props}>
      <Text style={[styles.text, variantText, textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { fontSize: 14, fontWeight: '600' },
  pressed: { opacity: 0.85 },
  primary: { backgroundColor: '#dc2626' },
  primaryText: { color: 'white' },
  secondary: { backgroundColor: '#e5e7eb' },
  secondaryText: { color: '#111827' },
  outline: { borderWidth: 1, borderColor: '#d1d5db', backgroundColor: 'white' },
  outlineText: { color: '#111827' },
});

