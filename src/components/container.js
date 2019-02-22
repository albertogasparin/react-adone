import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Provider, readContext } from '../context';
import BasketRegistry from '../registry';
import shallowEqual from '../utils/shallow-equal';
import { bindAction, bindActions } from '../bind-actions';

export default class Container extends Component {
  static propTypes = {
    children: PropTypes.node,
    scope: PropTypes.string,
    isGlobal: PropTypes.bool,
  };

  static basketType = null;
  static hooks = null;

  static getDerivedStateFromProps(nextProps, prevState) {
    const { scope } = nextProps;
    const hasScopeChanged = scope !== prevState.scope;

    let nextState = null;
    if (hasScopeChanged) {
      const actions = prevState.bindContainerActions(scope);
      nextState = { scope, scopedBasketActions: actions };
    }
    // We trigger the action here so subscribers get new values ASAP
    // onInit this is called twice (contructor and here) to support React<16.5
    // but the state update is triggered only once as shallowEq will stop it
    prevState.triggerContainerAction(nextProps);
    return nextState;
  }

  constructor(props) {
    super(props);
    const ctx = readContext();
    this.registry = new BasketRegistry('__local__');

    this.state = {
      api: {
        globalRegistry: ctx.globalRegistry,
        getBasket: (basket, scope) =>
          this.getScopedBasket(basket, scope) || ctx.getBasket(basket),
      },
      // stored to make them available in getDerivedStateFromProps
      // as js context there is null https://github.com/facebook/react/issues/12612
      bindContainerActions: this.bindContainerActions,
      triggerContainerAction: this.triggerContainerAction,
      scope: props.scope,
    };

    // this is needed for compat with React<16.5
    // as gDSFP in not called before first render
    this.state.scopedBasketActions = this.bindContainerActions(props.scope);
    this.triggerContainerAction(props);
  }

  componentDidUpdate(prevProps) {
    if (this.props.scope !== prevProps.scope) {
      this.deleteScopedBasket(prevProps.scope);
    }
  }

  componentWillUnmount() {
    this.deleteScopedBasket();
  }

  bindContainerActions = scope => {
    const { basketType, hooks } = this.constructor;
    const { api } = this.state;
    // we explicitly pass scope as it might be changed
    const { store } = api.getBasket(basketType, scope);

    const actions = bindActions(
      basketType.actions,
      store,
      this.getContainerProps
    );
    this.onInit = bindAction(
      store,
      hooks.onInit,
      'onInit',
      this.getContainerProps,
      actions
    );
    this.onUpdate = bindAction(
      store,
      hooks.onUpdate,
      'onUpdate',
      this.getContainerProps,
      actions
    );
    // make sure we also reset actionProps
    this.actionProps = null;
    return actions;
  };

  triggerContainerAction = nextProps => {
    // eslint-disable-next-line no-unused-vars
    const { children, scope, isGlobal, ...restProps } = nextProps;
    if (shallowEqual(this.actionProps, restProps)) return;

    // store restProps on instance so we can diff and use fresh props
    // in actions even before react sets them in this.props
    this.actionProps = restProps;

    if (this.onInit) {
      this.onInit();
      this.onInit = null;
    } else {
      this.onUpdate();
    }
  };

  getContainerProps = () => this.actionProps;

  getRegistry() {
    const isLocal = !this.props.scope && !this.props.isGlobal;
    return isLocal ? this.registry : this.state.api.globalRegistry;
  }

  getScopedBasket(basket, scopeId = this.props.scope) {
    const { basketType } = this.constructor;
    if (basket !== basketType) {
      return null;
    }
    const { store } = this.getRegistry().getBasket(basket, scopeId);
    // instead of returning global bound actions
    // we return the ones with the countainer props binding
    return {
      store,
      actions: this.state.scopedBasketActions,
    };
  }

  deleteScopedBasket(scopeId = this.props.scope) {
    const { basketType } = this.constructor;
    const { store } = this.getScopedBasket(basketType, scopeId);
    if (!store.listeners().length) {
      this.getRegistry().deleteBasket(basketType, scopeId);
    }
  }

  render() {
    const { children } = this.props;
    return <Provider value={this.state.api}>{children}</Provider>;
  }
}
