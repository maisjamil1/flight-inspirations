import amadeusClient from "@/api/amadeus-client.ts";
import { API_LINKS } from "@/api/constants.ts";

export const getFlightDestinations = async (params: {
  origin: string;
  departureDate?: string;
}) => {
  const response = await amadeusClient.get(API_LINKS.FLIGHTS, { params });
  return response.data;
};
