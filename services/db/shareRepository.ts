import { db } from './sqlite';

export class ShareRepository {
  async recordShare(postId: number, userId: number): Promise<any> {
    const database = await db.getDbAsync();

    try {
      await database.execAsync('BEGIN TRANSACTION;');

      const result = await database.runAsync(
        'INSERT INTO shares (post_id, user_id) VALUES (?, ?)',
        [postId, userId]
      );

      await database.execAsync('COMMIT;');

      return result.lastInsertRowId ? { id: result.lastInsertRowId } : null;
    } catch (error) {
      await database.execAsync('ROLLBACK;');
      console.error('Error recording share:', error);
      throw error;
    }
  }

  async getSharesCount(postId: number): Promise<number> {
    try {
      const database = await db.getDbAsync();
      const result = await database.getFirstAsync<any>(
        'SELECT COUNT(*) as count FROM shares WHERE post_id = ?',
        [postId]
      );
      return result?.count || 0;
    } catch (error) {
      console.error('Error getting shares count:', error);
      throw error;
    }
  }

  async getSharesByPost(postId: number): Promise<any[]> {
    try {
      const database = await db.getDbAsync();
      const shares = await database.getAllAsync<any>(
        `SELECT s.*, u.name as user_name FROM shares s
         LEFT JOIN users u ON s.user_id = u.id
         WHERE s.post_id = ?
         ORDER BY s.created_at DESC`,
        [postId]
      );
      return shares || [];
    } catch (error) {
      console.error('Error getting shares:', error);
      throw error;
    }
  }
}

export const shareRepository = new ShareRepository();
