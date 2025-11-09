export type PostType = 'adoption' | 'found' | 'lost';

import type { IComment } from './comment.types';

export interface IPost {
  id: number;
  userId: number;
  title: string;
  description: string;
  type: PostType;
  imageUrl: string;
  latitude: number;
  longitude: number;
  locationName: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  createdAt: string;
  updatedAt: string;
  userName?: string;
  userAvatarUrl?: string;
}

export interface ICreatePost {
  title: string;
  description: string;
  type: PostType;
  imageUrl: string;
  latitude: number;
  longitude: number;
  locationName: string;
}

export interface IPostDetails extends IPost {
  userEmail?: string;
  userPhone?: string;
  comments?: IComment[];
  isLikedByCurrentUser?: boolean;
}
