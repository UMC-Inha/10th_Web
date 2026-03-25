import { useTheme } from './context/ThemeProvider';

function App() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="max-w-xl mx-auto px-6 py-16">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">다크 모드</h1>
          <p className="text-gray-500 dark:text-gray-400">
            useContext + Tailwind CSS로 구현한 테마 토글
          </p>
        </header>

        <div className="flex flex-col items-center gap-8">
          {/* 토글 스위치 */}
          <button
            type="button"
            onClick={toggleTheme}
            className="relative w-20 h-10 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-950 bg-gray-300 dark:bg-blue-600"
          >
            <span
              className={`absolute top-1 left-1 w-8 h-8 rounded-full bg-white shadow-md transition-transform duration-300 flex items-center justify-center text-sm ${isDark ? 'translate-x-10' : 'translate-x-0'}`}
            >
              {isDark ? '🌙' : '☀️'}
            </span>
          </button>

          <p className="text-lg font-medium">
            현재 모드: <span className="text-blue-600 dark:text-blue-400">{isDark ? '다크' : '라이트'}</span>
          </p>

          {/* 카드 데모 */}
          <div className="w-full grid gap-4">
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm transition-colors duration-300">
              <h2 className="text-lg font-semibold mb-2">useContext</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ThemeProvider가 theme 상태와 toggleTheme 함수를 Context로 제공하고,
                하위 컴포넌트에서 useTheme 훅으로 직접 소비함
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm transition-colors duration-300">
              <h2 className="text-lg font-semibold mb-2">Tailwind CSS v4</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                @custom-variant로 클래스 기반 다크 모드를 활성화하고,
                dark: 접두사로 다크 모드 스타일을 적용함
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm transition-colors duration-300">
              <h2 className="text-lg font-semibold mb-2">localStorage</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                사용자가 선택한 테마를 localStorage에 저장하여
                새로고침 후에도 테마가 유지됨
              </p>
            </div>
          </div>

          {/* 색상 팔레트 데모 */}
          <div className="w-full">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Color Palette</h3>
            <div className="grid grid-cols-4 gap-3">
              <div className="h-16 rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 transition-colors duration-300" />
              <div className="h-16 rounded-lg bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 transition-colors duration-300" />
              <div className="h-16 rounded-lg bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 transition-colors duration-300" />
              <div className="h-16 rounded-lg bg-blue-500 dark:bg-blue-600 transition-colors duration-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
