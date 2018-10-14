// @flow
/* eslint-disable no-unused-vars, react/display-name */
import React from 'react';
import {
  Yield,
  YieldProvider,
  createYield,
  type BasketAction,
  type Basket,
} from '..';

/**
 * Basket types tests
 */
type State = {| count: number |};

let Test;
let TypeYield;
let basket: Basket<State, typeof actions>;

const actions = {
  increment: (n: number): BasketAction<State> => (produce, getState) => {
    // Produce tests
    // $ExpectError Produce should return state or undefined
    produce(() => '');

    produce(draft => {
      // $ExpectError Draft should be of type State
      draft.foo = 1;
    });

    // GetState tests
    const state = getState();
    // $ExpectError State should not be considered writable
    state.count = 1;
  },
};

// $ExpectError Basket should have key of type string
basket = { key: 1, defaultState: { count: 0 }, actions };

// $ExpectError Basket should have defaultState of type state
basket = { key: 'bla', defaultState: { bla: 0 }, actions };

// $ExpectError Basket should have defaultState of type state
basket = { key: 'bla', defaultState: { count: 0 } };

// $ExpectError Basket should have actions
basket = { key: 'bla', defaultState: { count: 0 } };

// Correct
basket = { key: 'bla', defaultState: { count: 0 }, actions };

/**
 * Yield component types tests
 */
Test = (
  // $ExpectError children should be a function
  <Yield>Wrong</Yield>
);

Test = (
  // $ExpectError should have "from" prop
  <Yield>{args => null}</Yield>
);

Test = (
  // $ExpectError from should be a valid basket
  <Yield from={{ key: '', defaultState: {}, actions: null }}>
    {args => null}
  </Yield>
);

Test = (
  // $ExpectError Child arg shape should be state + actions
  <Yield from={basket}>{({ foo }) => foo}</Yield>
);

Test = (
  // $ExpectError Basket actions should be correcly typed
  <Yield from={basket}>{({ increment }) => increment()}</Yield>
);

// Correct
Test = <Yield from={basket}>{({ count }) => count + 0}</Yield>;
Test = <Yield from={basket}>{({ increment }) => increment(1)}</Yield>;
Test = (
  <Yield from={basket} pick={() => ({ baz: 1 })}>
    {({ baz }) => baz}
  </Yield>
);

/**
 * createYield types tests
 */
TypeYield = createYield('TypeYield', basket);

Test = (
  // $ExpectError Child arg shape should be state + actions
  <TypeYield>{({ foo }) => foo}</TypeYield>
);

Test = (
  // $ExpectError Basket actions should be correcly typed
  <TypeYield>{({ increment }) => increment()}</TypeYield>
);

// Correct
Test = <TypeYield>{({ count }) => count + 0}</TypeYield>;
Test = <TypeYield>{({ increment }) => increment(1)}</TypeYield>;

TypeYield = createYield(basket, () => ({ baz: 1 }));

Test = (
  // $ExpectError Child arg shape should be pick + actions
  <TypeYield>{({ count }) => count}</TypeYield>
);

// Correct
Test = <TypeYield>{({ baz }) => baz}</TypeYield>;
Test = <TypeYield>{({ increment }) => increment(1)}</TypeYield>;

/**
 * YieldProvider types tests
 */
Test = (
  // $ExpectError initialStates should be an object
  <YieldProvider initialStates={null}>bla</YieldProvider>
);

// Correct
Test = <YieldProvider initialStates={{ k: {} }}>bla</YieldProvider>;
