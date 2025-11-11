import { PostCard } from '@/components/posts/PostCard';
import { PostCardSkeleton } from '@/components/posts/PostCardSkeleton';
import { FadeInCard } from '@/components/ui/FadeInCard';
import { useAuth } from '@/contexts/AuthContext';
import { postService } from '@/services/postService';
import { IPost } from '@/types/post.types';
import { showToast } from '@/utils/helpers';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FeedScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [liking, setLiking] = useState<number | null>(null);

  const loadPosts = useCallback(async () => {
    try {
      const allPosts = await postService.getAllPosts();
      setPosts(allPosts);

      // Carregar quais posts o usuário já curtiu
      if (user && allPosts.length > 0) {
        const liked = new Set<number>();
        for (const post of allPosts) {
          const isLiked = await postService.isPostLikedByUser(post.id, user.id);
          if (isLiked) {
            liked.add(post.id);
          }
        }
        setLikedPosts(liked);
      }
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
      showToast('error', 'Erro', 'Não foi possível carregar os posts');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  const handleLike = async (postId: number) => {
    if (!user || liking === postId) return;

    try {
      setLiking(postId);
      const newLiked = new Set(likedPosts);

      // Atualizar estado local
      if (newLiked.has(postId)) {
        newLiked.delete(postId);
      } else {
        newLiked.add(postId);
      }
      setLikedPosts(newLiked);

      // Atualizar no banco
      await postService.toggleLike(postId, user.id);

      // Recarregar posts para atualizar contadores
      const updatedPosts = await postService.getAllPosts();
      setPosts(updatedPosts);

      showToast('success', 'Sucesso', newLiked.has(postId) ? 'Post curtido!' : 'Curtida removida');
    } catch (error) {
      console.error('Erro ao curtir post:', error);
      showToast('error', 'Erro', 'Não foi possível curtir o post');
      // Reverter estado em caso de erro
      setLikedPosts(likedPosts);
    } finally {
      setLiking(null);
    }
  };

  const handleComment = (postId: number) => {
    // Navegar para tela de comentários
    router.push({
      pathname: '/comments',
      params: { postId: String(postId) },
    });
  };

  const handleShare = (postId: number) => {
    // Após compartilhar, recarregar posts para atualizar contadores
    loadPosts();
  };

  const handleEdit = (postId: number) => {
    // Navegar para tela de edição
  router.push({ pathname: '/edit-post' as any, params: { postId: String(postId) } });
  };

  const handleDelete = async (postId: number) => {
    if (!user) return;
    try {
      await postService.deletePost(postId, user.id);
      await loadPosts();
      showToast('success', 'Sucesso', 'Publicação excluída');
    } catch (error) {
      console.error('Erro ao excluir post:', error);
      showToast('error', 'Erro', 'Não foi possível excluir a publicação');
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🐾</Text>
      <Text style={styles.emptyTitle}>Nenhum post encontrado</Text>
      <Text style={styles.emptySubtitle}>Seja o primeiro a postar!</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🐾 BFpet Feed</Text>
        </View>
        <FlatList
          data={[1, 2, 3, 4]}
          renderItem={() => <PostCardSkeleton />}
          keyExtractor={(_, i) => `skeleton-${i}`}
          scrollEnabled={false}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🐾 BFpet Feed</Text>
      </View>

      <FlatList
        data={posts}
        renderItem={({ item, index }) => (
          <FadeInCard delay={index * 50} duration={400}>
            <PostCard
              post={item}
              userId={user!.id}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isLiked={likedPosts.has(item.id)}
              isLiking={liking === item.id}
            />
          </FadeInCard>
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FF6B9D"
            colors={['#FF6B9D']}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
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

  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 14,
    color: '#999',
  },
});
