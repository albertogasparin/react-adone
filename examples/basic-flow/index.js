// @flow
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { YieldProvider, Yield } from 'react-adone';

import basket from './basket';

/**
 * Main App
 */
class App extends Component<{}> {
  render() {
    return (
      <YieldProvider>
        <h1>Counter example</h1>
        <main>
          <Yield from={basket}>
            {({ count, increment }) => (
              <div>
                <p>{count}</p>
                <button onClick={increment}>+1</button>
              </div>
            )}
          </Yield>
        </main>
      </YieldProvider>
    );
  }
}

// $FlowFixMe
ReactDOM.render(<App />, document.getElementById('root'));
