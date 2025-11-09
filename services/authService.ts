import { authRepository } from '@/services/db/authRepository';
import { IAuthResponse, IUser } from '@/types/user.types';

export class AuthService {
  async login(email: string, password: string): Promise<IAuthResponse> {
    try {
      const user = await authRepository.getUserByEmail(email);

      if (!user) {
        return {
          success: false,
          message: 'Usuário não encontrado',
        };
      }

      // TODO: Use bcrypt for password comparison in production
      if (user.password !== password) {
        return {
          success: false,
          message: 'Senha incorreta',
        };
      }

      // Generate a simple token (in production use JWT)
      const token = `token_${user.id}_${Date.now()}`;
      await authRepository.setCurrentUser(user.id, token);

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatar_url,
          bio: user.bio,
          createdAt: user.created_at,
        },
        token,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Erro ao fazer login',
      };
    }
  }

  async createAccount(
    name: string,
    email: string,
    password: string
  ): Promise<IAuthResponse> {
    try {
      // Check if email already exists
      const existingUser = await authRepository.getUserByEmail(email);
      if (existingUser) {
        return {
          success: false,
          message: 'Email já cadastrado',
        };
      }

      // Create new user
      // TODO: Hash password in production
      const user = await authRepository.createUser(email, password, name);

      if (!user) {
        return {
          success: false,
          message: 'Erro ao criar conta',
        };
      }

      return {
        success: true,
        message: 'Conta criada com sucesso',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatar_url,
          bio: user.bio,
          createdAt: user.created_at,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Erro ao criar conta',
      };
    }
  }

  async getCurrentUser(): Promise<IUser | null> {
    try {
      const user = await authRepository.getCurrentUser();
      return user
        ? {
            id: user.id,
            email: user.email,
            name: user.name,
            avatarUrl: user.avatar_url,
            bio: user.bio,
            createdAt: user.created_at,
          }
        : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      await authRepository.logout();
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  async updateProfile(
    userId: number,
    name: string,
    bio?: string
  ): Promise<IUser | null> {
    try {
      const user = await authRepository.updateUserProfile(userId, name, bio);
      return user
        ? {
            id: user.id,
            email: user.email,
            name: user.name,
            avatarUrl: user.avatar_url,
            bio: user.bio,
            createdAt: user.created_at,
          }
        : null;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
