import { useState } from 'react';
import { useReducerCompany } from './hooks/useReducerCompany';

function App() {
  const { position, isUnlocked, tryUnlock, setPosition } = useReducerCompany();
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (!isUnlocked) {
      tryUnlock(input.trim());
    } else {
      setPosition(input.trim());
    }
    setInput('');
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Company Position</h1>
      <p>현재 직무: <strong>{position}</strong></p>

      <p style={{ marginTop: '16px', color: isUnlocked ? '#16a34a' : '#dc2626', fontSize: '14px' }}>
        {isUnlocked ? '✅ 잠금 해제됨 — 새 직무를 입력하세요' : '🔒 직무를 변경하려면 "카드메이커"를 입력하세요'}
      </p>

      <form onSubmit={handleSubmit} style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isUnlocked ? '새 직무 입력' : '카드메이커'}
          style={{ padding: '8px 12px', fontSize: '14px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <button
          type="submit"
          style={{ padding: '8px 16px', fontSize: '14px', borderRadius: '6px', cursor: 'pointer' }}
        >
          {isUnlocked ? '직무 변경' : '확인'}
        </button>
      </form>
    </div>
  );
}

export default App;
