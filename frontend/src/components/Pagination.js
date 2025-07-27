const Pagination = ({currentPage,noOfPages,setCurrentPage})=>{
    return(
        <div className="Pagination">
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 0}>◀️</button>
          {[...Array(noOfPages).keys()].map((n) => (
            <button
              key={n}
              className={n === currentPage ? "active" : ""}
              onClick={() => setCurrentPage(n)}
            >
              {n + 1}
            </button>
          ))}
          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === noOfPages - 1}>▶️</button>
        </div>
    )
}

export default Pagination;