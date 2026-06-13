import { memo } from 'react';

interface SearchFormProps {
  query: string;
  onQueryChange: (value: string) => void;
  includeAdult: boolean;
  onIncludeAdultChange: (value: boolean) => void;
  language: string;
  onLanguageChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

const SearchForm = memo(function SearchForm({
  query,
  onQueryChange,
  includeAdult,
  onIncludeAdultChange,
  language,
  onLanguageChange,
  onSubmit,
  loading,
}: SearchFormProps) {
  return (
    <div className="search-area">
      <form className="search-form" onSubmit={onSubmit}>
        <div className="search-row">
          <input
            type="text"
            className="search-input"
            placeholder="영화 제목을 입력하세요"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
          <button type="submit" className="search-btn" disabled={loading || !query.trim()}>
            {loading ? '검색 중...' : '검색'}
          </button>
        </div>

        <div className="search-options">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={includeAdult}
              onChange={(e) => onIncludeAdultChange(e.target.checked)}
            />
            <span>성인 콘텐츠 포함</span>
          </label>

          <label className="select-label">
            <span>언어</span>
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="lang-select"
            >
              <option value="ko-KR">한국어</option>
              <option value="en-US">영어</option>
              <option value="ja-JP">일본어</option>
            </select>
          </label>
        </div>
      </form>
    </div>
  );
});

export default SearchForm;
