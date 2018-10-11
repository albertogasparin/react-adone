import immer from 'immer';
import update from './update';

const applyMiddleware = (store, middlewares) =>
  [...middlewares, update]
    .reverse()
    .reduce((next, mw) => mw(store)(next), immer);

export default applyMiddleware;
