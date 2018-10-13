/* eslint-env jest */

import React from 'react';
import { mount } from 'enzyme';

import { basketMock } from './mocks';
import createYield from '../create-yield';

describe('createYield', () => {
  it('should return a Yield component', () => {
    const Comp = createYield(basketMock);
    const wrapper = mount(<Comp>{() => null}</Comp>);
    expect(wrapper.name()).toEqual('Yield(basket-key)');
    expect(wrapper.props()).toEqual({
      from: basketMock,
      pick: undefined,
      children: expect.any(Function),
    });
  });

  it('should return a named Yield component', () => {
    const Comp = createYield('MyYield', basketMock);
    const wrapper = mount(<Comp>{() => null}</Comp>);
    expect(wrapper.name()).toEqual('MyYield');
  });

  it('should return a Yield component with pick', () => {
    const selectorMock = jest.fn();
    const Comp = createYield(basketMock, selectorMock);
    const wrapper = mount(<Comp>{() => null}</Comp>);
    expect(wrapper.props()).toEqual({
      from: basketMock,
      pick: selectorMock,
      children: expect.any(Function),
    });
  });
});
