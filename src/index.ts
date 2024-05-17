import { AppApi } from './components/AppApi';
import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { IApi, IOrderForm, IProduct } from './types';
import { API_URL, CDN_URL, testCards} from './utils/constants';

import { ProductData} from './components/ProductsData'
import { Card } from './components/Card';
import { Api } from './components/base/api';
import { AppState, CatalogChangeEvent } from './components/AppData';
import { Page } from './components/Page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Product } from './components/Product';
import { Basket } from './components/common/Basket';
import { Order } from './components/Order';
import { Success } from './components/common/Success';
import { Tabs } from './components/Tabs';


const events = new EventEmitter
const api = new AppApi(CDN_URL, API_URL);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);


// Модель данных приложения
const appData = new AppState({}, events);

// все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderAddressTemplate = ensureElement<HTMLTemplateElement>('#order');
const orderContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderSuccessTemplate = ensureElement<HTMLTemplateElement>('#success');



// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderWithAddress = new Order(cloneTemplate(orderAddressTemplate), events);
const orderWithContacts = new Order(cloneTemplate(orderContactsTemplate), events);



// const tabs = new Tabs(orderAddressTemplate, {
//     onClick: (name) => {
//         if (name === 'cash') events.emit('payment:cash');
//                 else {
//                     events.emit('payment:online')};
//     }
// });

// console.log(tabs)


// events.on('payment:cash', () => {
//     tabs.selected='cash';
//     appData.order.payment='cash'
//     console.log(appData.order.payment)
// })

// events.on('payment:online', () => {
//     tabs.selected='online';
//     tabs.selected='online';
//     appData.order.payment='online'
//     console.log(appData.order.payment)
// })


// Глобальные контейнеры





// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})
events.on('items:changed', () => {
    page.catalog = appData.catalog.map((item) => {
        // Клонируем шаблон для каждой карточки
        const templateClone = cloneTemplate(cardCatalogTemplate);
        
        // Создаем новую карточку, используя клонированный шаблон
        const card = new Card(templateClone, {
            onClick: () => events.emit('card:selected', item),
        });

        // Отрисовываем карточку с соответствующими данными
        return card.render({
            id: item.id,
            category: item.category,
            title: item.title,
            price: item.price,
            image: item.image,
            description: item.description,
        });
    });

    // Обновляем счетчик корзины
    page.counter = appData.basket.length;
});


// Получаем карточки с сервера
api.getProductsList()
.then(appData.setCatalog.bind(appData))
.catch((err) => {
     console.error(err);
});

// Клик по карточке продукта в каталоге
events.on('card:selected', (item: Product) => {
    appData.setPreview(item);
});

events.on('preview:changed', (item: Product) => {
    const showItem = (item: Product) => {
        const card = new Card(cloneTemplate(cardPreviewTemplate), 
        {
            onClick: () => events.emit('item:addToCart', item),
        })

        modal.render({
            content: card.render({
                id: item.id,
                category: item.category,
                title: item.title,
                price: item.price,
                image: item.image,
                description: item.description,
                isInCart: item.isInCart
            })
        });
    };

    if (item) {
        api.getProductItem(item.id)
            .then((result) => {
                // item.description = result.description;
                showItem(item);
            })
            .catch((err) => {
                console.error(err);
            })
    } else {
        modal.close();
    }
});

events.on('item:addToCart', (item: Product) => {
    item.isInCart = true;
    appData.addToCart(item);
    events.emit('basket:changed')
    modal.close();
});

events.on('basket:changed', () =>  {
    page.counter=appData.basket.length;} 
    )
// открытие корзины
events.on('basket:open', () =>  {
    events.emit('modal:open');
    let cardsIndex=0
    const cardsInBasket = appData.basket.map((item) => {
        const card = new Card(cloneTemplate(cardBasketTemplate), {
            onClick: () => {
                events.emit('basket:delete', item);
            },
        });
        cardsIndex+=1;
        return card.render({
            title: item.title,
            price: item.price,
            index: cardsIndex
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
events.on('basket:delete', (item: Product) =>  {
    item.isInCart = false;
    appData.basket = appData.basket.filter(thing=> thing !== item)
    events.emit('basket:changed');
    events.emit('basket:open');
})

//открытие формы заказа 1й шаг(с адресом и способом оплаты)
events.on('order:start', () => {
    modal.render({
        content: orderWithAddress.render({
            // payment: 'online',
            // address: '',
            valid: false,
            errors: []
        })
    });
});

// Изменилось состояние валидации формы
events.on('form:changeValid', (errors: Partial<IOrderForm>) => {
    const { email, phone, address } = errors;
    orderWithAddress.valid = !address;
    orderWithContacts.valid = (!email && !phone) 
    orderWithAddress.errors = Object.values({address}).filter(i => !!i).join('; ');
    orderWithContacts.errors = Object.values({email, phone}).filter(i => !!i).join('; ');
});

// Изменилось одно из полей
events.on('form:changeInput', (data: { field: keyof IOrderForm, value: string }) => {
    appData.setOrderField(data.field, data.value);
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


const success = new Success(cloneTemplate(orderSuccessTemplate), {
    onClick: () => {
        modal.close();
        appData.clearBasket();
        appData.clearOrder();
        events.emit('basket:changed');
    }
});

//Отправка заказа на сервер
events.on('contacts:submit', () => {
    appData.formOrder()
    appData.getTotal()
    api.makeOrder(appData.order)
    .then((result) => {
    // const success = new Success(cloneTemplate(orderSuccessTemplate), {
    //     onClick: () => {
    //         modal.close();
    //         appData.clearBasket();
    //         appData.clearOrder();
    //         events.emit('basket:changed');
    //     }
    // });
    modal.render({
        content: success.render({total: result.total })
    });
    //    .then((result) => {
    //        modal.close();
    //        events.emit('order:made', result);
    //        appData.clearBasket();
    //        appData.clearOrder();
    //        events.emit('basket:changed');

    //    })
    //    .catch((err) => {
    //        console.error(err);
    //    })
    })})


// events.on('order:made', (result) => {
  
//     const orderSuccess = new Success (cloneTemplate(orderSuccessTemplate), )
//     modal.render({
//         content: orderSuccess.render({
//             // address: '',
//             valid: false,
//             errors: []
//         })
//     });
// });






// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

// Изменились элементы каталога
//Отображение товаров на странице



// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});










// api.makeOrder({
//     "payment": "online",
//     "email": "test@test.ru",
//     "phone": "+71234567890",
//     "address": "Spb Vosstania 1",
//     "total": 2200,
//     "items": [
//         "854cef69-976d-4c2a-a18c-2aa45046c390",
//         "c101ab44-ed99-4a54-990d-47aa2bb4e7d9"
//     ]
// })
