import { Checkout } from './checkout.entity';

export const checkoutProviders = [
  {
    provide: 'CHECKOUT_REPOSITORY',
    useValue: Checkout,
  },
];
