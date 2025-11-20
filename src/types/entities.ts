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

export interface Order {
  number: number;
}
