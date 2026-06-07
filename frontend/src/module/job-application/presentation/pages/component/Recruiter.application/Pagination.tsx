

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  const from = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const to = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <footer className="bg-white border-t border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
      <span className="text-xs text-slate-400">
        {totalItems === 0
          ? "No results"
          : `Showing ${from}–${to} of ${totalItems} applicant${
              totalItems !== 1 ? "s" : ""
            }`}
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-slate-500 hover:text-slate-900 font-medium text-xs disabled:opacity-30 rounded hover:bg-slate-100 transition"
        >
          ← Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          const isEllipsis =
            totalPages > 7 &&
            page > 2 &&
            page < totalPages - 1 &&
            Math.abs(page - currentPage) > 1;

          if (isEllipsis) {
            if (page === 3 || page === totalPages - 2) {
              return (
                <span key={page} className="px-1 text-slate-300 text-xs">
                  …
                </span>
              );
            }
            return null;
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-7 h-7 rounded flex items-center justify-center font-medium text-xs transition ${
                currentPage === page
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 text-slate-500 hover:text-slate-900 font-medium text-xs disabled:opacity-30 rounded hover:bg-slate-100 transition"
        >
          Next →
        </button>
      </div>
    </footer>
  );
}