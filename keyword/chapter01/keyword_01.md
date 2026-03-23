- null과 undefined의 차이점에 대해 직접 작성해주세요 🍠
  - null: 어떤 reference 변수에 대해 주소값이 없는 것을 표현하기 위한 키워드로 객체의 속성값이 존재하지 않을 때나 함수의 매개변수를 초기화하기 위한 용도로 사용
  - undefined: 변수를 초기화하지 않았을 때 자동으로 할당되는 값으로 값이 없는 것이 아닌, 값이 아직 할당되지 않은 것 -차이점
  1. 의미
     -undefined: 값이 할당된 적 없음
     -null: 의도적으로 값이 없음을 나타냄
  2. 발생 주치
     -undefined: 시스템
     -null: 개발자
  3. 자료형(type of)
     -undefined: undefined
     -null: object
  4. 느슨한 비교(==)
     -undefined: undefined == null
     -null: 값은 true
  5. 엄격한 비교(===)
     -undefined: undefined == null
     -null: 값은 false

함수에서의 TypeScript 🍠

- 함수 선언식의 특징에 대해 정리해주세요!
  - 매개 변수와 반환 값 모두 `:데이터 타입` 으로 타입을 명시해줘야 해요.
  - 함수를 적을 때 function이라는 말이 필요해요!
- 화살표 함수의 특징에 대해 정리해주세요!
  - 매개 변수와 반환 값 모두 `:데이터 타입` 으로 타입을 명시해줘야 해요.
  - function을 적지 않고 변수 선언하고 바로 화살표 함수로 리턴값을 할당할 수 있어요 -화살표 함수 (=>) 는 현대적인 함수 작성 방법입니다. function 키워드를 사용하여 작성하는 함수 선언식 또는 표현식에 비해서 더 간결한 문법과 this 바인딩 방식이라는 결정적인 차이점을 가집니다.
    1. 자체 바인딩이 존재하지 않습니다.
    2. 화살표 함수는 자체적인 arguments 객체를 가지지 않습니다.
    3. method 로 사용하면 안됩니다.
    4. 생성자로 사용하면 안되고, new.target 키워드에 대한 액서스 또한 없습니다.
    5. 함수 내부에서 yield 를 사용할 수 없으며 제너레이터 함수로 생성할 수 없습니다. -함수 표현식은 호이스팅 되지 않음 -변수 선언 자ㅔ(var, let)은 호이스팅될 수 있지만, 함수가 할당되는 시점은 코드가 실행되는 시점이므로 할당 전에 호출하면 에러 발생!

- 타입 스크립트에만 존재하는 타입 🍠
  - any 🍠
    //any: 모든 타입 허용
    let value: any;
    value = 123;
    value = "string";
    value = true;
    value = 10n;
    value = null;
    //타입 스크립트의 장점이 줄어들어 남용X
  - unknown 🍠
    - `typeof` , `instanceof`, `isArray()` 등을 통해 검증이 필요해요
      //unknown: 모든 타입 허용하지만, 사용 전 타입 검증 필요
      //타입 검증
      let data: unknown;
      data = "안녕하세요";
      data = 123;
      if(typeof data === "string") {
      console.log(data);
      }
      else if(typeof data === "number") {
      console.log(data);
      }
      //객체 검증
      let obj: unknown;
      obj = new Date();
      if(obj instanceof Date) {
      console.log(obj.getDate());
      }

    ```

    ```

  - void 🍠
    //void: 반환 값 없음 -> C++에서의 void와 같은 역할이에요!
    function sum(x: number, y: number): void {
    console.log(x + y);
    }

  - never 🍠
    //never: 절대 값을 반환하지 않는 함수
    //예외 처리하는 함수
    function throwError(message: string): never {
    throw new Error(message);
    }
    //무한 루프 함수
    function infiniteLoop(): never {
    while (true) {
    console.log("running...");
    }
    }
