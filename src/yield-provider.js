import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Provider } from './context';
import BasketRegistry from './registry';

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
    this.registry = new BasketRegistry(props.initialStates);
    this.state = {
      baskets: this.registry.baskets,
      initBasket: this.registry.initBasket,
    };
  }

  render() {
    const { children } = this.props;
    return <Provider value={this.state}>{children}</Provider>;
  }
}
