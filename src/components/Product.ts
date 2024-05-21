import { IProduct } from '../types';
import { Model } from './base/Model';

export class Product extends Model<IProduct> {
	id: string;
	category: string;
	title: string;
	description: string;
	image: string;
	price: number | null;
	isInCart: boolean;
}
