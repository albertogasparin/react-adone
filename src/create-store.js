import applyMiddleware from './middlewares';
import withDevtools from './enhancers/devtools';
import defaults from './defaults';

const createStore = (key, initialState) => {
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
  };
  store.produce = applyMiddleware(store, defaults.middlewares);
  return store;
};

export default withDevtools(createStore);
