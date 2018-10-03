// @flow
/* eslint-env jest */

import React from 'react';
import { shallow, mount } from 'enzyme';

import { basketMock, storeMock } from './mocks';
import { Yield, YieldProvider, fallbackProviderState } from '../yield';

describe('Yield', () => {
  const fbProviderState = { ...fallbackProviderState };
  const addBasket = jest.fn();
  const children = jest.fn().mockReturnValue(null);

  const modes = {
    withProvider: (baskets = {}) => {
      class YieldProviderMock extends YieldProvider {
        state = { baskets, middlewares: [], addBasket };
      }
      const Wrapper = (
        <YieldProviderMock>
          <Yield from={basketMock}>{children}</Yield>
        </YieldProviderMock>
      );
      const getShallow = () =>
        shallow(Wrapper)
          .childAt(0)
          .shallow();
      const getMount = () => mount(Wrapper).childAt(0);
      return { Wrapper, getShallow, getMount, addBasket, baskets, children };
    },
    withoutProvider: (baskets = {}) => {
      fallbackProviderState.baskets = baskets;
      fallbackProviderState.addBasket = addBasket;
      const Wrapper = <Yield from={basketMock}>{children}</Yield>;
      const getShallow = () => shallow(Wrapper);
      const getMount = () => mount(Wrapper);
      return { Wrapper, getShallow, getMount, addBasket, baskets, children };
    },
  };

  afterAll(() => {
    Object.assign(fallbackProviderState, fbProviderState);
  });

  Object.keys(modes).forEach(key => {
    const setup = modes[key];
    describe(key, () => {
      it('should render context consumer', () => {
        const { getShallow } = setup();
        const wrapper = getShallow();
        expect(wrapper.name()).toEqual('ContextConsumer');
      });

      it('should create a basket if first time', () => {
        const { getMount, addBasket } = setup();
        getMount();
        expect(addBasket).toHaveBeenCalledWith(basketMock.key, {
          store: expect.any(Object),
          actions: expect.any(Object),
        });
      });

      it('should get the basket instance if any', () => {
        const { getMount, addBasket } = setup({
          [basketMock.key]: { store: storeMock, actions: {} },
        });
        getMount();
        expect(addBasket).not.toHaveBeenCalled();
      });

      it('should save basket instance locally', () => {
        const { getMount } = setup();
        const instance = getMount().instance();
        expect(instance.basket).toEqual({
          actions: expect.any(Object),
          store: expect.any(Object),
        });
      });

      it('should render children', () => {
        const { getMount, children } = setup();
        getMount();
        expect(children).toHaveBeenCalledWith({
          count: 0,
          increase: expect.any(Function),
          decrease: expect.any(Function),
        });
      });
    });
  });
});

describe('YieldProvider', () => {
  describe('render', () => {
    it('should render context provider with value prop and children', () => {
      const children = jest.fn();
      const wrapper = shallow(<YieldProvider>{children}</YieldProvider>);
      expect(wrapper.name()).toEqual('ContextProvider');
      expect(wrapper.props()).toEqual({
        children,
        value: {
          addBasket: expect.any(Function),
          baskets: {},
          middlewares: [],
        },
      });
    });
  });

  describe('addBasket', () => {
    it('should add basket to state', () => {
      const children = jest.fn();
      const yieldBasket = { store: storeMock, actions: {} };
      const instance = shallow(
        <YieldProvider>{children}</YieldProvider>
      ).instance();
      instance.addBasket(basketMock.key, yieldBasket);
      expect(instance.state.baskets).toEqual({
        [basketMock.key]: yieldBasket,
      });
    });
  });
});
