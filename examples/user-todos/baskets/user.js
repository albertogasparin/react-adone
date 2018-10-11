// @flow

import type { BasketAction } from 'react-adone';

export type State = {
  selected: string | null,
  data: any[] | null,
  loading: boolean,
};

export const key = 'users';

const defaultState: State = {
  selected: null,
  data: null,
  loading: false,
};

const USERS = [{ id: '1', name: 'Bob' }, { id: '2', name: 'Paul' }];

export const actions = {
  load: (): BasketAction<State> => async (produce, getState) => {
    if (getState().loading) return;
    produce(function setLoading(draft) {
      draft.loading = true;
    });
    // simulate async call
    await new Promise(r => setTimeout(r, 1000));
    produce(function setData(draft) {
      draft.loading = false;
      draft.data = USERS;
    });
  },

  select: (uid: string): BasketAction<State> => produce => {
    produce(draft => {
      draft.selected = uid;
    });
  },
};

export const selectors = {
  getSelected: (state: State) => ({ selected: state.selected }),
};

export default {
  key: 'todos',
  defaultState,
  actions,
  selectors,
};
