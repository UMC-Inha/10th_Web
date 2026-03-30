import { useContext } from 'react';
import ButtonGroup from './components/ButtonGroup';
import { CounterContext } from './context/CounterProvider';

function App() {
  const context = useContext(CounterContext);

  return (
    <>
      <h1>{context?.count}</h1>
      <ButtonGroup
        handleIncrement={context?.handleIncrement}
        handleDecrement={context?.handleDecrement}
      />
    </>
  );
}

export default App;