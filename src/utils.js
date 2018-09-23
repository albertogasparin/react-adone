import immer from "immer";

export function createState(initialState) {
  let listeners = [];
  let currentState = initialState;
  return {
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
  return Object.keys(actions).reduce((acc, k) => {
    acc[k] = (...args) => {
      const getState = () => store.get();
      const dispatch = updateState.bind(null, store);
      return actions[k](...args)(dispatch, getState);
    };
    return acc;
  }, {});
}
