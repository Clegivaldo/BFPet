import React from 'react';
import {
    Animated,
    Easing,
    StyleSheet,
    View,
} from 'react-native';

export function PostCardSkeleton() {
  const shimmerAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      })
    ).start();
  }, [shimmerAnim]);

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.6, 0.3],
  });

  const Skeleton = ({ h = 12, mb = 8, w = '100%' }: any) => (
    <Animated.View
      style={{
        height: h,
        marginBottom: mb,
        width: w,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        opacity: shimmerOpacity,
      }}
    />
  );

  return (
    <View style={styles.container}>
      {/* Header skeleton */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Skeleton h={40} w={40} mb={0} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Skeleton h={14} w="60%" mb={6} />
            <Skeleton h={12} w="40%" mb={0} />
          </View>
        </View>
        <Skeleton h={20} w="60px" mb={0} />
      </View>

      {/* Image skeleton */}
      <Skeleton h={220} w="100%" mb={0} />

      {/* Content skeleton */}
      <View style={styles.content}>
        <Skeleton h={18} w="80%" mb={8} />
        <Skeleton h={14} w="100%" mb={4} />
        <Skeleton h={14} w="90%" mb={12} />
        <Skeleton h={12} w="50%" mb={0} />
      </View>

      {/* Counters skeleton */}
      <View style={styles.counters}>
        <Skeleton h={12} w="20%" mb={0} />
        <Skeleton h={12} w="25%" mb={0} />
        <Skeleton h={12} w="20%" mb={0} />
      </View>

      {/* Actions skeleton */}
      <View style={styles.actions}>
        <Skeleton h={40} w="30%" mb={0} />
        <Skeleton h={40} w="30%" mb={0} />
        <Skeleton h={40} w="30%" mb={0} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 8,
    borderBottomColor: '#f5f5f5',
    marginBottom: 0,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },

  content: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  counters: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    justifyContent: 'space-between',
  },

  actions: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    justifyContent: 'space-around',
  },
});
