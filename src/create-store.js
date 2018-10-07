// @flow
import applyMiddleware from './middlewares';
import withDevtools from './enhancers/devtools';

import type { BasketStore, Middleware } from './types';

const createStore = (
  key: string,
  initialState: any,
  middlewares: Middleware[] = []
): BasketStore<any> => {
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
};

export default withDevtools(createStore);
