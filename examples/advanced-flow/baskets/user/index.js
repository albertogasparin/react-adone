// @flow

import { createYield } from 'react-adone';
import type { State } from './types';

import * as actions from './actions';
import * as selectors from './selectors';

const defaultState: State = {
  selected: null,
  data: null,
  loading: false,
};

const basket = {
  key: 'users',
  defaultState,
  actions,
};

// You can even export ready-to-use components
export const UserState = createYield('UserState', basket);
export const UserSelectedState = createYield(
  'UserSelectedState',
  basket,
  selectors.getSelected
);

export default basket;
