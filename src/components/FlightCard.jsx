import React, { useState } from 'react';
import { Plane, ArrowRight, Clock, MapPin, Share2, Globe, Star } from 'lucide-react';
import StatusBadge from './StatusBadge';
import FlightTimeline from './FlightTimeline';
import { motion } from 'framer-motion';

const FlightCard = ({ flight, onToggleDetails, onSaveFavorite, isFavorite = false }) => {
  const [saved, setSaved] = useState(isFavorite);
  if (!flight) return null;

  const handleShare = () => {
    const summary = `Following ${flight.airline} flight ${flight.flightNumber} journey. Currently ${flight.status === 'active' ? 'en route' : flight.status}. Arriving at ${flight.arrival.iata} @ ${flight.arrival.formattedTime}.`;
    if (navigator.share) {
      navigator.share({
        title: 'Journey Details',
        text: summary,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(summary);
      alert('Journey details copied to clipboard!');
    }
  };

  const handleSave = async () => {
    if (onSaveFavorite) {
      await onSaveFavorite(flight);
      setSaved(!saved);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-5xl mx-auto bg-white rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden"
    >
      {/* Dynamic Header with Integrated Route */}
      <div className="bg-gray-900 p-10 md:p-14 text-white relative overflow-hidden">
        {/* Abstract Map Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
           <svg className="w-full h-full" viewBox="0 0 800 400" fill="none">
              <path d="M 100 300 Q 400 50 700 300" stroke="white" strokeWidth="1" strokeDasharray="10 10" />
              <circle cx="100" cy="300" r="4" fill="white" />
              <circle cx="700" cy="300" r="4" fill="white" />
           </svg>
        </div>

        <div className="relative z-10 flex flex-col gap-12">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10">
                <span className="text-2xl font-black text-white">{flight.airline?.charAt(0)}</span>
              </div>
              <div>
                <h2 className="text-3xl font-black tracking-tighter">{flight.airline}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{flight.flightNumber}</span>
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                  <StatusBadge status={flight.status} isDark />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleSave}
                className={`p-4 rounded-2xl transition-all border ${saved ? 'bg-primary-600 border-primary-500 text-white' : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'}`}
                title={saved ? "Remove Bookmark" : "Bookmark Seat"}
              >
                <Star className={`w-5 h-5 ${saved ? 'fill-white' : ''}`} />
              </button>
              <button onClick={handleShare} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5" title="Share Journey">
                <Share2 className="w-5 h-5 text-white/60" />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-end">
             <div className="space-y-2">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Origin</span>
                <div className="text-7xl font-black tracking-tighter">{flight.departure.iata}</div>
                <div className="text-xs font-bold text-white/40">{flight.departure.airport}</div>
             </div>
             
             <div className="flex flex-col items-center gap-4 mb-4">
                <div className="px-6 py-2 bg-white/5 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-3 border border-white/10">
                  <Globe className="w-3 h-3 text-primary-400" />
                  Direct Flight
                </div>
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
             </div>

             <div className="space-y-2 text-right">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Destination</span>
                <div className="text-7xl font-black tracking-tighter">{flight.arrival.iata}</div>
                <div className="text-xs font-bold text-white/40">{flight.arrival.airport}</div>
             </div>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-10 md:p-14 flex flex-col gap-16">
        {/* Time Tracking Row */}
        <div className="grid grid-cols-2 gap-12">
           <div className="space-y-2">
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Departure Time</div>
              <div className="text-4xl font-black text-gray-900 tracking-tighter">{flight.departure.formattedTime}</div>
              <div className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">{flight.departure.humanTime}</div>
           </div>
           <div className="space-y-2 text-right">
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Arrival Time</div>
              <div className="text-4xl font-black text-gray-900 tracking-tighter">{flight.arrival.formattedTime}</div>
              <div className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">{flight.arrival.humanTime}</div>
           </div>
        </div>

        {/* Dynamic Timeline */}
        <FlightTimeline 
          status={flight.status} 
          departureTime={flight.departure?.estimated}
          arrivalTime={flight.arrival?.estimated}
          departureIata={flight.departure?.iata} 
          arrivalIata={flight.arrival?.iata} 
        />

        {/* Footer Intelligence */}
        <div className="flex items-center justify-between pt-12 border-t border-gray-50">
           <div className="flex gap-12">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-gray-50 rounded-xl">
                   <MapPin className="w-4 h-4 text-gray-400" />
                 </div>
                 <div>
                    <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Terminal</span>
                    <span className="text-lg font-black text-gray-900">{flight.departure.terminal || '---'}</span>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-gray-50 rounded-xl">
                   <Clock className="w-4 h-4 text-gray-400" />
                 </div>
                 <div>
                    <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Gate</span>
                    <span className="text-lg font-black text-gray-900">{flight.departure.gate || '---'}</span>
                 </div>
              </div>
           </div>

           <button 
             onClick={onToggleDetails}
             className="group flex items-center gap-4 px-10 py-5 bg-primary-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] hover:bg-gray-900 transition-all shadow-[0_20px_40px_rgba(37,99,235,0.2)] hover:shadow-gray-200"
           >
             Detailed Journey
             <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
           </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FlightCard;
