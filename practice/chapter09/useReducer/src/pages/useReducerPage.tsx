import { useReducer } from 'react';

type Action =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' };

const reducer = (state: number, action: Action): number => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;

    case 'DECREMENT':
      return state - 1;

    default:
      return state;
  }
};

const Counter = () => {
  const [count, dispatch] = useReducer(reducer, 0);

  return (
    <div>
      <h1>{count}</h1>

      <button onClick={() => dispatch({ type: 'INCREMENT' })}>
        +
      </button>

      <button onClick={() => dispatch({ type: 'DECREMENT' })}>
        -
      </button>
    </div>
  );
};

export default Counter;