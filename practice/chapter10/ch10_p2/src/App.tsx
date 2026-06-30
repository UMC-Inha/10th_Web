import { useState, useMemo } from 'react'
import './App.css'

function getPrimes(limit: number): number[] {
  if (limit < 2) return []
  const sieve = new Array(limit + 1).fill(true)
  sieve[0] = false
  sieve[1] = false
  for (let i = 2; i * i <= limit; i++) {
    if (sieve[i]) {
      for (let j = i * i; j <= limit; j += i) {
        sieve[j] = false
      }
    }
  }
  return sieve.reduce<number[]>((acc, isPrime, num) => {
    if (isPrime) acc.push(num)
    return acc
  }, [])
}

function App() {
  const [limit, setLimit] = useState(1000)
  const [otherInput, setOtherInput] = useState('')

  const primes = useMemo(() => {
    console.log('소수 계산 실행!')
    return getPrimes(limit)
  }, [limit])

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>같이 배우는 리액트: useMemo편</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label>숫자 입력 (소수 찾기): </label>
        <input
          type="number"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          style={{ marginLeft: '0.5rem', padding: '4px 8px' }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <strong>소수 리스트:</strong>
        <p style={{ lineHeight: '1.8', maxWidth: '600px' }}>
          {primes.join(' ')}
        </p>
      </div>

      <div>
        <label>다른 입력 테스트: </label>
        <input
          type="text"
          value={otherInput}
          onChange={(e) => setOtherInput(e.target.value)}
          style={{ marginLeft: '0.5rem', padding: '4px 8px' }}
        />
      </div>
    </div>
  )
}

export default App
