# React Adone

## Basic usage

#### Defining a basket and using `Yield` consumer and provider

```js
// baskets/counter.js
export const key = "counter";

export const defaultState = {
  count: 0,
};

export const actions = {
  increment: () => (produce) => {
    produce(draft => { draft.count += 1 });
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
      {({ count, increment }) => (
        <div>
          {count}
          <button onClick={increment}>+</button>
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
  load: () => async (produce, getState) => {
    if (getState().loading === true) return;
    produce(draft => {
      draft.loading = true;
    });
    
    const todos = await fetch('/todos').then(r => r.json());
    produce(draft => {
      draft.loading = false;
      draft.error = null;
      draft.data = { todos };
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
    {({ data, loading, error, load }) => (
      <TodosList todos={data.todos} onLoad={load} />
    )}
  </Yield>
);
```

#### Middlewares

```js
// app.js
import { YieldProvider, Yield } from 'react-adone';
import * as counterBasket from './baskets/counter';

const logger = store => next => fn => {
  console.log("Updating", store.key);
  const result = next(fn);
  console.log("Changed", result.changes);
  return result;
};

const App = () => (
  <YieldProvider middlewares={[logger]}>
    <h1>App</h1>
    <Yield from={counterBasket}>
      {({ count, increment }) => (/**/)}
    </Yield>
  </YieldProvider>
)
```

#### Composition

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
    {({ actions }) => (
      <button onClick={actions.increment}>+</button>
    )}
  </Yield>
);
```


