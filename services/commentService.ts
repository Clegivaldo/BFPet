import { commentRepository } from '@/services/db/commentRepository';
import { IComment } from '@/types/comment.types';

export class CommentService {
  /**
   * Adicionar um novo comentário
   */
  async addComment(
    postId: number,
    userId: number,
    text: string
  ): Promise<IComment | null> {
    try {
      if (!text || !text.trim()) {
        throw new Error('Comentário não pode estar vazio');
      }

      if (text.trim().length > 500) {
        throw new Error('Comentário não pode ter mais de 500 caracteres');
      }

      const comment = await commentRepository.addComment(postId, userId, text.trim());
      return this.formatComment(comment);
    } catch (error) {
      console.error('[CommentService] Erro ao adicionar comentário:', error);
      throw error;
    }
  }

  /**
   * Obter todos os comentários de um post
   */
  async getCommentsByPost(postId: number): Promise<IComment[]> {
    try {
      const comments = await commentRepository.getCommentsByPost(postId);
      return comments.map((comment) => this.formatComment(comment));
    } catch (error) {
      console.error('[CommentService] Erro ao buscar comentários:', error);
      throw error;
    }
  }

  /**
   * Obter contagem de comentários de um post
   */
  async getCommentsCount(postId: number): Promise<number> {
    try {
      return await commentRepository.getCommentsCount(postId);
    } catch (error) {
      console.error('[CommentService] Erro ao contar comentários:', error);
      throw error;
    }
  }

  /**
   * Deletar um comentário
   */
  async deleteComment(commentId: number, userId: number): Promise<boolean> {
    try {
      // Verificar se o usuário é o dono do comentário
      const comment = await commentRepository.getCommentById(commentId);
      
      if (!comment) {
        throw new Error('Comentário não encontrado');
      }

      if (comment.user_id !== userId) {
        throw new Error('Você não tem permissão para deletar este comentário');
      }

      return await commentRepository.deleteComment(commentId);
    } catch (error) {
      console.error('[CommentService] Erro ao deletar comentário:', error);
      throw error;
    }
  }

  /**
   * Formatar comentário para o frontend
   */
  private formatComment(comment: any): IComment {
    return {
      id: comment.id,
      postId: comment.post_id,
      userId: comment.user_id,
      text: comment.text,
      userName: comment.user_name || 'Usuário',
      userAvatarUrl: comment.user_avatar_url,
      createdAt: comment.created_at,
    };
  }
}

export const commentService = new CommentService();
