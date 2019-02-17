// @flow

import { createComponents } from 'react-adone';
import type { State } from './types';

import * as actions from './actions';

type Actions = typeof actions;
type ContainerProps = {| selectedUser: string | null |};

const initialState: State = {
  data: null,
  loading: false,
};

export const {
  Container: TodoContainer,
  Subscriber: TodoSubscriber,
} = createComponents<State, Actions, ContainerProps>({
  initialState,
  actions,
  onContainerUpdate: () => ({ dispatch }, { selectedUser }) => {
    if (selectedUser) dispatch(actions.load(selectedUser));
  },
});
