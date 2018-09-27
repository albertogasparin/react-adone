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

export function updateState(target, updater) {
  let currState = target.get();
  let nextState = immer(currState, updater);
  if (nextState !== currState) target.set(nextState);
}

export function bindActions(actions, store) {
  const getState = () => store.get();
  const mutate = fn => updateState(store, fn);
  return Object.keys(actions).reduce((acc, k) => {
    acc[k] = (...args) => actions[k](...args)(mutate, getState);
    return acc;
  }, {});
}
