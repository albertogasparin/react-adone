export default function bindActions(actions, store, extraArg) {
  return Object.keys(actions).reduce((acc, k) => {
    // Using a custom produce so we can name fn for better debuggability
    const namedProduce = fn => {
      fn.displayName = fn.displayName || k + (fn.name ? `.${fn.name}` : '');
      store.produce(fn);
    };
    acc[k] = (...args) =>
      actions[k](...args)(namedProduce, store.getState, extraArg);
    return acc;
  }, {});
}
