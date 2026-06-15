import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { format } from 'date-fns';
import { formatHumanTime, calculateDelayMinutes, formatLocalTime } from './utils/timeUtils';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import FlightCard from './components/FlightCard';
import FlightDetails from './components/FlightDetails';
import FlightInsight from './components/FlightInsight';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import UserSavedData from './components/UserSavedData';
import { getFlightData } from './services/api';
import { Compass } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Auth & Firestore
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { saveSearch, getRecentSearches, saveFavorite, getFavorites, removeFavorite } from './services/firestore';

function getSeededValue(str, range, offset = 0) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash % range) + offset;
}

function Dashboard() {
  const { user } = useAuth();
  const [flight, setFlight] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [favorites, setFavorites] = useState([]);
  // Fetch user data on mount
  useEffect(() => {
    if (!user) return;
    
    let active = true;
    const loadData = async () => {
      const [searches, favs] = await Promise.all([
        getRecentSearches(user.uid),
        getFavorites(user.uid)
      ]);
      if (active) {
        setRecentSearches(searches);
        setFavorites(favs);
      }
    };
    
    loadData();
    
    return () => {
      active = false;
    };
  }, [user]);

  const handleSearch = useCallback(async (flightNumber) => {
    if (!flightNumber) return;
    
    setIsLoading(true);
    setError(null);
    setShowDetails(false);
    setSearchQuery(flightNumber);
    
    try {
      const data = await getFlightData(flightNumber);
      if (data && data.length > 0) {
        const flightData = data[0];
        setFlight(flightData);
        
        // Save to Firestore
        await saveSearch(user.uid, {
          flightNumber: flightData.flight?.iata || flightNumber,
          airline: flightData.airline?.name || 'Unknown',
          departure: flightData.departure,
          arrival: flightData.arrival
        });
        
        // Refresh recent searches
        const updatedSearches = await getRecentSearches(user.uid);
        setRecentSearches(updatedSearches);
      } else {
        setError("No flight found — try another route. Please check for typos.");
        setFlight(null);
      }
    } catch (err) {
      setError(err.message || "Unable to retrieve journey details. Let's try again in a moment.");
      setFlight(null);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const handleToggleFavorite = async (flightData) => {
    const isFav = favorites.find(f => f.flightNumber === flightData.flightNumber);
    if (isFav) {
      await removeFavorite(isFav.id);
    } else {
      await saveFavorite(user.uid, flightData);
    }
    const updatedFavs = await getFavorites(user.uid);
    setFavorites(updatedFavs);
  };

  const transformedFlight = useMemo(() => {
    if (!flight) return null;

    const depScheduled = flight.departure.scheduled;
    const depEstimated = flight.departure.estimated || flight.departure.scheduled;
    const arrScheduled = flight.arrival.scheduled;
    const arrEstimated = flight.arrival.estimated || flight.arrival.scheduled;

    const depDelay = calculateDelayMinutes(depScheduled, depEstimated);
    const arrDelay = calculateDelayMinutes(arrScheduled, arrEstimated);

    return {
      airline: flight.airline?.name || 'Unknown Airline',
      flightNumber: flight.flight?.iata || 'N/A',
      status: flight.flight_status,
      date: flight.flight_date ? format(new Date(flight.flight_date), 'EEE, MMM dd') : 'N/A',
      departure: {
        iata: flight.departure.iata,
        airport: flight.departure.airport,
        terminal: flight.departure.terminal,
        gate: flight.departure.gate,
        scheduled: depScheduled,
        estimated: depEstimated,
        formattedTime: formatLocalTime(depEstimated),
        humanTime: formatHumanTime(depEstimated, 'departure')
      },
      arrival: {
        iata: flight.arrival.iata,
        airport: flight.arrival.airport,
        terminal: flight.arrival.terminal,
        gate: flight.arrival.gate,
        scheduled: arrScheduled,
        estimated: arrEstimated,
        formattedTime: formatLocalTime(arrEstimated),
        humanTime: formatHumanTime(arrEstimated, 'arrival')
      },
      delay: depDelay > arrDelay ? depDelay : arrDelay,
      aircraft: {
        model: flight.aircraft?.iata || null,
        reg: flight.aircraft?.registration || null,
        airline: flight.airline?.name
      },
      weather: {
        condition: ['Clear', 'Partly Cloudy', 'Sunny'][getSeededValue(flight.flight?.iata || 'WS100', 3)],
        temp: getSeededValue(flight.flight?.iata || 'WS100', 8, 24),
        humidity: getSeededValue(flight.flight?.iata || 'WS100', 30, 40),
        visibility: '10km'
      }
    };
  }, [flight]);

  const flightSummary = useMemo(() => {
    if (!transformedFlight) return '';
    const { airline, flightNumber, departure, arrival, status } = transformedFlight;
    
    const arrTime = new Date(arrival.estimated.replace(/\+00:00$/, ''));
    const hasArrived = status === 'landed' || arrTime < new Date();

    const statusText = hasArrived ? 'has landed at' : 
                      status === 'active' ? 'is currently en route from' : 
                      'is scheduled to fly from';
    
    return `${airline} flight ${flightNumber} ${statusText} ${departure.airport} to ${arrival.airport} and is ${transformedFlight.delay > 10 ? 'delayed' : 'on time'}.`;
  }, [transformedFlight]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      
      <main className="container mx-auto px-4 py-12 md:py-20 max-w-5xl">
        <div className="text-center mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50/50 text-primary-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-primary-100/50 mb-2"
          >
             <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} />
             Radar: Active
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black text-gray-900 tracking-tight leading-none"
          >
            Window <span className="font-serif italic font-normal text-primary-600">Seat?</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-400 text-lg max-w-xl mx-auto font-medium italic"
          >
            For someone who never stopped looking up.
          </motion.p>
        </div>

        <SearchBar 
          onSearch={handleSearch} 
          isLoading={isLoading} 
          recentSearches={recentSearches} 
        />

        <div className="mt-16 space-y-12">
          {isLoading ? (
            <Loader />
          ) : error ? (
            <ErrorMessage message={error} onRetry={() => handleSearch(searchQuery)} />
          ) : transformedFlight ? (
            <div className="space-y-8">
              <FlightCard 
                flight={transformedFlight} 
                onToggleDetails={() => setShowDetails(!showDetails)}
                onSaveFavorite={handleToggleFavorite}
                isFavorite={!!favorites.find(f => f.flightNumber === transformedFlight.flightNumber)}
              />
              
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden space-y-8"
                  >
                    <FlightInsight 
                      delay={transformedFlight.delay} 
                      summary={flightSummary} 
                    />
                    <FlightDetails flight={transformedFlight} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
               <div className="relative w-40 h-56 bg-white border-8 border-gray-100 rounded-[3rem] shadow-inner overflow-hidden flex items-center justify-center mb-8">
                 {/* Sky gradient background */}
                 <div className="absolute inset-0 bg-gradient-to-b from-[#e0f2fe] via-[#bae6fd] to-[#fed7aa]" />
                 {/* Soft clouds */}
                 <div className="absolute w-24 h-12 bg-white/40 blur-md rounded-full -bottom-2 -left-4" />
                 <div className="absolute w-32 h-16 bg-white/30 blur-lg rounded-full -bottom-6 -right-6" />
                 {/* Stylized airplane silhouette */}
                 <svg className="w-10 h-10 text-white/80 drop-shadow-md relative z-10 transform -rotate-12 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L14 19v-5.5L21 16z" />
                 </svg>
                 {/* Window pane reflection/border gloss */}
                 <div className="absolute inset-0 border border-white/20 rounded-[2.5rem] pointer-events-none" />
               </div>
               <p className="text-gray-500 font-medium text-lg max-w-sm">
                 Look out the window. Search for a flight to see its journey in motion.
               </p>
            </motion.div>
          )}

          <UserSavedData 
            recentSearches={recentSearches} 
            favorites={favorites} 
            onSelectFlight={handleSearch} 
          />
        </div>
      </main>

      <footer className="py-12 text-center border-t border-gray-100 bg-white">
         <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
           built with wonder by shrest sharma
         </p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
