import React, { Component } from "react";

import shallowEqual from "fbjs/lib/shallowEqual";
import { createState, bindActions } from "./utils";

export const defaultCtxValue = {
  baskets: {},
  middlewares: [],
  addBasket: (key, basket) => (defaultCtxValue.baskets[key] = basket)
};

const { Provider, Consumer } = React.createContext(defaultCtxValue);

export class Yield extends Component {
  static defaultProps = {
    pick: state => state
  };

  basket = null;
  state = null;

  componentDidMount() {
    if (!this.state) {
      this.onUpdate(true);
    }
  }

  componentWillUnmount() {
    this.basket.state.off(this.onUpdate);
    this.basket = null;
  }

  getBasketState() {
    const { pick } = this.props;
    return pick ? pick(this.basket.state.get()) : {};
  }

  onUpdate = isMount => {
    if (!this.basket) return;
    const prevState = this.state;
    const nextState = this.getBasketState();
    this.state = nextState;
    if (isMount || !shallowEqual(prevState, nextState)) {
      this.forceUpdate();
    }
  };

  createBasket(middlewares) {
    const { from } = this.props;
    const state = createState(from.defaultState, from.key);
    const actions = bindActions(from.actions, state, middlewares);
    return { state, actions };
  }

  setBasket(basket) {
    this.basket = basket;
    this.basket.state.on(this.onUpdate);
  }

  render() {
    const { children, render, from } = this.props;
    if (!this.basket) {
      // We use React context just to get the basket store/actions
      // then we rely on our internal pub/sub to get updated
      // because context API doesn't have builtin selectors (yet)
      return (
        <Consumer>
          {({ baskets, middlewares, addBasket }) => {
            let basket = baskets[from.key];
            if (!basket) {
              basket = this.createBasket(middlewares);
              addBasket(from.key, basket);
            }
            this.setBasket(basket);
            return null;
          }}
        </Consumer>
      );
    }
    // Get fresh state at every re-render, so if a parent triggers
    // a re-render before the componet subscription calls onUpdate()
    // we already serve the updated state and skip add additional render
    this.state = this.getBasketState();
    return (children || render)({ ...this.state, ...this.basket.actions });
  }
}

export class YieldProvider extends Component {
  static defaultProps = {
    middlewares: []
  };

  constructor(props) {
    super(props);
    this.state = {
      baskets: {},
      middlewares: this.props.middlewares,
      addBasket: this.addBasket
    };
  }

  addBasket = (key, value) => {
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
