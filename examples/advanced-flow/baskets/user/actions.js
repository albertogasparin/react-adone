// @flow
import { type BasketAction } from 'react-adone';
import type { UserModel, State } from './types';

// Dummy data
const USERS: UserModel[] = [
  { id: '1', name: 'Bob' },
  { id: '2', name: 'Paul' },
];

export const load = (): BasketAction<State> => async (produce, getState) => {
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
};

export const select = (uid: string): BasketAction<State> => produce => {
  produce(draft => {
    draft.selected = uid;
  });
};
