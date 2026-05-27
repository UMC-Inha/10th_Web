🍠 useReducer 학습 회고
이해한 점
상태 업데이트 로직의 격리: useState를 사용할 때는 컴포넌트 내부에 setCount(prev => prev + 1) 같은 명령형 로직들이 파편화되어 흩어지기 쉬웠는데, useReducer를 사용하면 컴포넌트 외부의 reducer 함수 하나로 상태 변경 시나리오를 집약할 수 있어 코드가 훨씬 선언적으로 변한다는 것을 이해했습니다.

컴포넌트 경량화: 하위 컴포넌트에게 복잡한 상태 값과 상태 변경 함수들을 일일이 넘겨주지 않고, 오직 dispatch 함수 하나만 툭 던져주면 하위 컴포넌트가 스스로 액션(type, payload)을 발행하여 상위 상태를 안전하게 제어할 수 있다는 점에서 Props Drilling 방어에 훌륭한 도구임을 배웠습니다.

어려운 점 (개선 방법)
중첩 객체의 불변성 관리: 객체나 배열 형태의 복잡한 구조를 reducer 내부에서 업데이트할 때, 기존 값을 보존하기 위해 스프레드 연산자(...state)를 중첩해서 작성해야 하는 부분이 가독성을 떨어뜨리고 실수를 유발하기 쉬웠습니다.

개선 방법: 복잡한 상태 객체를 다룰 때는 immer 라이브러리를 결합하여 state.user.profile.age = action.payload처럼 직관적으로 뮤테이션 코드를 작성하면서도 불변성을 지키는 방식으로 리팩토링하거나, 상태 구조 자체를 평탄화(Flattening)하여 관리하는 룰을 세웠습니다.

회고
단순히 숫자가 오르내리는 카운터 수준에서는 useState가 편하지만, 실제 현업에서 다루는 복잡한 입력 폼(Form) 상태나 다중 필터 구조에서는 useReducer와 switch문의 조합이 압도적인 유지보수성과 가독성을 보장한다는 것을 깨달았습니다. 상태와 비즈니스 로직의 명확한 역할 분담(Separation of Concerns)이 왜 중요한지 체감할 수 있는 실습이었습니다.

🍠 Redux Toolkit 사용법 핵심 정리
Provider
Redux의 전역 상태 저장소인 Store를 React 앱 전체에 주입해 주는 최상위 컴포넌트입니다. main.tsx나 App.tsx에서 전체 레이아웃을 <Provider store={store}> 형태로 감싸주어야 비로소 모든 하위 컴포넌트들이 제약 없이 스토어에 접근할 수 있게 됩니다.

configureStore
기존 순수 Redux의 복잡한 createStore 설정을 완전히 대체하는 RTK의 핵심 함수입니다. 여러 개의 분산된 리듀서들을 하나로 병합(reducer: { ... })해 주는 것은 물론, 기본적으로 Redux DevTools 연동 및 redux-thunk 미들웨어가 내장되어 있어 단 한 줄로 강력한 스토어를 구축할 수 있습니다.

createSlice
기존 Redux에서 Action Type, Action Creator, Reducer 함수를 제각각 따로 만들던 노가다(Boilerplate)를 획기적으로 줄여준 일등 공신입니다. name, initialState, reducers 객체만 선언해 주면 내부적으로 액션 생성자 함수와 리듀서가 자동으로 출력됩니다. 또한, 내부에 Immer 라이브러리가 탑재되어 있어 불변성을 수동으로 챙기지 않고 state.count += 1처럼 데이터를 직접 변경해도 안전하게 불변성이 유지됩니다.

useSelector
Redux Store에 저장된 전역 상태 중 내가 지금 이 컴포넌트에서 필요한 특정 데이터만 쏙 집어서 구독(Select)하는 리액트 훅입니다. 셀렉터 함수가 반환하는 값이 바뀌었을 때만 컴포넌트 리렌더링을 유발하기 때문에 최적화에 유리합니다.

useDispatch
스토어에 액션을 전달하여 상태를 변경시키는 트리거인 dispatch 함수를 가져오는 훅입니다. const dispatch = useDispatch() 형태로 선언한 뒤, dispatch(increment())와 같이 슬라이스에서 자동 생성된 액션을 인자로 넣어 호출합니다.

🍠 Zustand 완벽 정리
Zustand란 무엇인가요?
Zustand(독일어로 '상태')는 발행-구독(Pub/Sub) 모델을 기반으로 한 매우 가볍고(약 1KB), 직관적이며 속도가 빠른 리액트 전역 상태 관리 라이브러리입니다. Context API처럼 앱 전체를 Provider로 뒤덮는 번거로움이 없고, Redux Toolkit처럼 복잡한 보일러플레이트 코드를 요구하지 않아 현대 프론트엔드 생태계에서 가장 각광받고 있습니다.

