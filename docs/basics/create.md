## Creating components

To create a pair of `Container` and `Subscriber`:

```js
// components/counter.js
const initialState = {
  count: 0,
};

const actions = {
  increment: () => setState => {
    // action code...
  },
};

const { Container, Subscriber } = createComponents({
  initialState,
  actions,
  name: 'counter',
  onContainerInit: () => ({ setState, ... }, props) => /* do something */
  onContainerUpdate: () => ({ setState, ... }, props) => /* do something */
});
```

Once used on a view, a state "instance" is created and the state is now shared across all components. `Container` comes handy whenever you need multiple instances of the same state, either global or local, or you need to pass specific props to actions ([see Container docs for more](../container.md)).
