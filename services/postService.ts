import { commentRepository } from '@/services/db/commentRepository';
import { likeRepository } from '@/services/db/likeRepository';
import { postRepository } from '@/services/db/postRepository';
import { shareRepository } from '@/services/db/shareRepository';
import { ICreatePost, IPost } from '@/types/post.types';

export class PostService {
  async createPost(userId: number, data: ICreatePost): Promise<IPost | null> {
    try {
      const post = await postRepository.createPost(
        userId,
        data.title,
        data.description,
        data.type,
        data.imageUrl,
        data.latitude,
        data.longitude,
        data.locationName
      );

      return post ? this.formatPost(post) : null;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  async getPostById(postId: number): Promise<IPost | null> {
    try {
      const post = await postRepository.getPostById(postId);
      return post ? this.formatPost(post) : null;
    } catch (error) {
      console.error('Error getting post:', error);
      throw error;
    }
  }

  async getAllPosts(limit: number = 20, offset: number = 0): Promise<IPost[]> {
    try {
      const posts = await postRepository.getAllPosts(limit, offset);
      return posts.map((post) => this.formatPost(post));
    } catch (error) {
      console.error('Error getting all posts:', error);
      throw error;
    }
  }

  async getPostsByUser(userId: number): Promise<IPost[]> {
    try {
      const posts = await postRepository.getPostsByUser(userId);
      return posts.map((post) => this.formatPost(post));
    } catch (error) {
      console.error('Error getting user posts:', error);
      throw error;
    }
  }

  async toggleLike(postId: number, userId: number): Promise<any> {
    try {
      const liked = await likeRepository.toggleLike(postId, userId);
      await postRepository.updatePostCounters(postId);
      const count = await likeRepository.getLikesCount(postId);

      return {
        success: true,
        liked,
        count,
      };
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  }

  async isPostLikedByUser(postId: number, userId: number): Promise<boolean> {
    try {
      return await likeRepository.isPostLikedByUser(postId, userId);
    } catch (error) {
      console.error('Error checking like:', error);
      throw error;
    }
  }

  async likePost(postId: number, userId: number): Promise<boolean> {
    try {
      const isLiked = await this.isPostLikedByUser(postId, userId);
      if (!isLiked) {
        await likeRepository.toggleLike(postId, userId);
        await postRepository.updatePostCounters(postId);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  }

  async unlikePost(postId: number, userId: number): Promise<boolean> {
    try {
      const isLiked = await this.isPostLikedByUser(postId, userId);
      if (isLiked) {
        await likeRepository.toggleLike(postId, userId);
        await postRepository.updatePostCounters(postId);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error unliking post:', error);
      throw error;
    }
  }

  async getLikesCount(postId: number): Promise<number> {
    try {
      return await likeRepository.getLikesCount(postId);
    } catch (error) {
      console.error('Error getting likes count:', error);
      throw error;
    }
  }

  async addComment(postId: number, userId: number, text: string): Promise<any> {
    try {
      const comment = await commentRepository.addComment(postId, userId, text);
      await postRepository.updatePostCounters(postId);
      return comment;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  async getCommentsByPost(postId: number): Promise<any[]> {
    try {
      return await commentRepository.getCommentsByPost(postId);
    } catch (error) {
      console.error('Error getting comments:', error);
      throw error;
    }
  }

  async deleteComment(commentId: number, postId: number): Promise<boolean> {
    try {
      const result = await commentRepository.deleteComment(commentId);
      if (result) {
        await postRepository.updatePostCounters(postId);
      }
      return result;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }

  async sharePost(postId: number, userId: number): Promise<any> {
    try {
      const share = await shareRepository.recordShare(postId, userId);
      await postRepository.updatePostCounters(postId);
      const count = await shareRepository.getSharesCount(postId);

      return {
        success: true,
        share,
        count,
      };
    } catch (error) {
      console.error('Error sharing post:', error);
      throw error;
    }
  }

  private formatPost(post: any): IPost {
    return {
      id: post.id,
      userId: post.user_id,
      title: post.title,
      description: post.description,
      type: post.type,
      imageUrl: post.image_url,
      latitude: post.latitude,
      longitude: post.longitude,
      locationName: post.location_name,
      likesCount: post.likes_count,
      commentsCount: post.comments_count,
      sharesCount: post.shares_count,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
      userName: post.user_name,
      userAvatarUrl: post.user_avatar_url,
    };
  }
}

export const postService = new PostService();
