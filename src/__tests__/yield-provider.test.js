/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';

import YieldProvider from '../yield-provider';

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
          baskets: expect.any(Map),
        },
      });
    });
  });

  describe('state', () => {
    it('should have basket registry in state', () => {
      const children = <div />;
      const instance = shallow(
        <YieldProvider>{children}</YieldProvider>
      ).instance();
      expect(instance.registry).toBeDefined();
      expect(instance.state.baskets).toBe(instance.registry.baskets);
      expect(instance.state.initBasket).toBe(instance.registry.initBasket);
    });
  });
});
