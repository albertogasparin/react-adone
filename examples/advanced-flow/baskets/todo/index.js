// @flow

import { createYield } from 'react-adone';
import type { State } from './types';

import * as actions from './actions';

const defaultState: State = {
  data: null,
  loading: false,
};

const basket = {
  key: 'todo',
  defaultState,
  actions,
};

// You can even export ready-to-use components
export const TodoState = createYield('TodoState', basket);

export default basket;
