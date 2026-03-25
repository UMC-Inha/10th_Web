import { useState } from 'react';

const PersonCard = () => {
  const [person, setPerson] = useState({
    name: '김해원',
    age: 25,
    nickname: '엠버',
    city: '',
  });

  // city 업데이트
  const updateCity = () => {
    setPerson((prevPerson) => ({
      ...prevPerson, // 기존 상태 복사
      city: '인천', // city 값만 덮어쓰기
    }));
  };

  // age 1 증가
  const increaseAge = () => {
    setPerson((prevPerson) => ({
      ...prevPerson, // 기존 상태 복사
      age: prevPerson.age + 1, // age만 +1
    }));
  };

  return (
    <>
      <h1>이름: {person.name}</h1>
      <h2>나이: {person.age}</h2>
      <h3>닉네임: {person.nickname}</h3>
      {person.city && <h4>도시: {person.city}</h4>}
      <button onClick={updateCity}>도시 추가</button>
      <button onClick={increaseAge}>나이 증가</button>
    </>
  );
};

export default PersonCard;
