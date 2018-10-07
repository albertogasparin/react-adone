import type { BasketStore, BasketActions } from './types';

export default function bindActions(
  actions,
  store: BasketStore<any>
): BasketActions {
  return Object.keys(actions).reduce((acc, k) => {
    acc[k] = (...args) => actions[k](...args)(store.produce, store.getState);
    return acc;
  }, {});
}
