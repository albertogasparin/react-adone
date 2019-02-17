## Creating selector components

Adone allows you to create components that update only when a specific part of the state changes.

```js
// todos-count.js
import { createSelector } from 'react-adone';
import { TodoSubscriber } from './components/todo';

const getTodosCount = state => ({ todosCount: state.todos.length }),

const TodoCountSubscriber = createSelector(
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
import { createSelector } from 'react-adone';
import { TodoSubscriber } from './components/todo';

const getTodosByStatus = (state, props) => ({ todos: state.todos.filter(t => t.status === props.status) });

const TodosSubscriber = createSelector(TodoSubscriber, getTodosCount)

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
import { createSelector } from 'react-adone';
import { CounterSubscriber } from './components/counter';

const CounterActions = createSelector(
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
