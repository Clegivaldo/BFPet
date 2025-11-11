import { db } from './sqlite';

export class AuthRepository {
  async getUserByEmail(email: string): Promise<any> {
    try {
      const database = await db.getDbAsync();
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
  const database = await db.getDbAsync();
      const now = new Date().toISOString();
      
      try {
        // Tentar com created_at (nova versão)
        const result = await database.runAsync(
          `INSERT INTO users (email, password, name, created_at) 
           VALUES (?, ?, ?, ?)`,
          [email, password, name, now]
        );

        if (result.lastInsertRowId) {
          return this.getUserById(result.lastInsertRowId);
        }
        return null;
      } catch (error: any) {
        // Se falhar (coluna não existe), tenta sem created_at
        console.warn('⚠️ Coluna created_at não encontrada, inserindo sem ela:', error.message);
        
        const result = await database.runAsync(
          `INSERT INTO users (email, password, name) 
           VALUES (?, ?, ?)`,
          [email, password, name]
        );

        if (result.lastInsertRowId) {
          return this.getUserById(result.lastInsertRowId);
        }
        return null;
      }
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUserById(id: number): Promise<any> {
    try {
      const database = await db.getDbAsync();
      // Usar SELECT * para pegar todas as colunas disponíveis
      const user = await database.getFirstAsync<any>(
        'SELECT * FROM users WHERE id = ?',
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
      const database = await db.getDbAsync();
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
      const database = await db.getDbAsync();
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
  const database = await db.getDbAsync();
  await database.runAsync('DELETE FROM current_user WHERE id = 1');
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  async updateUserProfile(userId: number, name: string, bio?: string, avatarUrl?: string): Promise<any> {
    try {
      const database = await db.getDbAsync();
      await database.runAsync(
        'UPDATE users SET name = ?, bio = ?, avatar_url = ? WHERE id = ?',
        [name, bio || '', avatarUrl || '', userId]
      );
      return this.getUserById(userId);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
}

export const authRepository = new AuthRepository();
