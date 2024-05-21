# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Товар 
```
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  isInCart?: boolean;
}
```
Окно с информацией об успешном заказе
```
export interface IOrderSuccess {
  id: string;
  total: number
}
```

Ошибка при заказе
```
export interface IOrderError {
  error: string;
 }
 ```

Методы запросов
```
 export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' | 'PATCH';
```

Интерфейс API
```
 export interface IApi {
  baseUrl: string;
  get<T>(uri: string): Promise<T>;
  post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
```
Основная информация приложения
```
export interface IAppState {
  catalog: IProduct[];
  basket: string[];
  preview: string | null;
}
```

Форма заказа
```
export interface IOrderForm {
  payment: string;
  address: string;
  email: string;
  phone: string;
}
```
Интерфейс заказа, отправляемого на сервер
```
export interface IOrder extends IOrderForm {
  total: number;
  items: string[]
}
```
Ошибки формы
```
export type FormErrors = Partial<Record<keyof IOrder, string>>;
```
Результат заказа
```
export interface IOrderResult {
    id: string;
    total: number
}
```
Карточка товара
```
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
```


Главная страница придложения
```
export interface IPage {
  counter: number;
  catalog: HTMLElement[];
  locked: boolean;
}
```
Запросы на сервер
```
export interface ILarekAPI {
  getProductsList: () => Promise<IProduct[]>;
  getProductItem: (id: string) => Promise<IProduct>;
  makeOrder: (order: IOrder) => Promise<IOrderResult>;
}
```



## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:
- слой представления, отвечает за отображение данных на странице,
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код
#### Класс Model
Абстрактный базовый класс для создания моделей данных, которые могут сообщать о своих изменениях через систему событий.
```
constructor(container: HTMLElement, protected events: IEvents)
```

#### Класс Component
Абстрактный базовый класс для создания компонентов, работающих с DOM. Он предоставляет методы для манипуляции элементами DOM, такие как переключение классов, установка текстового содержимого, управление видимостью и блокировкой элементов, а также установка изображений.\
```
constructor(protected readonly container: HTMLElement)
```
Конструктор принимает HTML-элемент, который будет служить корневым элементом для компонента.\
Методы:
- toggleClass(element: HTMLElement, className: string, force?: boolean) - переключает класс у указанного элемента.
- setText(element: HTMLElement, value: unknown) - устанавливает текстовое содержимое указанного элемента.
- setDisabled(element: HTMLElement, state: boolean) -  устанавливает или снимает блокировку элемента.
- setHidden(element: HTMLElement) - скрывает указанный элемент, устанавливая для него стиль display: none.
- setVisible(element: HTMLElement) - показывает указанный элемент, удаляя стиль display.
- setImage(element: HTMLImageElement, src: string, alt?: string) устанавливает изображение и альтернативный текст для него.
- render(data?: Partial<T>): HTMLElement - отрисовывает компонент, обновляя его состояние переданными данными.


#### Класс Api
Содержит в себе базовую логику отправки запросов. 
```
constructor(baseUrl: string, options: RequestInit = {})
```
В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы:
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.


#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

### Слой данных

#### Класс AppState
Класс отвечает за 
- хранение и логику работы с каталогом товаров, получаемых с сервера
- хранение каталога товаров, хранящихся в корзине текущего пользователя
- хранение данных заказа\

Поля класса:
- basket: IProduct[] - список товаров в корзине
- catalog: IProduct[] - каталог загруженных с сервера товаров
- order: IOrder - данные заказа 
- preview: string | null - id товара, карточку которого открываем на просмотр

Основные методы:
- setCatalog(items: IProduct[]): void - устанавливает каталог товаров
- setPreview(item: IProduct): void - устанавливает товар для просмотра 
- addToCart(item: IProduct): void - добавляет товар в корзину
- setOrderField(field: keyof IOrderForm, value: string) - заполяет значение одного из полей заказа
- validateOrder() - валидация полей заказа
- getOrderTotal(): number - получить сумму товаров в заказе
- getBasketTotal(): number - получить сумму товаров в корзине
- formOrder(): void - добавить в заказ товары из корзины
- clearBasket(): void - очистить товары в корзине

#### Класс Product
Для хранения данных о товаре. Помимо стандартных полей товара также хранит информацию о том, добавлен ли он в корзину.\
Поля:
- id: string;
- category: string;
- title: string;
- description: string;
- image: string;
- price: number | null;
- isInCart: boolean;


### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Класс Page
Отвечает за отображение блока с карточками товаров на главной странице. 
```
constructor(container: HTMLElement, protected events: IEvents)
```
В конструктор принимает контейнер, в котором размещаются карточки.\
Поля:
- _counter: HTMLElement - счетчик товаров? отображающийся на значке корзины
- _catalog: HTMLElement - каталог карточек
- _basket: HTMLElement - иконка с корзиной

#### Класс Card
Отвечает за отображение карточки товара на главной странице, задавая в карточке данные названия, описания, изображения, категории, стоимости. Класс используется для отображения карточек на странице сайта.  В конструктор класса передается DOM элемент контейнера, что позволяет при необходимости формировать карточки разных вариантов верстки (отображение карточки на главной странице, в модалке с карточкой, в модалке с корзиной). В классе устанавливаются слушатели на все интерактивные элементы, в результате взаимодействия с которыми пользователя генерируются соответствующие события.\
```
constructor(container: HTMLElement, actions?: ICardActions)
```
Поля класса содержат элементы разметки элементов карточки.
- _title: HTMLElement
- _image?: HTMLImageElement
- _description?: HTMLElement | null
- _category?: HTMLElement | null
- _price: HTMLElement | null
- button?: HTMLButtonElement | null
- cardIndex?: HTMLElement | null

