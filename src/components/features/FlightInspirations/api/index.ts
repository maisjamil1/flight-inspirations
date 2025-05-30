import amadeusClient from "@/api/amadeus-client";
import type { FlightDestination } from "@/components/features/FlightInspirations/types/tableTypes";
import { API_LINKS } from "@/api/constants.ts";

interface FlightDestinationsResponse {
  data: FlightDestination[];
  meta: {
    count: number;
    links: {
      self: string;
    };
  };
}

export const getFlightDestinations = async (params: Record<string, string>) => {
  const response = await amadeusClient.get<FlightDestinationsResponse>(
    API_LINKS.FLIGHTS,
    {
      params,
    },
  );
  return response.data;
};
