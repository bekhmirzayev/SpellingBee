import React from 'react';

interface HeaderProps {
  onHome: () => void;
  isSoundOn: boolean;
  onToggleSound: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHome, isSoundOn, onToggleSound }) => {
  return (
    // Floating Header Container
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4 pointer-events-none">
      <header className="pointer-events-auto w-full max-w-5xl bg-white/80 backdrop-blur-md border border-white/50 shadow-lg rounded-full px-6 py-3 flex justify-between items-center transition-all hover:shadow-xl">
        
        <div className="flex items-center">
          <span className="text-xl md:text-2xl font-extrabold text-indigo-600 tracking-tight flex items-center gap-2">
            <span className="text-3xl">🐝</span>
            <span>Najot Ta'lim</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="audio-toggle-btn"
            onClick={onToggleSound}
            className={`
              inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300
              ${isSoundOn 
                ? 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200' 
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}
            `}
            title={isSoundOn ? "Ovozni o'chirish" : "Ovozni yoqish"}
          >
            {isSoundOn ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
              </svg>
            )}
          </button>
          
          <button
            onClick={onHome}
            className="hidden md:inline-flex items-center px-5 py-2 rounded-full font-bold text-sm text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 hover:scale-105 transition-all shadow-sm"
          >
            🏠 Bosh Sahifa
          </button>
          
          {/* Mobile Icon Button */}
          <button
             onClick={onHome}
             className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 hover:scale-105 transition-all shadow-sm"
          >
            🏠
          </button>
        </div>
      </header>
    </div>
  );
};

export default Header;