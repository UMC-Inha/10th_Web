import ButtonGroup from '../components/ButtonGroup';
import { useCount } from '../context/CounterProvider';

function Counter() {
  const { count } = useCount();

  return (
    <div>
      <h1>{count}</h1>
      <ButtonGroup />
    </div>
  );
}

export default Counter;
