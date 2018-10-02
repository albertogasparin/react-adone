import combineMiddlewares from './middlewares';

import type { BasketActions } from './types';

export default function bindActions(
  actions,
  store,
  middlewares
): BasketActions {
  const produce = combineMiddlewares(store, middlewares);

  return Object.keys(actions).reduce((acc, k) => {
    acc[k] = (...args) => actions[k](...args)(produce, store.getState);
    return acc;
  }, {});
}
