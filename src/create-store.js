// @flow
import applyMiddleware from './middlewares';

import type { BasketStore, Middleware } from './types';

export default function createStore<S>(
  key: string,
  initialState: S,
  middlewares: Middleware[] = []
): BasketStore<S> {
  let listeners = [];
  let currentState = initialState;
  const store = {
    key,
    getState() {
      return currentState;
    },
    setState(nextState) {
      currentState = nextState;
      listeners.forEach(listener => listener());
    },
    subscribe(listener) {
      listeners.push(listener);
      return () => {
        listeners = listeners.filter(fn => fn !== listener);
      };
    },
    produce: (s): any => s, // makes Flow happy
  };
  store.produce = applyMiddleware(store, middlewares);
  return store;
}
