import React, { useMemo, useEffect, useState } from 'react';
import { Plane } from 'lucide-react';
import { motion } from 'framer-motion';

const FlightTimeline = ({ status, departureTime, arrivalTime, departureIata, arrivalIata }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const progress = useMemo(() => {
    if (status === 'landed') return 100;
    if (status === 'scheduled') return 0;
    
    try {
      const dep = new Date(departureTime.replace(/\+00:00$/, ''));
      const arr = new Date(arrivalTime.replace(/\+00:00$/, ''));
      if (isNaN(dep.getTime()) || isNaN(arr.getTime())) return 50;
      const total = arr - dep;
      const current = now - dep;
      return Math.min(Math.max((current / total) * 100, 0), 100);
    } catch {
      return 50;
    }
  }, [status, departureTime, arrivalTime, now]);

  const isArrived = progress >= 100 || status === 'landed';

  return (
    <div className="w-full py-12 px-2">
      <div className="relative h-[2px] w-full">
        {/* Track Background */}
        <div className="absolute inset-0 bg-gray-100 rounded-full" />
        
        {/* Dashed Path (Visible when not arrived) */}
        {!isArrived && (
          <div className="absolute inset-0 flex justify-between overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="h-full w-1.5 bg-gray-200/50 rounded-full" />
            ))}
          </div>
        )}

        {/* Active Progress Line */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-0 left-0 h-full bg-primary-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]"
        />

        {/* Departure Point */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 flex flex-col items-center">
          <div className="w-4 h-4 rounded-full bg-white border-[3px] border-primary-600 shadow-sm z-20" />
          <div className="absolute top-6 flex flex-col items-center gap-1">
            <span className="text-[10px] font-black text-gray-900 tracking-tighter">{departureIata}</span>
            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Origin</span>
          </div>
        </div>

        {/* Plane Icon */}
        <motion.div 
          initial={{ left: 0 }}
          animate={{ left: `${progress}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-30"
        >
          <div className="relative">
             <div className="absolute inset-0 bg-primary-400 blur-xl opacity-20 scale-150 animate-pulse" />
             <div className="bg-white p-3 rounded-full shadow-2xl border border-gray-50 transform hover:scale-110 transition-transform">
               <Plane 
                 className={`w-4 h-4 text-primary-600 ${status === 'active' && !isArrived ? 'animate-pulse' : ''}`} 
                 style={{ transform: 'rotate(90deg)' }} 
               />
             </div>
          </div>
        </motion.div>

        {/* Arrival Point */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 flex flex-col items-center">
          <div className={`w-4 h-4 rounded-full bg-white border-[3px] transition-colors duration-500 z-20 ${isArrived ? 'border-primary-600' : 'border-gray-200'}`} />
          <div className="absolute top-6 flex flex-col items-center gap-1">
            <span className="text-[10px] font-black text-gray-900 tracking-tighter">{arrivalIata}</span>
            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Dest</span>
          </div>
        </div>
      </div>
      
      {/* Dynamic Status Label */}
      <div className="mt-20 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 shadow-sm ${
            isArrived ? 'bg-green-50 text-green-600 border-green-100' : 
            status === 'active' ? 'bg-primary-50 text-primary-600 border-primary-100' : 
            'bg-gray-50 text-gray-400 border-gray-100'
          }`}>
            {isArrived ? 'Safe Landing' : status === 'active' ? 'En Route to Destination' : 'Ground Wait'}
          </div>
          {status === 'active' && !isArrived && (
            <div className="flex gap-1.5">
               <span className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
               <span className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
               <span className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-bounce" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightTimeline;
