import immer from "immer";

export function createState(initialState, key) {
  let listeners = [];
  let currentState = initialState;
  return {
    key,
    get() {
      return currentState;
    },
    set(nextState) {
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

const updateMiddleware = target => getState => next => fn => {
  const state = getState();
  const nextState = next(state, fn);
  if (nextState !== state) {
    target.set(nextState);
  }
};

export function bindActions(actions, store, middlewares) {
  const getState = () => store.get();
  const produce = [...middlewares, updateMiddleware(store)]
    .reverse()
    .reduce((next, mw) => {
      return mw(getState)(next);
    }, immer);

  return Object.keys(actions).reduce((acc, k) => {
    acc[k] = (...args) => actions[k](...args)(produce, getState);
    return acc;
  }, {});
}
