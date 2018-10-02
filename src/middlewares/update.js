// @flow

import type { Middleware } from '../types';

const updateMiddleware: Middleware = store => next => fn => {
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

export default updateMiddleware;
