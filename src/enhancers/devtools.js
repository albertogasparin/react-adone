import defaults from '../defaults';

const withDevtools = createStore => (...args) => {
  const store = createStore(...args);

  if (defaults.devtools && window && window.__REDUX_DEVTOOLS_EXTENSION__) {
    const origProduce = store.produce;
    const devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({
      name: `Basket: ${store.key}`,
    });
    devTools.init(store.getState());
    devTools.subscribe(message => {
      if (message.type === 'DISPATCH') {
        store.setState(JSON.parse(message.state));
      }
    });
    const produce = fn => {
      const result = origProduce(fn);
      devTools.send(fn.name, store.getState(), {}, store.key);
      return result;
    };
    store.produce = produce;
  }

  return store;
};

export default withDevtools;