왜 Zustand를 사용할까요?
설정이 극도로 간결함: 중앙 스토어를 파일 하나에 정의하고 나면, 다른 컴포넌트에서 Provider 래핑 없이 커스텀 훅처럼 바로 임포트해서 쓸 수 있습니다.

선택적 구독(Selector)을 통한 로컬 리렌더링: 스토어의 거대한 상태 중 컴포넌트가 명시한 값(state.count)이 변하지 않았다면, 다른 상태들이 아무리 요동쳐도 해당 컴포넌트는 절대 리렌더링되지 않습니다.

리액트 종속성 없음: 리액트 컴포넌트 생명주기 외부(순수 JS 클로저 안)에서 상태가 관리되므로, 리액트 컴포넌트 밖의 일반 유틸 함수나 비동기 로직 파일에서도 스토어 상태를 직접 읽고 수정할 수 있습니다.

Zustand 기본 사용법
1) Store 만들기
TypeScript
import { create } from 'zustand';

interface LpStore {
  currentLpTitle: string;
  setLpTitle: (title: string) => void;
}

// create 함수 안에서 set인자를 활용해 상태와 액션을 함께 정의합니다.
export const useLpStore = create<LpStore>((set) => ({
  currentLpTitle: "초기 LP 없음",
  setLpTitle: (title) => set({ currentLpTitle: title }), // 얕은 병합(Merge) 지원
}));
2) 컴포넌트에서 사용하기
TypeScript
import { useLpStore } from '../stores/lpStore';

function LpDisplay() {
  // 셀렉터 함수를 던져서 정확히 필요한 값만 가져옵니다.
  const currentLpTitle = useLpStore((state) => state.currentLpTitle);
  const setLpTitle = useLpStore((state) => state.setLpTitle);

  return (
    <div>
      <h2>현재 재생 중: {currentLpTitle}</h2>
      <button onClick={() => setLpTitle("Abbey Road - The Beatles")}>변경</button>
    </div>
  );
}
Zustand에서 중요한 개념
1) set 함수
스토어의 상태를 변경하는 핵심 함수입니다. 기본적으로 얕은 병합(Shallow Merge) 방식으로 동작하므로, 1레벨 객체 구조 내에서는 내가 변경하고 싶은 필드만 쏙 집어넣어도 나머지 상태들이 파괴되지 않고 안전하게 유지됩니다.

2) get 함수
액션(함수)을 정의할 때, 현재 스토어에 담긴 다른 상태 값을 실시간으로 읽어와야 할 때 사용합니다. create((set, get) => (...)) 형태로 주입받아 활용합니다.

예시: if (get().count > 10) return;

3) 선택적 구독 (selector)
useLpStore(state => state.target) 구조를 뜻합니다. 스토어 전체를 통째로 가져오는 것이 아니라 특정 원자값만 타겟팅하기 때문에, 불필요한 전체 컴포넌트 리렌더링 폭탄을 피할 수 있는 Zustand의 핵심 성능 방어 기전입니다.

Zustand 객체 상태 관리 예시
중첩 객체의 구조를 바꿀 때는 전통적인 스프레드 연산자를 활용해 수동 병합을 해주어야 합니다.

TypeScript
const useUserStore = create((set) => ({
  profile: { name: '태은', details: { age: 25, role: 'developer' } },
  updateRole: (newRole) => set((state) => ({
    profile: {
      ...state.profile,
      details: { ...state.profile.details, role: newRole }
    }
  })),
}));
Zustand 비동기 로직 예시
별도의 미들웨어나 Thunk 세팅 없이, 액션 함수 내부를 async/await로 짜서 set을 호출하면 끝입니다. 극도의 편리함을 자랑합니다.

TypeScript
const useLpFetchStore = create((set) => ({
  lps: [],
  isLoading: false,
  fetchLps: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/lps');
      const data = await res.json();
      set({ lps: data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  }
}));
Zustand + Persist 미들웨어
사용자의 다크모드 설정이나 인증 토큰처럼 새로고침해도 날아가면 안 되는 데이터를 localStorage 등에 자동으로 동기화(저장 및 복구)해 주는 기특한 내장 미들웨어입니다.

TypeScript
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
    }),
    { name: 'auth-storage' } // localStorage에 저장될 Key 이름
  )
);
Zustand + Immer 함께 쓰기
위에서 언급한 중첩 객체 스프레드 연산 지옥을 지워버릴 수 있는 꿀조합입니다. 무조건 복사본을 리턴해야 하는 규칙을 깨고 직관적인 뮤테이션을 가능케 합니다.

TypeScript
import { immer } from 'zustand/middleware/immer';

const useComplexStore = create(
  immer((set) => ({
    nested: { user: { name: '태은' } },
    changeName: (name) => set((state) => {
      state.nested.user.name = name; // Immer가 복사본을 알아서 만들어줌!
    }),
  }))
);
Zustand vs Context API
Context API: 의존성이 매우 단순할 때 쓰기 편하나, 고질적인 'Value 전역 구독 리렌더링 부작용'이 있습니다. Provider 내부의 무언가 하나라도 바뀌면 해당 Context를 구독하는 하위 모든 컴포넌트가 강제 리렌더링되어 성능 최적화(배일러 아웃)를 직접 수동 매니징해야 합니다.

