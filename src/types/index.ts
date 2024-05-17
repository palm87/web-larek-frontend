export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
}

export interface IProductsData {
  products: IProduct[];
  preview: string | null;
  getProduct(productId: string):IProduct| undefined;
}

export interface ICart {
  products: IProduct [];
  totalPrice: number;
  totalAmount: number;
  addProduct(productId:string):void;
  removeProduct(productId:string):void;
}

export interface IOrder {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];

}
export type TProductId = Pick<IProduct, 'id'>
export type TTotalAmountInCart = Pick<ICart, 'totalAmount'>
export type TTotalPriceInCart = Pick<ICart, 'totalPrice'>
export type TProductInCart = Pick<IProduct, 'title' | 'price'>
export type TOrderFormPayment = Pick<IOrder, 'payment' | 'address'>
export type TOrderFormContacts = Pick<IOrder, 'email' | 'phone'>
export type TOrderFormSuccess = Pick<IOrder, 'total'>

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
  items: string[]
}


export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderResult {
    id: string;
    total: number
}