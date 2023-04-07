import React from "react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

import "./Pagination.css";

function Pagination({ page, total, limit, setPage, next, prev }) {
  const totalPages = Math.ceil(total / limit);
  const handlePageClick = (val) => {
    setPage(val);
  };
  const handleNavClick = (val) => {
    setPage(val);
  };
  return (
    <div className="m-auto d-flex p-1 align-items-center justify-content-center">
      {totalPages > 0 && (
        <>
          {prev && (
            <button
              onClick={() => handleNavClick(prev.page)}
              className="navPage_btn"
            >
              <GrFormPrevious />
            </button>
          )}
          <div className="pagination_buttons">
            {[...Array(totalPages)].map((_, index) => {
              return (
                <button
                  id={page === index + 1 ? "active" : ""}
                  className={`page_btn ${
                    page === index + 1 ? "bg-primary text-white " : ""
                  }`}
                  key={index}
                  onClick={() => handlePageClick(index + 1)}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          {next && (
            <button
              onClick={() => handleNavClick(next.page)}
              className="navPage_btn"
            >
              <GrFormNext />{" "}
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default Pagination;


