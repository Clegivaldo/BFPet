import { IUser } from '@/types/user.types';
import { db } from './sqlite';

export class UserRepository {
  /**
   * Obter usuário por ID
   */
  async getUserById(id: number): Promise<IUser | null> {
    try {
      const database = db.getDb();
      const user = await database.getFirstAsync<any>(
        'SELECT id, email, name, avatar_url as avatarUrl, bio, created_at as createdAt FROM users WHERE id = ?',
        [id]
      );
      return user || null;
    } catch (error) {
      console.error('Error getting user by id:', error);
      throw error;
    }
  }

  /**
   * Obter usuário por email
   */
  async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      const database = db.getDb();
      const user = await database.getFirstAsync<any>(
        'SELECT id, email, name, avatar_url as avatarUrl, bio, created_at as createdAt FROM users WHERE email = ?',
        [email]
      );
      return user || null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  /**
   * Atualizar usuário
   */
  async updateUser(
    id: number,
    data: { name?: string; bio?: string; avatarUrl?: string }
  ): Promise<IUser | null> {
    try {
      const database = db.getDb();

      // Construir dinâmicamente o UPDATE
      const updateFields: string[] = [];
      const updateValues: any[] = [];

      if (data.name !== undefined) {
        updateFields.push('name = ?');
        updateValues.push(data.name);
      }

      if (data.bio !== undefined) {
        updateFields.push('bio = ?');
        updateValues.push(data.bio);
      }

      if (data.avatarUrl !== undefined) {
        updateFields.push('avatar_url = ?');
        updateValues.push(data.avatarUrl);
      }

      if (updateFields.length === 0) {
        return this.getUserById(id);
      }

      updateValues.push(id);

      await database.runAsync(
        `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );

      return this.getUserById(id);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Listar todos os usuários (útil para busca de perfis)
   */
  async getAllUsers(limit: number = 50, offset: number = 0): Promise<IUser[]> {
    try {
      const database = db.getDb();
      const users = await database.getAllAsync<any>(
        'SELECT id, email, name, avatar_url as avatarUrl, bio, created_at as createdAt FROM users LIMIT ? OFFSET ?',
        [limit, offset]
      );
      return users || [];
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  /**
   * Buscar usuários por nome
   */
  async searchUsersByName(query: string): Promise<IUser[]> {
    try {
      const database = db.getDb();
      const users = await database.getAllAsync<any>(
        `SELECT id, email, name, avatar_url as avatarUrl, bio, created_at as createdAt 
         FROM users 
         WHERE name LIKE ? 
         ORDER BY name ASC`,
        [`%${query}%`]
      );
      return users || [];
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }
}

export const userRepository = new UserRepository();
