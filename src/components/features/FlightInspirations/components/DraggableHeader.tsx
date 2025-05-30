import { useState } from "react";
import { GripVertical } from "lucide-react";
import { flexRender } from "@tanstack/react-table";
import type { Header } from "@tanstack/react-table";
import type { TableData } from "@/components/features/FlightInspirations/types/tableTypes";

interface DraggableHeaderProps {
  header: Header<TableData, unknown>;
  onReorder: (draggedId: string, targetId: string) => void;
}

export const DraggableHeader = ({ header, onReorder }: DraggableHeaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isOver, setIsOver] = useState(false);

  return (
    <th
      key={header.id}
      className={`p-2 select-none transition-colors ${
        isOver ? "bg-muted/50" : ""
      }`}
      draggable
      onDragStart={(e) => {
        setIsDragging(true);
        e.dataTransfer.setData("columnId", header.id);
      }}
      onDragEnd={() => {
        setIsDragging(false);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => {
        setIsOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsOver(false);
        const draggedColumnId = e.dataTransfer.getData("columnId");
        const targetColumnId = header.id;
        if (draggedColumnId !== targetColumnId) {
          onReorder(draggedColumnId, targetColumnId);
        }
      }}
    >
      <div className="flex items-center gap-2 group">
        <div
          className={`flex items-center justify-center w-4 h-4 rounded opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity ${
            isDragging ? "opacity-100" : ""
          }`}
        >
          <GripVertical className="w-3 h-3" />
        </div>
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
      </div>
    </th>
  );
};
