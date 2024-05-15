import { AppApi } from './components/AppApi';
import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { IApi, IProduct } from './types';
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



// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
// const order = new Order(cloneTemplate(orderTemplate), events);
// получить список товаров с сервера
// для каждого отрисовать карточку
// создать объект корзины
// создать объект заказа

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



// events.on('items:changed', () => {
//     page.catalog = appData.catalog.map((item) => {
//         const card = new Card (cloneTemplate(cardCatalogTemplate), {
//             onClick: () => events.emit('card:selected', item),
//         });

//         return card.render({
//             id: item.id,
//             cardCategory: item.category,
//             cardTitle: item.title,
//             cardPrice: item.price,
//             cardImage: item.image,
//             cardDescription: item.description,
//         });
//     });
//     page.counter = appData.basket.length;
// });

// // Получаем карточки с сервера
// api.getProductsList()
// .then(appData.setCatalog.bind(appData))
// .catch((err) => {
//      console.error(err);
// });



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

events.on('basket:open', () =>  {
    events.emit('modal:open');
    const cardsInBasket = appData.basket.map((item) => {
        const card = new Card(cloneTemplate(cardBasketTemplate), {
            onClick: () => {
                events.emit('item:remove', item);
            },
        });

        return card.render({
            title: item.title,
            price: item.price,
        });
    });

    modal.render({
        content: basket.render({
            items: cardsInBasket,
            // price: appData.totalPrice,
        }),
    });

    // basket.disableButton(!appData.basket.length);
});







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
