import { IProduct } from '../types';
import { cloneTemplate, ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';
import { CDN_URL } from '../utils/constants';


const categoryList: Record<string, string> = {
    'софт-скил': 'soft',
    'другое': 'other',
    'дополнительное': 'additional',
    'хард-скил': 'hard',
    'кнопка': 'button'
};

// enum Category {
//     SOFT_SKILL = 'софт-скил',
//     OTHER = 'другое',
//     ADDITIONAL = 'дополнительное',
//     HARD_SKILL = 'хард-скил',
//     BUTTON = 'кнопка'
// }

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
interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class Card extends Component<ICard> {
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement | null;
    protected _category?: HTMLElement | null;
    protected button?: HTMLButtonElement | null;
    protected _price: HTMLElement | null;
    protected cardIndex?: HTMLElement | null;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        this._title = ensureElement<HTMLElement>(`.card__title`, container);
        this._image = container.querySelector(`.card__image`);
        this._description = container.querySelector(`.card__text`);
        this._price = container.querySelector(`.card__price`);
        this._category = container.querySelector(`.card__category`);
        this.button = container.querySelector(`.card__button`);
        this.cardIndex = container.querySelector(`.basket__item-index`);

        if (actions?.onClick) {
            if (this.button) {
                this.button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
     
    }

    set index(value: number) {
        this.setText(this.cardIndex, value)
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title);
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    get description(): string {
        return this._description.textContent || '';
    }

    set category(value: string) {
        this.setText(this._category, value);
        this._category. classList.add(`card__category_${categoryList[value]}`) 
        }
    

    set price(value: number | null) {
        if (value===null) {
            this._price.textContent = 'Бесценно'
            this.setDisabled(this.button, true)
        }
        else {
            this._price.textContent = value.toString() + ' ' +'синапсов';
          
        }
    }

    set isInCart(value: boolean) {
        if (!this.button.disabled) {
            this.button.disabled = value;
            if (value) {
                this.button.textContent = 'Уже в корзине';
            } 
        }
       
    }
}


