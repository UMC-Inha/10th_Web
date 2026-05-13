// src/components/Home.tsx

const Home = () => {
  return (
    <div style={{ padding: '20px', lineHeight: '1.6' }}>
      <p>Tanstack Query를 이용한 무한 스크롤 실습 프로젝트</p>
      <ul>
        <li><strong>버튼 클릭 방식:</strong> 사용자가 버튼을 직접 눌러 다음 데이터를 가져온다</li>
        <li><strong>자동 무한 스크롤:</strong> 스크롤이 바닥에 닿으면 자동으로 데이터를 가져온다</li>
      </ul>
      <p>상단 메뉴를 클릭하면 각 방식을 테스트해볼 수 있다</p>
    </div>
  );
};

export default Home;