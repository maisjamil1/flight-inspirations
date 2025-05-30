import axios from "axios";

const AMADEUS_API_KEY = import.meta.env.VITE_AMADEUS_API_KEY;
const AMADEUS_API_SECRET = import.meta.env.VITE_AMADEUS_API_SECRET;
const AMADEUS_BASE_URL = import.meta.env.VITE_AMADEUS_BASE_URL;

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

const getAccessToken = async (): Promise<string> => {
  const now = Date.now();

  if (cachedToken && tokenExpiry && now < tokenExpiry) {
    return cachedToken;
  }

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", AMADEUS_API_KEY);
  params.append("client_secret", AMADEUS_API_SECRET);

  const response = await axios.post(
    `${AMADEUS_BASE_URL}/security/oauth2/token`,
    params,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  const { access_token, expires_in } = response.data;
  cachedToken = access_token;
  tokenExpiry = now + (expires_in - 60) * 1000;

  return access_token;
};

const amadeusClient = axios.create({
  baseURL: AMADEUS_BASE_URL,
});

amadeusClient.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${token}`,
  };
  return config;
});

export default amadeusClient;
