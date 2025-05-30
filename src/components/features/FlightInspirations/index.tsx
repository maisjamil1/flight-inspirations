import { useState, useEffect, useMemo } from "react";
import { getFlightDestinations } from "@/components/features/FlightInspirations/api";
import { format } from "date-fns";
import { toast } from "sonner";
import { useTableData } from "@/components/features/FlightInspirations/hooks/useTableData";
import { DateCell } from "./components/DateCell";
import EditableCell from "./components/EditableCell";
import { FilterInput } from "./components/FilterInput";
import { DraggableHeader } from "./components/DraggableHeader";
import type { TableData } from "@/components/features/FlightInspirations/types/tableTypes";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import FlightSearchBar from "@/components/features/FlightInspirations/components/FlightSearchBar.tsx";
import TablePagination from "@/components/features/FlightInspirations/components/TablePagination.tsx";
import LoadingState from "@/components/features/FlightInspirations/components/LoadingState.tsx";
import EmptyState from "@/components/features/FlightInspirations/components/EmptyState.tsx";
import TableHeader from "@/components/features/FlightInspirations/components/TableHeader.tsx";

const FlightInspirations = () => {
  const [origin, setOrigin] = useState("MAD");
  const [departureDate, setDepartureDate] = useState<Date | undefined>();
  const [loading, setLoading] = useState(false);

  const {
    data,
    editedCells,
    updateCell,
    saveChanges,
    columnFilters,
    setFilter,
    clearFilter,
    setFlightDestinations,
  } = useTableData();

  const handleSubmit = async () => {
    if (!origin) return;
    setLoading(true);
    try {
      const params = {
        origin,
        ...(departureDate && {
          departureDate: format(departureDate, "yyyy-MM-dd"),
        }),
      };
      const response = await getFlightDestinations(params);
      setFlightDestinations(response.data);
      toast.success("Flight destinations loaded successfully");
    } catch (err: any) {
      console.error("Error fetching flight destinations:", err?.message);
      toast.error("Error fetching flight destinations");
    } finally {
      setLoading(false);
    }
  };

  const columnHelper = createColumnHelper<TableData>();

  const columns = useMemo(() => {
    if (data.length === 0) return [];

    return Object.keys(data[0]).map((key) => {
      const isDateColumn = ["departureDate", "returnDate"].includes(key);

      return columnHelper.accessor((row) => row[key], {
        id: key,
        header: () => (
          <div className="font-semibold">
            {key.replace("_", " ")}
            <FilterInput
              columnKey={key}
              placeholder={`Search ${key}...`}
              value={columnFilters[key] || ""}
              onFilter={setFilter}
              onClear={clearFilter}
            />
          </div>
        ),
        cell: ({ row, column, getValue }) => {
          const rowIndex = row.index;
          const columnId = column.id;
          const value = getValue() as string;
          const isEdited = editedCells.has(`${rowIndex}-${columnId}`);

          return (
            <div
              className={`${isEdited ? "bg-amber-100 dark:bg-amber-950" : ""}`}
            >
              {isDateColumn ? (
                <DateCell
                  value={value}
                  onChange={(newValue) =>
                    updateCell(rowIndex, columnId, newValue)
                  }
                />
              ) : (
                <EditableCell
                  value={value}
                  rowIndex={rowIndex}
                  columnId={columnId}
                  isEdited={isEdited}
                  onUpdate={updateCell}
                />
              )}
            </div>
          );
        },
      });
    });
  }, [data, editedCells, setFilter, updateCell, columnHelper]);

  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    if (columns.length > 0 && columnOrder.length === 0) {
      setColumnOrder(columns.map((column) => column.id as string));
    }
  }, [columns]);

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  const reorderColumn = (draggedColumnId: string, targetColumnId: string) => {
    setColumnOrder((currentOrder) => {
      const newOrder = [...currentOrder];
      const draggedIndex = newOrder.indexOf(draggedColumnId);
      const targetIndex = newOrder.indexOf(targetColumnId);

      if (draggedIndex === -1 || targetIndex === -1) return currentOrder;

      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedColumnId);

      return newOrder;
    });
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination,
      columnOrder,
    },
    onPaginationChange: setPagination,
  });

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-2xl font-bold">Flight Inspirations</h1>
      <FlightSearchBar
        origin={origin}
        setOrigin={setOrigin}
        departureDate={departureDate}
        setDepartureDate={setDepartureDate}
        handleSubmit={handleSubmit}
      />
      {loading && <LoadingState />}

      {!loading && data.length > 0 && (
        <div className="space-y-4">
          <TableHeader onSaveChanges={saveChanges} />

          <div className="border rounded-lg overflow-auto bg-card">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b bg-muted">
                    {headerGroup.headers.map((header) => (
                      <DraggableHeader
                        key={header.id}
                        header={header}
                        onReorder={reorderColumn}
                      />
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <TablePagination table={table} />
          </div>
        </div>
      )}

      {!loading && data.length === 0 && <EmptyState />}
    </div>
  );
};

export default FlightInspirations;
