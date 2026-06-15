import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full glass">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary-600 rounded-xl shadow-lg shadow-primary-500/20 text-white flex items-center justify-center">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="3" width="14" height="18" rx="6" />
              <path d="M5 11h14" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
            </svg>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-gray-900">
            Window <span className="font-serif italic font-normal text-primary-600">Seat?</span>
          </span>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="hidden sm:flex flex-col items-end">
             <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Sky Radar</span>
             <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
               Active
             </span>
          </div>

          {user && (
            <div className="flex items-center gap-4 pl-8 border-l border-gray-100">
               <div className="flex flex-col items-end hidden md:flex">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">User</span>
                  <span className="text-xs font-bold text-gray-900">{user.email?.split('@')[0]}</span>
               </div>
               <button 
                onClick={logout}
                className="p-3 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-all"
                title="Logout"
               >
                 <LogOut className="w-4 h-4" />
               </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
