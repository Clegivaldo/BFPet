import { PRIMARY_COLOR } from '@/constants/theme';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'small' | 'medium' | 'large';
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle,
  size = 'medium',
}) => {
  const buttonSizeStyle = styles[size];
  const textSizeStyle = styles[`text_${size}`];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        buttonSizeStyle,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[styles.text, textSizeStyle, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  disabled: {
    backgroundColor: '#B8C5D6',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  text_small: {
    fontSize: 12,
  },
  text_medium: {
    fontSize: 16,
  },
  text_large: {
    fontSize: 18,
  },
});