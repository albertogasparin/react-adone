// @flow
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { YieldProvider } from '../../src';
import UserList from './components/user-list';
import TodoList from './components/todo-list';

class App extends Component<{}> {
  render() {
    return (
      <YieldProvider>
        <h1>User Todos example</h1>
        <main>
          <UserList />
          <TodoList />
        </main>
      </YieldProvider>
    );
  }
}

// $FlowFixMe
ReactDOM.render(<App />, document.getElementById('root'));
