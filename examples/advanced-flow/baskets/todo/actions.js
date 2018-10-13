// @flow

import { type BasketAction } from 'react-adone';
import type { TodoModel, State } from './types';

// Dummy data
const TODOS: { [id: string]: TodoModel[] } = {
  '1': [{ title: 'Buy veggies' }, { title: 'Wash bicycle' }],
  '2': [{ title: 'Do the dishes' }],
};

export const load = (uid: string): BasketAction<State> => async produce => {
  produce(function setLoading(draft) {
    draft.loading = true;
    draft.data = null; // reset
  });
  // simulate async call
  await new Promise(r => setTimeout(r, 1000));
  produce(function setData(draft: State) {
    draft.loading = false;
    draft.data = TODOS[uid];
  });
};
