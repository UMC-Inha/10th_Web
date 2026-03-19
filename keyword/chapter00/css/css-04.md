<!-- 아래 블로그를 참고하여 BEM 방법론에 대해 직접 정리해 보세요.
https://www.yolog.co.kr/post/css-bem-methodologys -->

# BEM이란?
Block, Element, Modifier

## 1. Block
독립적으로 의미가 있는 큰 단위  
다른 블록에 의존하지 않고 재사용이 가능하며 위치가 바뀌어도 동작하는 독립 컴포넌트

- 예시
    - `card`
    - `button`
    - `header`
```
<div class="card">
  ...
</div>
```

## 2. Element
Block 안에 들어가는 부품  
반드시 어떤 Block에 속해야 의미를 가짐  
Block과 Element는 `_`로 연결됨  

- 예시
    - `card_image`
    - `card_title`
    - `menu_item`
```
<div class="card">
  <img class="card__image" />
  <h3 class="card__title">상품 이름</h3>
</div>
```

## 3. Modifier
Block이나 Element의 상태, 모양, 변형을 나타내는 것  
활성 메뉴, 에러 상태 input 같이 Modifier는 `--`으로 연결됨  
기본형에 옵션을 붙이는 것

- 예시
    - `button-large`
    - `button-primary`
    - `menu_item--active`

## 주의할 점
1. Element 안에 Element 만들기
```
/* ❌ 잘못된 예 */
.card__header__title {
}

/* ✅ 올바른 예 */
.card__header {
}
.card__title {
}
```

2. Modifier만 단독 사용
```
<!-- ❌ 잘못된 예 -->
<button class="--primary">버튼</button>

<!-- ✅ 올바른 예 -->
<button class="button button--primary">버튼</button>
```

3. 의미 없는 이름 사용
```
/* ❌ 피해야 할 이름 */
.card__div {
}
.card__span {
}
.card__element1 {
}

/* ✅ 의미 있는 이름 */
.card__wrapper {
}
.card__label {
}
.card__content {
}
```

## 장점
- 클래스명만으로 구조 파악이 가능
- 영향 범위가 명확해서 리팩토링이 쉬워짐
- 일관된 규칙으로 누구나 코드 파악 가능
- CSS 충돌 x