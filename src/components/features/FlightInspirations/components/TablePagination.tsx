import React from "react";
import { Button } from "@/components/ui/button";
import type { RowData, Table } from "@tanstack/react-table";

type Props = {
  table: Table<RowData>;
};

const TablePagination = ({ table }: Props) => {
  return (
    <div className="flex items-center justify-between px-2 py-4 border-t bg-card">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
      <div className="flex items-center gap-1 text-sm">
        <div>Page</div>
        <strong>
          {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </strong>
      </div>
    </div>
  );
};

export default TablePagination;
