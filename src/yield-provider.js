import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Provider } from './context';
import initBasket from './init-basket';

export default class YieldProvider extends Component {
  static propTypes = {
    children: PropTypes.node,
    initialStates: PropTypes.object,
  };

  static defaultProps = {
    initialStates: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      baskets: {},
      initBasket: this.initBasket,
    };
  }

  initBasket = basket => {
    const { initialStates } = this.props;
    const basketInstance = initBasket(basket, initialStates[basket.key]);
    // change state directly so we don't trigger a re-render
    // plus it's used by newly created consumers that will have
    // the basket internally anyway
    this.state.baskets[basket.key] = basketInstance;
    return basketInstance;
  };

  render() {
    const { children } = this.props;
    return <Provider value={this.state}>{children}</Provider>;
  }
}
