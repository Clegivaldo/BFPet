import { IComment } from '@/types/comment.types';
import { db } from './sqlite';

export class CommentRepository {
  async addComment(postId: number, userId: number, text: string): Promise<any> {
    const database = await db.getDbAsync();

    try {
      await database.execAsync('BEGIN TRANSACTION;');

      const result = await database.runAsync(
        'INSERT INTO comments (post_id, user_id, text) VALUES (?, ?, ?)',
        [postId, userId, text]
      );

      await database.execAsync('COMMIT;');

      if (result.lastInsertRowId) {
        return this.getCommentById(result.lastInsertRowId);
      }
      return null;
    } catch (error) {
      await database.execAsync('ROLLBACK;');
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  async getCommentById(id: number): Promise<any> {
    try {
      const database = await db.getDbAsync();
      const comment = await database.getFirstAsync<any>(
        `SELECT c.*, u.name as user_name, u.avatar_url as user_avatar_url
         FROM comments c
         LEFT JOIN users u ON c.user_id = u.id
         WHERE c.id = ?`,
        [id]
      );
      return comment || null;
    } catch (error) {
      console.error('Error getting comment:', error);
      throw error;
    }
  }

  async getCommentsByPost(postId: number): Promise<IComment[]> {
    try {
      const database = await db.getDbAsync();
      const comments = await database.getAllAsync<any>(
        `SELECT c.*, u.name as user_name, u.avatar_url as user_avatar_url
         FROM comments c
         LEFT JOIN users u ON c.user_id = u.id
         WHERE c.post_id = ?
         ORDER BY c.created_at DESC`,
        [postId]
      );
      return comments || [];
    } catch (error) {
      console.error('Error getting comments:', error);
      throw error;
    }
  }

  async getCommentsCount(postId: number): Promise<number> {
    try {
      const database = await db.getDbAsync();
      const result = await database.getFirstAsync<any>(
        'SELECT COUNT(*) as count FROM comments WHERE post_id = ?',
        [postId]
      );
      return result?.count || 0;
    } catch (error) {
      console.error('Error getting comments count:', error);
      throw error;
    }
  }

  async deleteComment(commentId: number): Promise<boolean> {
    try {
  const database = await db.getDbAsync();
  await database.runAsync('DELETE FROM comments WHERE id = ?', [commentId]);
      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
}

export const commentRepository = new CommentRepository();
