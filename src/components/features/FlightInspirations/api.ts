import amadeusClient from '@/api/amadeus-client';
import type { FlightDestination } from '@/types/tableTypes';

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
  const response = await amadeusClient.get<FlightDestinationsResponse>('/shopping/flight-destinations', {
    params,
  });
  return response.data;
};
