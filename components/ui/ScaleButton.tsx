import React, { useRef } from 'react';
import {
    Animated,
    Easing,
    TouchableOpacity,
    TouchableOpacityProps
} from 'react-native';

interface ScaleButtonProps extends TouchableOpacityProps {
  onPress?: () => void;
  children: React.ReactNode;
  scaleValue?: number;
}

export function ScaleButton({
  onPress,
  children,
  scaleValue = 0.95,
  ...props
}: ScaleButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: scaleValue,
      duration: 150,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 150,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
      }}
    >
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        {...props}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}
