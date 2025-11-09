export interface IUser {
  id: number;
  email: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
}

export interface ICreateUser {
  name: string;
  email: string;
  password: string;
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IAuthResponse {
  success: boolean;
  message?: string;
  user?: IUser;
  token?: string;
}
