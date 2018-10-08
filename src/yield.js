// @flow

import React, { Component } from 'react';

import shallowEqual from './utils/shallow-equal';
import createStore from './create-store';
import bindActions from './bind-actions';

import type {
  BasketStoreUnsubscribe,
  Middleware,
  YieldBasket,
  YieldProviderProps,
  YieldProviderState,
  YieldProps,
  YieldState,
} from './types';

export const fallbackProviderState: YieldProviderState = {
  baskets: {},
  middlewares: [],
  addBasket(key, basket) {
    fallbackProviderState.baskets[key] = basket;
  },
};

const { Provider, Consumer } = React.createContext(fallbackProviderState);

export class Yield extends Component<YieldProps, ?YieldState> {
  static defaultProps = {
    pick: (state: *) => state,
  };

  basket: ?YieldBasket<{}> = null;
  unsubscribeStore: ?BasketStoreUnsubscribe = null;
  state = null;

  componentDidMount() {
    if (!this.state) {
      this.onUpdate(true);
    }
  }

  componentWillUnmount() {
    this.basket = null;
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
    }
  }

  getBasketState() {
    const { pick } = this.props;
    return pick && this.basket ? pick(this.basket.store.getState()) : {};
  }

  onUpdate = (isMount: boolean = false) => {
    if (!this.basket) return;
    const prevState = this.state;
    const nextState = this.getBasketState();
    this.state = nextState;
    if (isMount || !shallowEqual(prevState, nextState)) {
      this.forceUpdate();
    }
  };

  createBasket(middlewares: Middleware[]): YieldBasket<*> {
    const { from } = this.props;
    const store = createStore(from.key, from.defaultState, middlewares);
    const actions = bindActions(from.actions, store);
    return { store, actions };
  }

  setBasket(basket: YieldBasket<*>) {
    this.basket = basket;
    this.unsubscribeStore = this.basket.store.subscribe(this.onUpdate);
  }

  render() {
    const { children, from } = this.props;
    const { basket } = this;
    if (!basket) {
      // We use React context just to get the basket store/actions
      // then we rely on our internal pub/sub to get updated
      // because context API doesn't have builtin selectors (yet)
      return (
        <Consumer>
          {({ baskets, middlewares, addBasket }) => {
            let providerBasket = baskets[from.key];
            if (!providerBasket) {
              providerBasket = this.createBasket(middlewares);
              addBasket(from.key, providerBasket);
            }
            this.setBasket(providerBasket);
            return null;
          }}
        </Consumer>
      );
    }
    // Get fresh state at every re-render, so if a parent triggers
    // a re-render before the componet subscription calls onUpdate()
    // we already serve the updated state and skip an additional render
    this.state = this.getBasketState();
    return children({ ...this.state, ...basket.actions });
  }
}

export class YieldProvider extends Component<
  YieldProviderProps,
  YieldProviderState
> {
  static defaultProps = {
    baskets: {},
    middlewares: [],
  };

  constructor(props: YieldProviderProps) {
    super(props);
    this.state = {
      baskets: this.props.baskets,
      middlewares: this.props.middlewares,
      addBasket: this.addBasket,
    };
  }

  addBasket = (key: string, value: YieldBasket<*>) => {
    // change state directly so we don't trigger a re-render
    // plus it's used by newly created consumers that will have
    // the basket internally anyway
    this.state.baskets[key] = value;
  };

  render() {
    const { children } = this.props;
    return <Provider value={this.state}>{children}</Provider>;
  }
}
