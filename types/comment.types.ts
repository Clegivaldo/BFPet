export interface IComment {
  id: number;
  postId: number;
  userId: number;
  userName: string;
  userAvatarUrl?: string;
  text: string;
  createdAt: string;
}

export interface ICreateComment {
  text: string;
}
