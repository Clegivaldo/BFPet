import { db } from './sqlite';

export class AuthRepository {
  async getUserByEmail(email: string): Promise<any> {
    try {
      const database = db.getDb();
      const user = await database.getFirstAsync<any>(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return user || null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  async createUser(email: string, password: string, name: string): Promise<any> {
    try {
      const database = db.getDb();
      const result = await database.runAsync(
        `INSERT INTO users (email, password, name) VALUES (?, ?, ?)`,
        [email, password, name]
      );

      if (result.lastInsertRowId) {
        return this.getUserById(result.lastInsertRowId);
      }
      return null;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUserById(id: number): Promise<any> {
    try {
      const database = db.getDb();
      const user = await database.getFirstAsync<any>(
        'SELECT id, email, name, avatar_url, bio, created_at FROM users WHERE id = ?',
        [id]
      );
      return user || null;
    } catch (error) {
      console.error('Error getting user by id:', error);
      throw error;
    }
  }

  async setCurrentUser(userId: number, token: string): Promise<void> {
    try {
      const database = db.getDb();
      await database.runAsync(
        'DELETE FROM current_user WHERE id = 1'
      );
      await database.runAsync(
        'INSERT INTO current_user (id, user_id, token) VALUES (1, ?, ?)',
        [userId, token]
      );
    } catch (error) {
      console.error('Error setting current user:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<any> {
    try {
      const database = db.getDb();
      const current = await database.getFirstAsync<any>(
        'SELECT user_id FROM current_user WHERE id = 1'
      );

      if (current && current.user_id) {
        return this.getUserById(current.user_id);
      }
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      const database = db.getDb();
      await database.runAsync('DELETE FROM current_user WHERE id = 1');
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  async updateUserProfile(userId: number, name: string, bio?: string): Promise<any> {
    try {
      const database = db.getDb();
      await database.runAsync(
        'UPDATE users SET name = ?, bio = ? WHERE id = ?',
        [name, bio || '', userId]
      );
      return this.getUserById(userId);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
}

export const authRepository = new AuthRepository();
