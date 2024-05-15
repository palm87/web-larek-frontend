
import {IProduct} from "../types";
import {Model} from './base/Model';

/**
 * Класс описывающий свойства товара, наследуется от класса Model (реализация слоя Model).
 */
export class Product extends Model<IProduct> {
    id: string;
    category: string;
    title: string;
    description: string;
    image: string;
    price: number | null;
    selected: boolean;
}