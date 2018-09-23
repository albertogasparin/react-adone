import React, { Component } from "react";

import shallowEqual from "fbjs/lib/shallowEqual";
import { createState, bindActions } from "./utils";

export const defaultCtxValue = {
  baskets: {},
  addBasket: (key, basket) => (defaultCtxValue.baskets[key] = basket)
};

const { Provider, Consumer } = React.createContext(defaultCtxValue);

export class Yield extends Component {
  static defaultProps = {
    pick: state => state
  };

  basket = null;
  shouldUpdate = false;
  state = {};

  componentWillUnmount() {
    this.shouldUpdate = false;
    this.basket.state.off(this.onUpdate);
  }

  getBasketState() {
    const { pick } = this.props;
    return pick ? pick(this.basket.state.get()) : {};
  }

  onUpdate = () => {
    let prevState = this.state;
    this.state = this.getBasketState();
    if (this.shouldUpdate && !shallowEqual(this.state, prevState)) {
      this.forceUpdate();
    }
  };

  createBasket(addToContext) {
    const { from } = this.props;
    const state = createState(from.defaultState);
    const actions = bindActions(from.actions, state);
    const basket = { state, actions };
    addToContext(from.key, basket);
    return basket;
  }

  setBasket(basket) {
    this.basket = basket;
    this.shouldUpdate = true;
    this.basket.state.on(this.onUpdate);
    this.onUpdate();
  }

  render() {
    const { children, from } = this.props;
    if (!this.basket) {
      return (
        <Consumer>
          {({ baskets, addBasket }) => {
            const basket = baskets[from.key] || this.createBasket(addBasket);
            this.setBasket(basket);
            return null;
          }}
        </Consumer>
      );
    }

    return children(this.state, this.basket.actions);
  }
}

export class YieldProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baskets: {},
      addBasket: this.addBasket
    };
  }

  addBasket = (key, value) => {
    this.state.baskets[key] = value;
  };

  render() {
    const { children } = this.props;
    return <Provider value={this.state}>{children}</Provider>;
  }
}

