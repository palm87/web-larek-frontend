import { AppApi } from './components/AppApi';
import { EventEmitter } from './components/base/Events';
import './scss/styles.scss';
import { IOrderForm, IProduct } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { Card } from './components/Card';
import { AppState } from './components/AppData';
import { Page } from './components/Page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { Order } from './components/Order';
import { Success } from './components/common/Success';

const events = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);

// все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderAddressTemplate = ensureElement<HTMLTemplateElement>('#order');
const orderContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderSuccessTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderWithAddress = new Order(cloneTemplate(orderAddressTemplate), events);
const orderWithContacts = new Order(
	cloneTemplate(orderContactsTemplate),
	events
);

// отрисовка каталога карточек после получения их данных
events.on('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const templateClone = cloneTemplate(cardCatalogTemplate);
		const card = new Card(templateClone, {
			onClick: () => events.emit('card:selected', item),
		});

		return card.render({
			id: item.id,
			category: item.category,
			title: item.title,
			price: item.price,
			image: item.image,
			description: item.description,
		});
	});

	// обновляем счетчик на корзине на гланой странице
	page.counter = appData.basket.length;
});

// Клик по карточке продукта в каталоге
events.on('card:selected', (item: IProduct) => {
	appData.setPreview(item);
});

events.on('preview:changed', (item: IProduct) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => events.emit('item:addToCart', item),
		});
		modal.render({
			content: card.render({
				id: item.id,
				category: item.category,
				title: item.title,
				price: item.price,
				image: item.image,
				description: item.description,
				isInCart: item.isInCart,
			}),
		});
	});

// добавление товара в корзину
events.on('item:addToCart', (item: IProduct) => {
	item.isInCart = true;
	appData.addToCart(item);
	events.emit('basket:changed');
	modal.close();
});

// изменение корзины
events.on('basket:changed', () => {
	page.counter = appData.basket.length;
});
// открытие корзины
events.on('basket:open', () => {
	events.emit('modal:open');
	let cardsIndex = 0;
	const cardsInBasket = appData.basket.map((item) => {
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('basket:delete', item);
			},
		});
		cardsIndex += 1;
		return card.render({
			title: item.title,
			price: item.price,
			index: cardsIndex,
		});
	});
	modal.render({
		content: basket.render({
			items: cardsInBasket,
			total: appData.getBasketTotal(),
		}),
	});
});

//удаление товара из корзины
events.on('basket:delete', (item: IProduct) => {
	item.isInCart = false;
	appData.basket = appData.basket.filter((thing) => thing !== item);
	events.emit('basket:changed');
	events.emit('basket:open');
});

//открытие формы заказа 1й шаг(с адресом и способом оплаты)
events.on('order:start', () => {
	modal.render({
		content: orderWithAddress.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

//открытие формы заказа 2й шаг(с телефоном и почтой)
events.on('order:submit', () => {
	// appData.order.total = appData.totalPrice;
	modal.render({
		content: orderWithContacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

// Изменилось состояние валидации формы
events.on('form:changeValid', (errors: Partial<IOrderForm>) => {
	const { email, phone, address } = errors;
	orderWithAddress.valid = !address;
	orderWithContacts.valid = !email && !phone;
	orderWithAddress.errors = Object.values({ address })
		.filter((i) => !!i)
		.join('; ');
	orderWithContacts.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось одно из полей
events.on(
	'form:changeInput',
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// отправка заказа на сервер
events.on('contacts:submit', () => {
	appData.formOrder();
	appData.getOrderTotal();
	api
		.makeOrder(appData.order)
		.then((result) => {
			const success = new Success(cloneTemplate(orderSuccessTemplate), {
				onClick: () => {
					modal.close();
				},
			});
			appData.clearBasket();
			appData.clearOrder();
			events.emit('basket:changed');
			modal.render({ content: success.render({ total: result.total }) });
		})
		.catch((err) => {
			console.error(err);
		});
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});

// Получаем карточки с сервера
api
	.getProductsList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
