import { IComment } from '@/types/comment.types';
import { PRIMARY_COLOR } from '@/constants/theme';
import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { CommentCard } from './CommentCard';

interface CommentsListProps {
  comments: IComment[];
  onDelete: (commentId: number) => Promise<void>;
  currentUserId: number | null;
  isLoading?: boolean;
  isDeletingId?: number | null;
  onRefresh?: () => Promise<void>;
  isRefreshing?: boolean;
}

export const CommentsList: React.FC<CommentsListProps> = ({
  comments,
  onDelete,
  currentUserId,
  isLoading = false,
  isDeletingId = null,
  onRefresh,
  isRefreshing = false,
}) => {
  // Empty State
  if (comments.length === 0 && !isLoading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>💬</Text>
        <Text style={styles.emptyTitle}>Nenhum comentário ainda</Text>
        <Text style={styles.emptySubtitle}>
          Seja o primeiro a comentar neste post!
        </Text>
      </View>
    );
  }

  // Loading State
  if (isLoading && comments.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        <Text style={styles.loadingText}>Carregando comentários...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={comments}
      keyExtractor={(item) => `comment-${item.id}`}
      renderItem={({ item }) => (
        <CommentCard
          comment={item}
          onDelete={onDelete}
          isOwner={currentUserId === item.userId}
          isDeleting={isDeletingId === item.id}
        />
      )}
      scrollEnabled={false}
      nestedScrollEnabled={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={PRIMARY_COLOR}
          />
        ) : undefined
      }
      contentContainerStyle={styles.content}
      ListFooterComponent={
        isLoading ? (
          <View style={styles.footerLoading}>
            <ActivityIndicator size="small" color={PRIMARY_COLOR} />
          </View>
        ) : null
      }
    />
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  emptyContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  footerLoading: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
