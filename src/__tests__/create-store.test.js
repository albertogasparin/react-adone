// @flow
/* eslint-env jest */

import { basketMock } from './mocks';
import createStore from '../create-store';

describe('createStore', () => {
  it('should return a store object', () => {
    const store = createStore(basketMock.defaultState, basketMock.key);
    expect(store).toEqual({
      key: basketMock.key,
      getState: expect.any(Function),
      setState: expect.any(Function),
      on: expect.any(Function),
      off: expect.any(Function),
    });
  });

  describe('getState()', () => {
    it('should return current state', () => {
      const store = createStore(basketMock.defaultState, basketMock.key);
      expect(store.getState()).toBe(basketMock.defaultState);
    });
  });

  describe('setState()', () => {
    it('should replace current state', () => {
      const store = createStore(basketMock.defaultState, basketMock.key);
      const newState = { count: 1 };
      store.setState(newState);
      expect(store.getState()).toBe(newState);
    });

    it('should notify listeners', () => {
      const store = createStore(basketMock.defaultState, basketMock.key);
      const newState = { count: 1 };
      const listener = jest.fn();
      store.on(listener);
      store.setState(newState);
      expect(listener).toHaveBeenCalled();
    });
  });

  describe('off()', () => {
    it('should remove listener', () => {
      const store = createStore(basketMock.defaultState, basketMock.key);
      const newState = { count: 1 };
      const listener = jest.fn();
      store.on(listener);
      store.off(listener);
      store.setState(newState);
      expect(listener).not.toHaveBeenCalled();
    });
  });
});
