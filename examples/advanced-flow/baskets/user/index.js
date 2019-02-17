// @flow

import { createComponents, createSelectorComponent } from 'react-adone';
import type { State } from './types';

import * as actions from './actions';
import * as selectors from './selectors';

type Actions = typeof actions;
type ContainerProps = {||};

const initialState: State = {
  selected: null,
  data: null,
  loading: false,
};

export const {
  Container: UserContainer,
  Subscriber: UserSubscriber,
} = createComponents<State, Actions, ContainerProps>({
  initialState,
  actions,
  onContainerInit: actions.load,
});

export const UserSelectedSubscriber = createSelectorComponent<
  $Call<typeof selectors.getSelected, State>,
  Actions
>(UserSubscriber, selectors.getSelected);
