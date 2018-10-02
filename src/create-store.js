// @flow

import type { BasketStore } from './types';

export default function createStore<T>(
  initialState: T,
  key: string
): BasketStore<T> {
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
    },
  };
}
