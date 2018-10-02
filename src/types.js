// @flow

import { type Element } from 'react';

export type BasketStore<S> = {
  getState: () => S,
  setState: S => void,
  key: string,
  on: (listener: () => void) => void,
  off: (listener: () => void) => void,
};

export type BasketActions<S> = {
  [key: string]: (
    ...args: any
  ) => (produce: (S) => void | S, getState: () => S) => void,
};

export type Basket<S> = {
  key: string,
  defaultState: S,
  actions: BasketActions<S>,
};

export type Middleware = (store: BasketStore<*>) => (next: *) => (fn: *) => *;

export type YieldState = {};

export type YieldProps = {
  from: Basket<*>,
  children: (*) => Element<*>[],
  pick: (*) => * | null,
};

export type YieldBasket<S> = {
  store: BasketStore<S>,
  actions: BasketActions<S>,
};

export type YieldProviderState = {
  baskets: { [key: string]: YieldBasket<*> },
  middlewares: Middleware[],
  addBasket: (key: string, value: YieldBasket<*>) => void,
};

export type YieldProviderProps = {
  middlewares: Middleware[],
  children: any,
};
