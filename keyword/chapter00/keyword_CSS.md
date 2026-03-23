- border vs outline의 차이점 🍠
    
    `border`와 `outline`은 모두 요소의 테두리를 표현한다. 차이점은 동작 방식에 있다
    
    - `border`는 요소의 크기에 포함되며, box-sizing에 영향을 받아 전체 크기가 변한다.
    - `outline`은 요소 바깥에 그려지며, 요소의 크기나 레이아웃에 영향을 주지 않는다.
    
    따라서 `border`는 실제 레이아웃 구성에 영향을 주는 스타일이고,
    
    `outline`은 레이아웃에 영향을 주지 않으면서 시각적으로 강조할 때 사용된다.

    - relative / absolute 🍠
    
    ### relative / absolute
    
    ### **📍 relative 포지션 이해하기**
    
    <aside>
    💡 **`relative`**는 Document Flow에 따라 원래 본인이 있어야 할 위치를 기준으로, 좌표 프로퍼티(top / bottom / left / right) CSS 스타일을 통해 위치를 이동시키는 속성이에요.
    
    </aside>
    
    ### **1. relative 실습해보기**
    
    ```html
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <style>
        .box {
          width: 100px;
          height: 100px;
          background-color: purple;
          color: white;
          box-sizing: border-box;
          position: relative;
        }
      </style>
    </head>
    
    <body>
      <div class="box">BOX</div>
      <h1>고구마 상자</h1>
    </body>
    
    </html>
    ```
    
    위의 코드를 실행하면 아래와 같은 화면이 보여요:
    
    ![스크린샷 2024-07-18 오후 6.54.25.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/e57bc1c9-a051-46a7-9c15-f5e2f1fea50c/9afde3c4-1322-40ff-b7d6-6c7ca24dbde4/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-07-18_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_6.54.25.png)
    
    자, 이제 보라색 박스를 위에서 50px만큼 아래로 내리고, 왼쪽에서 50px만큼 오른쪽으로 이동시켜봐요. **`relative`**를 설정한 후 아래와 같은 속성을 적용하세요.
    
    <aside>
    💡
    
    **이동 방향 이해하기:**
    
    - 위 → 아래로 이동: `top` CSS 적용
    - 왼쪽 → 오른쪽으로 이동: `left` CSS 적용
    - 아래 → 위로 이동: `bottom` CSS 적용
    - 오른쪽 → 왼쪽으로 이동: `right` CSS 적용
    </aside>
    
    ```html
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <style>
        .box {
          width: 100px;
          height: 100px;
          background-color: purple;
          color: white;
          box-sizing: border-box;
          position: relative;
          top: 50px;
          left: 50px;
        }
      </style>
    </head>
    
    <body>
      <div class="box">BOX</div>
      <h1>고구마 상자</h1>
    </body>
    
    </html>
    ```
    
    ![스크린샷 2024-07-18 오후 6.56.12.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/e57bc1c9-a051-46a7-9c15-f5e2f1fea50c/b4018543-15bf-451e-921c-e4530f3645de/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-07-18_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_6.56.12.png)
    
    <aside>
    💡
    
    **실습 과제:
     -** 이제 여러분 차례예요! 위의 이미지 상태에서 고구마 상자를 아래 이미지처럼 이동시켜보세요.
    
    **힌트:**
    
    - `bottom`과 `right` 속성을 활용하세요
    - 필요하다면 고구마 상자 h1 태그에 class명을 부여해도 좋아요
    - ⭐️ **중요:** 음수 값도 사용할 수 있어요! (예: top: -20px)
    </aside>
    
    ![스크린샷 2024-07-18 오후 6.57.43.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/e57bc1c9-a051-46a7-9c15-f5e2f1fea50c/fd7e2bc8-0597-4eff-a26b-0ffbffe17e43/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-07-18_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_6.57.43.png)
    
    - 여러분의 코드를 아래에 첨부하세요 🍠
        
        ```html
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
          <style>
            .box {
              width: 100px;
              height: 100px;
              background-color: purple;
              color: white;
              box-sizing: border-box;
              position: relative;
              bottom: -160px;
              right: 0px;
            }
          </style>
        </head>
        
        <body>
          <div class="box">BOX</div>
          <h1>고구마 상자</h1>
        </body>
        
        </html>
        ```
        
        실행 결과
        
        ![image.png](attachment:ddc3aa6c-7f2d-46cc-8d4a-f24cf6558916:image.png)
        
    
    ### **📍** absolute 포지션 이해하기
    
    <aside>
    💡  **`absolute`는 Document Flow에서 완전히 제외되며, `position: static`이 아닌 부모/조상 요소를 기준으로 위치가 결정돼요.**
    
    **기준이 되는 부모/조상 요소:**
    
    - `position: relative`
    - `position: absolute`
    - `position: fixed`
    
    이 중 가장 가까운 조상을 기준으로 삼아요. 만약 아무도 position이 설정되어 있지 않다면? 최상위 요소인 `<body>`를 기준으로 움직여요!
    
    **꼭 기억하세요:** 부모 요소를 기준으로 위치를 정하고 싶다면, 반드시 그 부모 요소에 `position: relative`를 선언하세요!
    
    </aside>
    
    ### **2. absolute 실습해보기**
    
    이제 absolute의 강력한 기능을 직접 체험해봐요:
    
    ```html
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <style>
        /** 전체 선택자 기본적으로 설정된 마진을 없앰. */
        * {
          margin: 0;
          box-sizing: border-box;
        }
    
        .box1 {
          width: 500px;
          height: 500px;
          background-color: purple;
          color: white;
          position: relative;
        }
    
        .box2 {
          width: 200px;
          height: 200px;
          background-color: yellow;
        }
      </style>
    </head>
    
    <body>
      <div class="box1">BOX1</div>
      <h1 class="box2">BOX2</h1>
    </body>
    
    </html>
    ```
    
    위의 코드를 실행하면 아래와 같은 화면이 보여요:
    
    ![스크린샷 2024-07-18 오후 7.12.14.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/e57bc1c9-a051-46a7-9c15-f5e2f1fea50c/8af63428-2ea1-455d-94e5-52da156d58f6/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-07-18_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_7.12.14.png)
    
    <aside>
    🚨
    
    **실습 과제:
    - `position: absolute`**를 활용해서 아래 이미지처럼 BOX2를 BOX1 안으로 이동시켜보세요!
    
    **힌트:**
    
    1. BOX2에 `position: absolute`를 설정하세요
    2. BOX1이 이미 `position: relative`를 가지고 있으니, BOX2는 BOX1을 기준으로 움직일 거예요
    3. `top`, `left` 속성을 적절히 조합해보세요
    4. absolute로 설정하면 BOX2가 Document Flow에서 빠지면서 다른 요소들에 영향을 주지 않게 돼요!
    </aside>
    
    - **`position: absolute`**를 활용하여 본인의 힘으로, 아래와 같은 이미지로 BOX2를 이동시켜보세요! 🍠
        
        ![스크린샷 2024-07-18 오후 7.13.52.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/e57bc1c9-a051-46a7-9c15-f5e2f1fea50c/5a810066-8c42-4e8a-a2ac-fe8757085432/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-07-18_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_7.13.52.png)
        
        ### 코드는 아래에 첨부해주세요!
        
        ```html
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
          <style>
            /** 전체 선택자 기본적으로 설정된 마진을 없앰. */
            * {
              margin: 0;
              box-sizing: border-box;
            }
        
            .box1 {
              width: 500px;
              height: 500px;
              background-color: purple;
              color: white;
              position: relative;
            }
        
            .box2 {
              width: 200px;
              height: 200px;
              background-color: yellow;
              position: absolute;
              top: 0px;
              left: 0px;
            }
          </style>
        </head>
        
        <body>
          <div class="box1">BOX1</div>
          <h1 class="box2">BOX2</h1>
        </body>
        
        </html>
        ```

        - 정렬의 진수 🍠
    
    ### 다양한 정렬 방법
    
    **프론트엔드 개발**에서 요소를 가운데 정렬하는 건 정말 자주 마주치는 작업이에요. 
    
    상황에 따라 적절한 방법을 선택할 수 있도록, 5가지 핵심 정렬 방법을 마스터해봐요!
    
    <aside>
    💡
    
    **왜 여러 가지 방법을 알아야 할까요?**
    
    - 상황마다 최적의 방법이 다르기 때문이에요
    - 브라우저 호환성을 고려해야 할 때가 있어요
    - 레이아웃 구조에 따라 특정 방법이 더 효율적일 수 있어요
    </aside>
    
    ### 키워드 정리
    
    - text-align
        
        # text-align
        
        ### 기본 개념
        
        블록 요소 내부의 **인라인 콘텐츠**를 수평 정렬하는 속성이에요.
        
        ---
        
        ### 주요 값
        
        ```css
        text-align: left;     /* 왼쪽 정렬 (기본값) */
        text-align: right;    /* 오른쪽 정렬 */
        text-align: center;   /* 가운데 정렬 */
        text-align: justify;  /* 양쪽 정렬 */
        text-align: start;    /* 문서 시작 방향 */
        text-align: end;      /* 문서 끝 방향 */
        ```
        
        ---
        
        ### 적용 대상
        
        - ✅ 텍스트
        - ✅ 인라인 요소 (`<span>`, `<a>`, `<img>`)
        - ✅ 인라인 블록 (`display: inline-block`)
        - ❌ 블록 요소 자체는 정렬 불가예요
        
    - margin
        
        # margin
        
        ### 기본 개념
        
        요소의 **외부 여백**을 설정하는 속성이에요.
        
        ---
        
        ### 주요 값
        
        ```css
        /* 개별 설정 */
        margin-top: 10px;
        margin-right: 20px;
        margin-bottom: 10px;
        margin-left: 20px;
        
        /* 단축 속성 */
        margin: 10px;                /* 모든 방향 10px */
        margin: 10px 20px;          /* 상하 10px, 좌우 20px */
        margin: 10px 20px 30px;     /* 상 10px, 좌우 20px, 하 30px */
        margin: 10px 20px 30px 40px;/* 상 우 하 좌 (시계방향) */
        
        /* 특수 값 */
        margin: 0 auto;  /* 좌우 자동 여백 (가운데 정렬) */
        margin: inherit;  /* 부모 요소로부터 상속 */
        ```
        
        ### 핵심 특징
        
        - **margin collapse**: 인접한 블록 요소의 상하 마진은 겹쳐요
        - **auto 값**: 남은 공간을 자동으로 배분해요
        - 음수 값도 사용 가능해요
        
        ---
        
    - flex
        
        # flex
        
        ### 기본 개념
        
        **1차원 레이아웃** 시스템으로, 요소들을 행 또는 열로 배치하는 강력한 도구예요.
        
        ---
        
        ### 주요 값
        
        **Container 속성 (부모)**
        
        ```css
        /* Flex 컨테이너 선언 */
        display: flex;
        display: inline-flex;
        
        /* 방향 설정 */
        flex-direction: row;          /* 가로 방향 (기본값) */
        flex-direction: column;       /* 세로 방향 */
        flex-direction: row-reverse;  /* 가로 역방향 */
        flex-direction: column-reverse;/* 세로 역방향 */
        
        /* 줄바꿈 설정 */
        flex-wrap: nowrap;    /* 한 줄에 배치 (기본값) */
        flex-wrap: wrap;      /* 여러 줄 허용 */
        flex-wrap: wrap-reverse;
        
        /* 주축 정렬 */
        justify-content: flex-start;  /* 시작점 정렬 */
        justify-content: center;      /* 중앙 정렬 */
        justify-content: flex-end;    /* 끝점 정렬 */
        justify-content: space-between;/* 양 끝 배치 */
        justify-content: space-around; /* 균등 여백 */
        justify-content: space-evenly; /* 완전 균등 */
        
        /* 교차축 정렬 */
        align-items: stretch;     /* 늘리기 (기본값) */
        align-items: center;      /* 중앙 정렬 */
        align-items: flex-start;  /* 시작점 정렬 */
        align-items: flex-end;    /* 끝점 정렬 */
        align-items: baseline;    /* 텍스트 기준선 */
        
        /* 여러 줄 정렬 */
        align-content: stretch;
        align-content: center;
        align-content: space-between;
        
        /* 간격 설정 */
        gap: 20px;           /* 모든 간격 20px */
        row-gap: 10px;       /* 행 간격 */
        column-gap: 20px;    /* 열 간격 */
        ```
        
        **Item 속성 (자식)**
        
        ```css
        /* 크기 조절 */
        flex-grow: 1;     /* 늘어나는 비율 */
        flex-shrink: 1;   /* 줄어드는 비율 */
        flex-basis: 200px;/* 기본 크기 */
        
        /* 단축 속성 */
        flex: 1;          /* grow: 1, shrink: 1, basis: 0 */
        flex: 1 1 200px;  /* grow shrink basis */
        
        /* 개별 정렬 */
        align-self: center;   /* 자신만 다르게 정렬 */
        
        /* 순서 변경 */
        order: 1;         /* 표시 순서 (음수 가능) */
        ```
        
    - translate
        
        # translate
        
        ### 기본 개념
        
        요소를 **현재 위치에서 이동**시키는 변환 함수예요. **`Document Flow`**에 영향을 주지 않아요.
        
        ---
        
        ### 주요 문법
        
        ```css
        /* 2D 이동 */
        transform: translateX(100px);     /* X축 이동 */
        transform: translateY(50px);      /* Y축 이동 */
        transform: translate(100px, 50px);/* X, Y 동시 */
        transform: translate(50%, 50%);   /* 백분율 사용 */
        
        /* 3D 이동 */
        transform: translateZ(100px);     /* Z축 이동 */
        transform: translate3d(x, y, z);  /* 3D 이동 */
        
        /* 다른 transform과 조합 */
        transform: translate(50px, 100px) rotate(45deg);
        transform: translate(-50%, -50%) scale(1.2);
        ```
        
        ### 핵심 특징
        
        - **GPU 가속**: 성능이 우수해요
        - **백분율 기준**: 자기 자신의 크기가 기준이에요
        - **애니메이션**: transition, animation과 함께 자주 사용돼요
        - **position과 조합**: absolute와 함께 가운데 정렬에 활용돼요
        
        **관련 속성**
        
        ```css
        /* 변환 기준점 */
        transform-origin: center;     /* 중앙 (기본값) */
        transform-origin: top left;   /* 좌상단 */
        transform-origin: 50% 50%;    /* 백분율 */
        
        /* 3D 설정 */
        transform-style: preserve-3d;  /* 3D 공간 유지 */
        perspective: 1000px;           /* 원근감 */
        ```
        
    - grid
        
        # grid
        
        ### 기본 개념
        
        **2차원 레이아웃** 시스템으로, 행과 열을 동시에 다루는 가장 강력한 레이아웃 도구예요.
        
        ---
        
        ### 주요 문법
        
        ### **Container 속성 (부모)**
        
        ```css
        /* Grid 컨테이너 선언 */
        display: grid;
        display: inline-grid;
        
        /* 열 정의 */
        grid-template-columns: 200px 200px 200px;  /* 고정 크기 */
        grid-template-columns: 1fr 2fr 1fr;        /* 비율 */
        grid-template-columns: repeat(3, 1fr);     /* 반복 */
        grid-template-columns: minmax(100px, 1fr); /* 최소/최대 */
        grid-template-columns: auto-fit;           /* 자동 맞춤 */
        
        /* 행 정의 */
        grid-template-rows: 100px 200px;
        grid-template-rows: repeat(3, minmax(100px, auto));
        
        /* 영역 정의 */
        grid-template-areas: 
          "header header header"
          "sidebar main main"
          "footer footer footer";
        
        /* 간격 설정 */
        gap: 20px;              /* 모든 간격 */
        row-gap: 10px;          /* 행 간격 */
        column-gap: 20px;       /* 열 간격 */
        
        /* 자동 배치 */
        grid-auto-flow: row;    /* 행 방향 자동 배치 */
        grid-auto-flow: column; /* 열 방향 자동 배치 */
        grid-auto-flow: dense;  /* 빈 공간 채우기 */
        
        /* 자동 크기 */
        grid-auto-rows: 100px;   /* 자동 생성 행 크기 */
        grid-auto-columns: 1fr;  /* 자동 생성 열 크기 */
        
        /* 정렬 (전체) */
        justify-content: center;  /* 수평 정렬 */
        align-content: center;    /* 수직 정렬 */
        place-content: center;    /* 수평 + 수직 단축 */
        
        /* 정렬 (아이템) */
        justify-items: center;    /* 아이템 수평 정렬 */
        align-items: center;      /* 아이템 수직 정렬 */
        place-items: center;      /* 아이템 정렬 단축 */
        ```
        
        ### **Item 속성 (자식)**
        
        ```css
        /* 위치 지정 */
        grid-column: 1 / 3;      /* 1번째부터 3번째 라인까지 */
        grid-column: span 2;     /* 2개 열 차지 */
        grid-row: 2 / 4;         /* 2번째부터 4번째 라인까지 */
        
        /* 단축 속성 */
        grid-area: 2 / 1 / 4 / 3;  /* row-start / col-start / row-end / col-end */
        grid-area: header;          /* template-areas 이름 사용 */
        
        /* 개별 정렬 */
        justify-self: center;    /* 자신만 수평 정렬 */
        align-self: center;      /* 자신만 수직 정렬 */
        place-self: center;      /* 자신만 정렬 단축 */
        ```
        
        ### **유용한 함수들**
        
        ```css
        /* repeat(): 반복 */
        grid-template-columns: repeat(3, 1fr);
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        
        /* minmax(): 최소/최대값 */
        grid-template-columns: minmax(100px, 300px);
        grid-template-rows: minmax(50px, auto);
        
        /* fr 단위: 비율 */
        grid-template-columns: 1fr 2fr 1fr;  /* 1:2:1 비율 */
        ```
        
    
    ### 위의 키워드를 활용해서 가운데 정렬을 구현해보세요! 🍠
    
    <aside>
    💡
    
    HTML 요소는 여러분이 직접 만들어서, 가운데 정렬을 구현한 영상과 코드를 남겨주세요.
    향후 학습에 있어서 매우 중요한 부분이니, 꼭 직접 코드를 작성하면서 실습해보세요!
    
    </aside>
    
    - text-align
        
        ```html
        <!DOCTYPE html>
        <html lang="ko">
        <head>
          <meta charset="UTF-8">
          <title>text-align 실습</title>
          <style>
            .container {
              width: 500px;
              height: 200px;
              border: 2px solid black;
        
              text-align: center;
            }
        
            .box {
              display: inline-block;
              width: 100px;
              height: 100px;
              background-color: purple;
              color: white;
              line-height: 100px;
            }
          </style>
        </head>
        <body>
        
        <h2>text-align으로 가운데 정렬</h2>
        
        <div class="container">
          <div class="box">BOX</div>
        </div>
        
        </body>
        </html>
        ```
        
        `text-align`은 블록 요소 내부의 텍스트나 인라인 요소를 수평 정렬하는 속성이다. 따라서 정렬을 위해 부모 요소에 `text-align: center`를 적용하고, 자식 요소를 `inline-block`으로 설정하여 인라인 요소처럼 동작하도록 하였다.
        
        ![image.png](attachment:47ada2c4-1c17-407b-8b6a-41f7e7a3f907:image.png)
        
    - margin
        
        ![image.png](attachment:93dececb-b4b8-4d07-9ebd-204f151c8ce5:image.png)
        
        ```html
        <!DOCTYPE html>
        <html lang="ko">
        <head>
          <meta charset="UTF-8">
          <title>margin 정렬 실습</title>
          <style>
            .container {
              width: 500px;
              height: 200px;
              border: 2px solid black;
            }
        
            .box {
              width: 100px;
              height: 100px;
              background-color: purple;
              color: white;
              line-height: 100px;
              text-align: center;
        
              margin: 0 auto;
            }
          </style>
        </head>
        <body>
        
        <h2>margin으로 가운데 정렬</h2>
        
        <div class="container">
          <div class="box">BOX</div>
        </div>
        
        </body>
        </html>
        ```
        
    - flex
        
        ```html
        <!DOCTYPE html>
        <html lang="ko">
        <head>
          <meta charset="UTF-8">
          <title>flex 정렬 실습</title>
          <style>
            .container {
              width: 500px;
              height: 200px;
              border: 2px solid black;
        
              display: flex;              
              justify-content: center;   
              align-items: center;   
            }
        
            .box {
              width: 100px;
              height: 100px;
              background-color: purple;
              color: white;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          </style>
        </head>
        <body>
        
        <h2>flex로 가운데 정렬</h2>
        
        <div class="container">
          <div class="box">BOX</div>
        </div>
        
        </body>
        </html>
        ```
        
        ![image.png](attachment:d07092d3-f710-4c1d-86dd-d7242d7a47a3:image.png)
        
    - translate
        
        ```html
        <!DOCTYPE html>
        <html lang="ko">
        <head>
          <meta charset="UTF-8">
          <title>translate 정렬 실습</title>
          <style>
            .container {
              width: 500px;
              height: 200px;
              border: 2px solid black;
        
              position: relative;
            }
        
            .box {
              width: 100px;
              height: 100px;
              background-color: purple;
              color: white;
        
              position: absolute;
              top: 50%;
              left: 50%;
        
              transform: translate(-50%, -50%);
              
              display: flex;
              justify-content: center;
              align-items: center;
            }
          </style>
        </head>
        <body>
        
        <h2>translate로 가운데 정렬</h2>
        
        <div class="container">
          <div class="box">BOX</div>
        </div>
        
        </body>
        </html>
        ```
        
        ![image.png](attachment:d285bc33-563f-499b-b930-c761cffef82e:image.png)
        
    - grid
        
        ```html
        <!DOCTYPE html>
        <html lang="ko">
        <head>
          <meta charset="UTF-8">
          <title>grid 정렬 실습</title>
          <style>
            .container {
              width: 500px;
              height: 200px;
              border: 2px solid black;
        
              display: grid;       
              place-items: center; 
            }
        
            .box {
              width: 100px;
              height: 100px;
              background-color: purple;
              color: white;
        
              display: flex;
              justify-content: center;
              align-items: center;
            }
          </style>
        </head>
        <body>
        
        <h2>grid로 가운데 정렬</h2>
        
        <div class="container">
          <div class="box">BOX</div>
        </div>
        
        </body>
        </html>
        
        ```
        
        ![image.png](attachment:5302bb4c-5dc0-4423-ab63-424e00f94b16:image.png)
        
