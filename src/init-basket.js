import bindActions from './bind-actions';
import createStore from './create-store';

export default function initBasket(basket) {
  const store = createStore(basket.key, basket.defaultState);
  const actions = bindActions(basket.actions, store);
  return { store, actions };
}
