import { ShareButton } from '@/components/share/ShareButton';
import { ScaleButton } from '@/components/ui/ScaleButton';
import { IPost } from '@/types/post.types';
import { formatDate, formatPostType, truncateText } from '@/utils/formatters';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    View
} from 'react-native';

interface PostCardProps {
  post: IPost;
  userId: number;
  onLike?: (postId: number) => void;
  onComment?: (postId: number) => void;
  onShare?: (postId: number) => void;
  isLiked?: boolean;
  isLiking?: boolean;
}

export function PostCard({
  post,
  userId,
  onLike,
  onComment,
  onShare,
  isLiked = false,
  isLiking = false,
}: PostCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleLike = () => {
    if (onLike) {
      onLike(post.id);
    }
  };

  const handleComment = () => {
    if (onComment) {
      onComment(post.id);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(post.id);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header - User Info */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {post.userAvatarUrl && !imageError ? (
            <Image
              source={{ uri: post.userAvatarUrl }}
              style={styles.avatar}
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>
                {post.userName?.charAt(0).toUpperCase() || '?'}
              </Text>
            </View>
          )}
          <View style={styles.userDetails}>
            <Text style={styles.userName} numberOfLines={1}>
              {post.userName || 'Usuário'}
            </Text>
            <Text style={styles.timestamp}>{formatDate(post.createdAt)}</Text>
          </View>
        </View>

        {/* Post Type Badge */}
        <View style={[styles.postTypeBadge, styles[`badge_${post.type}`]]}>
          <Text style={styles.postTypeText}>{formatPostType(post.type)}</Text>
        </View>
      </View>

      {/* Post Image */}
      {post.imageUrl && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: post.imageUrl }}
            style={styles.postImage}
            onError={() => setImageError(true)}
          />
        </View>
      )}

      {/* Post Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {post.title}
        </Text>
        <Text style={styles.description} numberOfLines={3}>
          {truncateText(post.description, 150)}
        </Text>

        {/* Location */}
        <View style={styles.locationRow}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.locationText} numberOfLines={1}>
            {post.locationName}
          </Text>
        </View>
      </View>

      {/* Counters */}
      <View style={styles.counters}>
        <View style={styles.counterItem}>
          <Text style={styles.counterIcon}>❤️</Text>
          <Text style={styles.counterText}>
            {post.likesCount} {post.likesCount === 1 ? 'Curtida' : 'Curtidas'}
          </Text>
        </View>

        <View style={styles.counterItem}>
          <Text style={styles.counterIcon}>💬</Text>
          <Text style={styles.counterText}>
            {post.commentsCount} {post.commentsCount === 1 ? 'Comentário' : 'Comentários'}
          </Text>
        </View>

        <View style={styles.counterItem}>
          <Text style={styles.counterIcon}>↗️</Text>
          <Text style={styles.counterText}>
            {post.sharesCount} {post.sharesCount === 1 ? 'Compartilhamento' : 'Compartilhamentos'}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <ScaleButton
          style={[styles.actionButton, isLiked && styles.actionButtonActive]}
          onPress={handleLike}
          disabled={isLiking}
          scaleValue={0.93}
        >
          {isLiking ? (
            <ActivityIndicator size="small" color="#FF6B9D" />
          ) : (
            <>
              <Text style={styles.actionIcon}>{isLiked ? '❤️' : '🤍'}</Text>
              <Text style={[styles.actionText, isLiked && styles.actionTextActive]}>
                {isLiked ? 'Curtido' : 'Curtir'}
              </Text>
            </>
          )}
        </ScaleButton>

        <ScaleButton
          style={styles.actionButton}
          onPress={handleComment}
          scaleValue={0.93}
        >
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>Comentar</Text>
        </ScaleButton>

        <View style={styles.actionButton}>
          <ShareButton
            post={post}
            userId={userId}
            sharesCount={post.sharesCount}
            onShareSuccess={handleShare}
          />
        </View>
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

  /* Header */
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

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },

  avatarPlaceholder: {
    backgroundColor: '#FF6B9D',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  userDetails: {
    flex: 1,
  },

  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },

  timestamp: {
    fontSize: 12,
    color: '#999',
  },

  postTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  badge_adoption: {
    backgroundColor: '#FFE4E1',
  },

  badge_found: {
    backgroundColor: '#E1F5E1',
  },

  badge_lost: {
    backgroundColor: '#FFF3E0',
  },

  postTypeText: {
    fontSize: 11,
    fontWeight: '600',
  },

  /* Image */
  imageContainer: {
    width: '100%',
    height: 220,
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
  },

  postImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  /* Content */
  content: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
    lineHeight: 22,
  },

  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  locationIcon: {
    fontSize: 14,
    marginRight: 6,
  },

  locationText: {
    fontSize: 12,
    color: '#888',
    flex: 1,
  },

  /* Counters */
  counters: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },

  counterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },

  counterIcon: {
    fontSize: 14,
    marginRight: 4,
  },

  counterText: {
    fontSize: 12,
    color: '#666',
  },

  /* Actions */
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },

  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 6,
    marginHorizontal: 4,
  },

  actionButtonActive: {
    backgroundColor: '#FFE4E9',
  },

  actionIcon: {
    fontSize: 16,
    marginRight: 6,
  },

  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },

  actionTextActive: {
    color: '#FF6B9D',
  },
});
