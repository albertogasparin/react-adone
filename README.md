# React Adone

[![npm](https://img.shields.io/npm/v/react-adone.svg?maxAge=2592000)](https://www.npmjs.com/package/react-adone)
[![License](https://img.shields.io/:license-mit-blue.svg)](http://albertogasparin.mit-license.org)
[![CircleCI](https://circleci.com/gh/albertogasparin/react-adone.svg?style=shield&circle-token=17a5f372d198e27098226779bc1afd8fd6a2fb3a)](https://circleci.com/gh/albertogasparin/react-adone)
[![Dependency Status](https://david-dm.org/albertogasparin/react-adone.svg)](https://david-dm.org/albertogasparin/react-adone)
[![devDependency Status](https://david-dm.org/albertogasparin/react-adone/dev-status.svg)](https://david-dm.org/albertogasparin/react-adone#info=devDependencies)

Yes, this is another Redux-like/Context-alternative solution. Probably you better off using more well known libs unless:

- You don't want to create hundreds of Contexts to share pieces of state
- You have a huge app and a single Redux store is not possible
- Your tree is already deep enought and Context will make things even worse
- You have high performance requirements (Adone uses some tricks to avoid duplicate renders and uses the Context API just on first render because it is [a bit slower](https://github.com/facebook/react/issues/13739) than a subscription based store)
- You want your app still working even if you omit the Provider
- You still want to use Redux Devtools (because it's handy!)

## Philosophy

Adone is heavily inspired by Redux, the main difference is the lack of reducers. Store name, actions, default state and selectors are combined in a single entity called Basket. `Yield` is the React component that "yields" from a Basket and returns it's store state (or part of it) and the actions already bound to it.

The basket is just an object and `Yield` is responsible to get the instantiated store (using the `key` attribute) or creating a new one. That makes sharing Baskets across you project extremely cheap.

Similar to Redux, actions receive a `produce` function (read dispatcher) that gets called with mutator that receives a draft state that can either be modified directly or replaced by returning a new one.

## Basic usage

#### Defining a basket and using `Yield` consumer and provider

```js
// baskets/counter.js
const defaultState = {
  count: 0,
};

const actions = {
  increment: () => produce => {
    // produce() calls immer after passing through middlewares
    // the mutation function should return undefined or the entire new state
    produce(draft => {
      draft.count += 1;
    });
  },
};

export default { key: 'counter', defaultState, actions };
```

```js
// app.js
import { YieldProvider, Yield } from 'react-adone';
import counterBasket from './baskets/counter';

const App = () => (
  <YieldProvider>
    <h1>My counter</h1>
    <Yield from={counterBasket}>
      {/* The basket actions and store state get spread for easy consumption */}
      {({ count, increment }) => (
        <div>
          {count}
          <button onClick={increment}>+</button>
        </div>
      )}
    </Yield>
  </YieldProvider>
);
```

## Running examples

I provided few examples to see Adone in action. Run `npm run start` and then go and check each folder:

- Advanced async example with Flow typing `http://localhost:8080/advanced-flow/`

## Advanced usage

#### Basket async actions

```js
// baskets/todo.js
const defaultState = {
  data: null,
  loading: false,
};

const actions = {
  // the mutator function cannot be async
  // but the thunk returned by the action sure can
  load: () => async (produce, getState) => {
    if (getState().loading === true) return;
    produce(function setLoading(draft) {
      draft.loading = true;
    });

    const todos = await fetch('/todos').then(r => r.json());
    produce(function setData(draft) {
      draft.loading = false;
      draft.data = todos;
    });
  },
};

export default { key: 'todo', defaultState, actions };
```

Look at `./examples` folder for more.

#### Middlewares

Adone supports Redux-like middlewares. They can be added via `defaults.middlewares`.

```js
import { defaults } from 'react-adone';

const logger = store => next => fn => {
  console.log('Updating', store.key);
  const result = next(fn);
  console.log('Changed', result.changes);
  return result;
};

defaults.middlewares.add(logger);
```

#### Devtools

If you have [Redux Devtools extension](https://github.com/zalmoxisus/redux-devtools-extension) installed, Adone action's mutators and state will be visible there.
If you use arrow functions as mutators, the devtools will show just the action name, but if you use named functions you will get also the mutator's name (really handy when an action produces multiple mutations):

```js
const actions = {
  increment: () => produce => {
    // this will be logged as "increment"
    produce(draft => {
      draft.count += 1;
    });
    // this will be logged as "increment.addOne"
    produce(function addOne(draft) {
      draft.count += 1;
    });
  },
};
```

If you want to turn devtools off (for instance on prod), just set the `defaults.devtools` to `false`:

```js
import { defaults } from 'react-adone';
defaults.devtools = false;
```

#### Basket state rehydration

If you server side render your content, you might wanto to rehydrate your baskets state with the correct data.
`YieldProvider` (and `fallbackProviderState`) supports `initialStates` prop where you can define baskets initial status by key.

```js
// app.js
import { YieldProvider, Yield } from 'react-adone';
import counterBasket from './baskets/counter';

const initialStates = { counter: { count: 10 } };

const App = () => (
  <YieldProvider initialStates={initialStates}>
    <Yield from={counterBasket}>
      {({ count }) => (
        <p>{count}</p>
        {/* Count will now be 10 instead of the default 0 */}
      )}
    </Yield>
  </YieldProvider>
);
```

## Optimisations

#### Basket selectors

`Yield` `pick` prop allows you to provide a selector, making the render prop function get called only when the returned value of the selector changes.

```js
// baskets/todo.js
// ...
export const selectors = {
  getTodosCount: state => ({ todosCount: state.todos.length }),
};
```

```js
// todos-count.js
import { Yield } from 'react-adone';
import todoBasket, { selectors } from './baskets/todo';

export const TodosCount = () => (
  <Yield from={todoBasket} pick={selectors.getTodosCount}>
    {/* render prop is called only on todosCount change */}
    {({ todosCount }) => <p>You have {todosCount} todos</p>}
  </Yield>
);
```

A useful value of `pick` is `null`: when so, `Yield` children will not re-render on store state change
(but will if parent re-renders, as Adone is **not** using `PureComponent` nor `shouldComponentUpdate`)

```js
// button-increment.js
import { Yield } from 'react-adone';
import counterBasket from './baskets/counter';

export const ButtonIncrement = () => (
  <Yield from={counterBasket} pick={null}>
    {({ actions }) => <button onClick={actions.increment}>+</button>}
  </Yield>
);
```

#### Named components

Adone exports an helper function to create yielded components from a specific basket
so you don't have to specify a basket and a pick function

```js
// todo-components.js
import { createYield } from 'react-adone';
import todoBasket, { selectors } from './baskets/todo';

export const TodoYield = createYield('TodoYield', todoBasket);
export const TodosCountYield = createYield(
  'TodosCountYield',
  todoBasket,
  selectors.getTodosCount
);
// and they can be used as:
// <TodoYield>{({ ... }) => ... }<TodoYield>
// <TodosCountYield>{({ ... }) => ... }<TodosCountYield>
```

#### Composition

Adone supports render props composition via 3rd party libs:

```js
import Composer from "react-composer";
// ...

const UserProject = () => (
  <Composer
    components={[
      <Yield from={userBasket} />,
      <Yield from={projectBasket} />
    ]}
  >
    {([user, project]) => (
      /* here you can have a component that triggers user.load()
         and when user data is returned calls project.load(user.data.id) */
    )}
  </Composer>
);
```

## Contributing

To test your changes you can run the examples (with `npm run start`).
Also, make sure you run `npm run preversion` before creating you PR so you will double check that linting, types and tests are fine.
