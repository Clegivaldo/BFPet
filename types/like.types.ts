export interface ILike {
  id: number;
  postId: number;
  userId: number;
  createdAt: string;
}

export interface ILikeResponse {
  success: boolean;
  liked: boolean;
  count: number;
}
