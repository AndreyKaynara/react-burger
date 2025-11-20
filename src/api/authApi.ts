import request from '../utils/requests';
import type {
  AuthApiResponse,
  TokenApiResponse,
  UserRegisterData,
  UserDataApiResponse,
  UpdateUserData,
  LogoutApiResponse,
} from '../types';

export const registerApi = async (user: UserRegisterData): Promise<AuthApiResponse> => {
  return request<AuthApiResponse>('auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
};

export const loginApi = async (email: string, password: string): Promise<AuthApiResponse> => {
  return request<AuthApiResponse>('auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
};

export const logoutApi = async (refreshToken: string): Promise<LogoutApiResponse> => {
  return request<LogoutApiResponse>('auth/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: refreshToken }),
  });
};

export const refreshTokenApi = async (token: string): Promise<TokenApiResponse> => {
  return request<TokenApiResponse>('auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
};

export const updateUserApi = async (accessToken: string, user: UpdateUserData): Promise<UserDataApiResponse> => {
  return request<UserDataApiResponse>('auth/user', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      authorization: accessToken,
    },
    body: JSON.stringify(user),
  });
};

export const getUserDataApi = async (accessToken: string): Promise<UserDataApiResponse> => {
  return request<UserDataApiResponse>('auth/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: accessToken,
    },
  });
};
