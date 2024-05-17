import { Api, ApiListResponse } from './base/api';
import {IOrder, IOrderResult, IProduct} from "../types";
import { ICard } from './Card';

export interface ILarekAPI {
    getProductsList: () => Promise<ICard[]>;
    getProductItem: (id: string) => Promise<ICard>;
    makeOrder: (order: IOrder) => Promise<IOrderResult>;
}

export class AppApi extends Api implements ILarekAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getProductItem(id: string): Promise<ICard> {
        return this.get(`/product/${id}`).then(
            (item: ICard) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
    }

    getProductsList(): Promise<ICard[]> {
        return this.get('/product')
            .then((data: ApiListResponse<ICard>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image,
            }))
        );
    }

    makeOrder(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }

}


// import { IApi, IOrder, IOrderSuccess, IProduct, TOrderFormSuccess, TProductId} from '../types';
// import { ApiListResponse } from './base/api';

// export class AppApi {
// 	private _baseApi: IApi;

// 	constructor(baseApi: IApi) {
// 		this._baseApi = baseApi;
// 	}

// 	// getProducts(): Promise<IProduct[]> {
// 	// 	return this._baseApi.get<IProduct[]>(`/product`).then((products: IProduct[]) => products);
// 	// }

//     getProduct(productId: string): Promise<IProduct> {
//         return this._baseApi.get<IProduct>(`/product/${productId}`)
//     }


//     getProducts(): Promise<IProduct[]> {
// 		return this._baseApi.get(`/product`).then((products: ApiListResponse<IProduct>) => products.items);
// 	}

//     // etProductList(): Promise<IProduct[]> {
// 	// 	return this.('/product').then((data: ApiListResponse<IProduct>) =>
// 	// 		data.items.map((item) => ({
// 	// 			...item,
// 	// 			image: this.cdn + item.image,
// 	// 		}))
// 	// 	);
// 	// }

//     makeOrder(order: IOrder): Promise<IOrderSuccess> {
//         return this._baseApi.post('/order', order).then(
//             (response: IOrderSuccess) => response
//         );
//     }

// }
