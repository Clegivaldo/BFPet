import { postRepository } from '@/services/db/postRepository';
import { shareRepository } from '@/services/db/shareRepository';
import { IPost } from '@/types/post.types';
import { Clipboard, Share } from 'react-native';

export class ShareService {
  /**
   * Compartilhar via sistema operacional (WhatsApp, SMS, etc)
   */
  async sharePostNative(post: IPost, userId: number): Promise<boolean> {
    try {
      // Formatar mensagem de compartilhamento
      const message = this.formatShareMessage(post);
      
      // Compartilhar via sistema operacional
      const result = await Share.share({
        message: message,
        title: `${this.getPostTypeLabel(post.type)} - ${post.title}`,
      });

      // Se compartilhou com sucesso, registrar no banco
      if (result && result.action !== Share.dismissedAction) {
        await this.recordShare(post.id, userId);
        return true;
      }

      return false;
    } catch (error) {
      console.error('[ShareService] Erro ao compartilhar:', error);
      throw error;
    }
  }

  /**
   * Copiar link do post para clipboard
   */
  async copyShareLink(post: IPost, userId: number): Promise<string> {
    try {
      const link = this.generateShareLink(post);
      
      // Copiar para clipboard usando React Native
      Clipboard.setString(link);

      // Registrar compartilhamento
      await this.recordShare(post.id, userId);

      return link;
    } catch (error) {
      console.error('[ShareService] Erro ao copiar link:', error);
      throw error;
    }
  }

  /**
   * Registrar compartilhamento no banco de dados
   */
  async recordShare(postId: number, userId: number): Promise<void> {
    try {
      await shareRepository.recordShare(postId, userId);
      await postRepository.updatePostCounters(postId);
    } catch (error) {
      console.error('[ShareService] Erro ao registrar compartilhamento:', error);
      throw error;
    }
  }

  /**
   * Obter contagem de compartilhamentos
   */
  async getSharesCount(postId: number): Promise<number> {
    try {
      return await shareRepository.getSharesCount(postId);
    } catch (error) {
      console.error('[ShareService] Erro ao contar compartilhamentos:', error);
      throw error;
    }
  }

  /**
   * Formatar mensagem para compartilhamento
   */
  private formatShareMessage(post: IPost): string {
    const title = post.title.substring(0, 50);
    const postType = this.getPostTypeLabel(post.type);
    const location = post.locationName.substring(0, 30);

    return `🐾 ${postType} - ${title}\n\n${post.description.substring(0, 100)}...\n\n📍 ${location}\n\nVejo no BFpet App!`;
  }

  /**
   * Gerar link do post
   */
  private generateShareLink(post: IPost): string {
    // Em um app real, isso seria um deep link único
    // Por enquanto, retornamos um link genérico com info do post
    return `BFpet://post/${post.id} - ${post.title}`;
  }

  /**
   * Obter label do tipo de post
   */
  private getPostTypeLabel(type: string): string {
    switch (type) {
      case 'adoption':
        return '🐾 Adoção';
      case 'found':
        return '🔍 Encontrado';
      case 'lost':
        return '❌ Perdido';
      default:
        return '📄 Post';
    }
  }
}

export const shareService = new ShareService();
