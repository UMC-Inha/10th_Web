import { memo, useState } from 'react';

interface SearchFormProps {
  includeAdult: boolean;
  onIncludeAdultChange: (value: boolean) => void;
  language: string;
  onLanguageChange: (value: string) => void;
  onSubmit: (query: string) => void;
  loading: boolean;
}

const SearchForm = memo(function SearchForm({
  includeAdult,
  onIncludeAdultChange,
  language,
  onLanguageChange,
  onSubmit,
  loading,
}: SearchFormProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputValue);
  };

  return (
    <div className="search-area">
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-row">
          <input
            type="text"
            className="search-input"
            placeholder="영화 제목을 입력하세요"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" className="search-btn" disabled={loading || !inputValue.trim()}>
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
