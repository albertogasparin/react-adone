import immer from "immer";

export function createStore(initialState, key) {
  let listeners = [];
  let currentState = initialState;
  return {
    key,
    getState() {
      return currentState;
    },
    setState(nextState) {
      currentState = nextState;
      listeners.forEach(listener => listener());
    },
    on(listener) {
      listeners.push(listener);
    },
    off(listener) {
      listeners = listeners.filter(fn => fn !== listener);
    }
  };
}

const updateMiddleware = store => next => fn => {
  const changes = [];
  const state = store.getState();
  const nextState = next(state, fn, patches => {
    changes.push(...patches);
  });
  if (nextState !== state) {
    store.setState(nextState);
  }
  return { changes };
};

export function bindActions(actions, store, middlewares) {
  const produce = [...middlewares, updateMiddleware]
    .reverse()
    .reduce((next, mw) => mw(store)(next), immer);

  return Object.keys(actions).reduce((acc, k) => {
    acc[k] = (...args) => actions[k](...args)(produce, store.getState);
    return acc;
  }, {});
}
