/**
@copyright : Hotopics Unipessoal Lda. < www.toxsl.com >
@author    : Shiv Charan Panjeta 
 
All Rights Reserved.
Proprietary and confidential :  All information contained here in is, and remains
the property of Hotopics Unipessoal Lda. and it's partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
import React from "react";
import ReactPaginate from "react-paginate";
import CustomSelect from "../components/CustomSelect";
import "./pagination.scss";

const Pagination = (props) => {
  const perPageOptions = [
    { value: "10", label: "10" },
    { value: "50", label: "50" },
    { value: "100", label: "100" },
  ];

  return (
    <div className="d-flex align-item-center justify-content-between m-2">
      <div>
        <ReactPaginate
          nextLabel={"Next"}
          breakLabel={"..."}
          breakClassName={"page-item"}
          forcePage={props?.page - 1}
          pageCount={Math.ceil(props?.totalPages ?? 1)}
          marginPagesDisplayed={3}
          onPageChange={(e) => props?.setPage(e.selected + 1)}
          renderOnZeroPageCount={null}
          containerClassName={"pagination justify-content-end"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={`page-item`}
          previousLinkClassName={`page-link`}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          activeClassName={"active"}
          breakLinkClassName={"page-link"}
          className={
            props?.totalPages > 1
              ? "pagination justify-content-center"
              : "d-none"
          }
        />
      </div>
      {props?.totalPages > 1 && (
        <div className="d-flex align-items-center gap-2">
          <p className="mb-0">Show</p>
          <div style={{ minWidth: 88 }}>
            <CustomSelect
              className="per-page"
              value={String(props?.perPage ?? "")}
              onChange={(val) => props.setPerPage(val)}
              options={perPageOptions}
              aria-label="Rows per page"
            />
          </div>
          <p className="mb-0">per page</p>
        </div>
      )}
    </div>
  );
};

export default Pagination;
