import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-lg mx-auto p-10 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-[2.5rem] flex flex-col items-center text-center gap-6 shadow-xl shadow-red-500/5"
    >
      <div className="p-5 bg-red-100 dark:bg-red-900/40 rounded-[1.5rem] text-red-600 dark:text-red-400 shadow-inner">
        <AlertCircle className="w-10 h-10" />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-black text-red-900 dark:text-red-200 tracking-tight">Journey Not Found</h3>
        <p className="text-red-700 dark:text-red-400/80 font-medium leading-relaxed max-w-sm mx-auto">
          {message || "No flight found — try another route. Please verify the flight number and try again."}
        </p>
      </div>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="flex items-center gap-3 px-10 py-4 bg-red-600 text-white rounded-2xl font-black hover:bg-red-700 transition-all shadow-xl shadow-red-500/30 active:scale-95"
        >
          <RefreshCw className="w-5 h-5" />
          Try Again
        </button>
      )}
    </motion.div>
  );
};

export default ErrorMessage;
