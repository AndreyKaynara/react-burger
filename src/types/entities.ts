export interface User {
  email: string;
  name: string;
}

export interface UserRegisterData extends User {
  password: string;
}

export interface UpdateUserData {
  email?: string;
  name?: string;
  password?: string;
}

export interface Ingredient {
  _id: string;
  name: string;
  type: 'bun' | 'sauce' | 'main';
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_mobile: string;
  image_large: string;
  __v: number;
}

export interface IngredientInConstructor extends Ingredient {
  uuid: string;
}

export type OrderStatus = 'done' | 'pending' | 'created'; // пример возможных статусов

export interface Owner {
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}
export interface Order {
  _id: string;
  number: number;
  name: string;
  status: OrderStatus;
  ingredients: Ingredient[];
  owner: Owner;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderFromFeed {
  _id: string;
  ingredients: string[];
  status: 'done' | 'pending' | 'created' | 'cancelled';
  number: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}
