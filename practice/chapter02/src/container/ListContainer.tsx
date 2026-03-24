import './App.css';
import List from '../components/List';

function ListContainer() {
  const nickname = '엠버';
  const sweetPotato = '고구마';
  const array = ['REACT', 'NEXT', 'VUE', 'SVELTE', 'ANGULAR', 'REACT-NATIVE'] as const;

  return (
    <>
      <strong className="school">인하대학교</strong>
      <p style={{ color: 'purple', fontWeight: 'bold', fontSize: '3rem' }}>{nickname}/김해원</p>
      <h1>{`${nickname}는 ${sweetPotato} 아이스크림을 좋아합니다.`}</h1>
      <ul>
        {array.map((yaho, idx) => (
          <List key={idx} tech={yaho} />
        ))}
      </ul>
    </>
  );
}

export default ListContainer;
