/* eslint-env jest */

import React, { Fragment } from 'react';
import { mount } from 'enzyme';

import { createStore, defaultRegistry } from '../../store';
import { createContainer, createSubscriber } from '../creators';

const Store = createStore({
  initialState: { todos: [], loading: false },
  actions: {
    add: todo => ({ setState, getState }) =>
      setState({ todos: [...getState().todos, todo] }),
    load: () => async ({ setState, getState }) => {
      if (getState().loading) return;
      setState({ loading: true });
      await Promise.resolve();
      setState({ todos: ['todo1'], loading: false });
    },
  },
});

const expectActions = {
  add: expect.any(Function),
  load: expect.any(Function),
};

describe('Integration', () => {
  beforeEach(() => {
    defaultRegistry.stores.clear();
  });

  it('should get closer storeState with scope id if matching', () => {
    const Container = createContainer(Store);
    const Subscriber = createSubscriber(Store);
    const children1 = jest.fn((s, a) => {
      s.todos.length || a.add('todo2');
      return null;
    });
    const children2 = jest.fn(() => null);
    const OtherStore = createStore({
      initialState: {},
      actions: {},
    });
    const OtherContainer = createContainer(OtherStore);
    mount(
      <Container scope="s1">
        <Subscriber>{children1}</Subscriber>
        <Container scope="s2">
          <OtherContainer scope="s3">
            <OtherContainer>
              <Subscriber>{children2}</Subscriber>
            </OtherContainer>
          </OtherContainer>
        </Container>
      </Container>
    );
    expect(children1).toHaveBeenCalledTimes(2);
    expect(children1).toHaveBeenCalledWith(
      { todos: ['todo2'], loading: false },
      expect.any(Object)
    );

    expect(children2).toHaveBeenCalledTimes(1);
    expect(children2).toHaveBeenCalledWith(
      { todos: [], loading: false },
      expectActions
    );
  });

  it('should share scoped state across multiple subscribers', async () => {
    const Container = createContainer(Store, {
      onInit: () => ({ actions }) => actions.load(),
    });
    const Subscriber = createSubscriber(Store);

    const children1 = jest.fn(() => null);
    const children2 = jest.fn(() => null);

    mount(
      <Fragment>
        <Container scope="s1">
          <Subscriber>{children1}</Subscriber>
        </Container>
        <Container scope="s1">
          <Subscriber>{children2}</Subscriber>
        </Container>
      </Fragment>
    );

    await Promise.resolve();

    expect(children1.mock.calls[0]).toEqual([
      { loading: true, todos: [] },
      expectActions,
    ]);
    expect(children1.mock.calls[1]).toEqual([
      { loading: false, todos: ['todo1'] },
      expectActions,
    ]);

    expect(children2.mock.calls[0]).toEqual([
      { loading: true, todos: [] },
      expectActions,
    ]);
    expect(children2.mock.calls[1]).toEqual([
      { loading: false, todos: ['todo1'] },
      expectActions,
    ]);
  });
});
