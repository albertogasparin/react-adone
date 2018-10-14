/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';

import { basketMock } from './mocks';
import YieldProvider from '../yield-provider';

import initBasket from '../init-basket';

jest.mock('../init-basket');

describe('YieldProvider', () => {
  describe('render', () => {
    it('should render context provider with value prop and children', () => {
      const children = <div />;
      const wrapper = shallow(<YieldProvider>{children}</YieldProvider>);
      expect(wrapper.name()).toEqual('ContextProvider');
      expect(wrapper.props()).toEqual({
        children,
        value: {
          initBasket: expect.any(Function),
          baskets: {},
        },
      });
    });
  });

  describe('initBasket', () => {
    it('should add basket to state', () => {
      const children = <div />;
      const instance = shallow(
        <YieldProvider>{children}</YieldProvider>
      ).instance();
      instance.initBasket(basketMock);
      expect(initBasket).toHaveBeenCalledWith(basketMock);
      expect(instance.state.baskets).toHaveProperty(basketMock.key);
    });
  });
});
