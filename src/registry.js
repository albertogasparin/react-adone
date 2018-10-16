import bindActions from './bind-actions';
import createStore from './create-store';

export default class BasketRegistry {
  constructor(initialStates = {}, actionExtraArgument) {
    this.initialStates = initialStates;
    this.baskets = new Map();
    this.actionExtraArgument = actionExtraArgument;
  }

  initBasket = basket => {
    const { key, defaultState, actions } = basket;
    const initialState = this.initialStates[key];
    const store = createStore(key, initialState || defaultState);
    const boundActions = bindActions(actions, store, this.actionExtraArgument);
    const basketInstance = { store, actions: boundActions };

    this.baskets.set(key, basketInstance);
    return basketInstance;
  };

  setActionExtraArgument(actionExtraArgument) {
    this.actionExtraArgument = actionExtraArgument;
  }
}

export const defaultRegistry = new BasketRegistry();
