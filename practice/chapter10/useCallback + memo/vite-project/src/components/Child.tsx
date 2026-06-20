import { memo } from 'react';

interface ChildProps {
  onClick: () => void;
}

const Child = memo(({ onClick }: ChildProps) => {
  console.log('🔥 Child 렌더링');

  return (
    <div
      style={{
        border: '2px solid #4CAF50',
        padding: '20px',
        marginTop: '20px',
        borderRadius: '10px',
      }}
    >
      <h2>자식 컴포넌트</h2>

      <p>부모가 리렌더링되어도 props가 같다면 다시 렌더링되지 않습니다.</p>

      <button onClick={onClick}>자식 버튼 클릭</button>
    </div>
  );
});

export default Child;
