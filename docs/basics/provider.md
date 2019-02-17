## Provider or provider-less

Compared to other state management libraries, Adone does not require a provider at the top. However, you might still want one if you don't like storing state in a global object.

```js
// app.js
import { AdoneProvider } from 'react-adone';

const initialData = { 'nu718c@__global__': { count: 10 } };

const App = () => (
  <YieldProvider initialStates={initialData}>{/* your app */}</YieldProvider>
);
```

The same configuration passed to `AdoneProvider` is available for the default registry:

```js
import { defaultRegistry } from 'react-adone';

const initialData = { 'nu718c@__global__': { count: 10 } };

defaultRegistry.configure({
  initialStates: initialData,
});

const App = () => (
  /* your app */
);
```
