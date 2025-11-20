import { User, Ingredient, Order } from './entities';

export type UnsuccessApiResponse = {
  success: false;
  message: string;
};

export type AuthApiResponse =
  | {
      success: true;
      accessToken: string;
      refreshToken: string;
      user: User;
    }
  | UnsuccessApiResponse;

export type TokenApiResponse =
  | {
      success: true;
      accessToken: string;
      refreshToken: string;
    }
  | UnsuccessApiResponse;

export type IngredientsApiResponse =
  | {
      success: true;
      data: Ingredient[];
    }
  | UnsuccessApiResponse;

export type CreateOrderApiResponse =
  | {
      success: true;
      name: string;
      order: Order;
    }
  | UnsuccessApiResponse;

export type UserDataApiResponse =
  | {
      success: true;
      user: User;
    }
  | UnsuccessApiResponse;

export type LogoutApiResponse =
  | {
      success: true;
      message: string;
    }
  | UnsuccessApiResponse;
