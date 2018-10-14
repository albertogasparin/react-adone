import React from 'react';

import initBasket from './init-basket';

export const fallbackProviderState = {
  baskets: {},
  initBasket(basket) {
    const basketInstance = initBasket(basket);
    fallbackProviderState.baskets[basket.key] = basketInstance;
    return basketInstance;
  },
};

const { Provider, Consumer } = React.createContext(fallbackProviderState);

export { Provider, Consumer };
