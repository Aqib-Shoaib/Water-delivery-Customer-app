import React, { useMemo, useState } from 'react';
import { TextInput, Text, View, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Input({
  label,
  error,
  style,
  secureTextEntry,
  secureToggle = false,
  leftIcon,
  rightIcon,
  ...props
}) {
  const { colors, dark } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(!!secureTextEntry);

  const borderColor = useMemo(() => {
    if (error) return '#ef4444';
    if (isFocused) return '#dc2626';
    return dark ? '#4b5563' : '#d1d5db';
  }, [error, isFocused, dark]);

  return (
    <View style={style}>
      {label ? (
        <Text style={[styles.label, { color: dark ? '#d1d5db' : '#374151' }]}>{label}</Text>
      ) : null}
      <View
        style={[
          styles.inputWrapper,
          {
            borderColor,
            backgroundColor: dark ? '#111827' : '#ffffff',
            shadowColor: isFocused ? '#dc2626' : 'transparent',
          },
          isFocused && styles.focusShadow,
        ]}
      >
        {leftIcon ? <View style={styles.iconLeft}>{leftIcon}</View> : null}
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholderTextColor={dark ? '#9ca3af' : '#6b7280'}
          secureTextEntry={isSecure}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        {secureToggle ? (
          <Pressable onPress={() => setIsSecure((v) => !v)} style={styles.iconRight}>
            <Ionicons name={isSecure ? 'eye-off' : 'eye'} size={18} color={dark ? '#9ca3af' : '#6b7280'} />
          </Pressable>
        ) : rightIcon ? (
          <View style={styles.iconRight}>{rightIcon}</View>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 12, marginBottom: 6 },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  iconLeft: { paddingRight: 8 },
  iconRight: { paddingLeft: 8 },
  focusShadow: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  error: { marginTop: 6, color: '#ef4444', fontSize: 12 },
});
