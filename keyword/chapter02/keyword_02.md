**1. JSX 사용시 여러 개의 태그 동시에 반환하고 싶을 때 어떻게 해야할까?** 🍠 -**답변**🍠
//div 태그로 감싸는 방법
function App() {

  <div>
    return (
      <strong>상명대학교</strong>
      <p>매튜/김용민</p>
    )
    </div>
  }
  export default App

//<>(빈 태그)로 감싸는 방법
function App() {
<>
return (
<strong>상명대학교</strong>
<p>매튜/김용민</p>
)
</>
}
export default App -**이유**🍠
JSX는 반드시 하나의 부모 요소가 필요해요!
그러나 여러 개의 태그를 동시에 반환하려고 하면 React 입장에서는 무엇을 return 해야 할 지 모르는 상황이 됩니다.
그래서 <div>로 감싸거나 <>(빈 태그)로 감싸서 한 덩어리로 만들어 줍니다.
**예시: 택배상자**
return = 택배 상자라고 생각!
상자에 하나의 물건만 보낼 수 있다면 상자 안에 넣지 않고 물건 2개를 던지면 안되겠죠?
그래서 <div> 나 <>로 물건을 감싸서 배송하는 거라고 생각하면 됩니다!

**2. 구조분해 할당 활용🍠**  
 **방식: 매개변수에서 바로 구조 분해하는 방법**
**//구조분해 전**
const List = (props) => {
return <li>{props.tech}</li>;
};
export default List;

    **구조분해 후**
    const List = ({tech}) => {
      return <li>{tech}</li>;
    };
    export default List;

**3. Lazy Initialization 설명**
-Lazy initialization: 객체의 초기화를 최대한 늦추는 기법(필요할 때 초기화 가능)

-핵심: 객체의 생성 시점과 초기화 시점 분리 -객체 생성 → 최소한의 초기화만 수행 -초기화 시점: 실제로 초기화가 필요할 때 완전한 초기화 실행
-Lazy Initialization이 필요한 이유 → 성능과 메모리 절약
-Lazy Initailization 쓰는 법: 함수를 넣는 방식으로 사용 -예시:const [count, setCount] = useState(() => getInitialValue());
**+실습하면서 몰랐던 개념 토글 열어 정리**
-Lazy Initialization으로 초기화하기 위해서 함수 형식으로 초기화를 진행
-const [state, setState] = useState(() => 초기값); → 0을 바로 넣는 것이 아니라 0을 반환하는 함수를 넣어야 함
