import { useState, useEffect } from "react"

export default function Parent() {
    const [visible, setVisible] = useState(false);


return (
    <>
        <h1>같이 배우는 리액트 #2 useEffect</h1>
        <button onClick={() => setVisible(!visible)}>
            {visible ? '숨기기' : '보이기'}
        </button>
        {visible && <Child />}
    </>
)
}

//클린 업 코드를 작성하지 않으면 Child 컴포넌트가 사라진 이후에도 setInterval이 계속 실행됨
function Child() {
    useEffect(()=>{
        let i = 0;
        const counterInterval =setInterval(() => {
            console.log('Number => ', + i);
            i++;
        },1_000);

        return () => {
            console.log('언마운트 될 때 실행됩니다');
            clearInterval(counterInterval);
        }
    },[]);

    return <div className="mt-20 text-4xl">Child</div>
}