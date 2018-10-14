import bindActions from './bind-actions';
import createStore from './create-store';

export default function initBasket(basket, initialState) {
  const store = createStore(basket.key, initialState || basket.defaultState);
  const actions = bindActions(basket.actions, store);
  return { store, actions };
}
