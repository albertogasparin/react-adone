# React Adone

## Basic usage

#### Defining a basket and using `Yield` consumer and provider

```js
// baskets/counter.js
export const key = "counter";

export const defaultState = {
  data: {
    count: 0,
  },
};

export const actions = {
  increment: () => (dispatch) => {
    dispatch(draft => { draft.data.count += 1 });
  }
}
```

```js
// app.js
import { YieldProvider, Yield } from 'react-adone';
import * as counterBasket from './baskets/counter';

const App = () => (
  <YieldProvider>
    <h1>My counter</h1>
    <Yield from={counterBasket}>
      {({ data }, actions) => (
        <div>
          {data.count}
          <button onClick={actions.increment}>+</button>
        </div>
      )}
    </Yield>
  </YieldProvider>
)
```

## Advanced usage

#### Basket async actions (thunks)

```js
// baskets/todos.js
// ...
export const actions = {
  load: () => async (dispatch, getState) => {
    if (getState().loading === true) return;
    dispatch(draft => {
      draft.loading = true;
    });
    
    const todos = await fetch('/todos').then(r => r.json());
    dispatch(draft => {
      draft.loading = false;
      draft.error = null;
      draft.data.todos = todos;
    });
  }
};
```

```js
// todos-list.js
import { Yield } from 'react-adone';
import * as todosBasket from './baskets/todos';

class TodosList extends Component {
  componentDidMount() {
    this.props.onLoad();
  }
  render() {
    return this.props.todos.map(t => <Todo {...t} />)
  }
}

export const YieldTodosList = () => (
  <Yield from={todosBasket}>
    {({ data }, actions) => (
      <TodosList todos={data.todos} onLoad={actions.load} />
    )}
  </Yield>
);
```

## Optimisations

#### Basket selectors

```js
// baskets/todos.js
// ...
export const selectors = {
  getTodosCount: state => ({ data: state.data.todos.length })
};
```

```js
// todos-count.js
import { Yield } from 'react-adone';
import * as todosBasket from './baskets/todos';

export const TodosCount = () => (
  <Yield from={todosBasket} pick={todosBasket.selectors.getTodosCount}>
    {({ data }) => (
      <p>You have {data} todos</p>
    )}
  </Yield>
);
```

#### Actions only consumers

```js
// button-increment.js
import { Yield } from 'react-adone';
import * as counterBasket from './baskets/counter';

export const ButtonIncrement = () => (
  <Yield from={counterBasket} pick={null}>
    {(__, actions) => (
      <button onClick={actions.increment}>+</button>
    )}
  </Yield>
);
```