- 반응형 background 🍠
    
    ### 아래 반응형 background 관련 키워드를 정리해보세요 🍠
    
    <aside>
    💡
    
    아래 키워드에 대해 정리한 후,  코드와 실행 영상을 남겨주세요!
    
    </aside>
    
    - background-image
        
        배경 이미지를 설정
        
        ```html
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .box {
              width: 300px;
              height: 200px;
              background-image: url("./Figure_1.png");
              border: 1px solid black;
            }
          </style>
        </head>
        <body>
          <div class="box"></div>
        </body>
        </html>
        ```
        
    - background-repeat
        
        이미지 반복 여부 설정
        
        ```html
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .box {
              width: 300px;
              height: 200px;
              background-image: url("./Figure_1.png");
              background-repeat: no-repeat;
              border: 1px solid black;
            }
          </style>
        </head>
        <body>
          <div class="box"></div>
        </body>
        </html>
        ```
        
    - background-position
        
        이미지 위치 설정
        
        ```html
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .box {
              width: 300px;
              height: 200px;
              background-image: url("./Figure_1.png");
              background-repeat: no-repeat;
              background-position: center;
              border: 1px solid black;
            }
          </style>
        </head>
        <body>
          <div class="box"></div>
        </body>
        </html>
        ```
        
    - background-size
        
        이미지 크기 설정
        
        ```html
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .box {
              width: 300px;
              height: 200px;
              background-image: url("./Figure_1.png");
              background-repeat: no-repeat;
              background-size: cover;
              border: 1px solid black;
            }
          </style>
        </head>
        <body>
          <div class="box"></div>
        </body>
        </html>
        ```
        
    - 축약형
        
        여러 배경 속성을 한 번에 설정
        
        ```html
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .box {
              width: 300px;
              height: 200px;
              background: url("./Figure_1.png") no-repeat center / cover;
              border: 1px solid black;
            }
          </style>
        </head>
        <body>
          <div class="box"></div>
        </body>
        </html>
        ```
        
    
    [background - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/background)
    
