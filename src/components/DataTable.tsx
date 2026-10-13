import type { ReactNode } from 'react';

import { Spinner } from './Spinner';

export type Column<T> = {
  key: string;
  label: string;
  render: (row: T) => ReactNode;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  isLoading: boolean;
  emptyMessage: string;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

/** The one table+pagination shell every list page (Users/Reports/Blocked/Status/AuditLog) reuses, instead of five near-duplicate table markups. */
export function DataTable<T>({ columns, rows, rowKey, isLoading, emptyMessage, page, totalPages, onPageChange }: DataTableProps<T>) {
  if (isLoading && rows.length === 0) {
    return (
      <div className="loading-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="table-scroll">
        {rows.length === 0 ? (
          <div className="table-empty">{emptyMessage}</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={rowKey(row)}>
                  {columns.map((col) => (
                    <td key={col.key}>{col.render(row)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          <button type="button" className="link-button" onClick={() => onPageChange(page - 1)} disabled={page <= 0}>
            ← Previous
          </button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <button type="button" className="link-button" onClick={() => onPageChange(page + 1)} disabled={page + 1 >= totalPages}>
            Next →
          </button>
        </div>
      )}
    </>
  );
}
