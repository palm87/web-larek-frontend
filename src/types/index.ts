export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
}

export interface IProductsData {
  _products: IProduct[];
  preview: string | null;
  getProduct(productId: string):IProduct;
}

export interface IBasket {
  products: IProduct [];
  _totalPrice: number;
  _totalAmount: number;
  addProduct(productId:string):void;
  removeProduct(productId:string):void;
}


export interface IOrder {
  payment: string;
  email: string;
  phone: string;
  address: string;
  _total: number;
  products: IProduct[];
  makeOrder():void;

}

export type TProductInBasket = Pick<IProduct, 'title' | 'price'>
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

