// @flow

import type { BasketAction } from 'react-adone';

export type State = {
  data: any[] | null,
  loading: boolean,
};

const defaultState: State = {
  data: null,
  loading: false,
};

const TODOS = {
  '1': [{ title: 'Buy veggies' }, { title: 'Wash bicycle' }],
  '2': [{ title: 'Do the dishes' }],
};

const actions = {
  load: (uid: string): BasketAction<State> => async produce => {
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
  },
};

const basket = {
  key: 'todos',
  defaultState,
  actions,
};

export default basket;
