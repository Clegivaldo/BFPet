import { IPost } from '@/types/post.types';
import { db } from './sqlite';

export class PostRepository {
  async createPost(
    userId: number,
    title: string,
    description: string,
    type: string,
    imageUrl: string,
    latitude: number,
    longitude: number,
    locationName: string
  ): Promise<any> {
    const database = await db.getDbAsync();
    
    const result = await database.runAsync(
      `INSERT INTO posts (user_id, title, description, type, image_url, latitude, longitude, location_name)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, title, description, type, imageUrl, latitude, longitude, locationName]
    );

    if (result.lastInsertRowId) {
      return this.getPostById(result.lastInsertRowId);
    }
    return null;
  }

  async getPostById(id: number): Promise<any> {
    try {
      const database = await db.getDbAsync();
      const post = await database.getFirstAsync<any>(
        `SELECT p.*, u.name as user_name, u.avatar_url as user_avatar_url
         FROM posts p
         LEFT JOIN users u ON p.user_id = u.id
         WHERE p.id = ?`,
        [id]
      );
      return post || null;
    } catch (error) {
      console.error('Error getting post:', error);
      throw error;
    }
  }

  async getAllPosts(limit: number = 20, offset: number = 0): Promise<IPost[]> {
    try {
      const database = await db.getDbAsync();
      const posts = await database.getAllAsync<any>(
        `SELECT p.*, u.name as user_name, u.avatar_url as user_avatar_url
         FROM posts p
         LEFT JOIN users u ON p.user_id = u.id
         ORDER BY p.created_at DESC
         LIMIT ? OFFSET ?`,
        [limit, offset]
      );
      return posts || [];
    } catch (error) {
      console.error('Error getting all posts:', error);
      throw error;
    }
  }

  async getPostsByUser(userId: number): Promise<IPost[]> {
    try {
      const database = await db.getDbAsync();
      const posts = await database.getAllAsync<any>(
        `SELECT p.*, u.name as user_name, u.avatar_url as user_avatar_url
         FROM posts p
         LEFT JOIN users u ON p.user_id = u.id
         WHERE p.user_id = ?
         ORDER BY p.created_at DESC`,
        [userId]
      );
      return posts || [];
    } catch (error) {
      console.error('Error getting posts by user:', error);
      throw error;
    }
  }

  async updatePostCounters(postId: number): Promise<void> {
    try {
  const database = await db.getDbAsync();

      const likesResult = await database.getFirstAsync<any>(
        'SELECT COUNT(*) as count FROM likes WHERE post_id = ?',
        [postId]
      );

      const commentsResult = await database.getFirstAsync<any>(
        'SELECT COUNT(*) as count FROM comments WHERE post_id = ?',
        [postId]
      );

      const sharesResult = await database.getFirstAsync<any>(
        'SELECT COUNT(*) as count FROM shares WHERE post_id = ?',
        [postId]
      );

      await database.runAsync(
        'UPDATE posts SET likes_count = ?, comments_count = ?, shares_count = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [
          likesResult?.count || 0,
          commentsResult?.count || 0,
          sharesResult?.count || 0,
          postId,
        ]
      );
    } catch (error) {
      console.error('Error updating post counters:', error);
      throw error;
    }
  }

  async deletePost(postId: number): Promise<boolean> {
    const database = await db.getDbAsync();

    try {
      // Usar transação para garantir atomicidade
      await database.execAsync('BEGIN TRANSACTION;');

      // Delete related data
      await database.runAsync('DELETE FROM likes WHERE post_id = ?', [postId]);
      await database.runAsync('DELETE FROM comments WHERE post_id = ?', [postId]);
      await database.runAsync('DELETE FROM shares WHERE post_id = ?', [postId]);

      // Delete post
      await database.runAsync('DELETE FROM posts WHERE id = ?', [postId]);

      await database.execAsync('COMMIT;');
      return true;
    } catch (error) {
      await database.execAsync('ROLLBACK;');
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  async updatePost(
    postId: number,
    title: string,
    description: string,
    imageUrl: string,
    latitude: number,
    longitude: number,
    locationName: string
  ): Promise<any> {
    try {
      const database = await db.getDbAsync();

      await database.runAsync(
        `UPDATE posts SET title = ?, description = ?, image_url = ?, latitude = ?, longitude = ?, location_name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [title, description, imageUrl, latitude, longitude, locationName, postId]
      );

      return this.getPostById(postId);
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }
}

export const postRepository = new PostRepository();
