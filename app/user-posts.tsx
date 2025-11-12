import { PostCard } from '@/components/posts/PostCard';
import { FadeInCard } from '@/components/ui/FadeInCard';
import { PRIMARY_COLOR } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { profileService } from '@/services/profileService';
import { IPost } from '@/types/post.types';
import { showToast } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UserPostsScreen() {
  const router = useRouter();
  const { user: authUser } = useAuth();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  // Não precisamos rastrear likedPosts localmente aqui por enquanto

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      if (!authUser) return;

      const userPosts = await profileService.getUserPosts(authUser.id);
      setPosts(userPosts);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
      showToast('error', 'Erro', 'Não foi possível carregar os posts');
    } finally {
      setLoading(false);
    }
  }, [authUser]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  const handleLike = async (postId: number) => {
    // Implementar after postService
  };

  const handleComment = (postId: number) => {
    router.push({
      pathname: '/comments',
      params: { postId: String(postId) },
    });
  };

  const handleShare = (postId: number) => {
    loadPosts();
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>Nenhum post ainda</Text>
      <Text style={styles.emptySubtitle}>Crie seu primeiro post!</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={PRIMARY_COLOR} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meus Posts</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
          <Text style={styles.loadingText}>Carregando posts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={PRIMARY_COLOR} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Posts</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={posts}
        renderItem={({ item, index }) => (
          <FadeInCard delay={index * 50} duration={400}>
            <PostCard
              post={item}
              userId={authUser?.id || 0}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
              isLiked={false}
            />
          </FadeInCard>
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={PRIMARY_COLOR}
            colors={[PRIMARY_COLOR]}
          />
        }
        scrollIndicatorInsets={{ right: 1 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  backButton: {
    padding: 8,
    marginLeft: -8,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 4,
  },

  emptySubtitle: {
    fontSize: 14,
    color: '#999',
  },
});
