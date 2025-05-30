import { useState, useEffect, useMemo } from "react";
import { getFlightDestinations } from "@/components/features/FlightInspirations/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Save, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { toast } from "sonner";
import { useTableData } from "@/hooks/useTableData";
import { DateCell } from "./components/DateCell";
import EditableCell from "./components/EditableCell";
import { FilterInput } from "./components/FilterInput";
import { DraggableHeader } from "./components/DraggableHeader";
import type { TableData } from "@/types/tableTypes";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

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

  useEffect(() => {
    if (columns.length > 0 && columnOrder.length === 0) {
      setColumnOrder(columns.map((column) => column.id as string));
    }
  }, [columns]);

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
      pagination: {
        pageSize: 10,
        pageIndex: 0,
      },
      columnOrder,
    },
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Flight Inspirations</h1>

      <div className="flex items-center gap-4 mb-6">
        <Input
          placeholder="Origin city code (e.g. MAD)"
          value={origin}
          onChange={(e) => setOrigin(e.target.value.toUpperCase())}
          className="max-w-xs"
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[200px] justify-start text-left"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {departureDate ? (
                format(departureDate, "PPP")
              ) : (
                <span>Select date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="p-0">
            <Calendar
              mode="single"
              selected={departureDate}
              onSelect={setDepartureDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Button onClick={handleSubmit} variant="default">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>

      {loading && <p className="text-muted-foreground">Loading...</p>}

      {!loading && data.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Flight Data</h2>
            <Button onClick={saveChanges} variant="default">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>

          <div className="border rounded-lg overflow-auto">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b bg-muted/50">
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
                  <tr key={row.id} className="border-b hover:bg-muted/50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between px-2 py-4">
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
                  {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && data.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          <p>No flight data available. Search for flights to get started.</p>
        </div>
      )}
    </div>
  );
};

export default FlightInspirations;
