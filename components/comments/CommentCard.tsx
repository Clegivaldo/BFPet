import { IComment } from '@/types/comment.types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React from 'react';
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface CommentCardProps {
  comment: IComment;
  onDelete?: (commentId: number) => void;
  isOwner: boolean;
  isDeleting?: boolean;
}

export const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  onDelete,
  isOwner,
  isDeleting = false,
}) => {
  const handleDelete = () => {
    if (onDelete) {
      onDelete(comment.id);
    }
  };

  const getTimeAgo = () => {
    try {
      return formatDistanceToNow(new Date(comment.createdAt), {
        addSuffix: true,
        locale: ptBR,
      });
    } catch {
      return 'Recentemente';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Avatar e Cabeçalho */}
        <View style={styles.header}>
          {comment.userAvatarUrl ? (
            <Image
              source={{ uri: comment.userAvatarUrl }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatar, styles.placeholderAvatar]}>
              <Text style={styles.avatarPlaceholder}>
                {comment.userName?.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}

          <View style={styles.headerInfo}>
            <Text style={styles.userName}>{comment.userName}</Text>
            <Text style={styles.timeAgo}>{getTimeAgo()}</Text>
          </View>

          {/* Botão Deletar */}
          {isOwner && onDelete && (
            <TouchableOpacity
              onPress={handleDelete}
              disabled={isDeleting}
              style={styles.deleteButton}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color="#dc3545" />
              ) : (
                <Text style={styles.deleteIcon}>✕</Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Texto do Comentário */}
        <Text style={styles.text} numberOfLines={0}>
          {comment.text}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 0,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B9D',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  placeholderAvatar: {
    backgroundColor: '#FFE0EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B9D',
  },
  headerInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  timeAgo: {
    fontSize: 11,
    color: '#999',
  },
  text: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
    marginTop: 4,
  },
  deleteButton: {
    padding: 6,
    marginLeft: 8,
  },
  deleteIcon: {
    fontSize: 18,
    color: '#dc3545',
    fontWeight: 'bold',
  },
});
