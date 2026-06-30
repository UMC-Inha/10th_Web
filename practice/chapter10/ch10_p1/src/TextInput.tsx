import { memo, useRef } from 'react'

interface Props {
  text: string
  onChange: (value: string) => void
}

const TextInput = memo(({ text, onChange }: Props) => {
  const renderCount = useRef(0)
  renderCount.current++

  return (
    <div>
      <p>Text</p>
      <p>{renderCount.current}</p>
      <input value={text} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
})

export default TextInput
