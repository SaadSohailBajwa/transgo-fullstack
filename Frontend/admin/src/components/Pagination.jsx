import React from "react";

const Pagination = ({
  totalRows,
  rowsPerPage,
  currentPage,
  setCurrentPage,
}) => {
  let pages = [];

  for (let i = 1; i <= Math.ceil(totalRows / rowsPerPage); i++) {
    pages.push(i);
  }

  return (
    <div className="flex space-x-2">
      {pages.map((page, index) => (
        <button
          key={index}
          onClick={() => setCurrentPage(page)}
          className={`w-10 h-10 border border-blue-500 rounded-full focus:outline-none ${
            currentPage === page
              ? "bg-blue-500 text-white"
              : "bg-white text-blue-500"
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
