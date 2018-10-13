import { Yield } from './yield';

export default function createYield(name, from, pick) {
  if (typeof name !== 'string') {
    [from, pick, name] = [name, from, ''];
  }
  return class extends Yield {
    static defaultProps = { from, pick };
    static displayName = name || `Yield(${from.key})`;
  };
}
