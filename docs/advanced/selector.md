## Creating selector components

Adone allows you to create components that return a specific (or manipulated) part of the state, and they recompute only when state (or props) change.

```js
// todos-count.js
import { createSelectorComponent } from 'react-adone';
import { TodoSubscriber } from './components/todo';

const getTodosCount = state => ({ todosCount: state.todos.length }),

const TodoCountSubscriber = createSelectorComponent(
  TodoSubscriber, // subscriber to create selector from
  getTodosCount,  // selector function
  'TodoCountSubscriber' // optional selector component name
)

export const TodosCount = () => (
  <TodoCountSubscriber>
    {/* render prop is called only on todosCount change */}
    {({ todosCount }) => <p>You have {todosCount} todos</p>}
  </TodoCountSubscriber>
);
```

If you want to pass props to the selector, just add props to the selector subscriber and they will be the second argument of the selector:

```js
// button-increment.js
import { createSelectorComponent } from 'react-adone';
import { TodoSubscriber } from './components/todo';

const getTodosByStatus = (state, props) => ({ todos: state.todos.filter(t => t.status === props.status) });

const TodosSubscriber = createSelectorComponent(TodoSubscriber, getTodosCount)

export const TodoList = ({ status }) => (
  <TodosSubscriber status={status}>
    {({ todos }) => /* render... */}
  </Yield>
);
```

A useful value for the selector is `null`: when so, `Subscriber` will not re-render on any store state change
(but will if parent re-renders, as Adone is **not** using `PureComponent` nor `shouldComponentUpdate`).
So `null` is useful when children just have to trigger actions:

```js
// button-increment.js
import { createSelectorComponent } from 'react-adone';
import { CounterSubscriber } from './components/counter';

const CounterActions = createSelectorComponent(
  CounterSubscriber,
  null,
  'CounterActions'
);

export const ButtonIncrement = () => (
  <CounterActions>
    {({ actions }) => <button onClick={actions.increment}>+</button>}
  </CounterActions>
);
```

#### createSelectorComponent and createSelector

In case you want to re-render your component only when a specific part of the state changes, you can enhance your selector with [reselect](https://github.com/reduxjs/reselect) `createSelector`

```js
import { createSelector } from 'reselect';
import { TodoSubscriber } from './components/todo';

const getFilteredTodos = createSelector(
  state => state.data.todos,
  state => state.statusFilter,
  (todos, status) => todos.filter(t => t.status === status)
);

const FilteredTodosSubscriber = createSelectorComponent(
  TodoSubscriber,
  getFilteredTodos
);
```

With the above code, if other attributes on the state do change (eg: `state.loading`), `FilteredTodosSubscriber` will not re-render
