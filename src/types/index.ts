export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
  isInCart: boolean;
}

export interface IOrderSuccess {
  id: string;
  total: number
}

export interface IOrderError {
  error: string;
 }

 export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' | 'PATCH';

 export interface IApi {
  baseUrl: string;
  get<T>(uri: string): Promise<T>;
  post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IAppState {
  catalog: IProduct[];
  basket: string[];
  preview: string | null;
}

export interface IOrderForm {
  payment: string;
  address: string;
  email: string;
  phone: string;
}

export interface IOrder extends IOrderForm {
  total: number;
  items: string[]
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderResult {
    id: string;
    total: number
}