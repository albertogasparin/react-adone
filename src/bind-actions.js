import combineMiddlewares from './middlewares';

import type { BasketStore, BasketActions, Middleware } from './types';

export default function bindActions(
  actions,
  store: BasketStore,
  middlewares: Middleware[]
): BasketActions {
  const produce = combineMiddlewares(store, middlewares);

  return Object.keys(actions).reduce((acc, k) => {
    acc[k] = (...args) => actions[k](...args)(produce, store.getState);
    return acc;
  }, {});
}
