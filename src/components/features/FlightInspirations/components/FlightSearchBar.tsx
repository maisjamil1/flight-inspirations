import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Search } from "lucide-react";
import { format } from "date-fns";

type Props = {
  origin: string;
  setOrigin: (value: string) => void;
  departureDate: Date | undefined;
  setDepartureDate: (date: Date | undefined) => void;
  handleSubmit: () => void;
};

const FlightSearchBar = ({
  origin,
  setOrigin,
  departureDate,
  setDepartureDate,
  handleSubmit,
}: Props) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1 min-w-0">
        <Input
          placeholder="Origin city code (e.g. MAD)"
          value={origin}
          onChange={(e) => setOrigin(e.target.value.toUpperCase())}
          className="w-full"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:flex-none">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-[200px] justify-start text-left"
            >
              <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="truncate">
                {departureDate ? format(departureDate, "PPP") : "Select date"}
              </span>
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

        <Button
          onClick={handleSubmit}
          variant="default"
          className="w-full sm:w-auto"
        >
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>
    </div>
  );
};

export default FlightSearchBar;
