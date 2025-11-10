import { postRepository } from '@/services/db/postRepository';
import { db } from '@/services/db/sqlite';
import type { IPost } from '@/types/post.types';
import type { IUser } from '@/types/user.types';

export class ProfileService {
  /**
   * Obter perfil de um usuário
   */
  async getUserProfile(userId: number): Promise<IUser | null> {
    try {
      const database = db.getDb();
      const user = await database.getFirstAsync<any>(
        'SELECT id, email, name, avatar_url as avatarUrl, bio, created_at as createdAt FROM users WHERE id = ?',
        [userId]
      );
      return user || null;
    } catch (error) {
      console.error('[ProfileService] Erro ao buscar perfil:', error);
      throw error;
    }
  }

  /**
   * Atualizar perfil do usuário
   */
  async updateUserProfile(
    userId: number,
    data: { name?: string; bio?: string; avatarUrl?: string }
  ): Promise<IUser> {
    try {
      const database = db.getDb();

      // Validar dados
      if (data.name && data.name.trim().length < 2) {
        throw new Error('Nome deve ter pelo menos 2 caracteres');
      }

      if (data.bio && data.bio.length > 500) {
        throw new Error('Bio não pode ter mais de 500 caracteres');
      }

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
        return this.getUserProfile(userId) as Promise<IUser>;
      }

      updateValues.push(userId);

      await database.runAsync(
        `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );

      const updated = await this.getUserProfile(userId);
      if (!updated) {
        throw new Error('Falha ao atualizar perfil');
      }

      return updated;
    } catch (error) {
      console.error('[ProfileService] Erro ao atualizar perfil:', error);
      throw error;
    }
  }

  /**
   * Obter posts de um usuário
   */
  async getUserPosts(userId: number): Promise<IPost[]> {
    try {
      return await postRepository.getPostsByUser(userId);
    } catch (error) {
      console.error('[ProfileService] Erro ao buscar posts do usuário:', error);
      throw error;
    }
  }

  /**
   * Contar posts de um usuário
   */
  async getUserPostsCount(userId: number): Promise<number> {
    try {
      const posts = await postRepository.getPostsByUser(userId);
      return posts.length;
    } catch (error) {
      console.error('[ProfileService] Erro ao contar posts:', error);
      throw error;
    }
  }

  /**
   * Obter estatísticas do perfil
   */
  async getUserStats(userId: number): Promise<{
    postsCount: number;
    likesCount: number;
    sharesCount: number;
  }> {
    try {
      const posts = await postRepository.getPostsByUser(userId);
      
      let totalLikes = 0;
      let totalShares = 0;

      for (const post of posts) {
        totalLikes += post.likesCount || 0;
        totalShares += post.sharesCount || 0;
      }

      return {
        postsCount: posts.length,
        likesCount: totalLikes,
        sharesCount: totalShares,
      };
    } catch (error) {
      console.error('[ProfileService] Erro ao buscar estatísticas:', error);
      throw error;
    }
  }
}

export const profileService = new ProfileService();
