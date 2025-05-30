export type FlightDestination = {
  type: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  price: {
    total: string;
  };
  links: {
    flightDates: string;
    flightOffers: string;
  };
};

export type TableData = {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  price: string;
};