- transform 🍠
    
    ### transform 🍠
    
    CSS **`transform`** 속성으로, 요소에 회전 크기 조절, 기울이기, 이동 효과를 부여할 수 있어요.
    
     `transform`은 CSS [시각적 서식 모델](https://developer.mozilla.org/en-US/docs/Web/CSS/Visual_formatting_model)의 좌표 공간을 변경해요.
    
    <aside>
    💡 아래 키워드에 대해 정리한 후, 코드와 실행 영상을 남겨주세요!
    
    </aside>
    
    - translate
        
        요소의 위치를 X축, Y축 방향으로 이동시키는 속성, `position` 없이도 요소를 시각적으로 이동할 수 있으며, 원래 자리에는 영향을 주지 않는다.
        
        ```html
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .box {
              width: 100px;
              height: 100px;
              background: purple;
              transform: translate(150px, 30px);
            }
          </style>
        </head>
        <body>
          <div class="box"></div>
        </body>
        </html>
        ```
        
        ![image.png](attachment:8c3d1e07-f4b7-4cec-884b-cffc95c1dea7:image.png)
        
    - scale
        
        요소의 크기를 확대 또는 축소하는 속성, 그 값이 1보다 크면 확대, 1보다 작으면 축소된다.
        
        ```html
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .box {
              width: 100px;
              height: 100px;
              background: purple;
              transform: scale(1.5);
            }
          </style>
        </head>
        <body>
          <div class="box"></div>
        </body>
        </html>
        ```
        
    - rotate
        
        요소를 지정한 각도만큼 회전시키는 속성 ,단위는 deg를 사용하며, 양수는 시계 방향으로 회전한다.
        
        ```html
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .box {
              width: 100px;
              height: 100px;
              background: purple;
              transform: rotate(45deg);
            }
          </style>
        </head>
        <body>
          <div class="box"></div>
        </body>
        </html>
        ```
        
        ![image.png](attachment:324cb60a-92ca-4839-a44c-6834c5de4472:image.png)
        
    - skew
        
        요소를 X축 또는 Y축 방향으로 기울이는(비틀기) 속성, 요소의 모양이 평행사변형처럼 변형된다.
        
        ```html
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .box {
              width: 100px;
              height: 100px;
              background: purple;
              transform: skew(20deg, 10deg);
            }
          </style>
        </head>
        <body>
          <div class="box"></div>
        </body>
        </html>
        ```
        
        ![image.png](attachment:a0a81889-6299-43b4-b5c6-b71797df9dbc:image.png)
        
    - matrix
        
        위의 transform들을 하나의 행렬 값으로 표현하는 방식, 여러 변환이 합쳐진 결과를 표현할 때 사용된다. 구조는 `matrix(scaleX, skewY, skewX, scaleY, translateX, translateY)` 이와 같다.
        
        ```html
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .box {
              width: 100px;
              height: 100px;
              background: purple;
              transform: matrix(1, 0.2, 0.2, 1, 50, 30);
            }
          </style>
        </head>
        <body>
          <div class="box"></div>
        </body>
        </html>
        ```
        
        ![image.png](attachment:d28afcdf-82c5-4804-bcfc-1250a432be6e:image.png)
        
    
    [transform - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)
    
- transition 🍠
    
    ### transition  🍠
    
    <aside>
    💡 아래 키워드에 대해 정리한 후, 실습을 진행해주시고, 코드와 실행 영상을 남겨주세요!
    
    </aside>
    
    - transition-property
        
        어떤 속성에 애니메이션을 적용할지 지정한다.
        
        ```html
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .box {
              width: 100px;
              height: 100px;
              background: purple;
              transition-property: background-color;
            }
        
            .box:hover {
              background-color: yellow;
            }
          </style>
        </head>
        <body>
          <div class="box"></div>
        </body>
        </html>
        ```
        
    - transition-duration
        
        
        애니메이션이 얼마 동안 진행될지 시간 설정
        
        ```html
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .box {
              width: 100px;
              height: 100px;
              background: purple;
              transition-duration: 1s;
            }
        
            .box:hover {
              background: yellow;
            }
          </style>
        </head>
        <body>
          <div class="box"></div>
        </body>
        </html>
        ```
        
    - transition-timing-function
        
        애니메이션의 속도 변화 방식을 설정
        
        대표 값: `ease` `linear` `ease-in` `ease-out` `ease-in-out` 
        
        ```html
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .box {
              width: 100px;
              height: 100px;
              background: purple;
              transition: all 1s ease-in-out;
            }
        
            .box:hover {
              transform: translateX(200px);
            }
          </style>
        </head>
        <body>
          <div class="box"></div>
        </body>
        </html>
        ```
        
    - transition-delay
        
        애니메이션이 얼마 뒤에 시작할지 지연 시간 설정
        
        ```html
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .box {
              width: 100px;
              height: 100px;
              background: purple;
              transition: all 1s;
              transition-delay: 0.5s;
            }
        
            .box:hover {
              transform: scale(1.5);
            }
          </style>
        </head>
        <body>
          <div class="box"></div>
        </body>
        </html>
        ```
        
    - transition-behavior
        
        애니메이션이 어떤 방식으로 처리될지 제어하는 속성
        
        ```html
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .box {
              width: 100px;
              height: 100px;
              background: purple;
              transition: all 1s;
              transition-behavior: normal;
            }
        
            .box:hover {
              transform: rotate(45deg);
            }
          </style>
        </head>
        <body>
          <div class="box"></div>
        </body>
        </html>
        ```
        
    
    ### 실습  🍠
    
    **`transition`** 키워드를 학습한 후, 해당 키워드와, **`transform에서 배운 특정 키워드를 활용`**하여, 아래와 같은 영상과 비슷하게 만들어주세요! (똑같을 필요는 없고, 기능만 같으면 됩니다.)
    
    단, **`transition 축약형`**을 사용해주세요!
    
    [화면 기록 2024-07-18 오후 7.51.38.mov](https://prod-files-secure.s3.us-west-2.amazonaws.com/e57bc1c9-a051-46a7-9c15-f5e2f1fea50c/e6dc806f-17a6-483d-b55e-e3ae81b0d27c/%E1%84%92%E1%85%AA%E1%84%86%E1%85%A7%E1%86%AB_%E1%84%80%E1%85%B5%E1%84%85%E1%85%A9%E1%86%A8_2024-07-18_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_7.51.38.mov)
    
    - 코드 첨부 🍠
        
        ```html
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <title>Transition 실습</title>
            <style>
                body {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                    padding-top: 50px;
                }
        
                .box {
                    width: 100px;
                    height: 100px;
                    background-color: pink;
                    /* 다이아몬드 형태로 만들기 위해 회전함 */
                    transform: rotate(45deg);
                }
        
                /* 마우스를 올렸을 때 색상 */
                .box:hover {
                    background-color: purple;
                }
            </style>
        </head>
        <body>
        
            <div class="box"></div>
            <div class="box"></div>
            <div class="box"></div>
        
        </body>
        </html>
        ```
        
    - 실행 영상 첨부 🍠
        
        [Transition 실습 외 페이지 3개 - 개인 - Microsoft Edge 2026-03-18 23-26-14.mp4](attachment:77b066ec-f528-40ff-95f0-f7850ceb4644:Transition_실습_외_페이지_3개_-_개인_-_Microsoft_Edge_2026-03-18_23-26-14.mp4)
        
- animation 🍠
    
    ### animation 🍠
    
    <aside>
    💡 아래 키워드에 대해 학습한 후, 실습을 진행하시고 코드와 실행 영상을 남겨주세요!
    
    </aside>
    
    animation은 요소에 반본적인 움직임을 주는 속성이다 transition은 변화 할 때만 보여지지만 animation은 자동으로 실행된다는 차이가 있다.
    
    - animation-name
        
        어떤 keyframes를 사용할지 지정
        
        ```html
        <div class="box"></div>
        
        <style>
        @keyframes move {
          from { transform: translateX(0); }
          to { transform: translateX(200px); }
        }
        
        .box {
          width: 100px;
          height: 100px;
          background: purple;
          animation-name: move;
        }
        </style>
        ```
        
    - animation-duration
        
        애니메이션 실행 시간
        
    - animation-delay
        
        애니메이션 시작 전 대기 시간
        
    - animation-direction
        
        애니메이션 진행 방향 설정
        
        주요 값 : `normal` `reverse` `alternate` `alternate-reverse`
        
    - animation-iteration-count
        
        반복 횟수 설정
        
    - animation-play-state
        
        애니메이션 실행/ 정지
        
    - animation-timing-function
        
        속도 변화 방식
        
    - animation-fill-mode
        
        애니메이션 끝난 후에 상태 유지 여부
        
    - @keyframes
        
        애니메이션의 동작 과정을 정의하는 규칙
        
        ```css
        @keyframes move {
          from { transform: translateX(0); }
          to { transform: translateX(200px); }
        }
        ```
        
    - 축약형
        
        ```css
        /*축약형의 구조*/
        animation: 이름 시간 속도 지연 반복 방향;
        ```
        
        ```html
        /*각각의 animation을 하나의 코드에서 확인 할 수 있도록 작성하였다.*/
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              display: flex;
              gap: 30px;
              padding: 50px;
            }
        
            .box {
              width: 80px;
              height: 80px;
              background: purple;
            }
        
            /*animation */
            .box1 {
              animation-name: move;
              animation-duration: 2s;
            }
        
            /*delay */
            .box2 {
              animation: move 2s;
              animation-delay: 1s;
            }
        
            /*direction */
            .box3 {
              animation: move 2s infinite alternate;
            }
        
            /*iteration-count */
            .box4 {
              animation: move 1s infinite;
            }
        
            /*timing-function */
            .box5 {
              animation: move 2s infinite ease-in-out;
            }
        
            /*fill-mode */
            .box6 {
              animation: move 2s forwards;
            }
        
            /*play-state (hover 시 멈춤) */
            .box7 {
              animation: move 2s infinite;
            }
            .box7:hover {
              animation-play-state: paused;
            }
        
            /*keyframes */
            @keyframes move {
              from {
                transform: translateY(0);
              }
              to {
                transform: translateY(100px);
              }
            }
          </style>
        </head>
        
        <body>
          <div class="box box1"></div>
          <div class="box box2"></div>
          <div class="box box3"></div>
          <div class="box box4"></div>
          <div class="box box5"></div>
          <div class="box box6"></div>
          <div class="box box7"></div>
        </body>
        </html>
        ```
        
    
    [animation - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/animation)
    
    ### 실습  🍠
    
     **`animation 키워드`**를 학습한 후, 아래와 비슷한 영상을 만들어주세요!
    
    단, **`animation 축약형`**을 사용해주세요!
    
    - [ ]  원은 어떻게 만들까요?
    - Hint
        
        **`border-radius` 를 활용해봅시다~!**
        
    - [ ]  계속 튀기는 애니메이션은 어떻게 하면 쉽게 만들까요?
    - Hint
        
        `infinte`, `alternate` 속성을 활용해봅시다!
        
    
    [화면 기록 2024-07-18 오후 8.01.20.mov](https://prod-files-secure.s3.us-west-2.amazonaws.com/e57bc1c9-a051-46a7-9c15-f5e2f1fea50c/6c0aa987-9afa-4c7b-8096-51940175eeb4/%E1%84%92%E1%85%AA%E1%84%86%E1%85%A7%E1%86%AB_%E1%84%80%E1%85%B5%E1%84%85%E1%85%A9%E1%86%A8_2024-07-18_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_8.01.20.mov)
    
    - 코드 첨부 🍠
        
        ```html
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <title>Animation 실습</title>
            <style>
                body {
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                    height: 100vh;
                    margin: 0;
                    padding-top: 50px;
                }
        
                .ball {
                    width: 100px;
                    height: 100px;
                    background-color: purple;
                    border-radius: 50%;
                    /* 2. animation 축약형 사용함 [이름] [지속시간] [타이밍함수] [반복횟수] [방향] 
                       'bounce'라는 애니메이션을 0.6초 동안, 
                       부드럽게 가속/감속하며(ease-in-out), 무한히(infinite), 
                       갔다 돌아오는(alternate) 방식으로 실행
                    */
                    animation: bounce 0.6s ease-in-out infinite alternate;
                }
        
                @keyframes bounce {
                    from {
                        transform: translateY(0);
                    }
                    to {
                        /* 아래로 200px 이동 */
                        transform: translateY(200px);
                    }
                }
            </style>
        </head>
        <body>
        
            <div class="ball"></div>
        
        </body>
        </html>
        ```
        
    - 실행 영상 첨부 🍠
        
        [Animation 실습 외 페이지 4개 - 개인 - Microsoft Edge 2026-03-18 23-43-19.mp4](attachment:c458950e-5709-4a60-bcfd-1e5b15c672ef:Animation_실습_외_페이지_4개_-_개인_-_Microsoft_Edge_2026-03-18_23-43-19.mp4)
        
- CSS 방법론 BEM 🍠
    
    <aside>
    💡
    
    아래 블로그를 참고하여 **BEM 방법론**에 대해 직접 정리해 보세요.
    
    </aside>
    
    - 정리
        1. **BEM이란?**
            
            BEM(Block, Element, Modifier)은 CSS 클래스명을 체계적으로 작성하기 위한 방법론이다. 클래스 이름만 보고도 구조와 역할을 쉽게 파악할 수 있도록 만든 네이밍 규칙이다.
            
            특히 프로젝트 규모가 커질수록 발생하는 클래스 충돌 문제를 줄이고, 코드의 가독성과 유지보수성을 높이기 위해 사용된다.
            
        2. 네이밍 규칙의 예
            
            ```html
            Block
            Block__Element
            Block--Modifier
            Block__Element--Modifier
            => 클래스 이름을 통해서도 구조를 이해할 수 있게 작성함
            ```
            
        3. **BEM의 특징**
            - 클래스 이름만으로 구조 파악 가능
            - CSS 선택자 중첩을 줄일 수 있음
            - 스타일 충돌 방지할 수 있음
            - 유지 보수가 간편해짐
        4. **Block**
            
            독립적으로 존재할 수 있는 하나의 구성 단위
            
            - 페이지 내에 의미 있는 하나의 구성 단위이고 다른 블록에 의존하지 않음
            - Block은 재사용 가능한 컴포넌트 단위로 생각
        5. **Element**
            
            Block을 구성하는 내부 요소
            
            - block 안에서만 의미를 갖고 단독으로는 사용되지 않음
        6. **Modifier**
            
            Block 또는 Element의 상태나 변형을 나타냄
            
            - 색상, 크기, 상태 등을 표현함
            - `--`를 사용하여 “어떠한 상태”인지 표현함
    
    [개발자 매튜 | BEM CSS 방법론 실전 가이드 - 예제로 배우는 네이밍 규칙](https://www.yolog.co.kr/post/css-bem-methodology)