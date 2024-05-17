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

    //получение конкретного товара
    getProductItem(id: string): Promise<ICard> {
        return this.get(`/product/${id}`).then(
            (item: ICard) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
    }

    //получение списка товаров
    getProductsList(): Promise<ICard[]> {
        return this.get('/product')
            .then((data: ApiListResponse<ICard>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image,
            }))
        );
    }


    //отправка заказа
    makeOrder(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }
}

