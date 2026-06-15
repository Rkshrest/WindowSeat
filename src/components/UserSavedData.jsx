import React from 'react';
import { motion } from 'framer-motion';
import { History, Bookmark, ArrowRight, Plane } from 'lucide-react';

const UserSavedData = ({ recentSearches, favorites, onSelectFlight }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-12 border-t border-gray-100">
      {/* Recent Searches */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
            <History className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Recent Journeys</h3>
        </div>
        
        <div className="space-y-3">
          {recentSearches.length > 0 ? (
            recentSearches.map((search) => (
              <motion.button
                key={search.id}
                whileHover={{ x: 5 }}
                onClick={() => onSelectFlight(search.flightNumber)}
                className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-primary-200 transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                    <Plane className="w-4 h-4 text-gray-300" />
                  </div>
                  <div>
                    <span className="block text-sm font-black text-gray-900">{search.flightNumber}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{search.airline}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="text-right">
                      <span className="block text-[10px] font-black text-gray-900">{search.departure} → {search.arrival}</span>
                   </div>
                   <ArrowRight className="w-4 h-4 text-gray-200" />
                </div>
              </motion.button>
            ))
          ) : (
            <p className="text-xs font-medium text-gray-400 py-4 italic">No recent activity found.</p>
          )}
        </div>
      </div>

      {/* Bookmarks / Favorites */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
            <Bookmark className="w-4 h-4 fill-primary-600 text-primary-600" />
          </div>
          <h3 className="text-xs font-black uppercase tracking-widest text-primary-600/50">Saved Seats</h3>
        </div>

        <div className="space-y-3">
          {favorites.length > 0 ? (
            favorites.map((fav) => (
              <motion.button
                key={fav.id}
                whileHover={{ x: 5 }}
                onClick={() => onSelectFlight(fav.flightNumber)}
                className="w-full flex items-center justify-between p-4 bg-white border border-primary-100 rounded-2xl hover:border-primary-300 transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                    <Plane className="w-4 h-4 text-primary-400" />
                  </div>
                  <div>
                    <span className="block text-sm font-black text-gray-900">{fav.flightNumber}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{fav.airline}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="text-right">
                      <span className="block text-[10px] font-black text-primary-600">{fav.route}</span>
                   </div>
                   <ArrowRight className="w-4 h-4 text-primary-200" />
                </div>
              </motion.button>
            ))
          ) : (
            <div className="p-8 border-2 border-dashed border-gray-100 rounded-[2rem] text-center">
              <Bookmark className="w-8 h-8 text-gray-100 mx-auto mb-3" />
              <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">No saved seats yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSavedData;
