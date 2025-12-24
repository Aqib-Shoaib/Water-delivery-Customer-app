import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

export default function Card({ children, style, variant = 'elevated' }) {
  const { colors } = useTheme();

  const getBackgroundColor = () => {
    if (variant === 'glass') {
      return colors.card + 'cc'; // 80% opacity
    }
    return colors.card;
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: colors.border,
          shadowColor: colors.primary, // Tinted shadow
        },
        variant === 'glass' && styles.glassBorder,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 4,
    borderWidth: 1,
    borderTopWidth: 1.5, // Slight highlight on top
    borderColor: 'transparent',
  },
  glassBorder: {
    borderTopColor: 'rgba(255,255,255,0.4)',
    borderLeftColor: 'rgba(255,255,255,0.2)',
    borderRightColor: 'rgba(255,255,255,0.2)',
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
});
