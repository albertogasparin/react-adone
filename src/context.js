import React from 'react';

import { defaultRegistry } from './registry';

const { Provider, Consumer } = React.createContext(defaultRegistry);

export { Provider, Consumer };
