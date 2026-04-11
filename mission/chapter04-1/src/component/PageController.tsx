
interface Prop{
  page: number
  maxPage:number
  nextPage: () => void
  prevPage: () => void
}
const PageController = ({page, maxPage, nextPage, prevPage}:Prop) => {
  return (
    <nav className="flex items-center justify-center gap-6 mt-5">
      <button 
      disabled={page === 1}
      onClick={prevPage}
      className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-ad hover:bg-[#b2dab1] 
      transition-all duration-200 disabled:bg-gray-300 cursor-pointer disabled:cursor-not-allowed">
        {"<"}
      </button>
      <span>{page}페이지</span>
      <button 
      disabled={page === maxPage}
      onClick={nextPage}
      className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-ad hover:bg-[#b2dab1] 
      transition-all duration-200 disabled:bg-gray-300 cursor-pointer disabled:cursor-not-allowed">
        {">"}
      </button>
    </nav>
  );
}

export default PageController