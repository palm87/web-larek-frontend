import { IOrder } from '../types';

export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const defaultOrder: IOrder = {
	payment: 'card',
	email: '',
	phone: '',
	address: '',
	total: 0,
	items: [],
};

export const categoryList: Record<string, string> = {
	'софт-скил': 'soft',
	другое: 'other',
	дополнительное: 'additional',
	'хард-скил': 'hard',
	кнопка: 'button',
};
