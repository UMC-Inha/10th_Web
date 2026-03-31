import { useThemeContext } from './context/ThemeContext.tsx';

function App() {
  const { isDarkMode, toggleDarkMode } = useThemeContext();

  const modeText = isDarkMode ? '다크모드' : '라이트모드';

  return (
    <main
      className={[
        'min-h-screen flex items-center justify-center transition-colors',
        isDarkMode ? 'bg-slate-900' : 'bg-slate-100',
      ].join(' ')}
    >
      <section
        className={[
          'w-[360px] rounded-2xl border p-6 text-center shadow-md transition-colors',
          isDarkMode
            ? 'border-slate-700 bg-slate-800 text-slate-100'
            : 'border-slate-200 bg-white text-slate-900',
        ].join(' ')}
      >
        <h1 className="mb-4 text-2xl font-bold">Dark Mode Mission</h1>
        <p className="mb-6 text-sm">현재 모드: {modeText}</p>
        <button
          type="button"
          onClick={toggleDarkMode}
          className={[
            'rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
            isDarkMode
              ? 'bg-amber-300 text-slate-900 hover:bg-amber-200'
              : 'bg-slate-900 text-white hover:bg-slate-700',
          ].join(' ')}
        >
          {isDarkMode ? '라이트모드로 변경' : '다크모드로 변경'}
        </button>
      </section>
    </main>
  )
}

export default App
