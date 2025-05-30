import { useState, useEffect, useMemo } from "react";
import type { TableData, FlightDestination } from "@/types/tableTypes";
import debounce from "lodash/debounce";

const transformFlightDestinations = (
  destinations: FlightDestination[],
): TableData[] => {
  return destinations.map((dest, index) => ({
    origin: dest.origin,
    destination: dest.destination,
    departureDate: dest.departureDate,
    returnDate: dest.returnDate,
    price: dest.price.total,
  }));
};

export const useTableData = () => {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [editedCells, setEditedCells] = useState<Set<string>>(new Set());
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>(
    {},
  );
  const [flightDestinations, setFlightDestinations] = useState<
    FlightDestination[]
  >([]);

  useEffect(() => {
    const savedData = localStorage.getItem("tableData");
    if (savedData) {
      setTableData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    if (flightDestinations.length > 0) {
      const newTableData = transformFlightDestinations(flightDestinations);
      if (tableData.length === 0) {
        setTableData(newTableData);
      }
    }
  }, [flightDestinations]);

  const saveChanges = () => {
    localStorage.setItem("tableData", JSON.stringify(tableData));
    setEditedCells(new Set());
  };

  const updateCell = (rowIndex: number, columnId: string, value: string) => {
    const newData = [...tableData];
    newData[rowIndex] = {
      ...newData[rowIndex],
      [columnId]: value,
    };
    setTableData(newData);
    setEditedCells(new Set(editedCells).add(`${rowIndex}-${columnId}`));
  };

  const debouncedFilter = useMemo(
    () =>
      debounce((column: string, value: string) => {
        setColumnFilters((prev) => ({
          ...prev,
          [column]: value,
        }));
      }, 300),
    [],
  );

  const filteredData = useMemo(() => {
    return tableData.filter((row) => {
      return Object.entries(columnFilters).every(([column, filterValue]) => {
        const cellValue = row[column as keyof TableData];
        return cellValue
          ? cellValue.toLowerCase().includes(filterValue.toLowerCase())
          : true;
      });
    });
  }, [tableData, columnFilters]);

  return {
    data: filteredData,
    editedCells,
    updateCell,
    saveChanges,
    debouncedFilter,
    setFlightDestinations,
  };
};
