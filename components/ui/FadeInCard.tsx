import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Easing,
    ViewProps,
} from 'react-native';

interface FadeInCardProps extends ViewProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

export function FadeInCard({
  children,
  delay = 0,
  duration = 500,
  style,
  ...props
}: FadeInCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [fadeAnim, slideAnim, delay, duration]);

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
}

// styles intentionally empty
