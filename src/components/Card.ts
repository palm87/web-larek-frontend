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

export interface ICard {
    title: string;
    description: string;
    id: string;
    category: string;
    image: string;
    price: number | null;
}
interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class Card extends Component<ICard> {
    protected cardTitle: HTMLElement;
    protected cardImage?: HTMLImageElement;
    protected text?: HTMLElement | null;
    protected cardCategory?: HTMLElement | null;
    protected button?: HTMLButtonElement | null;
    protected cardPrice: HTMLElement | null;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.cardTitle = ensureElement<HTMLElement>(`.card__title`, container);
        this.cardImage = container.querySelector(`.card__image`);
        this.text = container.querySelector(`.card__text`);
        this.cardPrice = container.querySelector(`.card__price`);
        this.cardCategory = container.querySelector(`.card__category`);
        this.button = container.querySelector(`.card__button`);

        if (actions?.onClick) {
            if (this.button) {
                this.button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set title(value: string) {
        this.setText(this.cardTitle, value);
    }

    get title(): string {
        return this.cardTitle.textContent || '';
    }

    set image(value: string) {
        this.setImage(this.cardImage, value, this.title);
    }

    set description(value: string) {
        this.setText(this.text, value);
    }

    get description(): string {
        return this.text.textContent || '';
    }

    set category(value: string) {
        this.setText(this.cardCategory, value);
        this.cardCategory. classList.add(`card__category_${categoryList[value]}`) 
        }
    

    set price(value: number | null) {
        if (value===null) {
            this.cardPrice.textContent = 'Бесценно'
            this.setDisabled(this.button, true)
        }
        else {
            this.cardPrice.textContent = value.toString() + ' ' +'синапсов';
          
        }
    }

    set isInCart(value: boolean) {
        if (!this.button.disabled) {
            this.button.disabled = value;
        }
    }
}






// export class Card extends Component<ICard> {
//     protected _title: HTMLElement;
// 	protected _description?: HTMLElement;
//     protected _category?: HTMLSpanElement;
//     protected _image?: HTMLImageElement;
//     protected _price: HTMLElement;
// 	protected _id: string;
//     protected button?: HTMLButtonElement;

//     constructor(container: HTMLElement, actions?: ICardActions) {
// 		super(container)

//         this._title = ensureElement<HTMLElement>(`.card__title`, container);
//         this._image = ensureElement<HTMLImageElement>('.card__image', container);
//         this._description = container.querySelector(`.card__text`);
//         this._price = container.querySelector(`.card__price`);
//         this._category = container.querySelector(`.card__category`);
//         this.button = container.querySelector(`.card__button`);
    
//         if (actions?.onClick) {
//             if (this.button) {
//                 this.button.addEventListener('click', actions.onClick);
//             } else {
//                 container.addEventListener('click', actions.onClick);
//             }
//         }
        
//         // set _id(value: string) {
//         //     this.container.dataset._id = value;
//         // }
    
//         // get id(): string {
//         //     return this.container.dataset.id || '';
//         // }
    
//         // set title(value: string) {
//         //     this.setText(this._title, value);
//         // }
    
//         // get title(): string {
//         //     return this._title.textContent || '';
//         // }
    
//         // set image(value: string) {
//         //     this.setImage(this._image, value, this.title)
//         // }

// 	}
    

    // setData(productData: IProduct) {
    //     this.cardId = productData.id;

    //     this.cardTitle.textContent = productData.title;
    //     this.cardCategory.textContent=productData.category;
    //     this.cardDescription.textContent=productData.description;
    //     this.cardImage.src=CDN_URL + productData.image;

    //     if (productData.price===null) {
    //         this.cardPrice.textContent = 'Бесценно'
    //     }
    //     else this.cardPrice.textContent = productData.price.toString() + ' ' +'синапсов';
    // }

	// render() {
	// 	return this.element;
	// }

// }
