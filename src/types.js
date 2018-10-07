// @flow

import { type Element } from 'react';

type ProduceFn<S> = S => void | S;
type SelectorFn<S, T> = S => T;

export type BasketStoreUnsubscribe = () => void;

export type BasketStore<S> = {|
  getState: () => S,
  setState: S => void,
  key: string,
  subscribe: (listener: () => void) => BasketStoreUnsubscribe,
  produce: ProduceFn<S>,
|};

export type BasketActions<S> = {
  [key: string]: (
    ...args: any
  ) => (produce: ProduceFn<S>, getState: () => S) => void,
};

export type Basket<S> = {
  key: string,
  defaultState: S,
  actions: BasketActions<S>,
  selectors?: { [key: string]: SelectorFn<S> },
};

export type Middleware = (store: BasketStore<{}>) => (next: *) => (fn: *) => *;

export type YieldState = {};

export type YieldProps = {
  from: Basket<{}>,
  children: (*) => Element<*> | null,
  pick: (*) => * | null,
};

export type YieldBasket<S> = {
  store: BasketStore<S>,
  actions: BasketActions<S>,
};

export type YieldProviderState = {
  baskets: { [key: string]: YieldBasket<{}> },
  middlewares: Middleware[],
  addBasket: (key: string, value: YieldBasket<{}>) => void,
};

export type YieldProviderProps = {
  middlewares: Middleware[],
  children: any,
};
