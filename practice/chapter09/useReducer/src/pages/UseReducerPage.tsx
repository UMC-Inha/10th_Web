import {useReducer, useState} from 'react';

// 1. state에 대한 interface
interface IState {
    counter: number;
    error: string | null;
}
// 2. reducer에 대한 interface
interface IAction {
    type: 'INCREASE' | 'DECREASE' | 'RESET_TO_ZERO';
}

function reducer(state: IState, action: IAction){
    const {type} = action;

    switch(type){
        case 'INCREASE': {
            return {
                // 원본 값을 항상 유지해야함, 에러를 잃어버리지 않음
                ...state,
                counter: state.counter + 1,
            };
        }
        case 'DECREASE': {
            return {
                ...state,
                counter: state.counter -1,
            };
        }
        case 'RESET_TO_ZERO': {
            return {
                ...state,
                counter: 0,
            }
        }
        default:
            return state;
    }
}

export default function UseReducerPage() {
    // 3. useState 훅 사용
    const [count, setCount] = useState(0);

    // 4. useReducer 훅 사용
    /** useReducer에 대해서...
     * - 상태를 직접 변경하지 않고, dispatch 안에 '액션(Action)'을 정의하여 상태 변화를 요청
     * - 리액트는 상태의 참조값(주소)이 바뀌어야 리렌더링을 감지하므로 데이터 직접 변형은 안됨
     * - 기존 상태의 복사본을 만들고 사본을 기반으로 새로운 상태를 생성해 반환
     * - 데이터의 원본을 보호하는 불변성을 지키는 것이 useReducer의 핵심
     */

    const [state, distpatch] = useReducer(reducer, {
        counter : 0,
        error : null,
    })
    
    const handleIncrease = () => {
        setCount(count + 1);
    }
    console.log(state);

  return (
    <div className='flex flex-col gap-10'>
        <div>
            <h2 className='text-3xl'>useState</h2>
            <h2>useState 훅 사용 : {count}</h2>
            <button onClick={handleIncrease}>증가</button>
        </div>
        <div>
            <h2 className='text-3xl'>useReducer</h2>
            <h2>useReducer 훅 사용 : {state.counter}</h2>
            <button onClick={() =>
                distpatch({
                    type: 'INCREASE',
                })
            }>증가</button>

            <button onClick={() =>
                distpatch({
                    type: 'DECREASE'
                })
            }>감소</button>

            <button onClick={() => 
                distpatch({
                    type: 'RESET_TO_ZERO'
                })
            }>초기화</button>
        </div>
    </div>

  )
}