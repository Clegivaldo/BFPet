import { useThemeColor } from '@/hooks/use-theme-color';
import { IPost } from '@/types/post.types';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { ShareModal } from './ShareModal';

interface ShareButtonProps {
  post: IPost;
  userId: number;
  sharesCount?: number;
  onShareSuccess?: () => void;
}

export function ShareButton({
  post,
  userId,
  sharesCount = 0,
  onShareSuccess,
}: ShareButtonProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const handlePress = () => {
    setModalVisible(true);
  };

  const handleShareSuccess = () => {
    setLoading(true);
    // Simular delay para atualizar UI
    setTimeout(() => {
      setLoading(false);
      onShareSuccess?.();
    }, 500);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={handlePress}
        disabled={loading}
        activeOpacity={0.7}
      >
        <View style={styles.button}>
          {loading ? (
            <ActivityIndicator
              size={20}
              color={tintColor}
            />
          ) : (
            <Ionicons
              name="share-social"
              size={20}
              color={tintColor}
            />
          )}
        </View>
        {sharesCount > 0 && (
          <Text style={[styles.count, { color: textColor }]}>
            {sharesCount}
          </Text>
        )}
      </TouchableOpacity>

      <ShareModal
        visible={modalVisible}
        post={post}
        userId={userId}
        onClose={() => setModalVisible(false)}
        onShareSuccess={handleShareSuccess}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  button: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});
