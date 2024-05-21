export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	isInCart?: boolean;
}

export interface IOrderSuccess {
	id: string;
	total: number;
}

export interface IOrderError {
	error: string;
}

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface IApi {
	baseUrl: string;
	get<T>(uri: string): Promise<T>;
	post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IAppState {
	catalog: IProduct[];
	basket: string[];
	preview: string | null;
}

export interface IOrderForm {
	payment: string;
	address: string;
	email: string;
	phone: string;
}

export interface IOrder extends IOrderForm {
	total: number;
	items: string[];
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderResult {
	id: string;
	total: number;
}

export interface ICard {
	title: string;
	description: string;
	id: string;
	category: string;
	image: string;
	price: number | null;
	isInCart: boolean;
	index: number;
}

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface IModalData {
	content: HTMLElement;
}

export interface IFormState {
	valid: boolean;
	errors: string[];
}

export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export interface ILarekAPI {
	getProductsList: () => Promise<IProduct[]>;
	getProductItem: (id: string) => Promise<IProduct>;
	makeOrder: (order: IOrder) => Promise<IOrderResult>;
}

export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};
