import { db } from './sqlite';

export class LikeRepository {
  async toggleLike(postId: number, userId: number): Promise<boolean> {
    const database = await db.getDbAsync();

    try {
      await database.execAsync('BEGIN TRANSACTION;');

      const existingLike = await database.getFirstAsync<any>(
        'SELECT id FROM likes WHERE post_id = ? AND user_id = ?',
        [postId, userId]
      );

      if (existingLike) {
        // Unlike
        await database.runAsync(
          'DELETE FROM likes WHERE post_id = ? AND user_id = ?',
          [postId, userId]
        );
        await database.execAsync('COMMIT;');
        return false; // unliked
      } else {
        // Like
        await database.runAsync(
          'INSERT INTO likes (post_id, user_id) VALUES (?, ?)',
          [postId, userId]
        );
        await database.execAsync('COMMIT;');
        return true; // liked
      }
    } catch (error) {
      await database.execAsync('ROLLBACK;');
      console.error('Error toggling like:', error);
      throw error;
    }
  }

  async getLikesCount(postId: number): Promise<number> {
    try {
      const database = await db.getDbAsync();
      const result = await database.getFirstAsync<any>(
        'SELECT COUNT(*) as count FROM likes WHERE post_id = ?',
        [postId]
      );
      return result?.count || 0;
    } catch (error) {
      console.error('Error getting likes count:', error);
      throw error;
    }
  }

  async isPostLikedByUser(postId: number, userId: number): Promise<boolean> {
    try {
      const database = await db.getDbAsync();
      const like = await database.getFirstAsync<any>(
        'SELECT id FROM likes WHERE post_id = ? AND user_id = ?',
        [postId, userId]
      );
      return !!like;
    } catch (error) {
      console.error('Error checking if post is liked:', error);
      throw error;
    }
  }

  async getLikesByPost(postId: number): Promise<any[]> {
    try {
      const database = await db.getDbAsync();
      const likes = await database.getAllAsync<any>(
        `SELECT l.*, u.name as user_name FROM likes l
         LEFT JOIN users u ON l.user_id = u.id
         WHERE l.post_id = ?
         ORDER BY l.created_at DESC`,
        [postId]
      );
      return likes || [];
    } catch (error) {
      console.error('Error getting likes:', error);
      throw error;
    }
  }
}

export const likeRepository = new LikeRepository();
