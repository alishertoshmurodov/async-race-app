const handlePageChange = (
  page: number,
  setCurrentPage: any,
  totalPageCount: any,
) => {
  if (page > 0 && page <= totalPageCount) {
    setCurrentPage(page);
  }
};

function PaginationNav({ currentPage, totalPageCount, setCurrentPage }: any) {
  return (
    <div className="flex gap-x-4 items-center justify-end">
      <button
        onClick={() => handlePageChange(currentPage - 1, setCurrentPage, totalPageCount)}
        className={`text-xl py-1 px-3 rounded-md border transition ${
          currentPage > 1
            ? 'hover:bg-gray-800 hover:text-white hover:border-white'
            : 'cursor-default opacity-50'
        }`}
      >
        Prev
      </button>
      <span className="text-xl border text-white bg-gray-800 size-10 aspect-square grid place-items-center rounded-md ">
        {currentPage}
      </span>
      <button
        onClick={() => handlePageChange(currentPage + 1, setCurrentPage, totalPageCount)}
        className={`text-xl py-1 px-3 rounded-md border transition ${
          currentPage < totalPageCount
            ? 'hover:bg-gray-800 hover:text-white hover:border-white'
            : 'cursor-default opacity-50'
        }`}
      >
        Next
      </button>
    </div>
  );
}

export default PaginationNav;
