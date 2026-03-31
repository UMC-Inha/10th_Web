// // import "./App.css";
// // import List from "./components/List";
// import { useState } from "react";

// function App() {
//   // 초기 상태: name, age, nickname, city를 가진 객체
//   const [person, setPerson] = useState({
//     name: "진은비",
//     age: 25,
//     nickname: "카사",
//     city: "",
//   });

//   // city 업데이트
//   const updateCity = () => {
//     setPerson((prevPerson) => ({
//       ...prevPerson,
//       city: "인천",
//     }));
//   };

//   // age 1 증가
//   const increaseAge = () => {
//     setPerson((prevPerson) => ({
//       ...prevPerson,
//       age: prevPerson.age + 1,
//     }));
//   };

//   return (
//     <>
//       <h1>이름: {person.name}</h1>
//       <h2>나이: {person.age}</h2>
//       <h3>닉네임: {person.nickname}</h3>
//       {person.city && <h4>도시: {person.city}</h4>}
//       <button onClick={updateCity}>도시 추가</button>
//       <button onClick={increaseAge}>나이 증가</button>
//     </>
//   );
//   // 실습 2
//   // const handleIncreaseNumber = () => {
//   //   setCount(count + 1);
//   //   setCount(count + 1);
//   //   setCount(count + 1);
//   // };
//   // const [count, setCount] = useState<number>(0);
//   // return (
//   //   <>
//   //     <h1>{count}</h1>
//   //     <button onClick={handleIncreaseNumber}>숫자 증가</button>
//   //   </>
//   // );
//   // 실습 1
//   // const nickname = "카사";
//   // const dog = "똘이";
//   // const array = ["REACT", "NEXT", "VUE", "SVELTE", "ANGULAR", "REACT-NATIVE"];
//   // return (
//   //   <>
//   //     <strong className="school">인하대학교</strong>
//   //     <p style={{ color: "lightblue", fontWeight: "bold", fontSize: "3rem" }}>
//   //       {nickname}/진은비
//   //     </p>
//   //     <h1>{`${nickname}는 ${dog}를 좋아합니다.`}</h1>
//   //     <ul>
//   //       {array.map((item, idx) => (
//   //         <List key={idx} tech={item} />
//   //       ))}
//   //     </ul>
//   //   </>
//   // );
// }

// export default App;

import ButtonGroup from "./components/ButtonGroup";
import { useCount } from "./context/CounterProvider";

function App() {
  const { count } = useCount();
  return (
    <>
      <h1>{count}</h1>
      <ButtonGroup />
    </>
  );
}

export default App;
