import { FadeInCard } from '@/components/ui/FadeInCard';
import { PRIMARY_COLOR } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { postService } from '@/services/postService';
import { IPost } from '@/types/post.types';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExploreScreen() {
  const router = useRouter();
  const { user: authUser } = useAuth();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  // Carregar posts quando a página ganha foco
  useFocusEffect(
    useCallback(() => {
      loadPosts();
    }, [])
  );

  const loadPosts = async () => {
    try {
      setLoading(true);
      const allPosts = await postService.getAllPosts();
      setPosts(allPosts);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (post: IPost) => {
    if (!authUser) return;

    try {
      const isLiked = likedPosts.has(post.id);
      
      if (isLiked) {
        await postService.unlikePost(post.id, authUser.id);
        setLikedPosts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(post.id);
          return newSet;
        });
      } else {
        await postService.likePost(post.id, authUser.id);
        setLikedPosts((prev) => new Set(prev).add(post.id));
      }
    } catch (error) {
      console.error('Erro ao dar like:', error);
    }
  };

  const handleComment = (post: IPost) => {
    router.push({
      pathname: '/comments',
      params: { postId: post.id },
    });
  };

  const handleShare = async (post: IPost) => {
    if (!authUser) return;

    try {
      await postService.sharePost(post.id, authUser.id);
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  const renderPostCard = ({ item: post }: { item: IPost }) => {
    const isLiked = likedPosts.has(post.id);

    return (
      <FadeInCard style={styles.postCard}>
        {/* Header do Post */}
        <View style={styles.postHeader}>
          <View style={styles.userInfo}>
            <View style={styles.avatarSmall}>
              <Text style={styles.avatarText}>
                {(post.userName || 'U').charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.userNameInfo}>
              <Text style={styles.userName}>{post.userName || 'Usuário'}</Text>
              <Text style={styles.postType}>
                {post.type === 'adoption' && '🐾 Para Adoção'}
                {post.type === 'found' && '🔍 Encontrado'}
                {post.type === 'lost' && '😢 Perdido'}
              </Text>
            </View>
          </View>
        </View>

        {/* Imagem do Post */}
        {post.imageUrl && (
          <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
        )}

        {/* Conteúdo */}
        <View style={styles.postContent}>
          <Text style={styles.postTitle}>{post.title}</Text>
          <Text style={styles.postDescription}>{post.description}</Text>

          {post.locationName && (
            <View style={styles.locationInfo}>
              <Ionicons name="location" size={14} color={PRIMARY_COLOR} />
              <Text style={styles.locationText}>{post.locationName}</Text>
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <Text style={styles.statText}>❤️ {post.likesCount || 0}</Text>
          <Text style={styles.statText}>💬 {post.commentsCount || 0}</Text>
          <Text style={styles.statText}>🔄 {post.sharesCount || 0}</Text>
        </View>

        {/* Ações */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionButton, isLiked && styles.actionButtonActive]}
            onPress={() => handleLike(post)}
          >
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={20}
              color={isLiked ? PRIMARY_COLOR : '#666'}
            />
            <Text style={[styles.actionText, isLiked && { color: PRIMARY_COLOR }]}>
              {isLiked ? 'Curtido' : 'Curtir'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleComment(post)}
          >
            <Ionicons name="chatbubble-outline" size={20} color="#666" />
            <Text style={styles.actionText}>Comentar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleShare(post)}
          >
            <Ionicons name="share-social-outline" size={20} color="#666" />
            <Text style={styles.actionText}>Compartilhar</Text>
          </TouchableOpacity>
        </View>
      </FadeInCard>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
          <Text style={styles.loadingText}>Carregando posts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (posts.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Ionicons name="document-outline" size={48} color="#ddd" />
          <Text style={styles.emptyText}>Nenhum post encontrado</Text>
          <Text style={styles.emptySubtext}>
            Explore e veja posts de outros usuários
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPostCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },

  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  postCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },

  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  userNameInfo: {
    flex: 1,
  },

  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },

  postType: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },

  postImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#f0f0f0',
  },

  postContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  postTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },

  postDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },

  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },

  locationText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },

  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fafafa',
  },

  statText: {
    fontSize: 12,
    color: '#666',
    marginRight: 16,
  },

  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },

  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 4,
  },

  actionButtonActive: {
    backgroundColor: '#FFE4E9',
    borderRadius: 6,
  },

  actionText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },

  loadingText: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
  },

  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
  },

  emptySubtext: {
    fontSize: 13,
    color: '#999',
    marginTop: 6,
  },
});
