import './App.css'
import List from './components/List';
import { useState } from 'react';

function App() {
  const nickname = '매튜'
  const sweetPotato = '고구마'
  const array = ['REACT', 'NEXT', 'VUE', 'SVELTE', 'ANGULAR', 'REACT-NATIVE']
  const [count, setCount] = useState<number>(0);

  // 기능이 복잡해지면 함수를 따로 분리하는게 좋다
  const handleIncreaseNumber = () => {
    setCount(count + 1);
  }

  const [person, setPerson] = useState({
    name : '채부경',
    age: 24,
    nickname : "동동",
    city: '', //city 키를 미리 넣어둬야 타입 유추가 가능함
  })

  const updateCity = () => {
    setPerson((prevPerson) => ({
      ...prevPerson, // 기존 상태 복사
      city: '서울',
    }));
  }

  const increaseAge = () => {
    setPerson((prevPerson) => ({
      ...prevPerson, // 기존 상태 복사
      age : prevPerson.age + 1, // 나이가 +1
    }));
  }

  return (
     <>
      <h1>이름 : {person.name}</h1>
      <h2>나이: {person.age}</h2>
      <h3>닉네임 : {person.nickname}</h3>
      {person.city && <h4>도시: {person.city}</h4>}
      <button onClick={updateCity}>도시 추가</button>
      <button onClick={increaseAge}>나이 증가</button>

      <h1>{count}</h1>
      <button onClick={handleIncreaseNumber}>숫자 증가</button>

      <strong className='school'>상명대학교</strong>
      <p style={{color: 'purple', fontWeight:'bold', fontSize:'1rem'}}>{nickname}/김용민</p>
      <h2>{`${nickname}는 ${sweetPotato} 아이스크림을 좋아합니다.`}</h2>
      <ul>
        {array.map((yaho, idx) => (
          // 어떤 요소가 추가/삭제/변경 되었는지 구분하기 위해 key
          <List key={idx} tech={yaho}/>
        ))}
      </ul>
     </>
  )
}

export default App