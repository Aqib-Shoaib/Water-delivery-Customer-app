import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, View, Animated } from 'react-native';
import { useTheme } from '@react-navigation/native';

export default function Button({
  title,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  loading = false,
  style,
  textStyle,
  disabled,
  icon,
  ...props
}) {
  const { colors } = useTheme();
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const sizeStyle = (() => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 8, paddingHorizontal: 14, minHeight: 36 };
      case 'lg':
        return { paddingVertical: 16, paddingHorizontal: 24, minHeight: 56 };
      case 'md':
      default:
        return { paddingVertical: 12, paddingHorizontal: 20, minHeight: 48 };
    }
  })();

  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: colors.primary,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      case 'primary':
      default:
        return {
          backgroundColor: colors.primary,
          borderWidth: 0,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
        };
    }
  };

  const getTextVariant = () => {
    switch (variant) {
      case 'secondary':
        return { color: colors.text };
      case 'outline':
      case 'ghost':
        return { color: colors.primary };
      case 'primary':
      default:
        return { color: '#ffffff' };
    }
  };

  const isDisabled = disabled || loading;
  const variantStyles = getVariantStyle();
  const textStyles = getTextVariant();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        disabled={isDisabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          styles.base,
          sizeStyle,
          variantStyles,
          styles.rounded,
          isDisabled && { opacity: 0.5 },
          style,
        ]}
        {...props}
      >
        <View style={styles.contentRow}>
          {loading ? (
            <ActivityIndicator size="small" color={textStyles.color} style={{ marginRight: 8 }} />
          ) : icon ? (
            <View style={{ marginRight: 8 }}>{icon}</View>
          ) : null}
          <Text style={[styles.text, textStyles, size === 'lg' && styles.textLg, textStyle]}>
            {title}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  rounded: { borderRadius: 16 },
  text: { fontSize: 15, fontWeight: '600', letterSpacing: 0.3 },
  textLg: { fontSize: 17, fontWeight: '700' },
  contentRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
});

