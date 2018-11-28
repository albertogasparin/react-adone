import defaults from '../defaults';

const connectDevTools = store => {
  const devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({
    name: `Basket: ${store.key}`,
  });
  devTools.init(store.getState());
  devTools.subscribe(message => {
    if (message.type === 'DISPATCH') {
      store.setState(JSON.parse(message.state));
    }
  });
  return devTools;
};

const withDevtools = createStore => (...args) => {
  const store = createStore(...args);

  if (defaults.devtools && window && window.__REDUX_DEVTOOLS_EXTENSION__) {
    const origProduce = store.produce;
    let devTools;
    const produce = fn => {
      const result = origProduce(fn);
      try {
        if (!devTools) {
          devTools = connectDevTools(store);
        }
        devTools.send(fn.displayName, store.getState(), {}, store.key);
      } catch (err) {
        /* ignore devtools errors */
      }
      return result;
    };
    store.produce = produce;
  }

  return store;
};

export default withDevtools;
