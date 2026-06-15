import React, { useMemo } from 'react';
import { Info, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const FlightInsight = ({ delay, summary }) => {
  const delayInfo = useMemo(() => {
    if (delay < 10) {
      return {
        label: 'On Schedule',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-100',
        icon: <CheckCircle2 className="w-5 h-5 text-green-600" />
      };
    } else if (delay <= 30) {
      return {
        label: 'Slight Delay Expected',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-100',
        icon: <Clock className="w-5 h-5 text-yellow-600" />
      };
    } else {
      return {
        label: 'Delayed',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-100',
        icon: <AlertCircle className="w-5 h-5 text-red-600" />
      };
    }
  }, [delay]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-2xl border ${delayInfo.borderColor} ${delayInfo.bgColor} space-y-4`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Info className="w-4 h-4 text-gray-500" />
          </div>
          <h3 className="font-bold text-gray-900 tracking-tight">Captain's Log</h3>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-white border ${delayInfo.borderColor} ${delayInfo.color} text-xs font-black uppercase tracking-widest`}>
          {delayInfo.icon}
          {delayInfo.label}
        </div>
      </div>
      
      <p className="text-gray-600 text-sm font-medium leading-relaxed">
        {summary}
      </p>

      {delay > 0 && (
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest pt-2">
          <Clock className="w-3 h-3" />
          Difference: {delay} minutes from scheduled
        </div>
      )}
    </motion.div>
  );
};

export default FlightInsight;
