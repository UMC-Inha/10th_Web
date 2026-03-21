- null과 undefined의 차이점에 대해 직접 작성해주세요 🍠
    
    #### null
    
    null은 의도적으로 “값이 없음”을 표현하기 위해 직접 할당하는 값이다. 주로 값이 나중에 들어올 예정이거나, 현재는 비어있음을 명확하게 나타내고 싶을 때 사용한다. 
    
    즉, **의도적으로 비워둔 상태**를 의미한다.
    
    #### undefined
    
    undefined는 변수가 선언되었지만 아직 값이 할당되지 않았을 때, 자바스크립트가 자동으로 부여하는 값이다. 객체에서 존재하지 않는 속성에 접근하거나, 함수에서 반환값이 없을 때도 undefined가 반환된다.
    
    즉, **값이 아직 정의되지 않은 상태**를 의미한다.
    
    | 구분 | undefined | null |
    | --- | --- | --- |
    | 의미 | 값이 아직 할당 되지 않음 | 값이 없음을 의도적으로 명시함 |
    | 주체 | JS가 자동으로 부여 | 개발자가 직접 부여 |
    | `typeof` | `“undefined”` | `“object”` |
    
    **✅ 차이점 정리 :** null은 의도적으로 비워둔 상태, undefined는 아직 값이 없는 상태

    - 실습 정리 🍠
    
    TypeScript Playground 사이트에서 작성해보았습니다
    
    - string
        
        텍스트 데이터를 다룰 때 사용한다.
        
        ![image.png](attachment:35022ac3-b976-4677-b0f5-f79b46ee2232:image.png)
        
    - number
        
        정수, 실수 구분 없이 모든 숫자를 담당한다.
        
        “따옴표” 안에 들어간 숫자는 타입 스크립트에서 무조건 문자열 취급 한다.
        
        ![image.png](attachment:000db558-77ab-4dd5-9110-c415719d7f04:image.png)
        
    - boolean
        
        오직 `true`와 `false`만 취급한다.
        
        따라서 `“true”`는 boolean이 아닌 문자열로 취급하여 오류가 뜬다.
        
        ![image.png](attachment:92dd9e7b-a3d0-451f-bf0f-74525d53f13d:image.png)
        
    - null
        
        null 타입에는 오직 null만 사용 해야 한다. 0도 숫자로 값이 존재하는 상태이므로 오류이다
        
        ![image.png](attachment:09acf9d7-ee08-471a-918b-29d8c653a693:image.png)
        
    - undefined
        
        값이 할당 되지 않음을 나타낸다. undefined는 undefined만 들어갈 수 있다.
        
        ![image.png](attachment:46e3c8e2-e97d-45b8-9e56-f8352f976e38:image.png)
        
    - symbol
        
        중복되지 않는 고유한 값을 만들 때 사용한다.
        
        symbol은 symbol() 함수에 의해서만  만들어지는 타입이다.
        
        ![image.png](attachment:0df4fe2c-a447-46fc-8d61-8598afb73fde:image.png)
        
    - bigint
        
        number에서 감당 할 수 없는 큰 숫자를 다룰 때 사용한다.
        
        일반 숫자는 **`number`** 타입이라서 **biginit**에서는 오류가 발생한다. **biginit**에는 숫자 뒤에 n을 붙여야 한다.
        
        ![image.png](attachment:dfdcd6e3-0ef5-49e1-b950-6fa61f7b2bf4:image.png)
        
    - object
        
        모든 복합 데이터를 나타낸다. 객체가 와야 할 자리에 기본 타입이 오면 에러이다.
        
        ![image.png](attachment:bef24065-1761-4d41-bcb2-dc25c1b1d996:image.png)

        - 함수 선언식의 특징에 대해 정리해주세요!🍠
    
    함수 선언식은 전통적인 방식의 함수 정의 방법으로, `function` 키워드를 사용하여 정의한다.
    
    1. **함수 호이스팅**
        
        함수 선언식에서는 선언 이전에도 호출 할 수 있다.
        
        ```tsx
        chooseMenu(); //선언 이전 호출 가능
        
        functionchooseMenu() {
        console.log("뭐 먹을까?");
        }
        ```
        
    2. **this 바인딩**
        
        함수 선언식은 호출 방식에 따라 `this`가 동적으로 결정된다
        
    3. **생성자 함수로 사용가능**
        
        `new` 키워드를 사용해서 생성자 함수로 사용 할 수 있다.
        
    4. **arguments 객체 사용 가능**
        
        함수 내부에서 `arguments` 객체를 사용할 수 있어, 전달된 인자를 유연하게 처리할 수 있다.
        
