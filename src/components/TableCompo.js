import React, { useEffect, useState } from 'react';

export default function TableCompo({
  columns = [],
  data = [],
  pageSize,
  onView,
  onEdit,
  onDelete,
}) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!pageSize) return;
    const newTotalPages = Math.max(1, Math.ceil(data.length / pageSize));
    setPage((prev) => Math.min(prev, newTotalPages));
  }, [data.length, pageSize]);

  const totalPages = pageSize ? Math.max(1, Math.ceil(data.length / pageSize)) : 1;
  const startIndex = pageSize ? (page - 1) * pageSize : 0;
  const endIndex = pageSize ? startIndex + pageSize : data.length;
  const rowsToRender = pageSize ? data.slice(startIndex, endIndex) : data;

  const handlePrev = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setPage((prev) => Math.min(totalPages, prev + 1));
  };

  const hasActions = Boolean(onView || onEdit || onDelete);
  return (
    <div className="overflow-x-auto bg-white rounded-lg">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="text-xs text-gray-600 uppercase bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th key={col.accessor} scope="col" className="px-4 py-3">
                {col.header}
              </th>
            ))}
            {hasActions && (
              <th scope="col" className="px-4 py-3 text-right">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rowsToRender.map((row) => (
            <tr
              key={row.id || JSON.stringify(row)}
              className="border-b last:border-b-0 hover:bg-gray-50"
            >
              {columns.map((col) => (
                <td key={col.accessor} className="px-4 py-2">
                  {col.render
                    ? col.render(row[col.accessor], row)
                    : row[col.accessor]}
                </td>
              ))}
              {hasActions && (
                <td className="px-4 py-2 space-x-2 text-right">
                  {onView && (
                    <button
                      type="button"
                      className="px-2 py-1 text-xs font-semibold text-blue-600 border border-blue-500 rounded hover:bg-blue-50"
                      onClick={() => onView(row)}
                    >
                      View
                    </button>
                  )}
                  {onEdit && (
                    <button
                      type="button"
                      className="px-2 py-1 text-xs font-semibold text-green-600 border border-green-500 rounded hover:bg-green-50"
                      onClick={() => onEdit(row)}
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      className="px-2 py-1 text-xs font-semibold text-red-600 border border-red-500 rounded hover:bg-red-50"
                      onClick={() => onDelete(row)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
          {rowsToRender.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + (hasActions ? 1 : 0)}
                className="px-4 py-4 text-center text-gray-400"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {pageSize && data.length > pageSize && (
        <div className="flex items-center justify-end px-4 py-3 space-x-2 text-sm text-gray-600">
          <button
            type="button"
            onClick={handlePrev}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={handleNext}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
