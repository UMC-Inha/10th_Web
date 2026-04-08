import { useState, useEffect } from "react";

//useEffect안에는 상태를 업데이트 시키는 코드를 넣어서는 안됨
export default function UseEffectError() {
    const [counter, setCounter] = useState(0);

    const handleIncrease = () : void => {
        setCounter((counter):number => counter + 1);
    };

    useEffect(() => {
        // 1. 초기 렌더링 시작 (counter++)
        setCounter((counter):number => counter + 1);

        // 2. counter 값이 변경 될 때마다 실행
    }, [counter]);
    // 1번과 2번 과정이 반복해서 일어나므로 무한 랜더링이 일어남

  return (
    <div onClick={handleIncrease}>{counter}</div>
  )
}