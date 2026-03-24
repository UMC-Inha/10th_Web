import ButtonGroup from './components/ButtonGroup';
import { useCount } from './context/CounterProvider';

function App() {
  // const context = useContext(CounterContext);
  const context = useCount();

  console.log(context);

  return (
    <>
      <h1>{context?.count}</h1>
      <ButtonGroup
        // ? 를 지워도 더이상 타입스크립트에서 에러가 발생하지 않음.
        // 우리가 useCount 훅에서, context가 없는 경우의 에러처리를 했기 떄문.
        handleIncrement={context.handleIncrement}
        handleDecrement={context.handleDecrement}
      />
    </>
  );
}

export default App;
