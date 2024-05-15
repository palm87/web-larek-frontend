

import {Model} from "./base/Model";
import {IAppState, IOrder, IProduct} from "../types";
import { Product } from "./Product";

export type CatalogChangeEvent = {
    catalog: IProduct[]
};


export class AppState extends Model<IAppState> {
    basket: IProduct[]=[];
    catalog: IProduct[]=[];
    order: IOrder = {
        payment: '',
        email: '',
        phone: '',
        address: '',
        total: 0,
        items: []
    };
    preview: string | null;
    // formErrors: FormErrors = {};

    // toggleOrderedLot(id: string, isIncluded: boolean) {
    //     if (isIncluded) {
    //         this.order.items = _.uniq([...this.order.items, id]);
    //     } else {
    //         this.order.items = _.without(this.order.items, id);
    //     }
    // }

    // clearBasket() {
    //     this.order.items.forEach(id => {
    //         this.toggleOrderedLot(id, false);
    //         // this.catalog.find(it => it.id === id).clearBid();
    //     });
    // }

    getTotal() {
        return this.order.items.reduce((a, c) => a + this.catalog.find(it => it.id === c).price, 0)
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



    // setOrderField(field: keyof IOrderForm, value: string) {
    //     this.order[field] = value;

    //     if (this.validateOrder()) {
    //         this.events.emit('order:ready', this.order);
    //     }
    // }

    // validateOrder() {
    //     const errors: typeof this.formErrors = {};
    //     if (!this.order.email) {
    //         errors.email = 'Необходимо указать email';
    //     }
    //     if (!this.order.phone) {
    //         errors.phone = 'Необходимо указать телефон';
    //     }
    //     this.formErrors = errors;
    //     this.events.emit('formErrors:change', this.formErrors);
    //     return Object.keys(errors).length === 0;
    // }
}


// export class LotItem extends Model<ILot> {
//     about: string;
//     description: string;
//     id: string;
//     image: string;
//     title: string;
//     datetime: string;
//     history: number[];
//     minPrice: number;
//     price: number;
//     status: LotStatus;

//     protected myLastBid: number = 0;

//     clearBid() {
//         this.myLastBid = 0;
//     }

//     placeBid(price: number): void {
//         this.price = price;
//         this.history = [...this.history.slice(1), price];
//         this.myLastBid = price;

//         if (price > (this.minPrice * 10)) {
//             this.status = 'closed';
//         }
//         this.emitChanges('auction:changed', { id: this.id, price });
//     }

//     get isMyBid(): boolean {
//         return this.myLastBid === this.price;
//     }

//     get isParticipate(): boolean {
//         return this.myLastBid !== 0;
//     }

// }