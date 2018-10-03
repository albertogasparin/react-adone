// @flow
/* eslint-env jest */

import { storeMock } from './mocks';
import combineMiddlewares from '../middlewares';

describe('combineMiddlewares', () => {
  it('should always build update middleware', () => {
    const mutation = jest.fn();
    const combinedMw = combineMiddlewares(storeMock, []);
    combinedMw(mutation);
    expect(mutation).toHaveBeenCalled();
  });

  it('should build combined middlewares', () => {
    const mutation = jest.fn();
    const middlewareSpy = jest.fn();
    const middleware = store => next => fn => {
      const result = next(fn);
      middlewareSpy(store, next, fn, result);
      return result;
    };

    const combinedMw = combineMiddlewares(storeMock, [middleware]);
    combinedMw(mutation);
    expect(middlewareSpy).toHaveBeenCalledWith(
      storeMock,
      expect.any(Function),
      mutation,
      { changes: [] }
    );
  });
});
