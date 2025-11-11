import { CommentForm } from '@/components/comments/CommentForm';
import { CommentsList } from '@/components/comments/CommentsList';
import { showToast } from '@/components/ui/Toast';
import { useAuth } from '@/contexts/AuthContext';
import { commentService } from '@/services/commentService';
import { postService } from '@/services/postService';
import { IComment } from '@/types/comment.types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function CommentsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { postId: postIdParam } = useLocalSearchParams<{ postId: string }>();
  
  const postId = postIdParam ? parseInt(postIdParam) : null;

  const [comments, setComments] = useState<IComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);
  const [postTitle, setPostTitle] = useState('');

  const loadPostInfo = useCallback(async () => {
    try {
      if (!postId) return;
      const post = await postService.getPostById(postId);
      if (post) {
        setPostTitle(post.title);
      }
    } catch (error) {
      console.error('[CommentsScreen] Erro ao carregar post:', error);
    }
  }, [postId]);

  const loadComments = useCallback(async () => {
    try {
      if (!postId) return;
      setIsLoading(true);
      const fetchedComments = await commentService.getCommentsByPost(postId);
      setComments(fetchedComments);
    } catch (error) {
      console.error('[CommentsScreen] Erro ao carregar comentários:', error);
      showToast({
        message: 'Erro ao carregar comentários',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await loadComments();
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!postId) {
      router.back();
      return;
    }
    loadComments();
    loadPostInfo();
  }, [postId, loadComments, loadPostInfo, router]);

  const handleAddComment = async (text: string) => {
    try {
      if (!postId) return;

      if (!user) {
        // Sessão inválida — informar o usuário e redirecionar para login sem resetar DB
        showToast({
          message: 'Sessão inválida. Faça login novamente.',
          type: 'error',
        });
        router.push('/login');
        return;
      }

      setIsSubmitting(true);
      const newComment = await commentService.addComment(postId, user.id, text);

      if (newComment) {
        setComments((prev) => [newComment, ...prev]);
        showToast({
          message: 'Comentário enviado!',
          type: 'success',
        });
      }
    } catch (error: any) {
      console.error('[CommentsScreen] Erro ao enviar comentário:', error);
      showToast({
        message: error.message || 'Erro ao enviar comentário',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      if (!user) {
        showToast({ message: 'Sessão inválida. Faça login novamente.', type: 'error' });
        router.push('/login');
        return;
      }

      setIsDeletingId(commentId);
      await commentService.deleteComment(commentId, user.id);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      showToast({
        message: 'Comentário deletado',
        type: 'success',
      });
    } catch (error: any) {
      console.error('[CommentsScreen] Erro ao deletar comentário:', error);
      showToast({
        message: error.message || 'Erro ao deletar comentário',
        type: 'error',
      });
    } finally {
      setIsDeletingId(null);
    }
  };

  if (!postId || !user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erro ao carregar comentários</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>← Voltar</Text>
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <Text style={styles.title} numberOfLines={1}>
              Comentários ({comments.length})
            </Text>
            <Text style={styles.postTitle} numberOfLines={1}>
              {postTitle}
            </Text>
          </View>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <CommentsList
            comments={comments}
            onDelete={handleDeleteComment}
            currentUserId={user.id}
            isLoading={isLoading}
            isDeletingId={isDeletingId}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />
        </ScrollView>

        {/* Form */}
        <CommentForm
          user={user}
          onSubmit={handleAddComment}
          isLoading={isSubmitting}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 12,
  },
  backButton: {
    fontSize: 14,
    color: '#FF6B9D',
    fontWeight: '600',
  },
  headerTitle: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  postTitle: {
    fontSize: 12,
    color: '#666',
  },
  content: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#dc3545',
  },
});
