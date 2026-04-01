interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// 페이지네이션 컴포넌트
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  return (
    <div className="flex justify-center items-center gap-2 my-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-5 py-2 rounded-full text-sm font-medium bg-gray-800 text-gray-300 border border-gray-600 hover:border-white hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        ← 이전
      </button>
      <span className="px-4 text-gray-300 text-sm">
        <span className="font-bold text-lg">{currentPage}</span>
        <span className="text-gray-300 mx-1">/</span>
        {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-5 py-2 rounded-full text-sm font-medium bg-gray-800 text-gray-300 border border-gray-600 hover:border-white hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        다음 →
      </button>
    </div>
  );
};

export default Pagination;
