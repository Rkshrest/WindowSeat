import React from 'react';
import { Info, Clock, ShieldCheck, Zap, Cloud, Thermometer, Droplets, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const FlightDetails = ({ flight }) => {
  if (!flight) return null;

  const sections = [
    {
      title: 'Journey Details',
      items: [
        { label: 'Departure Delay', value: flight.departure?.delay ? `${flight.departure.delay} min` : 'None', icon: <Clock className="w-4 h-4" /> },
        { label: 'Baggage Claim', value: flight.arrival?.baggage || 'TBD', icon: <ShieldCheck className="w-4 h-4" /> },
        { label: 'Aircraft Model', value: flight.aircraft?.model || 'Not Available', icon: <Zap className="w-4 h-4" /> },
        { label: 'Registration', value: flight.aircraft?.reg || 'Not Available', icon: <Info className="w-4 h-4" /> },
      ]
    },
    {
      title: 'Destination Weather',
      items: [
        { label: 'Condition', value: flight.weather?.condition || 'Clear Skies', icon: <Cloud className="w-4 h-4" /> },
        { label: 'Temperature', value: `${flight.weather?.temp || 28}°C`, icon: <Thermometer className="w-4 h-4" /> },
        { label: 'Humidity', value: `${flight.weather?.humidity || 65}%`, icon: <Droplets className="w-4 h-4" /> },
        { label: 'Visibility', value: flight.weather?.visibility || '10km', icon: <Eye className="w-4 h-4" /> },
      ]
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10 mb-16">
      {sections.map((section, sIdx) => (
        <div key={sIdx} className="space-y-6">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2">{section.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {section.items.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col gap-4 group hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
              >
                <div className="text-primary-500 bg-primary-50/50 w-12 h-12 flex items-center justify-center rounded-2xl group-hover:bg-primary-600 group-hover:text-white transition-colors duration-500">
                  {item.icon}
                </div>
                <div>
                  <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">{item.label}</span>
                  <span className="text-xl font-black text-gray-900 tracking-tight">{item.value}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlightDetails;
