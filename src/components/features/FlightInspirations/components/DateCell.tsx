import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DateCellProps {
  value: string;
  onChange: (value: string) => void;
}

export const DateCell = ({ value, onChange }: DateCellProps) => {
  const parseDate = (dateStr: string) => {
    if (!dateStr) return undefined;
    if (dateStr.includes('-')) {
      return new Date(dateStr);
    } else if (dateStr.includes('/')) {
      const [month, day, year] = dateStr.split('/');
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    
    return undefined;
  };

  const [date, setDate] = useState<Date | undefined>(parseDate(value));

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    
    if (newDate) {
      const formattedDate = format(newDate, 'MM/dd/yyyy');
      onChange(formattedDate);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start text-left font-normal h-8 px-2"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value || 'Select date'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
