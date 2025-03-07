
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';

interface DataGridProps<T> {
  data: T[];
  columns: {
    accessor: keyof T | ((row: T) => React.ReactNode);
    header: string;
    cell?: (value: any, row: T) => React.ReactNode;
    className?: string;
  }[];
  keyAccessor: keyof T | ((row: T) => string);
  className?: string;
  rowClassName?: string | ((row: T) => string);
  headerClassName?: string;
  emptyMessage?: string;
}

function DataGrid<T>({
  data,
  columns,
  keyAccessor,
  className,
  rowClassName,
  headerClassName,
  emptyMessage = "No data available"
}: DataGridProps<T>) {
  const getRowKey = (row: T): string => {
    if (typeof keyAccessor === 'function') {
      return keyAccessor(row);
    }
    return String(row[keyAccessor]);
  };

  const getCellValue = (row: T, accessor: keyof T | ((row: T) => React.ReactNode)) => {
    if (typeof accessor === 'function') {
      return accessor(row);
    }
    return row[accessor];
  };

  const getRowClassNames = (row: T) => {
    if (typeof rowClassName === 'function') {
      return rowClassName(row);
    }
    return rowClassName;
  };

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className={cn("bg-slate-50", headerClassName)}>
            {columns.map((column, index) => (
              <th
                key={index}
                className={cn(
                  "px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-slate-200",
                  column.className
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row) => (
              <tr
                key={getRowKey(row)}
                className={cn(
                  "hover:bg-slate-50 transition-colors",
                  getRowClassNames(row)
                )}
              >
                {columns.map((column, index) => (
                  <td
                    key={index}
                    className={cn(
                      "px-4 py-3 text-sm border-b border-slate-200",
                      column.className
                    )}
                  >
                    {column.cell
                      ? column.cell(getCellValue(row, column.accessor), row)
                      : getCellValue(row, column.accessor)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-slate-500 border-b border-slate-200"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataGrid;
