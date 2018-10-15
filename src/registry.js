import bindActions from './bind-actions';
import createStore from './create-store';

export default class BasketRegistry {
  constructor(initialStates = {}) {
    this.initialStates = initialStates;
    this.baskets = new Map();
  }

  initBasket = basket => {
    const { key, defaultState, actions } = basket;
    const initialState = this.initialStates[key];
    const store = createStore(key, initialState || defaultState);
    const boundActions = bindActions(actions, store);
    const basketInstance = { store, actions: boundActions };

    this.baskets.set(key, basketInstance);
    return basketInstance;
  };
}

export const defaultRegistry = new BasketRegistry();
