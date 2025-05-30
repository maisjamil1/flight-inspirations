import { useCallback, memo, useState, useEffect } from "react";
import debounce from "lodash/debounce";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilterInputProps {
  columnKey: string;
  placeholder: string;
  value: string;
  onFilter: (key: string, value: string) => void;
  onClear: (key: string) => void;
}

export const FilterInput = memo(
  ({
    columnKey,
    placeholder,
    value: externalValue,
    onFilter,
    onClear,
  }: FilterInputProps) => {
    const [value, setValue] = useState(externalValue);

    useEffect(() => {
      setValue(externalValue);
    }, [externalValue]);

    const debouncedOnFilter = useCallback(
      debounce((value: string) => {
        onFilter(columnKey, value);
      }, 500),
      [columnKey, onFilter],
    );

    const handleChange = useCallback(
      (newValue: string) => {
        setValue(newValue);
        debouncedOnFilter(newValue);
      },
      [debouncedOnFilter],
    );

    const handleClear = useCallback(() => {
      setValue("");
      onClear(columnKey);
    }, [columnKey, onClear]);

    return (
      <div className="relative">
        <Input
          value={value}
          placeholder={placeholder}
          onChange={(e) => handleChange(e.target.value)}
          className="mt-2 h-8 text-xs pr-8"
        />
        {value && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 absolute right-1 top-1 hover:bg-transparent"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  },
);
