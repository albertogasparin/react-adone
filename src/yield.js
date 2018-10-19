import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Consumer } from './context';
import shallowEqual from './utils/shallow-equal';

export default class Yield extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    from: PropTypes.shape({
      key: PropTypes.string.isRequired,
      defaultState: PropTypes.object.isRequired,
      actions: PropTypes.object.isRequired,
    }).isRequired,
    pick: PropTypes.func,
    withProps: PropTypes.object,
  };

  basket = null;
  unsubscribeStore = null;
  state = null;

  componentWillUnmount() {
    this.basket = null;
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
    }
  }

  getBasketState() {
    const { pick, withProps } = this.props;
    if (!this.basket) {
      this.setBasket();
    }
    const state = this.basket.store.getState();
    return pick ? pick(state, withProps) : state;
  }

  onUpdate = () => {
    if (!this.basket) return;
    const prevState = this.state;
    const nextState = this.getBasketState();
    this.state = nextState;
    if (!shallowEqual(prevState, nextState)) {
      this.forceUpdate();
    }
  };

  setBasket() {
    const { from } = this.props;
    // We use React context just to get the baskets registry
    // then we rely on our internal pub/sub to get updates
    // because context API doesn't have builtin selectors (yet).
    // Reading context value from owner as suggested by gaearon
    // https://github.com/facebook/react/pull/13861#issuecomment-430356644
    // plus a fix to make it work with enzyme shallow
    const {
      ReactCurrentOwner: { currentDispatcher },
    } = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    const { baskets, initBasket } = currentDispatcher
      ? currentDispatcher.readContext(Consumer)
      : Consumer._currentValue;

    this.basket = baskets.get(from.key) || initBasket(from);
    this.unsubscribeStore = this.basket.store.subscribe(this.onUpdate);
  }

  render() {
    // Get fresh state at every re-render, so if a parent triggers
    // a re-render before the componet subscription calls onUpdate()
    // we already serve the updated state and skip an additional render
    this.state = this.getBasketState();
    return this.props.children({ ...this.state, ...this.basket.actions });
  }
}
