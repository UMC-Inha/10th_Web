import { useState } from "react";

// 실습 : useState로 객체 업데이트하기
function App() {
  // 초기 상태: name, age, nickname, city를 가진 객체
  const [person, setPerson] = useState({
    name: "진은비",
    age: 25,
    nickname: "카사",
    city: "",
  });

  // city 업데이트
  const updateCity = () => {
    setPerson((prevPerson) => ({
      ...prevPerson,
      city: "인천",
    }));
  };

  // age 1 증가
  const increaseAge = () => {
    setPerson((prevPerson) => ({
      ...prevPerson,
      age: prevPerson.age + 1,
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
}

export default App;