- 화살표 함수의 특징에 대해 정리해주세요!🍠
    
    화살표 함수는 ES6에서 도입된 함수 표현식으로, 기존 함수보다 간결한 문법이 특징이다. `this` 바인딩 방식에서 차이가 있다.
    
    1. **간단한 문법**
        
        function 키워드 없이 `=>` 를 사용하여 함수를 정의할 수 있으므로 코드가 짧다.
        
    2. **this 바인딩**
        
        화살표 함수는 자신만의 `this`를 가지지 않고 **상위 스코프의 `this`를 그대로 사용**한다.
        
    3. **생성자 함수로 사용 불가**
        
        화살표 함수는 new 키워드를 사용 할 수 없고 생성자 함수로 사용할 수 없다.
        
    4. **argument 객체가 없다**
        
        화살표 함수는 arguments 객체를 가지지 않기 때문에 rest parameter를 사용 해야 한다.
        
        ```tsx
        constfn= (...args) =>console.log(args);
        ```
        
    5. **return 생략 가능**
        
        중괄호 없이 작성할때 return을 생략 할 수 있다.
        
        ```tsx
        constsquare=x =>x*x;
        ```

        - any 🍠
    
    `any`는 모든 타입을 허용하는 타입으로 특정 변수의 타입을 모를 때 사용할 수 있다. 변수의 타입을 `any`로 지정하면 자유롭게 값을 사용할 수 있다.
    
    #### ✅ 특징
    
    - 타입 체크 하지 않는다
    - 어떤 연산이든 허용한다
    
    ```tsx
    let anyVar: any = 10;
    
    anyVar = "hello";
    anyVar = true;
    anyVar = {};
    anyVar = () => {};
    
    anyVar.toUpperCase();
    anyVar.toFixed();
    ```
    
    문자열 말고도 boolean,객체, 함수도 집어 넣을 수 있다. 그 후에 toUpperCase 문자형 메소드나, toFixed같은 숫자형 메소드를 사용해도 파일내에서는 오류가 발생하지 않는다
    
    ```tsx
    let num: number = 10;
    num = anyVar;
    ```
    
    num이라는 변수를 만들고 number타입으로 설정한 다음 anyVar를 집어넣어도 오류가 발생하지 않는다. 하지만 컴파일하고 나면 런타임에서 오류가 발생한다. 
    
    anyVar의 마지막에는 함수가 들어가있는데 toUpperCase같은 문자형 메소드를 사용하려니까 오류가 발생한다. 이걸 통해 알 수 있는 것은 **타입 검사를 하지 않는다**는 것이다.
    
- unknown 🍠
    
    `unknown`은 `any`와 비슷하게 모든 값을 받을 수 있지만, 사용하기 전에 반드시 **타입 검사**를 하는 타입이다.
    
    ```tsx
    letvalue:unknown="hello";
    
    if (typeofvalue==="string") { // 타입 정제
    console.log(value.toUpperCase());
    }
    ```
    
    위의 코드처럼 unknown타입의 변수가 string 타입임을 확실히 밝혀주었을 때만 unknown 타입의 변수를 string 타입으로 사용할 수 가 있다. 이러한 과정을  **타입 정제** 혹은 **타입 좁히기** 라고 한다.
    
- void 🍠
    
    `void`는 함수에서 **반환값이 없음**을 의미하는 타입이다.
    
    ```tsx
    functionlogMessage():void {
    console.log("hello");
    }
    ```
    
- never 🍠
    
    `never`는 절대 값을 반환하지 않는 경우에 사용되는 타입이다. 함수가 끝까지 실행되지 않는 상황을 말한다.
    
    대표적인 예시로는 무한 루프, 에러 함수가 있다.
    
    ```tsx
    functioninfiniteLoop():never {
    while (true) {}
    }
    
    functionthrowError():never {
    thrownewError("에러 발생");
    }
    ```
    
    예시들 처럼 함수에 반환값이 있는게 모순일때 never를 사용한다.
    
    `never` 타입도 변수의 타입으로 정의 할 수 있다.
    
    ```tsx
    let b : never;
    
    //어떤 값도 담을 수 없다
    b=1;
    b = {};
    b = "";
    b = undefined;
    ```
    
    `never` 타입은 undefined나 null도 담을 수 없다. 즉, 어떤 값도 저장 할 수 없는 변수의 타입으로 정의할 때 활용 하면 된다
    
    | void | never |
    | --- | --- |
    | 반환값이 없을 때 사용 | 절대 반환되지 않을 때 사용 |
    | 함수가 끝나고 그냥 종료 | 함수가 끝나지 않거나 에러 던짐 |
    | return문 없어도 됨 | return문 자체가 없음 |