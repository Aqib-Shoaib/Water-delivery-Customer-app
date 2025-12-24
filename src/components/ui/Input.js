import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  error,
  leftIcon,
  rightIcon,
  style,
  keyboardType,
  autoCapitalize = 'none',
  ...props
}) {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isSecure = secureTextEntry && !showPassword;
  
  const borderColor = error
    ? colors.error
    : isFocused
    ? colors.primary
    : 'transparent';

  const backgroundColor = colors.card;

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>}
      
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor,
            borderColor,
            borderWidth: isFocused || error ? 1.5 : 1,
            shadowColor: isFocused ? colors.primary : '#000',
            shadowOpacity: isFocused ? 0.15 : 0.05,
          },
        ]}
      >
        {leftIcon && (
          <View style={styles.leftIcon}>
            <Ionicons name={leftIcon} size={20} color={isFocused ? colors.primary : colors.textSecondary} />
          </View>
        )}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary + '80'} // 50% opacity
          secureTextEntry={isSecure}
          style={[styles.input, { color: colors.text }]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          {...props}
        />

        {(secureTextEntry || rightIcon) && (
          <View style={styles.rightIcon}>
            {secureTextEntry ? (
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            ) : (
              <Ionicons name={rightIcon} size={20} color={colors.textSecondary} />
            )}
          </View>
        )}
      </View>

      {error ? <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  leftIcon: {
    marginRight: 12,
  },
  rightIcon: {
    marginLeft: 12,
  },
  errorText: {
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
});
