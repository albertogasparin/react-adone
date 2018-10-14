import React from 'react';

import initBasket from './init-basket';

export const fallbackProviderState = {
  baskets: {},
  initialStates: {},
  initBasket(basket) {
    const initialState = fallbackProviderState.initialStates[basket.key];
    const basketInstance = initBasket(basket, initialState);
    fallbackProviderState.baskets[basket.key] = basketInstance;
    return basketInstance;
  },
};

const { Provider, Consumer } = React.createContext(fallbackProviderState);

export { Provider, Consumer };
