import { Form } from './common/Form';
import { IOrderForm } from '../types';
import { EventEmitter, IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';

export class Order extends Form<IOrderForm> {
	protected card: HTMLButtonElement;
	protected cash: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this.card = this.container.elements.namedItem('card') as HTMLButtonElement;
		this.cash = this.container.elements.namedItem('cash') as HTMLButtonElement;

		if (this.card) {
			this.card.addEventListener('click', () => {
				this.card.classList.add('button_alt-active');
				this.cash.classList.remove('button_alt-active');
				this.onInputChange('payment', 'card');
			});
		}

		if (this.cash) {
			this.cash.addEventListener('click', () => {
				this.cash.classList.add('button_alt-active');
				this.card.classList.remove('button_alt-active');
				this.onInputChange('payment', 'cash');
			});
		}
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}
