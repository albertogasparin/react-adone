/* eslint-env jest */

import React, { Component } from 'react';
import { shallow, mount } from 'enzyme';

import { basketMock, storeMock } from './mocks';
import { Yield, YieldProvider, fallbackProviderState } from '../yield';
import createStore from '../create-store';

jest.mock('../create-store');

describe('Yield', () => {
  const fbProviderState = { ...fallbackProviderState };
  const addBasket = jest.fn();
  const children = jest.fn().mockReturnValue(null);

  const modes = {
    withProvider: (baskets = {}) => {
      class YieldProviderMock extends YieldProvider {
        state = { baskets, middlewares: [], addBasket };
      }
      const getElement = () => (
        <YieldProviderMock>
          <Yield from={basketMock}>{children}</Yield>
        </YieldProviderMock>
      );
      const getShallow = () =>
        shallow(getElement())
          .childAt(0)
          .shallow();
      const getMount = () => mount(getElement()).childAt(0);
      return { getElement, getShallow, getMount, addBasket, baskets, children };
    },
    withoutProvider: (baskets = {}) => {
      fallbackProviderState.baskets = baskets;
      fallbackProviderState.addBasket = addBasket;
      const getElement = () => <Yield from={basketMock}>{children}</Yield>;
      const getShallow = () => shallow(getElement());
      const getMount = () => mount(getElement());
      return { getElement, getShallow, getMount, addBasket, baskets, children };
    },
  };

  Object.keys(modes).forEach(key => {
    const setup = modes[key];
    describe(key, () => {
      beforeEach(() => {
        // $FlowFixMe
        createStore.mockReturnValue(storeMock);
        storeMock.getState.mockReturnValue(basketMock.defaultState);
      });

      afterAll(() => {
        Object.assign(fallbackProviderState, fbProviderState);
      });

      it('should render context consumer and not children', () => {
        const { getShallow, children } = setup();
        const wrapper = getShallow();
        expect(wrapper.name()).toEqual('ContextConsumer');
        expect(children).not.toHaveBeenCalled();
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

      it('should save basket instance locally and listen', () => {
        const { getMount } = setup();
        const instance = getMount().instance();
        expect(instance.basket).toEqual({
          actions: expect.any(Object),
          store: storeMock,
        });
        expect(storeMock.subscribe).toHaveBeenCalledWith(instance.onUpdate);
      });

      it('should render children once', () => {
        const { getMount, children } = setup();
        getMount();
        expect(children).toHaveBeenCalledTimes(1);
        expect(children).toHaveBeenCalledWith({
          count: 0,
          increase: expect.any(Function),
          decrease: expect.any(Function),
        });
      });

      it('should update when store calls update listener', () => {
        const { getMount } = setup();
        const instance = getMount().instance();
        instance.forceUpdate = jest.fn();
        storeMock.getState.mockReturnValue({ count: 1 });
        instance.onUpdate();
        expect(instance.state).toEqual({ count: 1 });
        expect(instance.forceUpdate).toHaveBeenCalled();
      });

      it('should avoid re-render children just rendered from parent update', () => {
        const { getElement, children } = setup();
        class App extends Component<{}> {
          render() {
            return getElement();
          }
        }
        const wrapper = mount(<App />);
        // simulate store change -> parent re-render -> yield listener update
        storeMock.getState.mockReturnValue({ count: 1 });
        wrapper.setProps({ foo: 1 });
        wrapper
          .find(Yield)
          .instance()
          .onUpdate();

        expect(storeMock.getState).toHaveBeenCalledTimes(4);
        expect(children).toHaveBeenCalledTimes(2);
        expect(children).toHaveBeenLastCalledWith({
          count: 1,
          increase: expect.any(Function),
          decrease: expect.any(Function),
        });
      });

      it('should remove listener from store on unmount', () => {
        const { getMount } = setup();
        const unsubscribeMock = jest.fn();
        storeMock.subscribe.mockReturnValue(unsubscribeMock);
        const instance = getMount().instance();
        expect(instance.unsubscribeStore).toEqual(unsubscribeMock);
        instance.componentWillUnmount();
        expect(unsubscribeMock).toHaveBeenCalled();
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
