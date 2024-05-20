import { Api  } from './base/api';
import {ILarekAPI, IOrder, IOrderResult, IProduct, ApiListResponse} from "../types";

export class AppApi extends Api implements ILarekAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    //получение конкретного товара
    getProductItem(id: string): Promise<IProduct> {
        return this.get(`/product/${id}`).then(
            (item: IProduct) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
    }

    //получение списка товаров
    getProductsList(): Promise<IProduct[]> {
        return this.get('/product')
            .then((data: ApiListResponse<IProduct>) =>
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

