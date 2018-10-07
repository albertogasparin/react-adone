// @flow
/* eslint-env jest */

import type { Basket, BasketStore } from '../types';

export const basketMock: Basket<{}> = {
  key: 'basket.key',
  defaultState: { count: 0 },
  actions: {
    increase: jest.fn(),
    decrease: jest.fn(),
  },
};

export const storeMock: BasketStore<{}> = {
  key: basketMock.key,
  getState: jest.fn(),
  setState: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
  produce: jest.fn(),
};
