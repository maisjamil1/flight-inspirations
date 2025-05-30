import { useEffect, useState } from "react";
import { getFlightDestinations } from "@/components/features/FlightInspirations/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { toast } from "sonner";

const FlightInspirations = () => {
  const [origin, setOrigin] = useState("MAD");
  const [departureDate, setDepartureDate] = useState<Date | undefined>();
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!origin) return;
    setLoading(true);
    try {
      const params: Record<string, string> = { origin };
      if (departureDate) {
        params.departureDate = format(departureDate, "yyyy-MM-dd");
      }
      const data = await getFlightDestinations(params);
      setDestinations(data.data);
    } catch (err) {
      console.error("Error fetching flight destinations:", err?.message);
      toast.error("Error fetching flight destinations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 space-y-4">
      <h1 className="text-xl font-semibold">Search Flight Destinations</h1>

      <div className="flex items-center gap-4">
        <Input
          placeholder="City code (e.g. MAD)"
          value={origin}
          onChange={(e) => setOrigin(e.target.value.toUpperCase())}
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

        <Button onClick={handleSubmit} variant="default" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {loading && <p className="text-muted-foreground">Loading...</p>}

      {!loading && destinations.length > 0 && (
        <ul className="list-disc pl-5 space-y-1">
          {destinations.map((item, index) => (
            <li key={index}>
              {item.destination} — €{item.price.total} (Departure:{" "}
              {item.departureDate})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FlightInspirations;
