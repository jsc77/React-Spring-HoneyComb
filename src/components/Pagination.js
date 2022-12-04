import styled from "styled-components";

function Pagination({ total, limit, page, setPage }) {
  const numPages = Math.ceil(total / limit);
  const css =
    "px-3 py-2 leading-tight bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700";

  return (
    <>
      <Nav>
        <ul class="inline-flex -space-x-px">
          <li>
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              class="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700">
              이전
            </button>
          </li>
          {Array(numPages)
            .fill()
            .map((_, i) => (
              <li>
                <button
                  key={i + 1}
                  onClick={() => (
                    setPage(i + 1),
                    window.localStorage.setItem("pageNumber", i + 1)
                  )}
                  className={
                    window.localStorage.getItem("pageNumber") == i + 1
                      ? `bg-orange-500 text-white ${css}`
                      : `text-orange-500 ${css}`
                  }>
                  {i + 1}
                </button>
              </li>
            ))}
          <li>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === numPages}
              class="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700">
              다음
            </button>
          </li>
        </ul>
      </Nav>
    </>
  );
}

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  margin: 16px;
`;

export default Pagination;
