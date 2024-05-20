

import {Model} from "./base/Model";
import {FormErrors, IAppState, IOrder, IOrderForm, IProduct} from "../types";
import { Product } from "./Product";

export type CatalogChangeEvent = {
    catalog: IProduct[]
};


export class AppState extends Model<IAppState> {
    basket: IProduct[]=[];
    catalog: IProduct[];
    order: IOrder = {
        payment: '123',
        email: '',
        phone: '',
        address: '',
        total: 0,
        items: []
    };
    preview: string | null;
    formErrors: FormErrors = {};

    formOrder() {
        this.order.items = this.basket.map((item) => item.id)
    }

    clearBasket() {
        this.basket.forEach(basketItem => {
            const catalogItem = this.catalog.find(catalogItem => catalogItem.id === basketItem.id);
            if (catalogItem) {
                catalogItem.isInCart = false;
            }
        });
        this.basket =[]
    }
    clearOrder() {
        this.order= {
            payment: '',
            email: '',
            phone: '',
            address: '',
            total: 0,
            items: []
        };
    }

    // getTotal() {
    //     return this.order.items.reduce((a, c) => a + this.catalog.find(it => it.id === c).price, 0)
    // }

    getOrderTotal() {
        this.order.total= this.order.items.reduce((a, c) => a + this.catalog.find(it => it.id === c).price, 0)
    }
    getBasketTotal() {
        return this.basket.reduce((total, product) => total + product.price, 0);
    }

    setCatalog(items: IProduct[]) {
        this.catalog = items.map(item => new Product(item, this.events));
        this.emitChanges('items:changed', { catalog: this.catalog });
    }

    setPreview(item: IProduct) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    addToCart(item: IProduct) {
        this.basket.push(item)
    }

    setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;
        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
        }
    }

    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }

        this.formErrors = errors;
        this.events.emit('form:changeValid', this.formErrors);
        console.log(Object.keys(errors).length)
        return Object.keys(errors).length === 0;
    }
}