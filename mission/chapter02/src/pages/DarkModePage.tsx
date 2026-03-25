import { Link } from 'react-router';
import { useTheme } from '../context/ThemeProvider';
import './DarkModePage.css';

const DarkModePage = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 font-[system-ui]">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors no-underline"
          >
            &larr; Todo로 돌아가기
          </Link>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-lg text-xs font-medium border transition-colors duration-200 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {theme === 'light' ? '다크 모드' : '라이트 모드'}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-12">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3 transition-colors">
            다크 모드
          </h1>
          <p className="text-gray-500 dark:text-gray-400 transition-colors">
            useContext를 활용한 테마 전환
          </p>
        </section>

        <section className="mb-10 p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 transition-colors">테마 설정</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
                현재 <span className="font-semibold text-gray-900 dark:text-white">{theme === 'light' ? '라이트' : '다크'}</span> 모드가 적용되어 있음
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="relative w-14 h-8 rounded-full transition-colors duration-300 bg-gray-300 dark:bg-indigo-500"
            >
              <span className="absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow transition-transform duration-300 dark:translate-x-6" />
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="p-5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-3 transition-colors">
              <span className="text-blue-600 dark:text-blue-400 text-lg font-bold">1</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 transition-colors">ThemeProvider</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed transition-colors">
              createContext로 테마 상태를 생성하고 Provider로 하위 트리에 전달
            </p>
          </div>
          <div className="p-5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center mb-3 transition-colors">
              <span className="text-green-600 dark:text-green-400 text-lg font-bold">2</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 transition-colors">useTheme</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed transition-colors">
              커스텀 Hook으로 theme 값과 toggleTheme 함수를 소비
            </p>
          </div>
          <div className="p-5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mb-3 transition-colors">
              <span className="text-purple-600 dark:text-purple-400 text-lg font-bold">3</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 transition-colors">Tailwind dark:</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed transition-colors">
              html에 dark 클래스를 토글하여 Tailwind의 dark: variant 활성화
            </p>
          </div>
        </section>

        <section className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-colors">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors">미리보기</h2>
          <div className="space-y-3">
            {['React 공부하기', 'useContext 정리', 'Tailwind 다크모드 구현'].map((text) => (
              <div
                key={text}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300 transition-colors">{text}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default DarkModePage;
