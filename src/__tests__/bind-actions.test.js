// @flow
/* eslint-env jest */

import { basketMock, storeMock } from './mocks';
import bindActions from '../bind-actions';
import combineMiddlewares from '../middlewares';

jest.mock('../middlewares');

describe('bindActions', () => {
  it('should return all actions bound', () => {
    const result = bindActions(basketMock.actions, storeMock, []);
    expect(result).toEqual({
      increase: expect.any(Function),
      decrease: expect.any(Function),
    });
  });

  it('should bound actions providing produce and getState', () => {
    const action2 = jest.fn();
    const produce = jest.fn();
    basketMock.actions.increase.mockReturnValue(action2);
    // $FlowFixMe
    combineMiddlewares.mockReturnValue(produce);
    const result = bindActions(basketMock.actions, storeMock, []);
    result.increase(1);
    expect(basketMock.actions.increase).toHaveBeenCalledWith(1);
    expect(action2).toHaveBeenCalledWith(
      expect.any(Function),
      storeMock.getState
    );
  });
});
