const PAGE_LIST_SIZE = 10;

export default function paginator({ totalCount, page, perPage = 10 }) {
  const totalPage = Math.ceil(totalCount / perPage);

  // 현재 블록 번호 (0부터 시작)
  const quotient = Math.floor((page - 1) / PAGE_LIST_SIZE);

  // 블록의 시작 페이지, 끝 페이지
  const startPage = quotient * PAGE_LIST_SIZE + 1;
  const endPage = Math.min(startPage + PAGE_LIST_SIZE - 1, totalPage);

  // 페이지 리스트 생성 (Array.from 활용)
  const pageList = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return {
    pageList,            // [startPage ... endPage]
    page,                // 현재 페이지
    prevPage: page - 1,  // 이전 페이지 번호
    nextPage: page + 1,  // 다음 페이지 번호
    startPage,           // 현재 블록 시작
    endPage,             // 현재 블록 끝
    lastPage: totalPage, // 전체 마지막 페이지
    hasPrev: page > 1,
    hasNext: page < totalPage,
    isFirstPage: page === 1,
    isLastPage: page === totalPage,
  };
}
