export default function bindActions(actions, store) {
  return Object.keys(actions).reduce((acc, k) => {
    // Using a custom produce so we can name fn for better debuggability
    const namedProduce = fn => {
      Object.defineProperty(fn, 'name', {
        value: k + (fn.name ? `.${fn.name}` : ''),
      });
      store.produce(fn);
    };
    acc[k] = (...args) => actions[k](...args)(namedProduce, store.getState);
    return acc;
  }, {});
}
