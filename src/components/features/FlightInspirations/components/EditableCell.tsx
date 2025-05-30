import { useState, useCallback, memo } from "react";
import { Input } from "@/components/ui/input";
import debounce from "lodash/debounce";

interface EditableCellProps {
  value: string;
  rowIndex: number;
  columnId: string;
  isEdited: boolean;
  onUpdate: (rowIndex: number, columnId: string, value: string) => void;
}

const EditableCell = memo(({ value: initialValue, rowIndex, columnId, isEdited, onUpdate }: EditableCellProps) => {
  const [value, setValue] = useState(initialValue);

  const debouncedUpdate = useCallback(
    debounce((newValue: string) => {
      onUpdate(rowIndex, columnId, newValue);
    }, 300),
    [rowIndex, columnId, onUpdate]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedUpdate(newValue);
  };

  return (
    <div className={`${isEdited ? "bg-amber-100 dark:bg-amber-900/50" : ""}`}>
      <Input
        value={value}
        onChange={handleChange}
        className="border-none bg-transparent h-8 px-2 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
});

EditableCell.displayName = "EditableCell";

export default EditableCell;