Zustand: 외부 스토어 구조이기 때문에 리액트 리렌더링 흐름과 분리되어 있고, 셀렉터 원자 구독 방식을 취하므로 대규모 데이터 스트림 및 빈번한 업데이트 상황에서도 극도의 성능 우위를 점합니다.

🍠 React 전역 상태 관리 완벽 가이드 블로그 심화 정리
Q1. Context API의 value 전체 구독 메커니즘 vs Zustand의 selector 기반 구독의 성능 차이
Context API는 전역 상태가 변경되면 해당 컨텍스트의 <Provider> 하위에서 useContext를 호출하는 모든 컴포넌트가 변경된 상태값의 사용 여부와 상관없이 무조건 렌더링 파이프라인을 타게 됩니다. 이를 막으려면 값을 쪼개어 여러 Provider로 분리하거나 useMemo 등으로 하위 컴포넌트를 감싸야 하는 엄청난 공수가 듭니다.

반면 Zustand는 스토어의 데이터가 변경되더라도 각 컴포넌트가 인자로 주입한 셀렉터 함수(state => state.todo)의 리턴값 변동 여부를 엄격한 동등 비교(Object.is)를 통해 사전 검증합니다. 가리키는 원자적 값이 바뀌지 않았다면 컴포넌트에 리렌더링 전파를 원천 차단하므로, 데이터 크기가 커질수록 Context API 대비 어마어마한 렌더링 연산 이득과 성능적 우위를 가집니다.

Q2. Jotai의 atom 조합 방식이 파생 상태 관리에서 Zustand 대비 갖는 장점 (의존성 추적 관점)
Zustand는 단일의 거대한 중앙 집중식 Store 구조입니다. 어떤 상태를 기반으로 가공된 '파생 상태(Computed State)'를 만들려면 액션 내부에서 데이터를 바꿀 때마다 파생 값까지 수동으로 갱신해 주거나, 셀렉터 안에서 매번 무거운 계산 로직을 돌려야 하므로 상태 간의 얽힌 의존성을 추적하고 관리하기가 상대적으로 어렵습니다.

반면 Jotai는 Bottom-up(상향식) 원자 구조를 취합니다. 작은 기본 원자(countAtom)를 조합하여 파생 원자(doubleCountAtom = atom(get => get(countAtom) * 2))를 선언해 두면, Jotai 엔진이 런타임에 이들의 관계를 그래프 구조로 스스로 추적(Dependency Tracking)합니다. 개발자가 일일이 "이게 바뀔 때 저것도 바꿔라" 하고 명령형으로 선언하지 않아도 기본 아톰이 업데이트될 때 파생 아톰들이 연쇄적으로 알아서 완벽하게 동기화되므로, 복잡하고 유기적인 상태 결합 구조에서 Zustand보다 훨씬 선언적이고 안전합니다.

Q3. 서버 상태를 useEffect로 관리할 때 발생하는 캐싱/중복 요청/불일치 문제
캐싱 부재 (No Caching): useEffect 내부에서 단순 가져오기(fetch)를 돌리면, 유저가 페이지를 이동했다가 다시 돌아올 때마다 이미 받아왔던 똑같은 데이터인데도 처음부터 다시 조회를 시작합니다. 이는 무의미한 네트워크 자원 낭비와 잦은 로딩 스피너 노출로 이어져 UX를 심각하게 갉아먹습니다.

중복 요청 폭탄 (Request Duplication & Race Condition): 한 화면에 동일한 서버 데이터를 공유하는 컴포넌트가 3~4개 동시에 마운트되면, 각 컴포넌트의 useEffect가 독립적으로 실행되어 동일한 API 요청을 동시에 수차례 난사하는 대참사가 발생합니다. 또한, 네트워크 지연으로 인해 1번 요청과 2번 요청의 응답 순서가 뒤바뀌어 구버전 데이터가 신버전 데이터를 덮어쓰는 레이스 컨디션(Race Condition) 오류에 무방비로 노출됩니다.

데이터 불일치 (Server-Client Mismatch): 클라이언트의 컴포넌트 상태(State)는 한 번 받아온 시점의 스냅샷일 뿐입니다. 서버의 DB 데이터가 수정되거나 삭제되더라도 클라이언트는 내부에 들고 있는 정보가 신선한지(Fresh) 썩었는지(Stale) 판별할 기준 시스템이 아예 없기 때문에, 유저에게 계속 철 지난 데이터를 보여주는 데이터 싱크 불일치 문제를 필연적으로 겪게 됩니다. (이를 극복하기 위해 TanStack Query 같은 별도의 서버 상태 관리 라이브러리가 탄생한 이유이기도 합니다.)