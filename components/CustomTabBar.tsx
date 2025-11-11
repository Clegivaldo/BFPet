import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Animated, Easing, StyleSheet, TouchableOpacity, View } from 'react-native';

export function CustomTabBar(props: BottomTabBarProps) {
  const { state, descriptors, navigation } = props;
  const colorScheme = useColorScheme();
  const scale = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.06, duration: 800, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        Animated.timing(scale, { toValue: 1, duration: 800, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [scale]);

  return (
    <View style={[styles.container, { backgroundColor: '#fff' }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name as any);
          }
        };

        // Central slot: we render the FAB there instead of a regular tab
        if (index === 1) {
          return (
            <View key={route.key} style={styles.centerSlot} pointerEvents="box-none">
              <TouchableOpacity onPress={() => navigation.navigate('create-post' as any)} activeOpacity={0.8}>
                <Animated.View style={[styles.fab, { transform: [{ scale }] }]}>
                  <Ionicons name="add" size={28} color="#fff" />
                </Animated.View>
              </TouchableOpacity>
            </View>
          );
        }

        // Map a few known SF names -> icon names
        const icon = (options.tabBarIcon as any)?.({ color: isFocused ? Colors[colorScheme ?? 'light'].tint : '#999' }) || null;

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={(options as any).tabBarTestID}
            onPress={onPress}
            style={styles.tab}
            activeOpacity={0.7}
          >
            {icon}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 70,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  centerSlot: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FF6B9D',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default CustomTabBar;
