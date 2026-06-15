import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Search, Loader2, History } from 'lucide-react';

const SearchBar = ({ onSearch, isLoading, recentSearches }) => {
  const [query, setQuery] = useState('');
  const debounceTimer = useRef(null);

  const handleSubmit = useCallback((e) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  }, [query, onSearch]);

  // Debounce search logic
  useEffect(() => {
    if (query.length > 3) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        onSearch(query.trim());
      }, 1000);
    }
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [query, onSearch]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3">
      <div className="text-center">
        <label className="text-[11px] font-black text-primary-600/70 uppercase tracking-[0.25em] block mb-2">
          Where are we flying today?
        </label>
      </div>
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter flight number (e.g., AA100)"
          className="block w-full pl-16 pr-44 py-5 bg-white border border-gray-200 rounded-2xl text-lg font-medium placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-all shadow-sm"
          disabled={isLoading}
        />
        <div className="absolute inset-y-2 right-2 flex items-center">
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="flex items-center gap-2 h-full px-6 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all text-sm"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Find Journey'
            )}
          </button>
        </div>
      </form>

      {recentSearches && recentSearches.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="flex items-center gap-2 mr-2 text-gray-400">
            <History className="w-3 h-3" />
            <span className="text-[10px] font-black uppercase tracking-widest">Recent:</span>
          </div>
          {recentSearches.map((search, index) => (
            <button
              key={search.id || index}
              onClick={() => {
                const num = typeof search === 'string' ? search : search.flightNumber;
                setQuery(num);
                onSearch(num);
              }}
              className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-500 hover:bg-white hover:border-primary-200 hover:text-primary-600 transition-all"
            >
              {typeof search === 'string' ? search : search.flightNumber}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
