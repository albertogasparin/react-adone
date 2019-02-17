#### Container scope

By default all state instances are stored in the global registry. However in large, complex applications you might want to have multiple instances of the same state. That's where `Container` `scope` prop comes into play.
It allows you to have multiple global instances of the same state type in the registry (still available app-wide and SSR-compatible) or even local only instances, only accessible to `Subscriber` children.

```js
import { CounterContainer, CounterSubscriber } from 'components/counter';

const App = () => (
  <Fragment>
    <CounterContainer isGlobal>
      <CounterSubscriber>
        {({ count }) => count /* this might be 1 */}
      </CounterSubscriber>
    </CounterContainer>

    <CounterContainer scope={'counter-1'}>
      <CounterSubscriber>
        {({ count }) => count /* this might be 2 */}
      </CounterSubscriber>
    </CounterContainer>

    <CounterContainer>
      <CounterSubscriber>
        {/* this instance cannot be accessed elsewhere */}
        {({ count }) => count /* this might be 20 */}
      </CounterSubscriber>
    </CounterContainer>
  </Fragment>
);
```

The power of `Container` is that you can expand or reduce the scope at will, without requiring any change on the children. That means you can start with a localised scope and then if you need to access the same state elsewhere you can just move `Container` up in the tree (or make the scope global providing an `scope` or `isGlobal`).