Методы:
Гетерры и сеттеры для установки значений полей. А также
- isInCart(value: boolean): void для проверки нахождения товара в корзине/

#### Класс Modal
Реализует базовое модальное окно. Так же предоставляет методы `open` и `close` для управления отображением модального окна. Устанавливает слушатели на клавиатуру, для закрытия модального окна по Esc, на клик в оверлей и кнопку-крестик для закрытия попапа.
```
- constructor(container: HTMLElement, events: IEvents) 
```
Конструктор принимает контейнер и экземпляр класса `EventEmitter` для возможности инициации событий.\
Методы:
- set content(value: HTMLElement) - заменяет содержимое элемента _content новым значением value.
- open() - открывает модальное окно, добавляя класс modal_active, и эмитирует событие modal:open.
- close() - закрывает модальное окно, удаляя класс modal_active, очищая содержимое и эмитируя событие modal:close.
- render(data: IModalData): HTMLElement отрисовывает данные в модальном окне

#### Класс Form
Наследуется от Сomponent, является обобщённым компонентом для управления HTML-формой. Он обрабатывает ввод данных, отправку формы, валидацию и отображение ошибок.\
```
constructor(protected container: HTMLFormElement, protected events: IEvents)
```
Конструктор принимает HTML-элемент, который будет содержать корзину и экземпляр EventEmitter для обработки событий.\
Поля:
- _submit: HTMLButtonElement - кнопка для отправки формы.
- _errors: HTMLElement для отображения ошибок формы.
Методы:
- onInputChange(field: keyof T, value: string): void - обрабатывает изменения ввода в полях формы и вызывает событие form:changeInput.
-set valid(value: boolean): void устанавливает валидность формы, активируя или деактивируя кнопку отправки.
- set errors(value: string): void - устанавливает сообщение об ошибке в форме.
- render(state: Partial<T> & IFormState) - отрисовывает форму

#### Класс Basket
Класс Basket наследуется от Component, представляет собой компонент корзины покупок и используется для отображения списка товаров, общей стоимости и кнопки для оформления заказа.\
```
constructor(container: HTMLElement, protected events: EventEmitter)
```
Конструктор принимает HTML-элемент, который будет содержать корзину и экземпляр EventEmitter для обработки событий.\
Поля:
- _list: HTMLElement - список товаров.
- _total: HTMLElement - общая стоимость.
- _button: HTMLButtonElementдля оформления заказа.

Методы:
- set items(items: HTMLElement[]): void - устанавливает товары в корзине. Если массив товаров пуст, отображает сообщение "Корзина пуста" и отключает кнопку оформления заказа.

- set total(total: number): void - устанавливает общую стоимость товаров в корзине и обновляет соответствующий HTML-элемент.

#### Класс Order
Наследуется от класса Form.\
Управляет отображением всех данных заказа в процессе оформления заказа.\
```
constructor(container: HTMLFormElement, events: IEvents) 
```
Конструктор принимает HTML-элемент, который будет содержать компоненты формы заказа и экземпляр EventEmitter для обработки событий.\
Поля:
- card: HTMLButtonElement - оплата онлайн
- cash: HTMLButtonElement - оплата наличными

Методы:
- set phone(value: string) - устанавливает значение поля ввода для телефона.
- set email(value: string) - устанавливает значение поля ввода для email.
- set address(value: string) - устанавливает значение поля ввода для адреса.
- resetPayment() - cбрасывает выбор способа оплаты, устанавливая активным способ оплаты картой.

#### Класс Success
Наследуется от класса Component, отображает сообщение об успешном выполнении заказа, общую сумму списанных средств и кнопку для закрытия сообщения.\
```
constructor(container: HTMLElement, actions: ISuccessActions)
```
Конструктор принимает HTML-элемент, который будет содержать компоненты формы с сообщением об успешном заказе и действие, которое произойдет при нажатии на кнопку в форме.\
Поля:
- _close: HTMLButtonElement - кнопка с возвратом к каталогу товаров
- _total: HTMLElement - отображает общую сумму списанных средств.
Методы:
- set total(value: number): void - устанавливает текстовое содержание элемента _total, отображая общую сумму списанных средств в формате Списано ${value} синапсов.

### Слой коммуникации

#### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.
- getProductsList: () => Promise<IProduct[]> - получение с сервера списка продуктов
- getProductItem: (id: string) => Promise<IProduct> - получения данных о конкретном товаре
- makeOrder: (order: IOrder) => Promise<IOrderResult> - отправка заказа на сервер

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*\

- `items:changed` - изменение массива товаров
- `card:selected` - товар выбран для отображения в модальном окне
- `preview:changed` - изменился товар для предпросмотра`
- `item:addToCart` - товар добавлен в корзину
- `basket:delete` - товар удален из корзины
- `basket:changed` - корзина обновлена
- `basket:open` - корзина открыта
- `order:start` - открытие формы заказа 1й шаг(с адресом и способом оплаты)
- `order:submit` - открытие формы заказа 2й шаг(с телефоном и почтой)
- `contacts:submit` - заказ отравлен
- `modal:open` - открыто модальное окно










