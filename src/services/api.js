import axios from 'axios';

const API_KEY = import.meta.env.VITE_AVIATIONSTACK_API_KEY;
const BASE_URL = 'https://api.aviationstack.com/v1';

const apiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    access_key: API_KEY,
  },
});

/**
 * Fetch flight data by flight number
 */
export const getFlightData = async (flightNumber) => {
  const cleanNumber = flightNumber.replace(/\s/g, '').toUpperCase();
  
  try {
    const response = await apiClient.get('/flights', {
      params: { flight_iata: cleanNumber },
    });

    let flights = response.data?.data || [];

    if (flights.length === 0) {
      const icaoResponse = await apiClient.get('/flights', {
        params: { flight_icao: cleanNumber },
      });
      flights = icaoResponse.data?.data || [];
    }

    if (flights.length > 0) {
      // Find the most relevant flight:
      // 1. Current 'active' flight
      // 2. Flight for today
      // 3. Flight closest to NOW
      
      const now = new Date();
      
      return flights.sort((a, b) => {
        const aStatus = a.flight_status;
        const bStatus = b.flight_status;

        // If one is active, it's likely the most relevant
        if (aStatus === 'active' && bStatus !== 'active') return -1;
        if (bStatus === 'active' && aStatus !== 'active') return 1;

        const aTime = new Date(a.departure.estimated || a.departure.scheduled);
        const bTime = new Date(b.departure.estimated || b.departure.scheduled);
        
        const aDiff = Math.abs(aTime - now);
        const bDiff = Math.abs(bTime - now);

        // If time difference is significant, pick the closest one
        if (Math.abs(aDiff - bDiff) > 1000 * 60 * 60) { // 1 hour threshold
          return aDiff - bDiff;
        }

        // Otherwise, use status priority for tie-breaking
        const statusPriority = { 'active': 0, 'scheduled': 1, 'landed': 2, 'cancelled': 3 };
        const aSP = statusPriority[aStatus] ?? 4;
        const bSP = statusPriority[bStatus] ?? 4;
        
        if (aSP !== bSP) return aSP - bSP;

        return bTime - aTime;
      });
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching flight data:', error);
    if (error.response) {
      throw new Error(error.response.data.error?.message || 'Failed to fetch flight data');
    }
    throw error;
  }
};

export default apiClient;
