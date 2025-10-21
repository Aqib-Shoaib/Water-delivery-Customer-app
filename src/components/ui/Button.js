import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { useTheme } from '@react-navigation/native';

export default function Button({
  title,
  variant = 'primary',
  size = 'md', // 'sm' | 'md' | 'lg'
  loading = false,
  style,
  textStyle,
  disabled,
  ...props
}) {
  const { colors } = useTheme();

  const sizeStyle = (() => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 9, paddingHorizontal: 12 };
      case 'lg':
        return { paddingVertical: 14, paddingHorizontal: 18 };
      case 'md':
      default:
        return { paddingVertical: 12, paddingHorizontal: 16 };
    }
  })();

  // Fixed palette for consistency across light/dark
  const BRAND_PRIMARY = '#dc2626';
  const NEUTRAL_BG = '#e5e7eb';
  const NEUTRAL_TEXT = '#111827';
  const NEUTRAL_BORDER = '#d1d5db';

  const baseVariant = (() => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: NEUTRAL_BG,
          borderWidth: 0,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: NEUTRAL_BORDER,
        };
      case 'primary':
      default:
        return {
          backgroundColor: BRAND_PRIMARY,
          borderWidth: 0,
        };
    }
  })();

  const textVariant = (() => {
    switch (variant) {
      case 'secondary':
      case 'outline':
        return { color: NEUTRAL_TEXT };
      case 'primary':
      default:
        return { color: '#ffffff' };
    }
  })();

  const isDisabled = disabled || loading;

  return (
    <Pressable
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        sizeStyle,
        baseVariant,
        styles.rounded,
        styles.shadow,
        isDisabled && { opacity: 0.65 },
        pressed && styles.pressed,
        style,
      ]}
      {...props}
    >
      <View style={styles.contentRow}>
        {loading ? (
          <ActivityIndicator size="small" color={textVariant.color === '#ffffff' ? '#fff' : BRAND_PRIMARY} style={{ marginRight: 8 }} />
        ) : null}
        <Text style={[styles.text, textVariant, textStyle]}>{title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rounded: { borderRadius: 12 },
  text: { fontSize: 16, fontWeight: '700' },
  pressed: { transform: [{ scale: 0.98 }] },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  primary: {},
  primaryText: {},
  secondary: {},
  secondaryText: {},
  outline: {},
  outlineText: {},
  contentRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
});

