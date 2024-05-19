
// // import { IProduct, IProductsData} from "../types";
// import { IEvents } from "./base/events";


// export class ProductData implements IProductsData {
//     protected _products: IProduct[];
//     protected _preview: string | null;
//     protected events: IEvents;

//     constructor(events: IEvents) {
//         this.events = events;
//     }
    
//     set products(products:IProduct[]) {
//         this._products = products;
//         this.events.emit('products:changed')
//     }

//     get products () {
//         return this._products;
//     }

//     getProduct(productId: string) {
//         return this._products.find((item) => item.id === productId)
//     }

//     set preview(productId: string | null) {
//         if (!productId) {
//             this._preview = null;
//             return;
//         }
//         const selectedCard = this.getProduct(productId);
//         if (selectedCard) {
//             this._preview = productId;
//             this.events.emit('product:selected')
//         }
//     }

//     get preview () {
//         return this._preview;
//     }
// }